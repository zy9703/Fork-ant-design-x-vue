/**
 * @typedef {Object} TypingOption
 * @property {number} [step=1] - 一次显示的字符数
 * @property {number} [interval=50] - 打字间隔
 * @property {Object} [suffix=null] - 打字时显示的后缀
 */

/**
 * @typedef {'avatar'|'content'|'header'|'footer'} SemanticType
 */

/**
 * @typedef {Object} BubbleProps
 * @property {string} [prefixCls] - 前缀类名
 * @property {string} [rootClassName] - 根元素类名
 * @property {Object.<SemanticType, Object>} [styles] - 样式对象
 * @property {Object.<SemanticType, string>} [classNames] - 类名对象
 * @property {Object|VNode} [avatar] - 头像
 * @property {'start'|'end'} [placement='start'] - 位置
 * @property {boolean} [loading=false] - 加载状态
 * @property {TypingOption|boolean} [typing] - 打字效果配置
 * @property {string|Object} [content] - 内容
 * @property {Function} [messageRender] - 自定义消息渲染函数
 * @property {Function} [loadingRender] - 自定义加载渲染函数
 * @property {'filled'|'borderless'|'outlined'|'shadow'} [variant='filled'] - 样式变体
 * @property {'round'|'corner'} [shape] - 形状
 * @property {Function} [onTypingComplete] - 打字完成回调
 * @property {string|Object} [header] - 头部内容
 * @property {string|Object} [footer] - 底部内容
 */

/**
 * @typedef {Object} BubbleDataType
 * @property {string|number} [key] - 唯一键
 * @property {string} [role] - 角色
 */

/**
 * @typedef {Object} BubbleListProps
 * @property {string} [prefixCls] - 前缀类名
 * @property {string} [rootClassName] - 根元素类名
 * @property {Array<BubbleDataType>} [items] - 气泡数据
 * @property {boolean} [autoScroll=true] - 自动滚动
 * @property {Object|Function} [roles] - 角色配置
 */

export default {}; 