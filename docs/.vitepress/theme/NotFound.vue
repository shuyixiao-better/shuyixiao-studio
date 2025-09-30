<template>
  <div class="not-found">
    <main class="main starry">
      <div class="center">
        <div class="aura" aria-hidden="true"></div>

        <!-- 插画：小宇航员/机器人 + 放大镜 -->
        <div class="hero">
          <svg class="astronaut" viewBox="0 0 220 180" width="220" height="180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#8ec5ff"/>
                <stop offset="100%" stop-color="#60a5fa"/>
              </linearGradient>
              <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffd978"/>
                <stop offset="100%" stop-color="#ffb54d"/>
              </linearGradient>
              <filter id="glow404" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <!-- 身体 -->
            <rect x="86" y="76" rx="14" ry="14" width="64" height="62" fill="url(#g1)"/>
            <!-- 头盔 -->
            <circle cx="118" cy="58" r="28" fill="#0b1a2a" stroke="#9cc8ff" stroke-width="6"/>
            <!-- 微笑表情 -->
            <circle cx="110" cy="56" r="3" fill="#cfe5ff"/>
            <circle cx="126" cy="56" r="3" fill="#cfe5ff"/>
            <path d="M110 66c4 6 12 6 16 0" stroke="#cfe5ff" stroke-width="3" stroke-linecap="round"/>
            <!-- 胳膊与放大镜 -->
            <path d="M88 88 C70 92, 66 112, 76 122" stroke="#8ec5ff" stroke-width="8" stroke-linecap="round" fill="none"/>
            <g class="glass" transform="translate(60,116)">
              <circle cx="20" cy="20" r="16" fill="url(#g2)" opacity="0.15"/>
              <circle cx="20" cy="20" r="14" stroke="#ffd978" stroke-width="3" fill="rgba(255,217,120,0.15)"/>
              <rect x="33" y="30" width="28" height="8" rx="4" fill="#ffd978"/>
            </g>
            <!-- 背包 -->
            <rect x="148" y="88" width="16" height="34" rx="6" fill="#7db3ff"/>
            <!-- 小星星 -->
            <g fill="#ffd978" opacity=".8">
              <circle cx="28" cy="32" r="2"/>
              <circle cx="194" cy="22" r="2"/>
              <circle cx="186" cy="150" r="1.8"/>
              <circle cx="18" cy="128" r="1.6"/>
            </g>
          </svg>

        <!-- 发光破碎 404 已移除，保留角色与文案，营造极简画面 -->
        </div>

        <!-- 俏皮文案 -->
        <div class="message">
          <p class="line1">嘿，你发现了一个隐藏关卡！</p>
          <p class="line2">不过入口还在搭建，让一笑先带你回基地吧~</p>
        </div>

        <!-- 糖果/手柄样式按钮，含 hover 态说明 -->
        <a class="cta candy" href="/" aria-label="传送回首页" title="传送回首页">
          传送回首页
        </a>
        <div class="hint">悬停试试，会有微光与轻微放大~</div>
      </div>
    </main>
    <!-- 底部版权已移除，留出更多留白营造极简感 -->
  </div>
</template>

<style scoped>
/* 基础与配色 */
.not-found {
  min-height: 100vh;
  background: radial-gradient(1200px 600px at 50% 20%, rgba(96, 165, 250, 0.08), transparent 60%),
              linear-gradient(180deg, #111827 0%, #1e293b 60%, #0b1220 100%);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  color: #e8eef6;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans CJK SC', sans-serif;
}

.main {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 6rem 1.5rem 3rem;
}

.center {
  position: relative;
  text-align: center;
  max-width: 720px;
}

/* 背后柔和光晕 */
.aura {
  position: absolute;
  inset: -120px -60px -40px -60px;
  background: radial-gradient(ellipse at center, rgba(96,165,250,0.22) 0%, rgba(96,165,250,0.08) 35%, rgba(96,165,250,0.03) 60%, transparent 80%);
  filter: blur(12px);
  pointer-events: none;
}

/* 404 数字 */
/* 保留占位风格，但移除 404 文本使用的样式 */
.starry::before,
.starry::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.starry::before {
  background: radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,.5), transparent 60%),
              radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,.35), transparent 60%),
              radial-gradient(1px 1px at 40% 20%, rgba(255,255,255,.45), transparent 60%),
              radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,.5), transparent 60%),
              radial-gradient(1px 1px at 85% 18%, rgba(255,255,255,.35), transparent 60%),
              radial-gradient(1px 1px at 60% 12%, rgba(255,255,255,.3), transparent 60%);
  opacity: .8;
}
.starry::after {
  background: radial-gradient(2px 2px at 15% 65%, rgba(255, 216, 128, .45), transparent 65%),
              radial-gradient(2px 2px at 80% 55%, rgba(168, 205, 255, .5), transparent 65%),
              radial-gradient(2px 2px at 55% 75%, rgba(255, 173, 130, .45), transparent 65%);
  opacity: .5;
}

/* 角色布局 */
.hero { display: grid; place-items: center; gap: 6px; margin-bottom: 12px; }
.astronaut { filter: drop-shadow(0 8px 18px rgba(0,0,0,.35)); }
/* 移除 .broken404 相关样式，避免多余空间 */

/* 温暖文案 */
.message { margin: 0 0 36px; }
.line1 {
  margin: 0 0 10px 0;
  font-size: clamp(18px, 2.4vw, 22px);
  font-weight: 400;
  color: #e8eef6;
  opacity: 0.95;
}
.line2 {
  margin: 0;
  font-size: clamp(16px, 2.1vw, 18px);
  font-weight: 300;
  color: #c9d7ee;
}

/* 行动按钮 */
.cta {
  display: inline-block;
  padding: 14px 28px;
  border-radius: 12px;
  text-decoration: none;
  color: #0b1a2a;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, #60a5fa, #78b8ff);
  box-shadow: 0 8px 22px rgba(96,165,250,0.35), inset 0 1px 0 rgba(255,255,255,0.35);
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
}
.cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(96,165,250,0.45), inset 0 1px 0 rgba(255,255,255,0.45);
  filter: brightness(1.03);
}
.cta:active { transform: translateY(0); }

/* 糖果/手柄按钮的额外质感与悬停态展示 */
.candy {
  border: 1px solid rgba(255,255,255,.25);
  background: radial-gradient(120px 60px at 30% 20%, rgba(255,255,255,.35), transparent 60%),
              linear-gradient(135deg, #5aa5ff 0%, #7fb5ff 50%, #88c0ff 100%);
}
.candy:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 18px 34px rgba(123, 180, 255, 0.5), 0 0 0 6px rgba(96,165,250,0.12) inset;
}
.hint { margin-top: 8px; font-size: 12px; color: rgba(232,238,246,.6); }

/* 角落科技线条装饰（按需开启）。为避免视觉干扰，默认关闭。*/
/*
.main::before,
.main::after {
  content: '';
  position: absolute;
  width: 160px;
  height: 160px;
  border: 1px solid rgba(200, 220, 255, 0.08);
  border-radius: 12px;
  pointer-events: none;
}
.main::before { top: 24px; left: 24px; }
.main::after { bottom: 24px; right: 24px; }
*/

/* 底部版权 */
/* 已去掉底部版权区块，留白由父容器控制 */

@media (max-width: 640px) {
  .main { padding: 5rem 1rem 2rem; }
  .main::before, .main::after { display: none; }
}
</style>
