<script setup lang="ts">
import {PlusOutlined} from '@ant-design/icons-vue';
</script>
<template>
  <a-row>
    <a-col :span="2">
      <h1>Your Alerts</h1>
    </a-col>
    <a-col :span="2" :push="20">
      <a-button type="primary" style="background-color: #3a7d5d">
        <PlusOutlined/>
        Primary Button
      </a-button>
    </a-col>
  </a-row>
  <a-row style="margin-top:10px">
    0 / 1 alerts used
  </a-row>
  <div style="width: 170px; margin-top: 10px">
    <a-progress :showInfo="false" size="small" :percent="30"/>
  </div>

  <a-card style="background-color: #ffffff;">
    <div style="padding: 8px 0;">
      <h3 style="margin: 0;">No Alerts found</h3>
      <p style="margin: 4px 0 0; color: rgba(0, 0, 0, 0.65);">
        You don't have any Alerts yet. Get started by creating your first one.
      </p>
    </div>
  </a-card>
</template>


<style scoped>

</style>