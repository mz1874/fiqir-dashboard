<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useChat} from "@/hooks/useChats";

const {
  input,
  loading,
  messages,
  ollamaUrl,
  models,
  selectedModel,
  fetchModels,
  sendMessage,
} = useChat();

onMounted(() => {
  fetchModels();
});

</script>

<template>
  <div style="max-width: 800px; margin: auto; padding: 20px;">
    <!-- Ollama 地址配置 -->
    <div style="margin-bottom: 16px;">
      <a-input
          v-model:value="ollamaUrl"
          placeholder="Ollama 地址，例如 http://localhost:11434"
          :disabled="loading"
      />
    </div>

    <!-- 模型选择器 -->
    <div style="margin-bottom: 16px;">
      <a-select
          v-model:value="selectedModel"
          style="width: 200px"
          :disabled="loading"
          placeholder="选择模型"
      >
        <a-select-option
            v-for="model in models"
            :key="model"
            :value="model"
        >
          {{ model }}
        </a-select-option>
      </a-select>
      <a-button type="default" @click="fetchModels" :disabled="loading" style="margin-left: 10px;">
        Refresh model
      </a-button>
    </div>

    <!-- 对话记录 -->
    <a-list :data-source="messages" bordered item-layout="horizontal">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment
              :author="item.role === 'user' ? '你' : 'AI'"
              :content="item.content"
          />
        </a-list-item>
      </template>
    </a-list>

    <!-- 输入框 + 按钮 -->
    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <a-input
          v-model:value="input"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
          :disabled="loading"
      />
      <a-button type="primary" @click="sendMessage" :loading="loading">发送</a-button>
    </div>
  </div>
</template>


<style scoped>
</style>
