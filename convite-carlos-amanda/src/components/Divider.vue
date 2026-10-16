<template>
  <div class="divider" aria-hidden="true">
    <span class="line"></span>
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M12 2 L15 12 L12 22 L9 12 Z" fill="currentColor" />
      <path d="M2 12 L12 9 L22 12 L12 15 Z" fill="currentColor" opacity=".6" />
    </svg>
    <span class="line"></span>
  </div>
</template>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--gold);
  margin: 34px auto;
  max-width: 280px;
}
.line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-light), transparent);
}
</style>
