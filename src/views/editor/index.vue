<template>
  <!-- 编辑器 + 预览区 容器 -->
  <div class="editor-preview-container">
    <!-- 编辑器区域 -->
    <div class="editor-box">
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          style="height: 500px; overflow-y: hidden"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
      />
    </div>

    <!-- 预览区域 -->
    <div class="preview-box">
      <h3 style="margin-bottom: 10px;">Preview：</h3>
      <div class="preview-content" v-html="valueHtml"/>
    </div>
  </div>

  <div style="margin-top: 16px;">
    <a-button type="default" @click="showHtmlContent">查看 HTML 内容（控制台打印）</a-button>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import {onBeforeUnmount, ref, shallowRef, onMounted} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
const showPreview = ref(false)


// 编辑器实例
const editorRef = shallowRef()

// 编辑器内容
const valueHtml = ref('<p>hello</p>')

// 异步设置内容模拟
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>Ajax async set HTML.</p>'
  }, 1500)
})

const showHtmlContent = () => {
  console.log('当前 HTML 内容是：', valueHtml.value)
  alert('请查看浏览器控制台中的 HTML 内容')
}

// 配置
const toolbarConfig = {}
const editorConfig = {
  placeholder: 'Type here...',
  MENU_CONF: {
    uploadImage: {
      server: '/api/upload/image222',
      fieldName: 'file',
      customInsert(res, insertFn) {
        insertFn(res.data.url)
      },
    },
  },
}
const mode = 'default'  // or 'simple'

// 编辑器创建回调
const handleCreated = (editor) => {
  editorRef.value = editor
}

// 组件销毁时释放编辑器资源
onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})


</script>

<style scoped>
.preview-content p {
  margin-bottom: 12px;
  line-height: 1.6;
}

.preview-content img {
  max-width: 100%;
  height: auto;
}

.editor-preview-container {
  display: flex;
  margin-top: 20px;
  gap: 24px;
  align-items: flex-start;
}

/* 编辑器区域 */
.editor-box {
  width: 50%;
  border: 1px solid #ccc;
}

/* 预览区域 */
.preview-box {
  width: 50%;
  border: 1px solid #aaa;
  padding: 16px;
  min-height: 500px;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

/* 内容美化 */
.preview-content p {
  margin-bottom: 12px;
  line-height: 1.6;
}

.preview-content img {
  max-width: 100%;
  height: auto;
}
</style>