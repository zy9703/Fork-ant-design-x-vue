import Vue from 'vue';

// 创建一个全局上下文实例
export const BubbleEventBus = new Vue();

// 创建全局上下文对象
export const globalBubbleContext = {
  onUpdate: null
};

// 提供一个混入，在组件内使用上下文
export const BubbleContextMixin = {
  methods: {
    // 更新上下文内容
    updateBubbleContext(context) {
      Object.assign(globalBubbleContext, context);
      BubbleEventBus.$emit('bubble-context-update', globalBubbleContext);
    },
    // 使用上下文功能
    useBubbleContext() {
      return globalBubbleContext;
    }
  }
};

// 创建上下文提供者组件
export const BubbleContextProvider = {
  name: 'A3BubbleContextProvider',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    this.updateBubbleContext(this.value);
  },
  watch: {
    value: {
      handler(newVal) {
        this.updateBubbleContext(newVal);
      },
      deep: true
    }
  },
  methods: {
    updateBubbleContext(context) {
      Object.assign(globalBubbleContext, context);
      BubbleEventBus.$emit('bubble-context-update', globalBubbleContext);
    }
  },
  render() {
    return this.$slots.default ? this.$slots.default[0] : null;
  }
};

export default BubbleContextProvider;