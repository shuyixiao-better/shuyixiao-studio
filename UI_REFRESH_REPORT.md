# UI Refresh 本地验收报告

分支：`ui-refresh`。基线：`5161660`。只做本地提交，未推送、未切换回或合并至 `write`，未部署。

## 结果

- 六阶段均通过 `pnpm docs:build`；Node 22.16.0、pnpm 10.17.1。
- `node --test scripts/deploy-env.test.mjs`：43/43 通过。
- before 20 张；after 84 张（三平台 × 七页面 × 两视口 × 两模式），无资源错误、hydration 异常或页面横向溢出。
- CF/GitHub 的 56 个页面组合共 0 次 `/api/*` 请求；交互检查另确认无评论函数请求。
- 补充验证：推荐页辅助文字在 light/dark 下使用 AA 辅助色；遗留周报测试页在两种模式下均不挂载 iframe、不发 API 请求。
- 八组交互通过：字号/栅格/详情展开、列表全宽与筛选分页、点赞/焦点/反馈、HTML 降级、超时降级、CF 引导、GitHub 引导、390px 菜单与 404。
- `dist/version.json`、`dist/rss.xml`、`dist/404.html` 存在；字体加载器、RSS/版本生成脚本、依赖与部署配置均未改。
- sidebar、socialLinks、base、cleanUrls、outDir、sitemap 和 head 统计/广告脚本保留；26 个自带样式页面的正文与外链经去除样式/装饰图标后的比较保持一致。

## 样式度量

口径仅为原 custom.css 与拆分后的七个全局模块，不混入组件 scoped CSS；规则采用紧凑排版。

| 文件 | 前行数 | 后行数 | 后 !important |
|---|---:|---:|---:|
| `custom.css` | 4862 | 7 | 0 |
| `base.css` | 0 | 14 | 5 |
| `components.css` | 0 | 24 | 3 |
| `doc.css` | 0 | 28 | 0 |
| `home.css` | 0 | 54 | 0 |
| `layout.css` | 0 | 23 | 0 |
| `nav.css` | 0 | 11 | 0 |
| `tokens.css` | 0 | 169 | 0 |
| **合计** | **4862** | **330** | **8** |

`!important`：295 → 8；源码字节数：99,578 → 19,673。保留项均有原因注释：无障碍动态覆盖、VitePress/scoped 焦点覆盖，以及不能改动的页面内联样式覆盖。
指定的 text-3 在小字号下不满足 AA，因此保留原色板，实际辅助文字使用 `--ui-muted`；正文/次级文字/按钮采用对应明暗令牌。

## 后台组件行为

| 组件 | Netlify | Cloudflare | GitHub Pages |
|---|---|---|---|
| ArticleStats | 本地元信息 + 有效阅读/点赞；异常隐藏后台数字 | 仅本地元信息，不请求 API | 同 CF |
| SiteVisits | 有效 JSON 才显示总访问量及分隔符 | 整项及分隔符隐藏 | 同 CF |
| FeedbackWidget | 显示 40px 反馈入口，保留原提交接口 | 不渲染入口 | 同 CF |
| ConsumerCopilot（组件/页面） | 正常初始化对话 | 主站同路径提示，不请求 chat | 同 CF |
| PandaCoder 周报/遗留测试页 | 挂载原代理 iframe | 不挂载 iframe，显示主站提示 | 同 CF |
| Comments | 原评论功能；周报页不显示 | 统一提示，链接到同路径 #评论区 | 同 CF |

local/unknown：最多一次共享的 `/api/check-env` GET 探测，3 秒超时，200 + JSON content-type 才启用；sessionStorage 失败不影响降级。线上忽略 `?__deploy=`，只有 localhost/127.0.0.1 可覆盖测试环境。

## 各阶段文件

**阶段 0：多平台环境**（`d76508e`）

