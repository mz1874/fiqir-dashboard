<script setup lang="ts">

import {LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons-vue";
</script>

<template>
  <!--  顶部导航    -->
  <a-layout-header
      style="background: #fff; padding: 0; display: flex; align-items: center; justify-content: space-between">
    <!-- 左侧：收缩按钮 -->
    <div style="display: flex; align-items: end; margin-right: 20px">
      <a-avatar style="background-color: #87d068; margin-right: 8px">U</a-avatar>
      <span style="margin-right: 12px">Admin</span>
      <a-button type="primary" danger shape="circle" @click="onLogout">
        <template #icon>
          <LogoutOutlined />
        </template>
      </a-button>
    </div>
  </a-layout-header>
</template>

<style scoped>

</style>