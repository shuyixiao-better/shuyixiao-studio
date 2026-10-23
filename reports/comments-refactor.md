# 评论功能重构验收报告

日期：2026-10-23；本地分支：`comments-refactor`。只做本地提交，不推送、不合并、不部署。

## 改动与删除

| 文件 | 改动 |
| --- | --- |
| `netlify/functions/comments.mjs` | 单一函数、可注入依赖的工厂、独立记录存储、旧数据合并、登录令牌、作者回复、级联删除、防刷与安全邮件通知。 |
| `netlify/functions/comments-v2.mjs` | 删除，消除线上/本地实现分歧。 |
| `netlify/functions/comments-test.mjs` | 删除公开测试入口。 |
| `docs/.vitepress/theme/utils/comments-core.js` | 前后端共用路径、纯文本校验、保留昵称、显示范围和链接分词。Netlify 打包已通过，无需维护两份。 |
| `docs/.vitepress/theme/components/Comments.vue` | 保留注册名，改为薄封装；移除图片、`v-html`、全局键盘监听、Shift 长按和旧管理逻辑。 |
| `docs/.vitepress/theme/components/comments/CommentSection.vue` | 视口前 200px 懒加载、骨架、空状态、错误重试和组件组合。 |
| `docs/.vitepress/theme/components/comments/CommentForm.vue` | 昵称记忆、带标签的纯文本表单、3–12 行自适应、计数、蜜罐、快捷提交与行内反馈。 |
| `docs/.vitepress/theme/components/comments/CommentItem.vue` | 安全文本/链接、头像、相对时间、作者标识、内联回复和原地删除确认。 |
| `docs/.vitepress/theme/components/comments/AdminBar.vue` | 仅 `?admin=1` 显示登录/退出。 |
| `docs/.vitepress/theme/components/comments/composables/useComments.js` | 请求、状态、会话令牌、过期/401 清理、取消请求与提交后列表更新。 |
| `docs/.vitepress/theme/components/comments/comments.css` | 暖色编辑风、移动端、暗色、减弱动画偏好；复用现有颜色。 |
| `docs/.vitepress/theme/index.js` | 先判断显示范围，再选择评论或静态平台主站引导。 |
| `docs/.vitepress/theme/styles/tokens.css` | 新增 light/dark 低饱和删除警示色 `--ui-danger`。 |
| `.gitignore` | 忽略 `.comments-shots/` 截图与本地验收结果。 |
| `scripts/comments.test.mjs` | Node 原生单元/函数集成测试。 |
| `scripts/comments.browser-test.mjs` | 使用已有 Playwright 安装复现截图与交互测试，不新增项目依赖。 |
| `reports/comments-refactor.md` | 本报告：接口、变量、兼容边界、验收与待决定页面。 |

`CommentsPlaceholder.vue`、`RequiresBackendNotice.vue` 和部署环境判断继续复用现有实现。依赖文件、部署配置、工作流、非评论函数和隐私政策正文均不改动。

## 新接口

所有请求同源；所有 JSON 响应均 `Cache-Control: no-store`，没有通配 CORS。只读列表无须登录。

| 路由/方法 | 请求 | 成功响应 |
| --- | --- | --- |
| `GET /api/comments?path=...` | 白名单文章路径 | `200 { comments, total, truncated }`；顶层倒序，`replies` 正序。`total` 包含顶层和回复。 |
| `POST /api/comments` | `{ path, author, content, hp, elapsedMs }` | `201 { success: true, comment }`；蜜罐/过快请求为 `200 { success: true }`，不落库、不计数、不发邮件。 |
| `POST /api/comments/admin-login` | `{ password }` | `200 { token, expiresAt }`，有效 12 小时；`expiresAt` 为 Unix 毫秒。 |
| `POST /api/comments` + Bearer | `{ path, parentId, content }` | `201 { success: true, comment }`；固定作者名，只能回复同页顶层评论，包括旧评论。 |
| `DELETE /api/comments` + Bearer | `{ path, id }` | `200 { success: true }`；删除顶层时级联删除全部回复，管理模式也可单独删除回复。 |
| `OPTIONS /api/comments` | 无 | `204`。 |

