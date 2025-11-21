<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 50
  }
})

const displayedText = ref('')
const cursorVisible = ref(true)

onMounted(() => {
  let i = 0
  const type = () => {
    if (i < props.text.length) {
      displayedText.value += props.text.charAt(i)
      i++
      setTimeout(type, props.speed)
    }
  }
  type()
  
  // Cursor blink
  setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)
})
</script>

<template>
  <div class="typewriter-container">
    <span class="typewriter-text">{{ displayedText }}</span>
    <span class="cursor" :class="{ visible: cursorVisible }">|</span>
  </div>
</template>

<style scoped>
.typewriter-container {
  font-family: 'Courier New', Courier, monospace; /* Monospace for typewriter feel */
  font-size: 1.1rem;
  line-height: 1.6;
  min-height: 3.2em; /* Reserve space */
  color: var(--vp-c-text-2);
  margin-top: 1rem;
  white-space: pre-wrap; /* Preserve line breaks if any */
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  color: var(--vp-c-brand);
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.1s;
}

.cursor.visible {
  opacity: 1;
}
</style>
