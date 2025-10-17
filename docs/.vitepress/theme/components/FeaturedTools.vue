<template>
  <div class="featured-tools-section">
    <div class="featured-tools-container">
      <h2 class="featured-tools-title">✨ 实用工具</h2>
      <p class="featured-tools-subtitle">精选开发工具，助力高效编码</p>
      
      <div class="tools-showcase">
        <a href="/tools/avatar-generator/" class="featured-tool-card">
          <div class="tool-card-icon">🎨</div>
          <div class="tool-card-content">
            <h3 class="tool-card-title">头像生成器</h3>
            <p class="tool-card-desc">随机生成独特的个性头像，支持多种风格，一键下载使用</p>
            <div class="tool-card-tags">
              <span class="tool-badge">免费</span>
              <span class="tool-badge">在线工具</span>
            </div>
          </div>
          <div class="tool-card-arrow">→</div>
        </a>
        
        <a href="/articles/panda-coder-intro" class="featured-tool-card">
          <div class="tool-card-icon">🐼</div>
          <div class="tool-card-content">
            <h3 class="tool-card-title">PandaCoder</h3>
            <p class="tool-card-desc">IDEA代码生成插件，智能生成样板代码，提升开发效率</p>
            <div class="tool-card-tags">
              <span class="tool-badge">开源</span>
              <span class="tool-badge">IDEA插件</span>
            </div>
          </div>
          <div class="tool-card-arrow">→</div>
        </a>
      </div>
      
      <div class="tools-more">
        <a href="/tools/" class="tools-more-link">
          查看更多工具 →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped>
/* 实用工具展示区域样式 */
.featured-tools-section {
  margin: 5rem auto;
  padding: 0 2rem;
  max-width: 1200px;
  position: relative;
  z-index: 10;
}

.featured-tools-container {
  position: relative;
  padding: 3.5rem 3rem;
  background: linear-gradient(135deg,
    rgba(139, 92, 246, 0.05) 0%,
    rgba(59, 130, 246, 0.08) 50%,
    rgba(139, 92, 246, 0.05) 100%);
  border-radius: 28px;
  box-shadow: 
    0 25px 70px rgba(139, 92, 246, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.featured-tools-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg,
    transparent,
    rgba(139, 92, 246, 0.8),
    rgba(59, 130, 246, 0.8),
    rgba(139, 92, 246, 0.8),
    transparent);
}

.featured-tools-container::after {
  content: '🛠️';
  position: absolute;
  bottom: 2rem;
  right: 2.5rem;
  font-size: 5rem;
  opacity: 0.06;
  transform: rotate(-15deg);
  pointer-events: none;
}

.featured-tools-container:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 35px 90px rgba(139, 92, 246, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(139, 92, 246, 0.35);
}

.featured-tools-title {
  margin: 0 0 0.75rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    #8b5cf6 0%,
    #3b82f6 50%,
    #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  letter-spacing: 1.5px;
}

.featured-tools-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 70px;
  height: 3px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6);
  transform: translateX(-50%);
  border-radius: 2px;
}

.featured-tools-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 2.5rem;
  font-weight: 500;
}

.tools-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.featured-tool-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%);
  border-radius: 20px;
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.featured-tool-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.1),
    rgba(59, 130, 246, 0.1));
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 20px;
}

.featured-tool-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 
    0 20px 50px rgba(139, 92, 246, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.featured-tool-card:hover::before {
  opacity: 1;
}

.tool-card-icon {
  font-size: 3rem;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.15),
    rgba(59, 130, 246, 0.15));
  border-radius: 16px;
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
}

.featured-tool-card:hover .tool-card-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.25),
    rgba(59, 130, 246, 0.25));
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
}

.tool-card-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.tool-card-title {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.featured-tool-card:hover .tool-card-title {
  color: #8b5cf6;
}

.tool-card-desc {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.tool-card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tool-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.1),
    rgba(59, 130, 246, 0.1));
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
  font-weight: 500;
  transition: all 0.3s ease;
}

.featured-tool-card:hover .tool-badge {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
}

.tool-card-arrow {
  font-size: 1.5rem;
  color: #8b5cf6;
  opacity: 0.5;
  transition: all 0.4s ease;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.featured-tool-card:hover .tool-card-arrow {
  opacity: 1;
  transform: translateX(5px);
}

.tools-more {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px dashed rgba(139, 92, 246, 0.2);
}

.tools-more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: transparent;
  color: #8b5cf6;
  text-decoration: none;
  border: 2px solid #8b5cf6;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tools-more-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.2), transparent);
  transition: left 0.5s ease;
}

.tools-more-link:hover::before {
  left: 100%;
}

.tools-more-link:hover {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: white;
  border-color: transparent;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

/* 响应式 - 工具展示区域 */
@media (max-width: 768px) {
  .featured-tools-section {
    margin: 3rem auto;
    padding: 0 1rem;
  }
  
  .featured-tools-container {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }
  
  .featured-tools-container::after {
    font-size: 3.5rem;
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .featured-tools-title {
    font-size: 1.6rem;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }
  
  .featured-tools-subtitle {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }
  
  .tools-showcase {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .featured-tool-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .tool-card-icon {
    width: 70px;
    height: 70px;
    font-size: 2.5rem;
  }
  
  .tool-card-title {
    font-size: 1.2rem;
  }
  
  .tool-card-desc {
    font-size: 0.85rem;
  }
  
  .tool-card-arrow {
    display: none;
  }
  
  .tools-more-link {
    width: 100%;
    justify-content: center;
    padding: 0.65rem 1.5rem;
    font-size: 0.95rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .featured-tools-container {
    padding: 3rem 2.5rem;
  }
  
  .featured-tools-title {
    font-size: 2rem;
  }
  
  .featured-tools-subtitle {
    font-size: 1.05rem;
  }
  
  .tools-showcase {
    gap: 1.25rem;
  }
}

/* 暗色模式优化 */
.dark .featured-tools-container {
  background: linear-gradient(135deg,
    rgba(139, 92, 246, 0.08) 0%,
    rgba(59, 130, 246, 0.12) 50%,
    rgba(139, 92, 246, 0.08) 100%);
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.dark .featured-tools-container:hover {
  border-color: rgba(139, 92, 246, 0.45);
  box-shadow:
    0 35px 90px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.dark .featured-tool-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.dark .featured-tool-card:hover {
  box-shadow: 
    0 20px 50px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.dark .tool-card-icon {
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.2),
    rgba(59, 130, 246, 0.2));
}

.dark .featured-tool-card:hover .tool-card-icon {
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.3),
    rgba(59, 130, 246, 0.3));
}

.dark .tool-badge {
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.15),
    rgba(59, 130, 246, 0.15));
  border-color: rgba(139, 92, 246, 0.4);
}
</style>

