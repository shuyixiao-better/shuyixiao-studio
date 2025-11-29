<template>
  <div class="not-found-container">
    <div class="content">
      <div class="zen-circle"></div>
      <div class="poetry">
        <p class="line">行到水穷处</p>
        <p class="line">坐看云起时</p>
      </div>
      <div class="message">
        此处风景独好，只是暂无内容
      </div>
      <div class="action">
        <a href="/" class="home-link" aria-label="返回首页">
          <span class="text">归去来兮</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 引入衬线字体以增强文艺感 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap');

.not-found-container {
  min-height: calc(100vh - var(--vp-nav-height));
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-base);
  overflow: hidden;
  position: relative;
  transition: background-color 0.5s;
}

/* 装饰性的水墨圆/禅意圆 - 现代科技版 */
.zen-circle {
  width: 260px;
  height: 260px;
  border-radius: 50%;
  /* 使用品牌色，支持暗黑模式 */
  background: radial-gradient(circle at 30% 30%, var(--vp-c-brand-soft), transparent 70%);
  border: 1px solid var(--vp-c-brand-dimm);
  box-shadow: 0 0 40px var(--vp-c-brand-dimm);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
  animation: breathe 8s ease-in-out infinite;
}

.content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
  animation: fadeIn 1.2s ease-out;
}

.poetry {
  margin-bottom: 3rem;
}

.poetry .line {
  font-family: 'Noto Serif SC', 'Songti SC', 'STSong', serif;
  font-size: 2.5rem;
  line-height: 1.5;
  font-weight: 300;
  color: var(--vp-c-text-1);
  margin: 0.5rem 0;
  letter-spacing: 0.5rem;
  /* 微妙的文字阴影 */
  text-shadow: 0 2px 10px var(--vp-c-brand-dimm);
}

.message {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 3rem;
  font-weight: 400;
  letter-spacing: 0.1rem;
}

.action {
  display: flex;
  justify-content: center;
}

.home-link {
  position: relative;
  display: inline-block;
  padding: 12px 36px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 1.1rem;
  letter-spacing: 0.2rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 4px; /* 轻微圆角 */
  transition: all 0.3s ease;
  overflow: hidden;
  background: transparent;
}

.home-link:hover {
  color: white; /* 假设品牌色背景上文字为白色，或者根据实际情况调整 */
  background-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px var(--vp-c-brand-dimm);
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes breathe {
  0%, 100% {
    transform: translate(-50%, -60%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -60%) scale(1.05);
    opacity: 0.8;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .poetry .line {
    font-size: 1.8rem;
    letter-spacing: 0.2rem;
  }
  
  .zen-circle {
    width: 180px;
    height: 180px;
  }
}
</style>
