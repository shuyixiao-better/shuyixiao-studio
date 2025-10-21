/**
 * 鸿蒙字体 CDN 加载方案 - 使用中文网字计划
 * 基于 cn-font-split 的智能按需加载方案
 * 
 * 特点:
 * - 只加载页面实际使用的字符
 * - 全球 CDN 加速
 * - 自动字体分包
 * - 减少首屏加载时间
 */

interface FontCDNConfig {
  name: string;
  weight: number;
  family: string;
  cdnUrl: string;
  loaded: boolean;
}

class HarmonyOSFontCDNLoader {
  private fonts: FontCDNConfig[] = [
    { 
      name: 'Regular', 
      weight: 400, 
      family: 'HarmonyOS Sans SC',
      cdnUrl: 'https://chinese-font.netlify.app/.netlify/functions/css?font=HarmonyOS%20Sans%20SC&subset=CN&weight=400',
      loaded: false 
    },
    { 
      name: 'Light', 
      weight: 300, 
      family: 'HarmonyOS Sans SC',
      cdnUrl: 'https://chinese-font.netlify.app/.netlify/functions/css?font=HarmonyOS%20Sans%20SC&subset=CN&weight=300',
      loaded: false 
    },
    { 
      name: 'Medium', 
      weight: 500, 
      family: 'HarmonyOS Sans SC',
      cdnUrl: 'https://chinese-font.netlify.app/.netlify/functions/css?font=HarmonyOS%20Sans%20SC&subset=CN&weight=500',
      loaded: false 
    },
    { 
      name: 'Bold', 
      weight: 700, 
      family: 'HarmonyOS Sans SC',
      cdnUrl: 'https://chinese-font.netlify.app/.netlify/functions/css?font=HarmonyOS%20Sans%20SC&subset=CN&weight=700',
      loaded: false 
    }
  ];

  private loadedFonts = new Set<number>();
  private loadingPromises = new Map<number, Promise<void>>();
  private observer: IntersectionObserver | null = null;

  /**
   * 初始化 - 只在用户交互后才开始加载
   */
  init(): void {
    if (typeof window === 'undefined') return;

    // 监听用户首次交互(滚动/点击/触摸)
    const loadOnInteraction = () => {
      this.loadFont(400); // 加载默认字重
      
      // 移除监听器,只执行一次
      window.removeEventListener('scroll', loadOnInteraction);
      window.removeEventListener('click', loadOnInteraction);
      window.removeEventListener('touchstart', loadOnInteraction);
    };

    window.addEventListener('scroll', loadOnInteraction, { passive: true, once: true });
    window.addEventListener('click', loadOnInteraction, { passive: true, once: true });
    window.addEventListener('touchstart', loadOnInteraction, { passive: true, once: true });

    // 也可以设置延迟加载作为备选
    setTimeout(() => {
      if (!this.loadedFonts.has(400)) {
        this.loadFont(400);
      }
    }, 2000);
  }

  /**
   * 懒加载指定字重的字体
   */
  async loadFont(weight: number): Promise<void> {
    // 如果已经加载,直接返回
    if (this.loadedFonts.has(weight)) {
      return Promise.resolve();
    }

    // 如果正在加载,返回现有的 Promise
    if (this.loadingPromises.has(weight)) {
      return this.loadingPromises.get(weight)!;
    }

    const font = this.fonts.find(f => f.weight === weight);
    if (!font) {
      console.warn(`Font weight ${weight} not found`);
      return Promise.resolve();
    }

    // 创建加载 Promise
    const loadPromise = this.loadFontCSS(font);
    this.loadingPromises.set(weight, loadPromise);

    try {
      await loadPromise;
      this.loadedFonts.add(weight);
      font.loaded = true;
      console.log(`✅ HarmonyOS Sans ${font.name} loaded from CDN`);
    } catch (error) {
      console.error(`❌ Failed to load HarmonyOS Sans ${font.name}:`, error);
    } finally {
      this.loadingPromises.delete(weight);
    }
  }

  /**
   * 加载字体 CSS 文件
   */
  private loadFontCSS(font: FontCDNConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载过该 CSS
      const existingLink = document.querySelector(`link[data-font-weight="${font.weight}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = font.cdnUrl;
      link.setAttribute('data-font-weight', font.weight.toString());
      link.setAttribute('data-font-name', font.name);
      link.setAttribute('crossorigin', 'anonymous');

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load font: ${font.name}`));

      document.head.appendChild(link);
    });
  }

  /**
   * 智能预加载 - 在浏览器空闲时加载其他字重
   */
  intelligentPreload(): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadOtherWeights();
      }, { timeout: 3000 });
    } else {
      setTimeout(() => {
        this.loadOtherWeights();
      }, 3000);
    }
  }

  /**
   * 加载其他字重
   */
  private async loadOtherWeights(): Promise<void> {
    // 检测页面中使用的字重
    const weights = new Set<number>();
    
    // 只检查主要内容区域,避免性能问题
    const mainContent = document.querySelector('.main') || document.body;
    const elements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b');
    
    elements.forEach(el => {
      const fontWeight = window.getComputedStyle(el).fontWeight;
      const weight = parseInt(fontWeight);
      
      if ([300, 400, 500, 700].includes(weight) && !this.loadedFonts.has(weight)) {
        weights.add(weight);
      }
    });

    // 加载检测到的字重
    for (const weight of weights) {
      await this.loadFont(weight);
    }
  }

  /**
   * 手动加载所有字重
   */
  async loadAllFonts(): Promise<void> {
    const promises = this.fonts.map(font => this.loadFont(font.weight));
    await Promise.all(promises);
  }

  /**
   * 获取加载状态
   */
  getLoadStatus(): { total: number; loaded: number; fonts: FontCDNConfig[] } {
    return {
      total: this.fonts.length,
      loaded: this.loadedFonts.size,
      fonts: [...this.fonts]
    };
  }
}

// 创建全局单例
const fontCDNLoader = new HarmonyOSFontCDNLoader();

// 导出
export default fontCDNLoader;

// 自动初始化
if (typeof window !== 'undefined') {
  console.log('🎨 HarmonyOS Font CDN Loader initializing...');
  
  // 等待 DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fontCDNLoader.init();
      fontCDNLoader.intelligentPreload();
    });
  } else {
    fontCDNLoader.init();
    fontCDNLoader.intelligentPreload();
  }
}

