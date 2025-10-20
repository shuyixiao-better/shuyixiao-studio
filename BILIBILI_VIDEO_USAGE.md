# B站视频嵌入组件使用说明

## 功能说明

在博客文章中嵌入哔哩哔哩（B站）视频的全局组件，支持响应式布局和暗色主题。

## 组件位置

- 组件文件：`docs/.vitepress/theme/components/BilibiliVideo.vue`
- 全局注册：`docs/.vitepress/theme/index.js`

## 使用方法

### 基础用法

在任何 Markdown 文件中，只需使用以下语法即可嵌入 B站视频：

```markdown
<BilibiliVideo url="https://www.bilibili.com/video/BV18VKhziE59/" />
```

### 带标题的视频

```markdown
<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="PandaCoder 熊猫编码器 - 功能演示"
/>
```

### 完整参数示例

```markdown
<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="视频标题"
  width="100%"
  height="auto"
  :autoplay="false"
  :page="1"
/>
```

## 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `url` | String | 是 | - | B站视频链接或BV号 |
| `title` | String | 否 | '' | 视频标题（显示在视频下方） |
| `width` | String/Number | 否 | '100%' | 视频宽度 |
| `height` | String/Number | 否 | 'auto' | 视频高度（auto时自动按16:9比例） |
| `autoplay` | Boolean | 否 | false | 是否自动播放 |
| `page` | Number | 否 | 1 | 视频分P（多P视频时使用） |

## URL 格式支持

组件支持多种 URL 格式：

1. **完整链接**（推荐）：
   ```
   https://www.bilibili.com/video/BV18VKhziE59/
   ```

2. **带参数的完整链接**：
   ```
   https://www.bilibili.com/video/BV18VKhziE59/?spm_id_from=333.1387.homepage.video_card.click&vd_source=xxx
   ```

3. **仅 BV 号**：
   ```
   BV18VKhziE59
   ```

## 使用示例

### 示例 1：基础嵌入

```markdown
## 功能演示

<BilibiliVideo url="https://www.bilibili.com/video/BV18VKhziE59/" />
```

### 示例 2：带标题和说明

```markdown
## 教程视频

下面是详细的使用教程：

<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="PandaCoder 完整使用教程"
/>

视频中展示了所有核心功能的使用方法。
```

### 示例 3：多P视频指定分P

```markdown
<BilibiliVideo 
  url="BV18VKhziE59"
  title="第2集：高级功能"
  :page="2"
/>
```

### 示例 4：自定义尺寸

```markdown
<BilibiliVideo 
  url="BV18VKhziE59"
  width="800px"
  height="450px"
/>
```

## 特性说明

### 1. 响应式设计

- 默认宽度为 100%，自动适应容器
- 移动端自动优化显示
- 支持自定义宽高

### 2. 16:9 自适应

当 `height="auto"` 时（默认），组件自动计算高度以保持 16:9 比例：

```markdown
<BilibiliVideo url="BV18VKhziE59" />
<!-- 自动保持 16:9 比例 -->
```

### 3. 暗色主题适配

组件自动适配 VitePress 的亮色/暗色主题，无需额外配置。

### 4. 懒加载

视频使用 `loading="lazy"` 属性，只在滚动到可见区域时才加载，提升页面性能。

### 5. 安全沙箱

使用 `sandbox` 属性限制 iframe 权限，提升安全性。

### 6. 默认关闭弹幕

为了更好的观看体验，默认关闭弹幕显示。

## 技术实现

### 组件架构

```
BilibiliVideo.vue
├── Props 定义（url, title, width, height, autoplay, page）
├── BV号提取逻辑（extractBvid）
├── 嵌入URL生成（embedUrl）
├── 样式计算（wrapperStyle）
└── 模板渲染
    ├── 视频容器
    ├── iframe 播放器
    └── 标题显示
```

### URL 解析逻辑

```javascript
const extractBvid = (url) => {
  // 如果直接是BV号
  if (url.startsWith('BV')) return url
  
  // 从完整URL中提取BV号
  const match = url.match(/BV[\w]+/)
  return match ? match[0] : ''
}
```

### 16:9 比例实现

使用 padding-bottom 技巧实现固定比例：

```css
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 = 9/16 = 56.25% */
  height: 0;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

## 样式自定义

如果需要自定义样式，可以在 Markdown 文件中使用内联样式：

```markdown
<div style="max-width: 800px; margin: 0 auto;">
  <BilibiliVideo 
    url="BV18VKhziE59"
    title="居中显示的视频"
  />
</div>
```

## 注意事项

1. **URL 必填**：`url` 参数是必需的，必须提供有效的 B站视频链接或 BV号

2. **BV号格式**：确保 BV号格式正确，应该类似 `BV18VKhziE59`

3. **网络访问**：需要能够访问 `player.bilibili.com` 域名

4. **浏览器兼容性**：组件使用标准的 iframe 和 CSS，兼容所有现代浏览器

5. **移动端优化**：在移动端会自动移除圆角并全宽显示

## 实际应用

当前在以下页面使用了该组件：

- `docs/articles/panda-coder-intro.md` - PandaCoder 插件介绍页面的 v1.0.0 版本演示视频

## 后续扩展

您可以在任何需要展示 B站视频的地方使用此组件，例如：

- 教程文档中的演示视频
- 项目介绍页面的功能展示
- 技术分享文章的视频讲解
- 工具使用说明的操作演示

## 总结

现在您可以在整个站点的任何 Markdown 文件中轻松嵌入 B站视频，只需要一行简单的代码即可！组件已经过优化，支持响应式、暗色主题、懒加载等特性，开箱即用。