错误只返回 `{ error: '中文提示' }`：`400` 输入/路径/父评论不合法（含超 16 KiB 请求体）；`401` 密码错误或令牌无效/过期；`404` 删除目标不存在；`405` 方法不支持；`429` 评论/登录过频；`503` 必要密钥或管理密码缺失；`500` 存储/服务错误。不会返回堆栈或供应商错误详情。

访客昵称 1–20 字符、正文 2–500 字符、最多 2 个 HTTP(S) 链接；控制字符清理、换行压缩与保留昵称检查前后端共用。IP 只用于 HMAC 标识，访客按分钟/日窗口限 2/20 条；登录每 15 分钟最多失败 5 次。新评论每条独立写入，30 个同毫秒并发提交测试无覆盖、无 ID 重复。

## Netlify 环境变量

只需在后台确认，本次未读取或修改生产配置。

| 变量 | 要求 |
| --- | --- |
| `ADMIN_PASSWORD` | 管理登录必需；未配置则登录 503、管理写操作不放行。 |
| `COMMENT_SECRET` | 建议配置的独立高强度密钥，用于签名和 IP 哈希；未配置时从 `ADMIN_PASSWORD` 派生。两者都缺失时访客提交 503，避免用可预测密钥哈希 IP。 |
| `SMTP_HOST` | 邮件服务器地址。 |
| `SMTP_PORT` | 默认 465；465 使用 TLS，其他端口按 nodemailer 的 STARTTLS 能力连接。 |
| `SMTP_USER` / `SMTP_PASS` | SMTP 登录账号和凭据。 |
| `ADMIN_EMAIL` | 接收评论通知的站长邮箱。 |

邮件配置不完整时只记录一行提示并跳过。邮件正文中的昵称、路径、时间、内容和链接均转义；通过 `white-space: pre-wrap` 保留换行。支持 `context.waitUntil` 时后台发送，否则最多等待 5 秒；失败不会撤销已保存评论。不再调用 `transporter.verify()`。

更换 `COMMENT_SECRET`（或未设置它时更换 `ADMIN_PASSWORD`）会使已有令牌失效，并使 IP 哈希/限流标识重置。退出只清除当前浏览器 sessionStorage；已签发令牌最长仍有效 12 小时。

## 旧数据兼容与边界

- 新数据在 `comments` store 的 `v2/{encodeURIComponent(normalizedPath)}/{timestamp13}-{uuid8}` 下逐条存储；读取使用 strong consistency。
- GET 同时读取去掉前导斜杠的旧规范化 key、`.html` 变体，以及目录路径的 `index` / `index.html` 变体，按旧 ID 去重合并为 `legacy:{id}`。旧 `timestamp` 转为 `createdAt`，旧记录固定为访客顶层。
- 旧 `images` 不返回前端，原数据保留，不做迁移、不删旧 key。旧数组仍须在服务端整包读入，历史 base64 的存储成本不会因本次改动消失。
- 站长删除旧评论时只更新包含目标的旧数组，并删除它的新格式回复；旧 key 仍保留。旧数组更新无法获得新独立记录同等的并发保障；限流计数也允许少量竞态。
- 一次最多读取/展示最近 300 条新记录并与旧数据合并后裁到 300 条。`total` 是总记录数，`truncated` 表示超限；最新窗口里的回复若其父评论已不在窗口内，则不单独显示。若只有此类回复，会明确提示较早讨论超出展示范围，不误报“暂无评论”。级联删除仍扫描全部记录。
- 限流采用固定时间窗口，窗口交界存在突发余量。`comments-meta` 的过期窗口记录没有自动清理任务，长期运行时需另行安排维护；本次未新增任务或依赖。
- `comments: true` 可覆盖前端的默认目录规则，但后端仍只允许约定的六个路径前缀；请只在该范围内启用评论。
- 一次级联删除与同时发生的回复写入不是事务，极端并发可能留下不可见的孤立回复；前端不会展示孤立回复。

## 需你决定的目录正文

下列页面主要内容为正文，当前按 `index.md` 规则排除；未擅自添加 `comments: true`：

