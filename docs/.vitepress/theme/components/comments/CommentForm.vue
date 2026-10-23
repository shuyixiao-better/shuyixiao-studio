<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { validateComment } from '../../utils/comments-core.js'
const props = defineProps({ submit: { type: Function, required: true } })
const author = ref(''), content = ref(''), hp = ref(''), message = ref(''), busy = ref(false), textarea = ref(null)
const ready = ref(false)
let storage, renderedAt = 0, resize = () => {}
const valid = computed(() => !validateComment({ author: author.value, content: content.value }).error)
onMounted(() => {
  ready.value = true
  renderedAt = Date.now()
  try { storage = window.localStorage; author.value = storage.getItem('comments-nickname') || '' } catch { /* Optional storage. */ }
  resize = () => {
    const el = textarea.value
    if (!el) return
    const line = parseFloat(window.getComputedStyle(el).lineHeight) || 25.5
    el.style.height = 'auto'
    el.style.height = `${Math.min(Math.max(el.scrollHeight, line * 3 + 44), line * 12 + 44)}px`
  }
  resize()
})
function remember() {
  try { storage?.setItem('comments-nickname', author.value) } catch { /* Optional storage. */ }
}
async function send() {
  if (busy.value || !ready.value) return
  const value = validateComment({ author: author.value, content: content.value })
  if (value.error) { message.value = value.error; return }
  busy.value = true
  message.value = ''
  try {
    await props.submit({ ...value, hp: hp.value, elapsedMs: Date.now() - renderedAt })
    content.value = ''
    author.value = value.author
    remember()
    message.value = '评论已发表，谢谢你的分享。'
    renderedAt = Date.now()
    await nextTick(); resize()
  } catch (error) { message.value = error.message }
  finally { busy.value = false }
}
</script>
<template>
  <form class="comment-form" @submit.prevent="send">
    <label class="comment-sr-only" for="comment-author">昵称</label>
    <input id="comment-author" v-model="author" class="comment-input comment-author" name="nickname" maxlength="20" placeholder="昵称" autocomplete="nickname" required @change="remember" />
    <label class="comment-sr-only" for="comment-content">评论内容</label>
    <div class="comment-editor">
      <textarea id="comment-content" ref="textarea" v-model="content" class="comment-input" name="content" rows="3" maxlength="500" placeholder="写下你的想法，参与讨论…" required @input="resize" @keydown.enter="event => { if ((event.metaKey || event.ctrlKey) && !event.isComposing) { event.preventDefault(); send() } }" />
      <span class="comment-counter" :class="{ near: content.length >= 450 }">{{ content.length }}/500</span>
    </div>
    <div class="comment-honeypot" aria-hidden="true">
      <label for="comment-website">网站</label><input id="comment-website" v-model="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
    </div>
    <div class="comment-submit-row"><span class="comment-hint">⌘ / Ctrl + Enter 发表</span><button class="comment-primary" type="submit" :disabled="busy || !valid || !ready">{{ busy ? '发表中…' : '发表评论' }}</button></div>
    <p class="comment-feedback" aria-live="polite" role="status">{{ message }}</p>
  </form>
</template>
