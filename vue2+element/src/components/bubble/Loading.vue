<template>
  <span :class="`${prefixCls}-dot`">
    <i :class="`${prefixCls}-dot-item`" :key="`item-1`" />
    <i :class="`${prefixCls}-dot-item`" :key="`item-2`" />
    <i :class="`${prefixCls}-dot-item`" :key="`item-3`" />
  </span>
</template>

<script>
export default {
  name: 'A3BubbleLoading',
  props: {
    prefixCls: {
      type: String,
      default: 'bubble'
    }
  }
};
</script>

<style scoped>
@keyframes loadingMove {
  0% { transform: translateY(0); }
  10% { transform: translateY(4px); }
  20% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
  40% { transform: translateY(0); }
}

.bubble-dot {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  column-gap: 8px;
  padding: 0 4px;
}

.bubble-dot-item {
  background-color: #1890ff;
  border-radius: 100%;
  width: 4px;
  height: 4px;
  animation-name: loadingMove;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.bubble-dot-item:nth-child(1) {
  animation-delay: 0s;
}

.bubble-dot-item:nth-child(2) {
  animation-delay: 0.2s;
}

.bubble-dot-item:nth-child(3) {
  animation-delay: 0.4s;
}
</style> 