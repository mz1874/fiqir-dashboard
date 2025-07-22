<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useChat} from "@/hooks/useChats";
import axios from 'axios';

const {
  input,
  loading,
  messages,
  ollamaUrl,
  models,
  selectedModel,
  fetchModels,
  handleSend,
  removeFile,
  uploadedFiles,
  handlePaste,
  handleDrop,
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
    <br>
    <!-- 上传的图片文件标签 -->
    <div v-if="uploadedFiles.length" style="margin-bottom: 10px;">
      <a-tag
          v-for="(filename, index) in uploadedFiles"
          :key="filename"
          closable
          @close="removeFile(filename)"
          style="margin-bottom: 6px; margin-right: 6px;"
      >
        {{ filename }}
      </a-tag>
    </div>


    <!-- 输入框 + 按钮 -->
    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <!-- 拖拽区域包裹输入框 -->
      <div
          @dragover.prevent
          @drop.prevent="handleDrop"
          style="
      border: 1px dashed #ccc;
      padding: 8px;
      border-radius: 4px;
      flex: 1;
      display: flex;
      align-items: center;
    "
      >
        <a-input
            v-model:value="input"
            placeholder="输入消息或拖拽文件..."
            @keyup.enter="handleSend"
            @paste="handlePaste"
            :disabled="loading"
            style="flex: 1"
        />
      </div>

      <!-- 发送按钮 -->
      <a-button type="primary" @click="handleSend" :loading="loading">
        发送
      </a-button>
    </div>

  </div>
</template>


<style scoped>
</style>
