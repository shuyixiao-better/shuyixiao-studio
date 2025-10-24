<template>
  <div class="premium-recommend-section">
    <div class="premium-recommend-container">
      <!-- 标题区域 -->
      <div class="section-header">
        <h2 class="section-title">✨ 精选好物推荐</h2>
        <p class="section-subtitle">「我正在使用的优质工具与服务」</p>
      </div>

      <!-- 产品网格 -->
      <div class="products-grid">
        <a 
          v-for="product in featuredProducts" 
          :key="product.id"
          :href="product.link"
          target="_blank"
          rel="noopener noreferrer"
          class="product-card"
          @click="handleClick(product.id)"
        >
          <!-- 折扣标签 -->
          <div v-if="product.badge" class="product-badge">
            {{ product.badge }}
          </div>

          <!-- 产品图标 -->
          <div class="product-icon">{{ product.icon }}</div>

          <!-- 产品信息 -->
          <div class="product-info">
            <h3 class="product-title">{{ product.title }}</h3>
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
              🎉 {{ product.discount }}
            </div>
          </div>

          <!-- 悬停时显示的详细信息 -->
          <div class="product-details" v-if="product.longDescription">
            <p>{{ product.longDescription }}</p>
            <div class="product-tags">
              <span v-for="tag in product.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 箭头图标 -->
          <div class="product-arrow">→</div>
        </a>
      </div>

      <!-- 说明文字 -->
      <div class="disclosure">
        <span class="disclosure-icon">ℹ️</span>
        <span class="disclosure-text">
          {{ config.disclosure.long }}
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

// 点击处理
const handleClick = (productId: string) => {
  trackAffiliateClick(productId, 'homepage')
}
</script>

<style scoped>
/* ========================================
   精选好物推荐 - 样式
   使用金色/橙色渐变，区别于工具的紫色
   ======================================== */

.premium-recommend-section {
  margin: 5rem auto;
  padding: 0 2rem;
  max-width: 1200px;
  position: relative;
  z-index: 10;
}

.premium-recommend-container {
  position: relative;
  padding: 3.5rem 3rem;
  background: linear-gradient(135deg,
    rgba(255, 193, 7, 0.05) 0%,
    rgba(255, 152, 0, 0.08) 50%,
    rgba(255, 193, 7, 0.05) 100%);
  border-radius: 28px;
  box-shadow: 
    0 25px 70px rgba(255, 193, 7, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-recommend-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 193, 7, 0.8),
    rgba(255, 152, 0, 0.8),
    rgba(255, 193, 7, 0.8),
    transparent);
}

.premium-recommend-container::after {
  content: '🛍️';
  position: absolute;
  bottom: 2rem;
  right: 2.5rem;
  font-size: 5rem;
  opacity: 0.06;
  transform: rotate(-15deg);
  pointer-events: none;
}

.premium-recommend-container:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 35px 90px rgba(255, 193, 7, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 193, 7, 0.35);
}

/* 标题区域 */
.section-header {
  margin-bottom: 2.5rem;
}

.section-title {
  margin: 0 0 0.75rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    #f59e0b 0%,
    #f97316 50%,
    #f59e0b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1.5px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 70px;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b, #f97316);
  transform: translateX(-50%);
  border-radius: 2px;
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 500;
  font-style: italic;
}

/* 产品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* 产品卡片 */
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%);
  border-radius: 20px;
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(255, 193, 7, 0.1),
    rgba(255, 152, 0, 0.1));
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 20px;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 193, 7, 0.5);
  box-shadow: 
    0 20px 50px rgba(255, 193, 7, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.product-card:hover::before {
  opacity: 1;
}

/* 产品标签 */
.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.35rem 0.75rem;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

/* 产品图标 */
.product-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(255, 193, 7, 0.3));
  transition: transform 0.3s ease;
}

.product-card:hover .product-icon {
  transform: scale(1.1) rotate(5deg);
}

/* 产品信息 */
.product-info {
  flex: 1;
  position: relative;
  z-index: 2;
}

.product-title {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.product-card:hover .product-title {
  color: #f59e0b;
}

.product-desc {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

/* 价格信息 */
.product-pricing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.current-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f59e0b;
}

.original-price {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  text-decoration: line-through;
}

/* 折扣信息 */
.product-discount {
  font-size: 0.85rem;
  color: #f97316;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

/* 详细信息 (悬停显示) */
.product-details {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.4s ease;
  margin-top: 0;
  position: relative;
  z-index: 2;
}

.product-card:hover .product-details {
  max-height: 200px;
  opacity: 1;
  margin-top: 1rem;
}

.product-details p {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem;
}

/* 标签 */
.product-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.7rem;
  padding: 0.25rem 0.6rem;
  background: rgba(255, 193, 7, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.product-card:hover .tag {
  background: rgba(255, 193, 7, 0.2);
  border-color: rgba(255, 193, 7, 0.5);
}

/* 箭头 */
.product-arrow {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: #f59e0b;
  opacity: 0.5;
  transition: all 0.3s ease;
  z-index: 2;
}

.product-card:hover .product-arrow {
  opacity: 1;
  transform: translateX(5px);
}

/* 说明文字 */
.disclosure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 193, 7, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(255, 193, 7, 0.2);
  margin-top: 2rem;
}

.disclosure-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.disclosure-text {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  text-align: center;
}

/* ========================================
   响应式设计
   ======================================== */

@media (max-width: 768px) {
  .premium-recommend-section {
    margin: 3rem auto;
    padding: 0 1rem;
  }
  
  .premium-recommend-container {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }
  
  .premium-recommend-container::after {
    font-size: 3.5rem;
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .section-title {
    font-size: 1.6rem;
    letter-spacing: 1px;
  }
  
  .section-subtitle {
    font-size: 0.95rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .product-card {
    padding: 1.5rem;
  }
  
  .product-icon {
    font-size: 2.5rem;
  }
  
  .product-title {
    font-size: 1.2rem;
  }
  
  .product-desc {
    font-size: 0.85rem;
  }
  
  .disclosure {
    padding: 0.875rem;
  }
  
  .disclosure-text {
    font-size: 0.85rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .premium-recommend-container {
    padding: 3rem 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1.05rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
  }
}

/* ========================================
   暗色模式优化
   ======================================== */

.dark .premium-recommend-container {
  background: linear-gradient(135deg,
    rgba(255, 193, 7, 0.08) 0%,
    rgba(255, 152, 0, 0.12) 50%,
    rgba(255, 193, 7, 0.08) 100%);
  border-color: rgba(255, 193, 7, 0.3);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.dark .premium-recommend-container:hover {
  border-color: rgba(255, 193, 7, 0.45);
  box-shadow:
    0 35px 90px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.dark .product-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.dark .product-card:hover {
  box-shadow: 
    0 20px 50px rgba(255, 193, 7, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.dark .disclosure {
  background: rgba(255, 193, 7, 0.12);
  border-color: rgba(255, 193, 7, 0.3);
}

.dark .tag {
  background: rgba(255, 193, 7, 0.15);
  border-color: rgba(255, 193, 7, 0.4);
}
</style>

