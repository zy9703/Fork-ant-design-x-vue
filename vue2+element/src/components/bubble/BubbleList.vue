<template>
  <bubble-context-provider :value="bubbleContext">
    <div
      :class="listClasses"
      ref="listRef"
      @scroll="onInternalScroll"
    >
      <bubble
        v-for="item in displayItems"
        :key="item.key"
        v-bind="getBubbleProps(item)"
        ref="bubbleRefs"
        :typing="initialized ? item.typing : false"
        @typing-complete="handleTypingComplete(item.key)"
      >
        <template v-slot:avatar v-if="$scopedSlots.avatar">
          <slot name="avatar" v-bind="item"></slot>
        </template>
        <template v-slot:header v-if="$scopedSlots.header">
          <slot name="header" v-bind="item"></slot>
        </template>
        <template v-slot:message="slotProps" v-if="$scopedSlots.message">
          <slot name="message" v-bind="{ ...item, ...slotProps }"></slot>
        </template>
        <template v-slot:footer v-if="$scopedSlots.footer">
          <slot name="footer" v-bind="item"></slot>
        </template>
        <template v-slot:loading v-if="$scopedSlots.loading">
          <slot name="loading" v-bind="item"></slot>
        </template>
      </bubble>
    </div>
  </bubble-context-provider>
</template>

<script>
import { BubbleContextProvider } from './BubbleContext';
import Bubble from './Bubble.vue';
import { generateUniqueId } from './utils';

// 检测是否滚动到底部的容差值
const TOLERANCE = 1;

export default {
  name: 'A3BubbleList',
  components: {
    Bubble,
    BubbleContextProvider
  },
  props: {
    prefixCls: {
      type: String,
      default: 'bubble'
    },
    rootClassName: String,
    items: {
      type: Array,
      default: () => []
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    roles: {
      type: [Object, Function],
      default: () => ({})
    }
  },
  data() {
    return {
      initialized: false,
      displayItems: [],
      scrollReachEnd: true,
      updateCount: 0,
      completedKeys: new Set(),
      bubbleRefs: []
    };
  },
  computed: {
    listPrefixCls() {
      return `${this.prefixCls}-list`;
    },
    listClasses() {
      return [
        this.listPrefixCls,
        this.rootClassName,
        {
          [`${this.listPrefixCls}-reach-end`]: this.scrollReachEnd
        }
      ];
    },
    bubbleContext() {
      return {
        onUpdate: this.onBubbleUpdate
      };
    },
    // 处理的数据项
    processedItems() {
      return this.items.map((item, index) => {
        const key = item.key || generateUniqueId();
        const role = item.role || '';
        let roleProps = {};
        
        // 处理角色配置
        if (this.roles) {
          if (typeof this.roles === 'function') {
            roleProps = this.roles({ ...item, key }, index) || {};
          } else if (this.roles[role]) {
            roleProps = this.roles[role] || {};
          }
        }
        
        return {
          ...roleProps,
          ...item,
          key
        };
      });
    }
  },
  watch: {
    // 当项目更新时，重新处理显示项目
    items: {
      immediate: true,
      handler() {
        this.updateDisplayItems();
      }
    },
    // 当打字完成的状态更新时，更新显示项目
    completedKeys: {
      deep: true,
      handler() {
        this.updateDisplayItems();
      }
    },
    // 当更新计数器更新时，尝试滚动到底部
    updateCount() {
      this.$nextTick(() => {
        if (this.autoScroll && this.$refs.listRef && this.scrollReachEnd) {
          this.$refs.listRef.scrollTo({
            top: this.$refs.listRef.scrollHeight
          });
        }
      });
    },
    // 当显示项目数量变化时，检查是否需要自动滚动
    'displayItems.length'() {
      if (this.autoScroll) {
        // 获取倒数第二个项目
        const lastItemIndex = this.displayItems.length - 2;
        if (lastItemIndex < 0) return;
        
        const lastItemKey = this.displayItems[lastItemIndex].key;
        
        // 检查项目是否在视口内
        this.$nextTick(() => {
          if (!this.$refs.bubbleRefs) return;
          
          const bubbleEl = this.$refs.bubbleRefs.find(ref => {
            return ref.$vnode.key === lastItemKey;
          });
          
          if (bubbleEl && bubbleEl.$el) {
            const bubbleRect = bubbleEl.$el.getBoundingClientRect();
            const listRect = this.$refs.listRef.getBoundingClientRect();
            
            const isVisible = bubbleRect.top < listRect.bottom && bubbleRect.bottom > listRect.top;
            
            if (isVisible) {
              this.updateCount++;
              this.scrollReachEnd = true;
            }
          }
        });
      }
    }
  },
  created() {
    this.updateDisplayItems();
  },
  mounted() {
    this.initialized = true;
  },
  methods: {
    // 更新显示项目
    updateDisplayItems() {
      // 过滤掉正在打字的项目
      this.displayItems = this.processedItems.filter(item => {
        // 如果没有typing，或者已经完成了typing，或者没有初始化，则显示
        return !item.typing || this.completedKeys.has(item.key) || !this.initialized;
      });
    },
    // 处理打字完成
    handleTypingComplete(key) {
      this.completedKeys.add(key);
      this.$emit('typing-complete', key);
    },
    // 获取气泡组件属性
    getBubbleProps(item) {
      const { key, onTypingComplete, ...rest } = item;
      return {
        ...rest,
        onTypingComplete: () => {
          onTypingComplete && onTypingComplete();
          this.handleTypingComplete(key);
        }
      };
    },
    // 内部滚动处理
    onInternalScroll(e) {
      const target = e.target;
      this.scrollReachEnd = 
        target.scrollHeight - Math.abs(target.scrollTop) - target.clientHeight <= TOLERANCE;
    },
    // 气泡更新处理
    onBubbleUpdate() {
      if (this.autoScroll) {
        this.updateCount++;
      }
    },
    // 滚动到指定位置
    scrollTo({ key, offset, behavior = 'smooth', block }) {
      if (typeof offset === 'number') {
        // 滚动到指定位置
        this.$refs.listRef.scrollTo({
          top: offset,
          behavior
        });
      } else if (key !== undefined) {
        // 滚动到指定气泡
        const bubbleEl = this.$refs.bubbleRefs.find(ref => ref.$vnode.key === key);
        
        if (bubbleEl) {
          // 检查是否是最后一个元素
          const index = this.displayItems.findIndex(item => item.key === key);
          this.scrollReachEnd = index === this.displayItems.length - 1;
          
          // 滚动到视图
          bubbleEl.$el.scrollIntoView({
            behavior,
            block
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.bubble-list {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 16px;
}

.bubble-list > .bubble {
  margin-bottom: 16px;
}

.bubble-list > .bubble:last-child {
  margin-bottom: 0;
}
</style> 