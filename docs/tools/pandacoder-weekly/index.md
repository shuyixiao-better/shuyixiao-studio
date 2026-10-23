---
layout: doc
title: PandaCoder 周报浏览
description: 查看 PandaCoder 周报
date: '2025-12-25'
---

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { hasBackend } from '../../.vitepress/theme/utils/deploy-env.js'
const backend = ref(false)
const ready = ref(false)
const frame = ref(null)
const frontendUrl = '/api/pandacoder-proxy?type=frontend&path=/'
const hideAsideCurtain = () => {
  if (typeof window === 'undefined') return
  try {
    const curtain = frame.value?.contentDocument?.querySelector('.aside-curtain')
    if (curtain) curtain.style.display = 'none'
  } catch { /* The proxy may embed cross-origin content. */ }
}
onMounted(async () => {
  backend.value = await hasBackend()
  ready.value = true
  if (!backend.value) return
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.filter(registration => registration.scope.includes('pandacoder-proxy-sw') || registration.active?.scriptURL?.includes('pandacoder-proxy-sw')).forEach(registration => registration.unregister())
    }).catch(() => { /* Service worker access is optional. */ })
  }
  await nextTick()
  hideAsideCurtain()
})
</script>

<div class="weekly-page">
  <RequiresBackendNotice v-if="ready && !backend" />
  <div v-if="backend" class="pandacoder-container">
    <iframe ref="frame" :src="frontendUrl" title="PandaCoder 周报" frameborder="0" allowfullscreen allow="clipboard-read; clipboard-write" @load="hideAsideCurtain" />
  </div>
</div>

<style scoped>
.redirect-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  padding: var(--sp-20);
}

.redirect-card {
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-card);
  padding: var(--sp-40);
  max-width: var(--ui-size-600);
  width: 100%;
  box-shadow: none;
  text-align: center;
}

.redirect-icon {
  font-size: var(--ui-text-hero);
  margin-bottom: var(--sp-20);
}

.redirect-title {
  font-size: var(--ui-text-title);
  font-weight: var(--ui-weight-heading);
  color: var(--vp-c-text-1);
  margin-bottom: var(--sp-16);
}

.redirect-message {
  font-size: var(--ui-text-base);
  color: var(--vp-c-text-2);
  line-height: var(--ui-leading-body);
  margin-bottom: var(--sp-12);
}

.redirect-hint {
  font-size: var(--ui-text-sm);
  color: var(--vp-c-text-2);
  margin-bottom: var(--sp-20);
}

.redirect-url {
  background: var(--vp-c-bg-soft);
  border-radius: var(--ui-radius-input);
  padding: var(--sp-16);
  margin-bottom: var(--sp-24);
}

.redirect-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: var(--ui-text-base);
  word-break: break-all;
  transition: var(--ui-transition);
}

.redirect-link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.redirect-button {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: none;
  border-radius: var(--ui-radius-input);
  padding: var(--sp-16) var(--sp-32);
  font-size: var(--ui-text-base);
  font-weight: var(--ui-weight-heading);
  cursor: pointer;
  transition: var(--ui-transition);
  box-shadow: none;
}

.redirect-button:hover {
  box-shadow: none;
}
.pandacoder-container {
  position: fixed;
  top: var(--vp-nav-height, var(--sp-64));
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: calc(100vh - var(--vp-nav-height, var(--sp-64)));
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.pandacoder-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
@media (prefers-color-scheme: dark) {
  .redirect-card {
    background: var(--vp-c-bg-soft);
  }

  .redirect-title {
    color: var(--vp-c-text-1);
  }

  .redirect-message {
    color: var(--vp-c-text-2);
  }

  .redirect-hint {
    color: var(--vp-c-text-2);
  }

  .redirect-url {
    background: var(--vp-c-bg-soft);
  }

  .pandacoder-container {
    background: var(--vp-c-bg-soft);
  }
}
.aside-curtain,
div.aside-curtain,
[class*="aside-curtain"],
[data-v-3a82ddb3].aside-curtain,
.aside-curtain[data-v-3a82ddb3] {
  display: none;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  z-index: -9999;
  width: 0;
  height: 0;
}
</style>



