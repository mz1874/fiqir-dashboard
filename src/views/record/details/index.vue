<template>
  <div style="padding: 20px; background: #ffffff;">
    <!-- Back Button -->
    <a-button type="link" @click="goBack" style="margin-bottom: 20px;">
      <arrow-left-outlined /> Back to all IESO Records
    </a-button>

    <!-- Title -->
    <h2 style="margin-bottom: 20px;">IESO Maximum Renewables To Load Ratio Record</h2>

    <!-- Records Section -->
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="Current Record" :bordered="false">
          <p>0.711 on 2024年4月27日 GMT-5 22:55</p>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="Previous Record" :bordered="false">
          <p>0.693 on 2024年4月26日 GMT-5 22:55</p>
        </a-card>
      </a-col>
    </a-row>
  </div>

  <div class="main-graph">
    <a-row>
      <a-col :span="24">
        <h1>Maximum Renewables To Load Ratio Record - IESO</h1>
      </a-col>
    </a-row>
    <a-divider style="height: 1px; background-color: #d7d2d2" />
    <a-row>
      <div ref="mainChart" style="width: 100%; height: 400px;"></div>
    </a-row>
  </div>
  <h1 style="margin: 20px">Top 10 Days</h1>

  <div class="content-below">
    <a-table :columns="columns" :pagination="false" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a>{{ record.name }}</a>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-button type="text" size="small" @click="handleAction(record)" class="custom-action-btn">View Day <ArrowRightOutlined/></a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])

const mainChart = ref<HTMLDivElement | null>(null)
const router = useRouter()

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Maximum Renewables To Load Ratio Value',
    dataIndex: 'maximumrenewables',
    key: 'maximumrenewables',
    ellipsis: true,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    ellipsis: true,
  },
]

const data = [
  {
    rank: '1',
    key: '1',
    time: '2024年4月27日 GMT-5 22:55',
    maximumrenewables: 0.77,
    action: '',
  },
  {
    rank: '2',
    key: '2',
    time: '2024年4月27日 GMT-5 22:55',
    maximumrenewables: 0.76,
    action: '',
  },
  {
    rank: '3',
    key: '3',
    time: '2024年4月27日 GMT-5 22:55',
    maximumrenewables: 0.76,
    action: '',
  },
  {
    rank: '4',
    key: '4',
    time: '2024年4月27日 GMT-5 22:55',
    maximumrenewables: 0.76,
    action: '',
  },
  {
    rank: '5',
    key: '5',
    time: '2024年4月27日 GMT-5 22:55',
    maximumrenewables: 0.76,
    action: '',
  },
]

const goBack = () => {
  router.back()
}

const handleAction = (record: any) => {
  console.log('Action clicked for:', record)
}

onMounted(() => {
  if (mainChart.value) {
    const myChart = echarts.init(mainChart.value)

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        splitLine: {
          show: true,
          lineStyle: {
            color: '#ddd',
            type: 'solid'
          }
        }
      },
      yAxis: {
        type: 'value'
      },
      label: {
        show: true,
        position: 'top'
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true,
          lineStyle: {
            type: 'dashed'
          },
        }
      ]
    }

    myChart.setOption(option)
  }
})
</script>

<style scoped>
h2 {
  color: #333;
}

:deep(.ant-card) {
  background: #fff;
  border-radius: 8px;
}

:deep(.ant-card-head-title) {
  font-weight: bold;
}

.content-below {
  background: #fff;
  margin-top: 10px;
}

.main-graph {
  padding: 20px;
  background-color: #ffffff;
  margin-top: 10px;
}

/* Custom styling for the action button */
:deep(.custom-action-btn) {
  border: none !important; /* Remove border */
  box-shadow: none !important; /* Remove shadow */
  background: transparent !important; /* Remove background */
  color: #087f5b !important; /* Green text */
}

:deep(.custom-action-btn:hover) {
  background-color: rgba(8, 127, 91, 0.19) !important; /* Light green background on hover */
  color: #087f5b !important; /* Green text */
}
</style>