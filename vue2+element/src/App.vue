<template>
  <div id="app">
    <h1>Ant Design X Vue（Vue2 + Element UI版本）</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="气泡组件 Bubble" name="bubble">
        <bubble-example />
      </el-tab-pane>
      <!-- 后续可以在这里添加更多组件的示例 -->
    </el-tabs>
  </div>
</template>

<script>
import BubbleExample from './views/BubbleExample.vue';

export default {
  name: 'App',
  components: {
    BubbleExample
  },
  data() {
    return {
      activeTab: 'bubble'
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.el-tabs {
  margin-bottom: 40px;
}
</style>