- `.gitignore`：忽略本地视觉验收截图。
- `docs/.vitepress/theme/components/CommentsPlaceholder.vue`：用统一提示组件引导主站同路径的评论锚点。
- `docs/.vitepress/theme/components/ConsumerCopilot.vue`：按后台能力启用对话、静态平台不请求 chat，并统一交互样式。
- `docs/.vitepress/theme/components/RequiresBackendNotice.vue`：统一的主站功能提示与同路径链接。
- `docs/.vitepress/theme/index.js`：SSR 安全布局、统一环境判断、组件注册与阅读区元信息。
- `docs/.vitepress/theme/utils/deploy-env.js`：精确域名识别、仅本地覆盖、后端能力探测、主站 URL 与 3 秒 JSON 请求。
- `docs/tools/consumer-copilot/index.md`：统一后台判断与主站提示，保留页面正文和链接。
- `docs/tools/pandacoder-weekly/index.md`：静态平台不挂载 iframe；修复 template hydration，并保留代理路径及遮罩隐藏。
- `scripts/deploy-env.test.mjs`：Node 内置测试覆盖域名边界、本地覆盖、探测缓存、超时与 HTML 降级。

**阶段 1：基础样式**（`9d1695d`）

- `docs/.vitepress/theme/custom.css`：仅保留七个样式模块导入。
- `docs/.vitepress/theme/styles/base.css`：基础排版、2px 品牌色焦点环与减少动态效果支持。
- `docs/.vitepress/theme/styles/components.css`：公共卡片/按钮/后台提示/浮钮，以及保留内联内容所需的可读性覆盖。
- `docs/.vitepress/theme/styles/doc.css`：正文、标题、表格、代码、目录及缩放样式，修复手机代码块外扩。
- `docs/.vitepress/theme/styles/home.css`：首页间距、栅格、列表与响应式排版。
- `docs/.vitepress/theme/styles/layout.css`：阅读/文章列表布局、保留必要遮罩规则和页脚分隔符。
- `docs/.vitepress/theme/styles/nav.css`：64px 导航、滚动透明背景及下拉菜单。
- `docs/.vitepress/theme/styles/tokens.css`：暖色明暗主题、字体阶梯、尺寸与 AA 辅助文字色。
- `docs/index.md`：仅统一自带样式和装饰图标，保留正文与外链。

**阶段 2：定位与导航**（`385438c`）

- `docs/.vitepress/config.mts`：跨界探索定位、六项导航、简洁页脚与默认 SEO 描述。
- `docs/.vitepress/theme/index.js`：SSR 安全布局、统一环境判断、组件注册与阅读区元信息。

**阶段 3：首页**（`1423a5b`）

- `docs/.vitepress/theme/components/LineIcon.vue`：复用内联 24px / 1.5px 线性 SVG 图标。
- `docs/.vitepress/theme/components/RSSFeedCard.vue`：紧凑订阅条，保留 RSS 与公众号入口。
- `docs/.vitepress/theme/components/RecentPosts.vue`：沿用 posts.data.js，改为日期/标题/分类列表。
- `docs/.vitepress/theme/components/home/AboutBlog.vue`：合并首页写作理念与署名。
- `docs/.vitepress/theme/components/home/HomeHero.vue`：探索者主标题、介绍、阅读入口与低权重访问说明。
- `docs/.vitepress/theme/components/home/HomeNav.vue`：桌面三列、手机单列的六项内容导航。
- `docs/.vitepress/theme/components/home/NowExploring.vue`：四类探索卡片，空链接不可点击。
- `docs/.vitepress/theme/data/explorations.js`：四类探索数据，status 默认持续更新、link 暂为 null。
- `docs/.vitepress/theme/index.js`：SSR 安全布局、统一环境判断、组件注册与阅读区元信息。
- `docs/.vitepress/theme/styles/home.css`：首页间距、栅格、列表与响应式排版。
- `docs/index.md`：仅统一自带样式和装饰图标，保留正文与外链。

**阶段 4：阅读与统计**（`a7b41c0`）

- `docs/.vitepress/theme/NotFound.vue`：简洁 404，并移除原有额外 Google 字体导入。
- `docs/.vitepress/theme/components/ArticleList.vue`：全宽细线列表、保留搜索筛选分页，统一焦点和移动布局。
- `docs/.vitepress/theme/components/ArticleStats.vue`：本地日期/字数/阅读时长与后台阅读/点赞分离，失败静默隐藏。
- `docs/.vitepress/theme/components/CommentsPlaceholder.vue`：用统一提示组件引导主站同路径的评论锚点。
- `docs/.vitepress/theme/components/SiteVisits.vue`：避免重复探测、校验 JSON，失败时隐藏访问量及分隔符。
- `docs/.vitepress/theme/index.js`：SSR 安全布局、统一环境判断、组件注册与阅读区元信息。
- `docs/.vitepress/theme/styles/nav.css`：64px 导航、滚动透明背景及下拉菜单。
- `docs/.vitepress/theme/utils/deploy-env.js`：精确域名识别、仅本地覆盖、后端能力探测、主站 URL 与 3 秒 JSON 请求。