| 页面 | 标题与依据 |
| --- | --- |
| `docs/tutorials/architecture/security/auth-system/index.md` | 《认证授权体系设计概述》，230 行，包含认证/授权概念与体系设计正文。 |
| `docs/tutorials/certifications/system-architect/index.md` | 《系统架构设计师（高级）- 考试概述与备考规划》，138 行，包含考试说明与备考规划正文。 |

其余受排除的白名单目录首页（以导航/专题介绍为主，建议维持默认）：`articles/index.md`、`projects/index.md`、`insights/wisdom/index.md`、`tutorials/algorithm/index.md`、`tutorials/architecture/index.md`、`tutorials/certifications/index.md`、`tutorials/es/index.md`、`tutorials/explorations/index.md`、`tutorials/insights/index.md`、`tutorials/musings/index.md`、`tutorials/rag/index.md`、`tutorials/treasures/index.md`（以上均相对 `docs/`）。如希望专题介绍页也参与讨论，可逐页明确启用。

## 隐私政策建议（未修改）

`docs/policies/privacy-policy.md:12` 的“匿名访问统计、设备信息与日志信息”之后，建议补充：评论防刷使用 IP 的 HMAC 标识，不在评论存储中保存原始 IP；标识用于频率和登录尝试限制。

`docs/policies/privacy-policy.md:16` 目前只说明“沟通回复与服务改进”，建议明确：评论昵称、正文、时间会直接公开；新评论只支持纯文本；站长会收到含评论内容的邮件通知；昵称保存在浏览器 localStorage；管理会话令牌保存在 sessionStorage。

`docs/policies/privacy-policy.md:18` 的第三方服务说明建议列明 Netlify Blobs 和邮件服务商；旧图片虽停止展示，历史存储尚未删除。保留期、删除流程和适用的第三方政策需由站长确认后再写入。

## 验收证据

- Node 22.16.0 / pnpm 10.17.1；`node --test scripts/comments.test.mjs`：38 项通过，包含路径、昵称/长度/链接、XSS 分词、令牌、并发、旧数据、回复/删除、限流、蜜罐、错误脱敏和显示规则。
- 现有 `scripts/deploy-env.test.mjs`：43 项通过，部署能力判断保持兼容。
- `pnpm exec netlify functions:build --src netlify/functions --functions ./.tmp-fn`：通过，前后端共享模块打包正常；临时目录验收后删除。
- `pnpm docs:build`：通过，无 SSR 警告；构建仍提示部分 Vite 分块超过 500 kB，不属于本次范围。
- `pnpm docs:preview` + Playwright：7 种状态 × 1440/390 宽 × light/dark，共 28 张；另有 Cloudflare 文章引导、隐私政策不显示评论 2 张，共 30 张。截图与机器结果保存在 `.comments-shots/`（已忽略，不提交）。额外检查失败重试、昵称记忆、快捷提交、登录/回复/删除/退出、401 清会话、400 原因提示与 Bearer 请求头。
- 所有截图页面无新增 hydration 警告、无横向滚动；恶意 `<img onerror>` / `<script>` 原样作为文字显示，0 个 alert 弹窗。评论区接近视口前，评论接口请求数为 0。
- `pnpm docs:dev:netlify --offline --no-open` 启动成功，用测试密码、测试密钥和空 SMTP 配置，curl 访问真实函数：空读 200 → 提交 201 → 读到记录 → 登录 200 → 回复 201 → 读到回复 → 级联删除 200 → 总数归零。数据使用 Netlify 本地沙箱，不写生产 Blobs；未验证真实 SMTP 投递。
- 无新依赖；依赖文件、部署配置和工作流 diff 为空。只本地提交，不 push、不合并 `write`。

Playwright 复现：先运行 `pnpm docs:preview --port 4173`；再用已有安装执行 `PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/comments.browser-test.mjs`，可选 `COMMENTS_PREVIEW_ORIGIN`。修改构建后应重启 preview，避免其静态文件索引与新产物不一致。

## 价值

解决评论存储型 XSS、并发覆盖丢评论与访客可见管理入口等问题 → 保障文章讨论数据安全和可持续维护，同时让未进入评论区的访问不再调用评论函数。
