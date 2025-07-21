<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { message as antdMessage } from 'ant-design-vue';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const input = ref('');
const loading = ref(false);
const messages = ref<ChatMessage[]>([]);

const ollamaUrl = ref('http://localhost:11434');

const models = ref<string[]>([]);
const selectedModel = ref('');

// 获取模型列表
const fetchModels = async () => {
  try {
    const response = await axios.get(`${ollamaUrl.value}/api/tags`);
    models.value = response.data.models.map((m: any) => m.name);
    if (!selectedModel.value && models.value.length > 0) {
      selectedModel.value = models.value[0]; // 默认选中第一个模型
    }
  } catch (err) {
    antdMessage.error('无法获取模型列表');
    console.error(err);
  }
};

onMounted(() => {
  fetchModels();
});

const sendMessage = async () => {
  const userMessage = input.value.trim();
  if (!userMessage || !selectedModel.value) return;

  messages.value.push({ role: 'user', content: userMessage });
  input.value = '';
  loading.value = true;

  const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
  messages.value.push(assistantMessage);

  try {
    const response = await fetch(`${ollamaUrl.value}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel.value,
        messages: messages.value.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    if (!reader) {
      antdMessage.error('响应流读取失败');
      return;
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          const chunk = json.message?.content;
          if (chunk) {
            assistantMessage.content += chunk;
            messages.value = [...messages.value];
          }
        } catch (e) {
          console.error('JSON parse error:', line, e);
        }
      }
    }

  } catch (err) {
    antdMessage.error('请求失败');
    console.error(err);
  } finally {
    loading.value = false;
  }
};
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
