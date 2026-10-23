<script setup>
import { ref } from 'vue'
const props = defineProps({ loggedIn: Boolean, login: { type: Function, required: true } })
const emit = defineEmits(['logout'])
const password = ref(''), message = ref(''), busy = ref(false)
async function send() {
  if (busy.value) return
  busy.value = true; message.value = ''
  try { await props.login(password.value); password.value = '' } catch (error) { message.value = error.message }
  finally { busy.value = false }
}
</script>
<template>
  <div class="comment-admin-bar">
    <p v-if="loggedIn">已进入管理模式 · <button class="comment-text-button" @click="emit('logout')">退出</button></p>
    <form v-else class="comment-login" @submit.prevent="send">
      <label class="comment-sr-only" for="comment-password">管理密码</label>
      <input id="comment-password" v-model="password" class="comment-input" type="password" autocomplete="current-password" placeholder="管理密码" required />
      <button class="comment-primary" :disabled="busy">{{ busy ? '登录中…' : '登录' }}</button>
    </form>
    <p class="comment-feedback" aria-live="polite">{{ message }}</p>
  </div>
</template>
