<script setup>
defineProps({
  position: {
    type: String,
    default: 'bottom' // 'top' or 'bottom'
  },
  color: {
    type: String,
    default: 'var(--vp-c-bg)' // Matches background to create "cutout" effect
  }
})
</script>

<template>
  <div class="wave-divider" :class="position">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
    </svg>
  </div>
</template>

<style scoped>
.wave-divider {
  position: relative;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.wave-divider svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 60px;
}

.wave-divider .shape-fill {
  fill: var(--vp-c-brand-dimm); /* Use brand dimm color for the wave */
  opacity: 0.1;
}

/* Rotate for bottom/top variation if needed */
.wave-divider.top {
  transform: rotate(180deg);
}
</style>
