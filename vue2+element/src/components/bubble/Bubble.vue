<template>
  <div 
    :class="bubbleClasses"
    :style="bubbleStyles"
    ref="bubbleRef"
  >
    <!-- 头像 -->
    <div 
      v-if="avatar"
      :class="`${prefixCls}-avatar ${classNames.avatar || ''}`"
      :style="styles.avatar || {}"
    >
      <slot name="avatar">
        <el-avatar v-if="typeof avatar === 'object'" v-bind="avatar"></el-avatar>
        <el-avatar v-else>{{ avatar }}</el-avatar>
      </slot>
    </div>

    <!-- 内容容器 -->
    <div :class="`${prefixCls}-content-wrapper`" v-if="hasHeader || hasFooter">
      <!-- 头部 -->
      <div 
        v-if="hasHeader" 
        :class="`${prefixCls}-header ${classNames.header || ''}`"
        :style="styles.header || {}"
      >
        <slot name="header">{{ header }}</slot>
      </div>

      <!-- 主体内容 -->
      <div
        :class="contentClasses"
        :style="styles.content || {}"
      >
        <slot name="loading" v-if="loading">
          <bubble-loading :prefixCls="prefixCls" v-if="!loadingRender"></bubble-loading>
          <component :is="loadingRender()" v-else></component>
        </slot>
        <template v-else>
          <slot name="message" v-bind:content="typedContent">
            {{ typedContent }}
          </slot>
          <template v-if="isTyping && typingSuffix">{{ typingSuffix }}</template>
        </template>
      </div>

      <!-- 底部 -->
      <div 
        v-if="hasFooter"
        :class="`${prefixCls}-footer ${classNames.footer || ''}`"
        :style="styles.footer || {}"
      >
        <slot name="footer">{{ footer }}</slot>
      </div>
    </div>

    <!-- 无头尾时的简单内容 -->
    <div
      v-else
      :class="contentClasses"
      :style="styles.content || {}"
    >
      <slot name="loading" v-if="loading">
        <bubble-loading :prefixCls="prefixCls" v-if="!loadingRender"></bubble-loading>
        <component :is="loadingRender()" v-else></component>
      </slot>
      <template v-else>
        <slot name="message" v-bind:content="typedContent">
          {{ typedContent }}
        </slot>
        <template v-if="isTyping && typingSuffix">{{ typingSuffix }}</template>
      </template>
    </div>
  </div>
</template>

<script>
import { BubbleEventBus } from './BubbleContext';
import BubbleLoading from './Loading.vue';
import { useTypingConfig } from './utils';

