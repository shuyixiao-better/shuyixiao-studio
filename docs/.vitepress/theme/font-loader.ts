/**
 * 鸿蒙字体懒加载器
 * 优化字体加载性能，提供友好的用户交互体验
 */

interface FontConfig {
  name: string;
  weight: number;
  cssPath: string;
  loaded: boolean;
}

class HarmonyOSFontLoader {
  private fonts: FontConfig[] = [
    { name: 'Regular', weight: 400, cssPath: '/fonts/HarmonyOS_SansSC_Regular/result.css', loaded: false },
    { name: 'Light', weight: 300, cssPath: '/fonts/HarmonyOS_SansSC_Light/result.css', loaded: false },
    { name: 'Medium', weight: 500, cssPath: '/fonts/HarmonyOS_SansSC_Medium/result.css', loaded: false },
    { name: 'Bold', weight: 700, cssPath: '/fonts/HarmonyOS_SansSC_Bold/result.css', loaded: false }
  ];

  private loadedFonts = new Set<number>();
  private loadingPromises = new Map<number, Promise<void>>();

  /**
   * 预加载最常用的字重（Regular）
   */
  async preloadPrimaryFont(): Promise<void> {
    return this.loadFont(400);
  }

  /**
   * 懒加载指定字重的字体
   */
  async loadFont(weight: number): Promise<void> {
    // 如果已经加载，直接返回
    if (this.loadedFonts.has(weight)) {
      return Promise.resolve();
    }

    // 如果正在加载，返回现有的 Promise
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
    } finally {
      this.loadingPromises.delete(weight);
    }
  }

  /**
   * 加载字体 CSS 文件
   */
  private loadFontCSS(font: FontConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载过该 CSS
      const existingLink = document.querySelector(`link[data-font-weight="${font.weight}"]`);
      if (existingLink) {
        console.log(`⏭️ HarmonyOS Sans ${font.name} (${font.weight}) already loaded, skipping...`);
        resolve();
        return;
      }

      console.log(`📥 Loading HarmonyOS Sans ${font.name} (${font.weight}) from ${font.cssPath}...`);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = font.cssPath;
      link.setAttribute('data-font-weight', font.weight.toString());
      link.setAttribute('data-font-name', font.name);

      link.onload = () => {
        console.log(`✅ HarmonyOS Sans ${font.name} (${font.weight}) loaded successfully`);
        resolve();
      };

      link.onerror = () => {
        console.error(`❌ Failed to load HarmonyOS Sans ${font.name} (${font.weight}) from ${font.cssPath}`);
        reject(new Error(`Failed to load font: ${font.name}`));
      };

      document.head.appendChild(link);
      console.log(`🔗 Link element added to head for ${font.name}`);
    });
  }

  /**
   * 批量加载所有字体
   */
  async loadAllFonts(): Promise<void> {
    const promises = this.fonts.map(font => this.loadFont(font.weight));
    await Promise.all(promises);
  }

  /**
   * 智能预加载：根据页面内容检测需要的字重
   * 优化：只检测主要内容区域,避免性能问题
   */
  intelligentPreload(): void {
    // 延迟执行，避免阻塞首屏渲染
    const checkAndLoad = () => {
      const weights = new Set<number>();
      
      // 只检测主要内容区域,避免性能问题
      const mainContent = document.querySelector('.main') || document.querySelector('.vp-doc') || document.body;
      const elements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b, .title');
      
      elements.forEach(el => {
        const fontWeight = window.getComputedStyle(el).fontWeight;
        const weight = parseInt(fontWeight);
        
        if ([300, 400, 500, 700].includes(weight) && !this.loadedFonts.has(weight)) {
          weights.add(weight);
        }
      });

      // 加载检测到的字重
      console.log(`🔍 Detected font weights: ${Array.from(weights).join(', ')}`);
      weights.forEach(weight => {
        this.loadFont(weight);
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(checkAndLoad, { timeout: 2000 });
    } else {
      setTimeout(checkAndLoad, 1000);
    }
  }

  /**
   * 获取加载状态
   */
  getLoadStatus(): { total: number; loaded: number; fonts: FontConfig[] } {
    return {
      total: this.fonts.length,
      loaded: this.loadedFonts.size,
      fonts: [...this.fonts]
    };
  }
}

// 创建全局单例
const fontLoader = new HarmonyOSFontLoader();

// 导出
export default fontLoader;

/**
 * 立即加载策略（不阻塞渲染）
 * - 使用 requestAnimationFrame 确保在浏览器空闲时加载
 * - 字体请求会立即出现在 Network → Font 选项卡
 */
if (typeof window !== 'undefined') {
  console.log('🎨 HarmonyOS Font Loader initializing...');
  
  // 等待 DOM 加载完成
  const initFontLoader = () => {
    // 使用 requestAnimationFrame 确保不阻塞首屏渲染
    requestAnimationFrame(() => {
      console.log('📥 Loading primary font (Regular)...');
      fontLoader.preloadPrimaryFont();
      
      // 在浏览器空闲时加载其他字重
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          console.log('🔍 Starting intelligent font preload...');
          fontLoader.intelligentPreload();
        }, { timeout: 1000 });
      } else {
        setTimeout(() => {
          console.log('🔍 Starting intelligent font preload...');
          fontLoader.intelligentPreload();
        }, 500);
      }
    });
  };
  
  // 等待 DOM 加载完成后立即初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFontLoader);
  } else {
    initFontLoader();
  }
}

