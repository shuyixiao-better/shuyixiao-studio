# 如何在文章中嵌入B站视频

## 🎯 超级简单！只需两步

### 第一步：复制视频链接

1. 打开你想分享的 B站视频
2. 复制浏览器地址栏的链接（例如：`https://www.bilibili.com/video/BV18VKhziE59/`）

### 第二步：粘贴到文章中

在你的 `.md` 文件中，添加以下代码：

```markdown
<BilibiliVideo url="粘贴你的B站链接" />
```

就这么简单！视频会自动嵌入到页面中。

## 📝 实际例子

### 例子 1：最基础的用法

```markdown
<BilibiliVideo url="https://www.bilibili.com/video/BV18VKhziE59/" />
```

### 例子 2：给视频加个标题

```markdown
<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="这是视频的标题"
/>
```

### 例子 3：只用 BV 号也可以

```markdown
<BilibiliVideo url="BV18VKhziE59" />
```

## 🎬 常见场景

### 场景 1：在教程中加入演示视频

```markdown
# 如何使用 XXX 功能

下面是详细的操作演示：

<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="功能演示视频"
/>

## 操作步骤
1. 第一步...
2. 第二步...
```

### 场景 2：在项目介绍中展示效果

```markdown
# 我的项目

这是一个很棒的项目！看看运行效果：

<BilibiliVideo 
  url="BV18VKhziE59"
  title="项目运行效果演示"
/>
```

### 场景 3：多个视频（系列教程）

```markdown
# 完整教程

## 第一课：入门

<BilibiliVideo 
  url="BV11111111"
  title="第一课：基础知识"
/>

## 第二课：进阶

<BilibiliVideo 
  url="BV22222222"
  title="第二课：高级技巧"
/>
```

## 📋 可选参数一览表

| 参数 | 作用 | 必填吗 | 默认值 | 示例 |
|------|------|--------|--------|------|
| url | 视频链接 | ✅ 必填 | - | `"BV18VKhziE59"` |
| title | 视频标题 | ❌ 可选 | 无 | `"演示视频"` |
| width | 视频宽度 | ❌ 可选 | 100% | `"800px"` |
| height | 视频高度 | ❌ 可选 | 自动（16:9） | `"450px"` |
| page | 第几P | ❌ 可选 | 第1P | `:page="2"` |

## 💡 小贴士

### 如何获取 BV 号？

从链接中找到 `BV` 开头的那串字符：

```
https://www.bilibili.com/video/BV18VKhziE59/
                               ↑这就是BV号↑
```

### 多P视频怎么办？

如果视频有多个分P，可以指定播放第几P：

```markdown
<BilibiliVideo 
  url="BV18VKhziE59"
  :page="2"
  title="第2集"
/>
```

注意：`:page` 前面有个冒号 `:`

### 视频会自动适配手机吗？

会的！组件已经做好了响应式设计，在手机上会自动全宽显示。

### 会影响页面加载速度吗？

不会！组件使用了懒加载技术，只有滚动到视频位置时才会加载。

## ⚠️ 注意事项

1. **链接一定要正确**：确保是 B站的视频链接
2. **BV号要完整**：类似 `BV18VKhziE59` 这样的格式
3. **一页不要太多视频**：建议一个页面最多 2-3 个视频
4. **最好加上标题**：方便读者知道视频内容

## 🎯 实战演练

试试在你的文章中加入这段代码：

```markdown
## 功能演示

<BilibiliVideo 
  url="https://www.bilibili.com/video/BV18VKhziE59/"
  title="PandaCoder 功能演示"
/>

上面的视频展示了主要功能的使用方法。
```

## 🔍 查看效果

想看实际效果？访问这个页面：

👉 `/articles/panda-coder-intro`

## ❓ 遇到问题？

### 视频不显示

- ✅ 检查链接是否正确
- ✅ 确认 BV号格式对不对
- ✅ 看看浏览器控制台有没有报错

### 视频显示不全

- ✅ 试试不设置 width 和 height，让它自动适配
- ✅ 检查外层容器是否有宽度限制

### 想了解更多

查看详细文档：
- 📖 完整使用说明：`BILIBILI_VIDEO_USAGE.md`
- 🚀 快速开始：`BILIBILI_VIDEO_QUICK_START.md`
- 💡 更多示例：`BILIBILI_VIDEO_EXAMPLES.md`

## 🎉 开始使用吧！

现在你已经掌握了在文章中嵌入 B站视频的方法，赶快试试吧！

记住：只需要 `<BilibiliVideo url="你的视频链接" />` 就可以了！