export default {
  name: 'A3Bubble',
  components: {
    BubbleLoading
  },
  props: {
    prefixCls: {
      type: String,
      default: 'bubble'
    },
    rootClassName: String,
    styles: {
      type: Object,
      default: () => ({})
    },
    classNames: {
      type: Object,
      default: () => ({})
    },
    avatar: [Object, String],
    placement: {
      type: String,
      default: 'start',
      validator: (val) => ['start', 'end'].includes(val)
    },
    loading: {
      type: Boolean,
      default: false
    },
    typing: [Boolean, Object],
    content: [String, Object],
    messageRender: Function,
    loadingRender: Function,
    variant: {
      type: String,
      default: 'filled',
      validator: (val) => ['filled', 'borderless', 'outlined', 'shadow'].includes(val)
    },
    shape: {
      type: String,
      validator: (val) => ['round', 'corner'].includes(val)
    },
    onTypingComplete: Function,
    header: [String, Object],
    footer: [String, Object],
    direction: {
      type: String,
      default: 'ltr'
    }
  },
  data() {
    return {
      typedContent: this.content || '',
      isTyping: false,
      typingEnabled: false,
      typingStep: 1,
      typingInterval: 50,
      typingSuffix: null,
      typingTimer: null,
      triggerTypingCompleteRef: false,
      bubbleContext: null
    };
  },
  computed: {
    // 气泡类名
    bubbleClasses() {
      return [
        this.prefixCls,
        this.rootClassName,
        `${this.prefixCls}-${this.placement}`,
        {
          [`${this.prefixCls}-rtl`]: this.direction === 'rtl',
          [`${this.prefixCls}-typing`]: this.isTyping && !this.loading && !this.messageRender && !this.typingSuffix
        }
      ];
    },
    // 内容类名
    contentClasses() {
      return [
        `${this.prefixCls}-content`,
        `${this.prefixCls}-content-${this.variant}`,
        this.shape ? `${this.prefixCls}-content-${this.shape}` : '',
        this.classNames.content || ''
      ];
    },
    // 样式对象
    bubbleStyles() {
      return {};
    },
    // 是否有头部
    hasHeader() {
      return this.header || this.$slots.header;
    },
    // 是否有底部
    hasFooter() {
      return this.footer || this.$slots.footer;
    }
  },
  watch: {
    content: {
      immediate: true,
      handler(newContent) {
        this.processContent(newContent);
      }
    },
    isTyping(newVal) {
      if (!newVal && !this.loading) {
        if (!this.triggerTypingCompleteRef) {
          this.triggerTypingCompleteRef = true;
          this.onTypingComplete && this.onTypingComplete();
        }
      } else {
        this.triggerTypingCompleteRef = false;
      }
    }
  },
  created() {
    // 处理打字效果配置
    [this.typingEnabled, this.typingStep, this.typingInterval, this.typingSuffix] = 
      useTypingConfig(this.typing);
    
    // 监听上下文更新
    BubbleEventBus.$on('bubble-context-update', (context) => {
      this.bubbleContext = context;
    });
  },
  mounted() {
    this.processContent(this.content);
  },
  beforeDestroy() {
    BubbleEventBus.$off('bubble-context-update');
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
    }
  },
  methods: {
    // 处理内容和打字效果
    processContent(content) {
      if (!this.typingEnabled || !content) {
        this.typedContent = content;
        this.isTyping = false;
        return;
      }

      this.isTyping = true;
      this.typedContent = '';
      
      if (this.typingTimer) {
        clearInterval(this.typingTimer);
      }
      
      let currentLength = 0;
      const totalLength = String(content).length;
      
      this.typingTimer = setInterval(() => {
        currentLength = Math.min(currentLength + this.typingStep, totalLength);
        this.typedContent = String(content).substring(0, currentLength);
        
        // 触发上下文更新
        if (this.bubbleContext && this.bubbleContext.onUpdate) {
          this.bubbleContext.onUpdate();
        }
        
        if (currentLength >= totalLength) {
          clearInterval(this.typingTimer);
          this.isTyping = false;
        }
      }, this.typingInterval);
    }
  }
};
</script>

<style scoped>
.bubble {
  display: flex;
  column-gap: 12px;
}

.bubble-start {
  justify-content: start;
}

.bubble-end {
  justify-content: end;
  flex-direction: row-reverse;
}

.bubble-end .bubble-content-wrapper {
  align-items: flex-end;
}

.bubble-rtl {
  direction: rtl;
}

.bubble-typing .bubble-content:last-child::after {
  content: "|";
  font-weight: 900;
  user-select: none;
  opacity: 1;
  margin-inline-start: 0.1em;
  animation: cursorBlink 0.8s infinite linear;
}

@keyframes cursorBlink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

/* 头像 */
.bubble-avatar {
  display: inline-flex;
  justify-content: center;
  align-self: flex-start;
}

/* 头部和底部 */
.bubble-header, .bubble-footer {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.bubble-header {
  margin-bottom: 4px;
}

.bubble-footer {
  margin-top: 12px;
}

/* 内容包装器 */
.bubble-content-wrapper {
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  max-width: 100%;
}

/* 内容 */
.bubble-content {
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  min-height: calc(12px * 2 + 1.5 * 14px);
  word-break: break-word;
  padding: 12px 16px;
}

/* 变体样式 */
.bubble-content-filled {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.bubble-content-borderless {
  padding: 0;
  background: transparent;
}

.bubble-content-outlined {
  background-color: transparent;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.bubble-content-shadow {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 形状样式 */
.bubble-content-round {
  border-radius: 16px;
}

.bubble-content-corner {
  border-radius: 4px;
}
</style> 