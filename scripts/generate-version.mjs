/**
 * 生成版本信息文件
 * 在构建时自动生成包含时间戳和版本信息的 version.json
 * 用于前端检测网站更新
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 生成版本信息
function generateVersionInfo() {
  const now = new Date()

  // 获取 Git commit hash (如果可用)
  let gitHash = 'unknown'
  try {
    gitHash = execSync('git rev-parse --short HEAD').toString().trim()
  } catch (error) {
    console.warn('⚠️  无法获取 Git commit hash，使用默认值')
  }
  
  const versionInfo = {
    // 构建时间戳（毫秒）
    buildTime: now.getTime(),
    // 人类可读的构建时间
    buildDate: now.toISOString(),
    // 版本号（从 package.json 读取）
    version: getPackageVersion(),
    // Git commit hash
    gitHash: gitHash,
    // 部署环境
    environment: process.env.NETLIFY ? 'netlify' : (process.env.GITHUB_ACTIONS ? 'github' : 'local')
  }
  
  return versionInfo
}

// 从 package.json 读取版本号
function getPackageVersion() {
  try {
    const packageJsonPath = path.resolve(__dirname, '../package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    return packageJson.version || '1.0.0'
  } catch (error) {
    console.warn('⚠️  无法读取 package.json，使用默认版本号')
    return '1.0.0'
  }
}

// 主函数
async function main() {
  console.log('🔨 Generating version info...')
  
  try {
    // 生成版本信息
    const versionInfo = generateVersionInfo()
    
    console.log('📦 Version Info:', {
      buildDate: versionInfo.buildDate,
      version: versionInfo.version,
      gitHash: versionInfo.gitHash,
      environment: versionInfo.environment
    })
    
    // 确保输出目录存在
    const outputDir = path.resolve(__dirname, '../docs/.vitepress/dist')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // 写入 version.json
    const outputPath = path.join(outputDir, 'version.json')
    fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2), 'utf-8')
    
    console.log(`✅ Version file generated: ${outputPath}`)
    
    // 同时在 public 目录生成一份（用于开发环境）
    const publicDir = path.resolve(__dirname, '../docs/public')
    if (fs.existsSync(publicDir)) {
      const publicOutputPath = path.join(publicDir, 'version.json')
      fs.writeFileSync(publicOutputPath, JSON.stringify(versionInfo, null, 2), 'utf-8')
      console.log(`✅ Version file also generated in public: ${publicOutputPath}`)
    }
    
  } catch (error) {
    console.error('❌ Failed to generate version info:', error)
    process.exit(1)
  }
}

// 执行
main()

