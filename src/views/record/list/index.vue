<script setup lang="ts">
const timelineData = [
  {
    rank: '#3',
    title: 'Maximum Solar in ISONE',
    value: '890 MW',
    time: '2 days ago',
    link: '#'
  },
  {
    rank: '#2',
    title: 'Maximum Battery Charging in CAISO',
    value: '9,081 MW',
    time: '3 days ago',
    link: '#'
  },
  {
    rank: '#1',
    title: 'Maximum Wind in SPP',
    value: '23,804 MW',
    time: '3 days ago',
    link: '#'
  },
  {
    rank: '#1',
    title: 'Maximum Battery Charging in CAISO',
    value: '9,296 MW',
    time: '4 days ago',
    link: '#'
  }
]
</script>

<template>
  <h1>Last Records</h1>
  <div style="margin-top: 10px">
    <a-space wrap>
      Jump ISO to
      <a-button type="default" class="view-btn">Primary Button</a-button>
      <a-button type="default" class="view-btn">Primary Button</a-button>
      <a-button type="default" class="view-btn">Primary Button</a-button>
      <a-button type="default" class="view-btn">Primary Button</a-button>
      <a-button type="default" class="view-btn">Primary Button</a-button>
    </a-space>
  </div>
  <a-timeline style="margin-top: 30px">
    <a-timeline-item v-for="(item, index) in timelineData" :key="index">
      <div class="record-card">
        <div class="record-main">
          <span class="rank">{{ item.rank }}</span>
          <span class="title">{{ item.title }}</span>
          <span class="value">{{ item.value }}</span>
          <span class="time">{{ item.time }}</span>
        </div>
        <a-button type="default" class="view-btn" @click="window.open(item.link)">
          View Record →
        </a-button>
      </div>
    </a-timeline-item>
  </a-timeline>
</template>

<style scoped>
.record-card {
  background: #f9fbfd;
  border: 1px solid #ffffff;
  border-radius: 6px;
  padding: 8px 12px;
  height: 100px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.record-main {
  display: flex;
  align-items: center;
  gap: 8px; /* 控制文字和按钮的间距 */
}

.rank {
  font-weight: bold;
  color: #555;
}

.title {
  color: #222;
}

.value {
  font-weight: bold;
  color: #008000;
}

.time {
  color: #888;
  font-size: 12px;
}

.view-btn {
  border-color: #2e8540;
  margin-left: 20px;
  color: #2e8540;
  padding: 0 8px;
  height: 40px; /* 按钮稍小一些，像文字一样 */
}


/* 作用于 scoped 样式中，增加节点圆圈大小 */
::v-deep(.ant-timeline-item-head) {
  width: 13px;   /* 默认 12px，可以改大 */
  height: 13px;
}

::v-deep(.ant-timeline-item-head-blue) {
  border-color: #2e8540;
}

</style>
