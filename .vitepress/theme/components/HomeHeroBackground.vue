<template>
  <div class="hero-background">
    <div class="stars"></div>
    <div class="twinkling"></div>
    <div class="nebula"></div>
  </div>
</template>

<style scoped>
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
}

.stars, .twinkling, .nebula {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.stars {
  background: #000 url('https://raw.githubusercontent.com/shuyixiao/shuyixiao-studio/main/docs/public/stars.png') repeat top center;
  z-index: 0;
}

/* Fallback if image missing: CSS stars */
.stars {
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.5;
}

.nebula {
  background: radial-gradient(circle at 50% 50%, rgba(100, 126, 255, 0.15), transparent 60%),
              radial-gradient(circle at 80% 20%, rgba(66, 211, 146, 0.1), transparent 40%);
  filter: blur(30px);
  animation: pulse 8s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(1.1); }
}
</style>
