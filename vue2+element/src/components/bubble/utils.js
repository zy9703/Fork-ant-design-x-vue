/**
 * 检查是否是对象
 * @param {*} obj 
 * @returns {boolean}
 */
export function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

/**
 * 处理打字效果配置
 * @param {boolean|Object} typing 
 * @returns {Array} [启用状态, 步长, 间隔, 后缀]
 */
export function useTypingConfig(typing) {
  if (!typing) {
    return [false, 1, 50, null];
  }

  const typingEnabled = true;
  
  if (typing === true) {
    return [typingEnabled, 1, 50, null];
  }

  const { step = 1, interval = 50, suffix = null } = typing;
  
  return [typingEnabled, step, interval, suffix];
}

/**
 * 创建打字效果
 * @param {string} content 
 * @param {boolean} enabled 
 * @param {number} step 
 * @param {number} interval 
 * @returns {Object} {content, isTyping}
 */
export function useTypedEffect(content, enabled, step, interval) {
  if (!enabled || !content) {
    return { typedContent: content, isTyping: false };
  }

  // 打字效果状态
  let isTyping = true;
  let typedContent = '';
  let currentLength = 0;
  const totalLength = String(content).length;
  
  // 清除之前的定时器
  if (window._typingTimer) {
    clearInterval(window._typingTimer);
  }

  // 开始打字效果
  window._typingTimer = setInterval(() => {
    currentLength = Math.min(currentLength + step, totalLength);
    typedContent = String(content).substring(0, currentLength);
    
    if (currentLength >= totalLength) {
      clearInterval(window._typingTimer);
      isTyping = false;
    }
  }, interval);

  return { 
    typedContent, 
    isTyping,
    resetTyping() {
      if (window._typingTimer) {
        clearInterval(window._typingTimer);
      }
    }
  };
}

/**
 * 生成唯一ID
 * @returns {string}
 */
export function generateUniqueId() {
  return `bubble_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}