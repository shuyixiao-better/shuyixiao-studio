<script setup>
import { withBase } from 'vitepress'
import explorations from '../../data/explorations.js'
import LineIcon from '../LineIcon.vue'
</script>
<template>
  <section class="home-section exploring-section" aria-labelledby="exploring-title">
    <h2 id="exploring-title">正在探索</h2><p class="section-description">近期把时间花在这些事情上</p>
    <div class="exploring-grid">
      <component :is="item.link ? 'a' : 'div'" v-for="item in explorations" :key="item.title" :href="item.link ? withBase(item.link) : undefined" class="exploring-card ui-card" :class="{ linked: item.link }">
        <div class="exploring-meta"><LineIcon :name="item.icon" /><span>{{ item.status }}</span></div>
        <h3>{{ item.title }}</h3><p>{{ item.desc }}</p><span v-if="item.link" class="exploring-arrow">→</span>
      </component>
    </div>
  </section>
</template>
