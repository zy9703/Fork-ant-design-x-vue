<template>
  <div class="bubble-example">
    <h2>基础气泡示例</h2>
    
    <div class="example-section">
      <h3>1. 基础气泡</h3>
      <bubble content="这是一条基础消息"></bubble>
    </div>
    
    <div class="example-section">
      <h3>2. 带头像的气泡</h3>
      <bubble 
        content="这是一条带头像的消息" 
        :avatar="{ src: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' }"
      ></bubble>
    </div>
    
    <div class="example-section">
      <h3>3. 不同位置的气泡</h3>
      <bubble 
        content="左侧气泡" 
        placement="start"
        :avatar="{ src: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' }"
      ></bubble>
      <bubble 
        content="右侧气泡" 
        placement="end"
        :avatar="{ src: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' }"
      ></bubble>
    </div>
    
    <div class="example-section">
      <h3>4. 不同样式变体</h3>
      <bubble content="filled样式（默认）" variant="filled"></bubble>
      <bubble content="borderless样式" variant="borderless"></bubble>
      <bubble content="outlined样式" variant="outlined"></bubble>
      <bubble content="shadow样式" variant="shadow"></bubble>
    </div>
    
    <div class="example-section">
      <h3>5. 不同形状</h3>
      <bubble content="corner形状" shape="corner"></bubble>
      <bubble content="round形状" shape="round"></bubble>
    </div>
    
    <div class="example-section">
      <h3>6. 带头部和底部的气泡</h3>
      <bubble 
        content="这是消息内容" 
        header="这是头部"
        footer="这是底部"
      ></bubble>
    </div>
    
    <div class="example-section">
      <h3>7. 加载状态</h3>
      <bubble loading></bubble>
    </div>
    
    <div class="example-section">
      <h3>8. 打字效果</h3>
      <bubble 
        :key="'typing-demo-' + typingKey"
        content="这是一条带有打字效果的消息，会一个字一个字地显示出来。" 
        :typing="true"
      ></bubble>
      <el-button @click="resetTypingMessage">重置打字效果</el-button>
    </div>
    
    <h2>气泡列表示例</h2>
    
    <div class="example-section">
      <h3>对话列表</h3>
      <div class="chat-container">
        <bubble-list 
          :items="chatMessages" 
          :roles="chatRoles"
          style="height: 400px; border: 1px solid #eee;"
        ></bubble-list>
        
        <div class="chat-input">
          <el-input 
            v-model="newMessage" 
            placeholder="输入消息..." 
            @keyup.enter.native="sendMessage"
          ></el-input>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bubble, BubbleList } from '../components/bubble';
import { generateUniqueId } from '../components/bubble/utils';

export default {
  name: 'BubbleExample',
  components: {
    Bubble,
    BubbleList
  },
  data() {
    return {
      typingKey: 0,
      newMessage: '',
      chatMessages: [
        {
          key: '1',
          role: 'system',
          content: '欢迎使用Bubble组件聊天示例！',
          typing: true
        }
      ],
      // 角色配置
      chatRoles: {
        system: {
          variant: 'shadow',
          shape: 'round',
          avatar: { src: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' }
        },
        user: {
          placement: 'end',
          variant: 'filled',
          shape: 'round',
          avatar: { src: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' }
        }
      }
    };
  },
  methods: {
    // 重置打字效果
    resetTypingMessage() {
      // 增加typingKey值，强制组件重新渲染
      this.typingKey++;
    },
    
    // 发送消息
    sendMessage() {
      if (!this.newMessage.trim()) return;
      
      // 添加用户消息
      this.chatMessages.push({
        key: generateUniqueId(),
        role: 'user',
        content: this.newMessage
      });
      
      const userMessage = this.newMessage;
      this.newMessage = '';
      
      // 模拟系统回复
      setTimeout(() => {
        // 先显示加载状态
        const responseKey = generateUniqueId();
        this.chatMessages.push({
          key: responseKey,
          role: 'system',
          loading: true
        });
        
        // 2秒后显示回复
        setTimeout(() => {
          const index = this.chatMessages.findIndex(msg => msg.key === responseKey);
          if (index !== -1) {
            this.chatMessages.splice(index, 1, {
              key: responseKey,
              role: 'system',
              content: `你发送的消息是: "${userMessage}"`,
              typing: true
            });
          }
        }, 2000);
      }, 500);
    }
  }
};
</script>

<style scoped>
.bubble-example {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.example-section h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-size: 16px;
}

.chat-container {
  display: flex;
  flex-direction: column;
}

.chat-input {
  display: flex;
  margin-top: 16px;
}

.chat-input .el-input {
  margin-right: 8px;
}
</style> 