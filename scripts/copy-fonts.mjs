import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 源路径和目标路径
const sourceDir = join(__dirname, '..', 'HarmonyOS-font', 'HarmonyOS Sans 字体', 'HarmonyOS_SansSC');
const targetDir = join(__dirname, '..', 'docs', 'public', 'fonts', 'HarmonyOS_SansSC');

// 需要复制的字体文件
const fonts = [
  'HarmonyOS_SansSC_Light.ttf',
  'HarmonyOS_SansSC_Regular.ttf',
  'HarmonyOS_SansSC_Medium.ttf',
  'HarmonyOS_SansSC_Bold.ttf'
];

// 创建目标目录
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
  console.log(`✅ 创建目录: ${targetDir}`);
}

// 复制字体文件
fonts.forEach(font => {
  const source = join(sourceDir, font);
  const target = join(targetDir, font);
  
  try {
    copyFileSync(source, target);
    console.log(`✅ 复制成功: ${font}`);
  } catch (error) {
    console.error(`❌ 复制失败: ${font}`, error.message);
  }
});

console.log('\n🎉 字体文件复制完成！');

