# B站视频嵌入 - 快速开始

## 一分钟上手

在任何 Markdown 文件中添加 B站视频，只需复制粘贴以下代码：

```markdown
<BilibiliVideo url="你的B站视频链接" />
```

## 常用示例

### 📌 最简单的用法

```markdown
<BilibiliVideo url="https://www.bilibili.com/video/BV18VKhziE59/" />
```

### 📌 带标题

```markdown
<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="视频标题"
/>
```

### 📌 使用 BV 号

```markdown
<BilibiliVideo url="BV18VKhziE59" />
```

### 📌 多P视频指定分P

```markdown
<BilibiliVideo 
  url="BV18VKhziE59"
  :page="2"
/>
```

## 获取 B站视频链接

1. 打开 B站视频页面
2. 复制浏览器地址栏的链接
3. 粘贴到 `url` 参数中

例如：`https://www.bilibili.com/video/BV18VKhziE59/`

## 完整参数

| 参数 | 说明 | 默认值 | 示例 |
|------|------|--------|------|
| url | 视频链接（必填） | - | `"BV18VKhziE59"` |
| title | 视频标题 | 无 | `"教程视频"` |
| width | 宽度 | `"100%"` | `"800px"` |
| height | 高度 | `"auto"` | `"450px"` |
| autoplay | 自动播放 | `false` | `:autoplay="true"` |
| page | 视频分P | `1` | `:page="2"` |

## 使用位置

可以在以下位置使用：
- ✅ 所有 `.md` 文件
- ✅ 文章页面
- ✅ 教程文档
- ✅ 项目介绍
- ✅ 工具说明

## 效果预览

访问以下页面查看实际效果：
- `/articles/panda-coder-intro` - PandaCoder 插件介绍页面

## 问题排查

**视频无法显示？**
- 检查 URL 是否正确
- 确保 BV号格式正确
- 确认网络可以访问 B站

**详细文档：** 查看 `BILIBILI_VIDEO_USAGE.md`

