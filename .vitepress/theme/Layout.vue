<script setup>
import DefaultTheme from 'vitepress/theme'
import HomeHeroBackground from './components/HomeHeroBackground.vue'
import Typewriter from './components/Typewriter.vue'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #home-hero-before>
      <HomeHeroBackground />
    </template>
    
    <template #home-hero-info-before>
      <!-- Optional: Insert something before hero info -->
    </template>
    
    <template #home-hero-info>
      <div class="custom-hero-info">
        <h1 class="name" v-if="frontmatter.hero.name">
          <span class="clip">{{ frontmatter.hero.name }}</span>
        </h1>
        <p class="text" v-if="frontmatter.hero.text">{{ frontmatter.hero.text }}</p>
        
        <!-- Typewriter Effect for Tagline -->
        <Typewriter 
          v-if="frontmatter.hero.tagline" 
          :text="frontmatter.hero.tagline" 
          :speed="50"
        />
        
        <div class="actions" v-if="frontmatter.hero.actions">
          <div class="action" v-for="action in frontmatter.hero.actions" :key="action.link">
            <a :href="action.link" class="VPButton" :class="[action.theme, 'medium']">
              {{ action.text }}
            </a>
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
/* Re-implementing some hero styles since we replaced the slot */
.custom-hero-info {
  text-align: center;
  padding: 0 24px;
}

.name {
  font-size: 56px;
  line-height: 64px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.text {
  font-size: 36px;
  line-height: 64px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  margin-bottom: 10px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

/* Media queries for responsiveness */
@media (min-width: 640px) {
  .name { font-size: 64px; line-height: 72px; }
  .text { font-size: 48px; line-height: 56px; }
}

@media (min-width: 960px) {
  .name { font-size: 72px; line-height: 80px; }
  .text { font-size: 56px; line-height: 64px; }
}
</style>
