// 导入并导出所有组件
import Bubble from './bubble';

// 所有组件列表
const components = {
  Bubble
};

// 安装函数
const install = function(Vue) {
  // 注册所有组件
  Object.keys(components).forEach(key => {
    Vue.use(components[key]);
  });
};

// 自动安装
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ...components
}; 