**阶段 5：组件、页面与验收**

- `UI_REFRESH_REPORT.md`：分阶段文件清单、度量、验证结果与待办记录。
- `docs/.vitepress/theme/components/ArticleList.vue`：全宽细线列表、保留搜索筛选分页，统一焦点和移动布局。
- `docs/.vitepress/theme/components/ArticleStats.vue`：本地日期/字数/阅读时长与后台阅读/点赞分离，失败静默隐藏。
- `docs/.vitepress/theme/components/BilibiliVideo.vue`：统一组件的令牌、装饰图标、响应式与明暗样式。
- `docs/.vitepress/theme/components/Comments.vue`：保留评论/图片/删除接口，统一样式、锚点和键盘入口。
- `docs/.vitepress/theme/components/CommentsPlaceholder.vue`：用统一提示组件引导主站同路径的评论锚点。
- `docs/.vitepress/theme/components/ConsumerCopilot.vue`：按后台能力启用对话、静态平台不请求 chat，并统一交互样式。
- `docs/.vitepress/theme/components/EasterEgg.vue`：40px 中性浮钮、统一堆栈与键盘关闭。
- `docs/.vitepress/theme/components/FeaturedTools.vue`：低权重工具列表与统一线性图标。
- `docs/.vitepress/theme/components/FeedbackWidget.vue`：无后台不渲染；保留提交接口并统一浮钮、表单与弹窗。
- `docs/.vitepress/theme/components/FontLoadIndicator.vue`：统一组件的令牌、装饰图标、响应式与明暗样式。
- `docs/.vitepress/theme/components/GoogleAdsense.vue`：统一组件的令牌、装饰图标、响应式与明暗样式。
- `docs/.vitepress/theme/components/JobsQuotes.vue`：克制名言样式，减少动态效果偏好下不自动轮播。
- `docs/.vitepress/theme/components/LineIcon.vue`：复用内联 24px / 1.5px 线性 SVG 图标。
- `docs/.vitepress/theme/components/PasswordProtect.vue`：统一输入/解锁样式，补客户端守卫和减少动态效果适配。
- `docs/.vitepress/theme/components/PremiumRecommend.vue`：克制推荐卡片，详情可用键盘展开，保留商品链接与点击统计。
- `docs/.vitepress/theme/components/SiteRuntime.vue`：统一组件的令牌、装饰图标、响应式与明暗样式。
- `docs/.vitepress/theme/components/SiteVisits.vue`：避免重复探测、校验 JSON，失败时隐藏访问量及分隔符。
- `docs/.vitepress/theme/components/TechPhilosophy.vue`：统一组件的令牌、装饰图标、响应式与明暗样式。
- `docs/.vitepress/theme/components/UpdateNotification.vue`：保留 version.json 检查链路，统一通知与客户端刷新守卫。
- `docs/.vitepress/theme/components/WinningMindset.vue`：统一组件的令牌、装饰图标、响应式与明暗样式。
- `docs/.vitepress/theme/index.js`：SSR 安全布局、统一环境判断、组件注册与阅读区元信息。
- `docs/.vitepress/theme/styles/base.css`：基础排版、2px 品牌色焦点环与减少动态效果支持。
- `docs/.vitepress/theme/styles/components.css`：公共卡片/按钮/后台提示/浮钮，以及保留内联内容所需的可读性覆盖。
- `docs/.vitepress/theme/styles/doc.css`：正文、标题、表格、代码、目录及缩放样式，修复手机代码块外扩。
- `docs/.vitepress/theme/styles/home.css`：首页间距、栅格、列表与响应式排版。
- `docs/.vitepress/theme/styles/layout.css`：阅读/文章列表布局、保留必要遮罩规则和页脚分隔符。
- `docs/.vitepress/theme/styles/tokens.css`：暖色明暗主题、字体阶梯、尺寸与 AA 辅助文字色。
- `docs/.vitepress/theme/utils/deploy-env.js`：精确域名识别、仅本地覆盖、后端能力探测、主站 URL 与 3 秒 JSON 请求。
- `docs/about/index.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/insights/wisdom/index.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/insights/wisdom/steve-jobs.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/clean-code.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/cognitive-awakening.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/design-patterns.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/dive-into-deep-learning.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/elasticsearch-guide.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/hackers-and-painters.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/large-language-models.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/microservices-patterns.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/naval-almanack.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/phoenix-architecture.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/poor-charlies-almanack.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/pragmatic-programmer.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/principles.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/refactoring.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/soft-skills.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/books/understanding-jvm.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/recommendations/index.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/tools/avatar-generator/AvatarGenerator.vue`：仅统一工具界面样式与装饰图标，保留工具生成逻辑。
- `docs/tools/avatar-generator/index.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/tools/code-rain/CodeRain.vue`：仅统一工具界面样式与装饰图标，保留工具生成逻辑。
- `docs/tools/code-rain/index.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/tools/consumer-copilot/index.md`：统一后台判断与主站提示，保留页面正文和链接。
- `docs/tools/dev-fortune/DevFortune.vue`：仅统一工具界面样式与装饰图标，保留工具生成逻辑。
- `docs/tools/dev-fortune/index.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/tools/index.md`：仅统一自带样式和装饰图标，保留正文与外链。
- `docs/tools/pandacoder-test.md`：为遗留测试页补后台守卫并去掉惰性 template 包裹，正文不变。
- `docs/tools/pandacoder-weekly/index.md`：静态平台不挂载 iframe；修复 template hydration，并保留代理路径及遮罩隐藏。
- `docs/tools/requirement-boundary/RequirementBoundary.vue`：仅统一工具界面样式与装饰图标，保留工具生成逻辑。
- `scripts/deploy-env.test.mjs`：Node 内置测试覆盖域名边界、本地覆盖、探测缓存、超时与 HTML 降级。
- `scripts/ui-refresh-check.mjs`：可复用的 20/84 张截图与请求、资源、hydration、溢出验收。
- `scripts/ui-refresh-interactions.mjs`：八组筛选分页、点赞、焦点、弹窗、异常降级及手机交互验收。

