import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Components from './components'

// 注册Element UI
Vue.use(ElementUI)

// 使用自定义组件库
Vue.use(Components)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
