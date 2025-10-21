/**
 * 智能字体加载器 - 根据环境自动选择方案
 * 开发环境：使用本地方案（避免 CORS）
 * 生产环境：使用 CDN 方案（性能优化）
 */

import fontLoaderLocal from './font-loader'
import fontLoaderCDN from './font-loader-cdn'

// 检测是否为生产环境
const isProduction = typeof window !== 'undefined' 
  && window.location.hostname !== 'localhost' 
  && window.location.hostname !== '127.0.0.1';

// 根据环境选择加载器
const fontLoader = isProduction ? fontLoaderCDN : fontLoaderLocal;

// 输出当前使用的方案
if (typeof window !== 'undefined') {
  console.log(`🎨 Font Loader Mode: ${isProduction ? 'CDN (Production)' : 'Local (Development)'}`);
  console.log(`   Environment: ${window.location.hostname}`);
}

export default fontLoader;