## 截图与复验

截图在 `.ui-refresh-shots/before/` 和 `.ui-refresh-shots/after/{netlify,cloudflare,github}/`，均已被 .gitignore 排除；结构化记录为 before/results.json、after/results.json、interactions.json。
截图页面：首页、文章、关于、工具、258 行的 Elasticsearch 安装长文（原版桌面全页高 8526px）；after 另加消费助手与周报。视口为 1440×900 / 390×844，均包含 light/dark。
Netlify 的统计/check-env、评论和周报 iframe 在浏览器中使用测试桩；外部统计/广告请求在视觉验收中屏蔽，生产 head 脚本未改。未验证真实后台服务或执行线上部署。
复验时先构建，再启动 docs:preview（每次重建后需重启，避免旧资源列表缓存）；`PLAYWRIGHT_MODULE` 指向项目外 Playwright，`CHROME_PATH` 可指定本机 Chrome，然后运行 scripts/ui-refresh-check.mjs after 与 scripts/ui-refresh-interactions.mjs。依赖文件无需修改。

## 风险与后续决定

- 原有五个导航目标没有对应页面：`/tutorials/java/`、`/tutorials/spring/`、`/tutorials/microservice/`、`/tutorials/design-pattern/`、`/interview/`。本次按要求保留地址，未擅自补内容或改路由。
- 原有超过 500 kB 的构建分包提醒仍在；无新增 SSR 警告。
- posts.data.js 原数据包含政策页，因此首页最新文章也可能显示政策内容；按保持数据源的要求未改筛选。
- 探索卡片 link 均为 null；后续需决定量化/Web3/健身/薄肌理论的落点，以及是否新建栏目。
- 头像生成器等工具的成品图案/画布效果属于工具输出，保留其生成逻辑；统一的是界面装饰。

价值：解决跨三个托管平台的后台能力误判及分散样式覆盖，消除静态镜像无效后台请求；在保留既有内容与部署链路的前提下，完成可复验的个人品牌升级。
