<template>
  <div class="home-section premium-recommend-section">
    <div class="premium-recommend-container">
      <!-- 标题区域 -->
      <div class="section-header">
        <h2 class="section-title"> 精选好物推荐</h2>
        <p class="section-subtitle">「我正在使用的优质工具与服务」</p>
      </div>

      <!-- 产品网格 -->
      <div class="products-grid">
        <article
          v-for="product in featuredProducts" 
          :key="product.id"
          class="product-card"
        >
          <!-- 折扣标签 -->
          <div v-if="product.badge" class="product-badge">
            {{ product.badge }}
          </div>

          <!-- 产品图标 -->
          <div class="product-icon"><LineIcon name="book" /></div>

          <!-- 产品信息 -->
          <div class="product-info">
            <h3 class="product-title"><a :href="product.link" target="_blank" rel="noopener noreferrer" @click="handleClick(product.id)">{{ product.title }}</a></h3>
            <p class="product-desc">{{ product.description }}</p>
            
            <!-- 价格信息 -->
            <div class="product-pricing" v-if="product.price">
              <span class="current-price">{{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">
                {{ product.originalPrice }}
              </span>
            </div>

            <!-- 折扣信息 -->
            <div v-if="product.discount" class="product-discount">
               {{ product.discount }}
            </div>
          </div>

          <!-- 悬停时显示的详细信息 -->
          <details class="product-details" v-if="product.longDescription">
            <summary>查看详情</summary>
            <p>{{ product.longDescription }}</p>
            <div class="product-tags">
              <span v-for="tag in product.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </details>

          <!-- 箭头图标 -->
          <a class="product-arrow" :href="product.link" :aria-label="`查看${product.title}`" target="_blank" rel="noopener noreferrer" @click="handleClick(product.id)">→</a>
        </article>
      </div>

      <!-- 说明文字 -->
      <div class="disclosure">
        <span class="disclosure-icon"><LineIcon name="book" /></span>
        <span class="disclosure-text">
          {{ disclosureText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFeaturedProducts, trackAffiliateClick, affiliateConfig } from '../../data/affiliate'

// 获取精选产品
const featuredProducts = computed(() => {
  return getFeaturedProducts(affiliateConfig.limits.homepage)
})

// 配置
const config = affiliateConfig
const disclosureText = computed(() => config.disclosure.long.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, ''))

// 点击处理
const handleClick = (productId: string) => {
  trackAffiliateClick(productId, 'homepage')
}
</script>

<style scoped>
.premium-recommend-container { border-top: var(--ui-border) solid var(--vp-c-divider); padding-top: var(--sp-32); }
.section-title { font-size: var(--ui-text-section); font-weight: var(--ui-weight-heading); margin-bottom: var(--sp-8); }
.section-subtitle { font-size: var(--ui-text-sm); color: var(--vp-c-text-2); margin-bottom: var(--sp-32); }
.products-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sp-24); }
.product-card { position: relative; display: flex; flex-direction: column; gap: var(--sp-12); min-width: 0; padding: var(--sp-24); border: var(--ui-border) solid var(--vp-c-divider); border-radius: var(--ui-radius-card); text-decoration: none; color: var(--vp-c-text-1); }
.product-card:hover { border-color: var(--vp-c-brand-1); }
.product-icon { color: var(--ui-muted); }
.product-badge, .product-discount, .product-tags, .disclosure { color: var(--ui-muted); font-size: var(--ui-text-xs); }
.product-title a { color: var(--vp-c-text-1); }
.product-title a:hover { color: var(--vp-c-brand-1); }
.product-title { font-size: var(--ui-text-base); font-weight: var(--ui-weight-heading); margin: 0 0 var(--sp-8); }
.product-desc, .product-details { color: var(--vp-c-text-2); font-size: var(--ui-text-sm); }
.product-details summary { cursor: pointer; color: var(--vp-c-text-2); }
.product-details { border-top: var(--ui-border) solid var(--vp-c-divider); padding-top: var(--sp-12); }
.product-pricing { display: flex; gap: var(--sp-8); font-variant-numeric: tabular-nums; font-size: var(--ui-text-sm); }
.original-price { text-decoration: line-through; color: var(--ui-muted); }
.product-tags { display: flex; flex-wrap: wrap; gap: var(--sp-8); }
.product-arrow { align-self: flex-end; color: var(--ui-muted); }
.disclosure { display: flex; gap: var(--sp-8); margin-top: var(--sp-24); }
@media (max-width: 959px) { .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 639px) { .products-grid { grid-template-columns: minmax(0, 1fr); } }
</style>
