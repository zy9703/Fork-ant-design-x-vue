import Bubble from './Bubble.vue';
import BubbleList from './BubbleList.vue';

export { Bubble, BubbleList };

export default {
  install(Vue) {
    Vue.component(Bubble.name, Bubble);
    Vue.component(BubbleList.name, BubbleList);
  }
}; 