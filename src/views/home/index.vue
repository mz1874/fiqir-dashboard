<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" theme="light" :trigger="null" collapsible>
      <div
          :style="collapsed
    ? 'display: flex; justify-content: center; align-items: center; padding: 16px;'
    : 'display: flex; align-items: center; padding: 16px;'"
      >
        <img
            v-if="!collapsed"
            src="@/assets/fiqirs_logo.jpeg"
            alt="Logo"
            class="logo-img logo"
            style="height: 40px; margin-right: 12px;"
        />
        <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
            style="font-size: 20px; cursor: pointer;"
        />
        <menu-fold-outlined
            v-else
            class="trigger"
            @click="() => (collapsed = !collapsed)"
            style="font-size: 20px; cursor: pointer; margin-left: auto;"
        />
      </div>



      <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline">
        <a-sub-menu key="sub1">
          <template #title>
        <span>
          <user-outlined />
          <span>User</span>
        </span>
          </template>
          <a-menu-item key="3">Tom</a-menu-item>
          <a-menu-item key="4">Bill</a-menu-item>
          <a-menu-item key="5">Alex</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <!--  顶部导航    -->
      <a-layout-header
          style="background: #fff; padding: 0; display: flex; align-items: center; justify-content: space-between">
        <!-- 左侧：收缩按钮 -->
        <div style="display: flex; align-items: center; margin-right: 20px">
          <a-avatar style="background-color: #87d068; margin-right: 8px">U</a-avatar>
          <span style="margin-right: 12px">Admin</span>
          <a-button type="primary" danger shape="circle" @click="onLogout">
            <template #icon>
              <LogoutOutlined/>
            </template>
          </a-button>
        </div>


      </a-layout-header>

      <!--   主要内容   -->
      <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        Content
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {LogoutOutlined} from '@ant-design/icons-vue';
import {ref} from 'vue';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';

const selectedKeys = ref<string[]>(['1']);
const collapsed = ref<boolean>(false);

function onLogout() {

}
</script>
<style>


.logo-img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

#components-layout-demo-custom-trigger .trigger {
  margin-left: 100px;
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin-left: 20px;
}



</style>
