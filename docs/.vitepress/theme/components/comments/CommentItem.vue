<script setup>
import { computed, ref, watch } from 'vue'
import { linkify, validateComment } from '../../utils/comments-core.js'
const props = defineProps({ comment: { type: Object, required: true }, managed: Boolean, highlighted: Boolean, reply: Function, remove: Function, replyItem: Boolean })
const replying = ref(false), confirming = ref(false), content = ref(''), message = ref(''), busy = ref(false)
const segments = computed(() => linkify(props.comment.content))
const date = computed(() => new Date(props.comment.createdAt))
const localTime = computed(() => Number.isFinite(date.value.getTime()) ? date.value.toLocaleString('zh-CN') : '')
const relative = computed(() => {
  const minutes = Math.max(0, Math.floor((Date.now() - date.value.getTime()) / 60000))
  if (!Number.isFinite(minutes)) return ''
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} 小时前`
  if (minutes < 10080) return `${Math.floor(minutes / 1440)} 天前`
  return `${date.value.getFullYear()}-${String(date.value.getMonth() + 1).padStart(2, '0')}-${String(date.value.getDate()).padStart(2, '0')}`
})
const avatarColor = computed(() => {
  const colors = ['var(--vp-c-bg-soft)', 'var(--vp-c-border)', 'var(--ui-surface)', 'var(--vp-c-bg)']
  const hash = [...props.comment.author].reduce((sum, c) => (sum * 31 + c.codePointAt(0)) >>> 0, 0)
  return colors[hash % colors.length]
})
watch(() => props.managed, value => { if (!value) { replying.value = false; confirming.value = false; content.value = ''; message.value = '' } })
async function sendReply() {
  const value = validateComment({ content: content.value }, { isAuthor: true })
  if (value.error) { message.value = value.error; return }
  busy.value = true; message.value = ''
  try { await props.reply(props.comment.id, value.content); content.value = ''; replying.value = false } catch (error) { message.value = error.message }
  finally { busy.value = false }
}
async function deleteComment() {
  busy.value = true; message.value = ''
  try { await props.remove(props.comment.id) } catch (error) { message.value = error.message }
  finally { busy.value = false; confirming.value = false }
}
</script>
<template>
  <li class="comment-item" :class="{ 'comment-reply': replyItem, 'comment-highlighted': highlighted }">
    <span v-if="!replyItem" class="comment-avatar" :style="{ background: avatarColor }" aria-hidden="true">{{ [...comment.author][0] || '客' }}</span>
    <div class="comment-main">
      <div class="comment-meta"><span class="comment-name">{{ comment.author }}</span><span v-if="comment.isAuthor" class="comment-author-badge">作者</span><time :datetime="comment.createdAt" :title="localTime">{{ relative }}</time></div>
      <p class="comment-content"><template v-for="(segment, index) in segments" :key="index"><a v-if="segment.type === 'link'" :href="segment.value" target="_blank" rel="nofollow ugc noopener noreferrer">{{ segment.value }}</a><template v-else>{{ segment.value }}</template></template></p>
      <div v-if="managed" class="comment-actions">
        <button v-if="!replyItem" class="comment-text-button" :disabled="busy" @click="replying = !replying">{{ replying ? '取消回复' : '回复' }}</button>
        <span v-if="confirming" class="comment-delete-confirm">确认删除？ <button class="comment-text-button" :disabled="busy" @click="deleteComment">确认</button> / <button class="comment-text-button" :disabled="busy" @click="confirming = false">取消</button></span>
        <button v-else class="comment-text-button" :disabled="busy" @click="confirming = true">删除</button>
      </div>
      <form v-if="managed && replying && !replyItem" class="comment-reply-form" @submit.prevent="sendReply">
        <label class="comment-sr-only" :for="`reply-${comment.id}`">回复 {{ comment.author }}</label>
        <textarea :id="`reply-${comment.id}`" v-model="content" class="comment-input" rows="3" maxlength="500" placeholder="以作者身份回复…" required />
        <div class="comment-submit-row"><span class="comment-counter-inline">{{ content.length }}/500</span><button class="comment-primary" :disabled="busy || content.trim().length < 2">{{ busy ? '发送中…' : '发表回复' }}</button></div>
      </form>
      <p v-if="managed" class="comment-feedback" aria-live="polite">{{ message }}</p>
      <ul v-if="comment.replies?.length" class="comment-replies">
        <CommentItem v-for="child in comment.replies" :key="child.id" :comment="child" :managed="managed" :remove="remove" reply-item />
      </ul>
    </div>
  </li>
</template>
