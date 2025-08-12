<script setup lang="ts">
import {ArrowLeftOutlined, CaretLeftOutlined, CaretRightOutlined} from "@ant-design/icons-vue";
import {useRouter} from 'vue-router'
import {onMounted, ref, watch} from "vue";
import * as echarts from 'echarts';


const router = useRouter()
const stackedChartDom = ref<HTMLDivElement | null>(null)

const lineChartDom = ref<HTMLDivElement | null>(null)
const lineChartDom2 = ref<HTMLDivElement | null>(null)
const lineChartDom3 = ref<HTMLDivElement | null>(null)

const dateFormat = 'YYYY/MM/DD'
const datePicker = ref()

watch(datePicker, (newVal, oldVal) => {
  console.log('日期改变了:', oldVal, '→', newVal)
})

const goBack = () => {
  router.back()
}
var stackedChartOption = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Fuel Mix - Associated Electric Cooperative, Inc.',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
    bottom: 20
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false, // 如果是折线图要贴边，必须是 false
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: false,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [140, 232, 101, 264, 90, 340, 250]
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: false,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 282, 111, 234, 220, 340, 310]
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: false,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(55, 162, 255)'
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 132, 201, 334, 190, 130, 220]
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: false,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 0, 135)'
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 402, 231, 134, 190, 230, 120]
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: false,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 191, 0)'
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 302, 181, 234, 210, 290, 150]
    }
  ]
};


var lineChartOption = {
  title: {
    text: 'Load - Associated Electric Cooperative, Inc.',
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
};


onMounted(() => {
  var stackedChart = echarts.init(stackedChartDom.value);
  stackedChartOption && stackedChart.setOption(stackedChartOption);

  var lineChart = echarts.init(lineChartDom.value);
  lineChartOption && lineChart.setOption(lineChartOption);

  var lineChart2 = echarts.init(lineChartDom2.value);
  lineChartOption && lineChart2.setOption(lineChartOption);

  var lineChart3 = echarts.init(lineChartDom3.value);
  lineChartOption && lineChart3.setOption(lineChartOption);
})


</script>

<template>
  <a-button type="link" @click="goBack" style="margin-bottom: 20px;">
    <arrow-left-outlined/>
    Back to all Areas
  </a-button>

  <h1 style="margin-bottom: 20px">Associated Electric Cooperative, Inc.</h1>
  <a-row>
    <a-col>
      <a-range-picker
          v-model:value="datePicker"
          :format="dateFormat"
      />
    </a-col>
    <div style="margin-left: 10px">
      <a-button style="margin-right: 10px">
        <CaretLeftOutlined/>
      </a-button>
      <a-button>
        <CaretRightOutlined/>
      </a-button>
    </div>
  </a-row>
  <!--Chart start -->
  <div style="background-color: #f9f9f9;
            border: 1px solid #e4e4e4;
            margin-top: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div ref="stackedChartDom" style="width: 100%; height: 400px;">

    </div>
  </div>

  <div style="background-color: #f9f9f9;
            border: 1px solid #e4e4e4;
            margin-top: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

    <div ref="lineChartDom" style="width: 100%; height: 400px;">

    </div>
  </div>

  <div style="background-color: #f9f9f9;
            border: 1px solid #e4e4e4;
            margin-top: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

    <div ref="lineChartDom2" style="width: 100%; height: 400px;">

    </div>
  </div>


  <div style="background-color: #f9f9f9;
            border: 1px solid #e4e4e4;
            margin-top: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

    <div ref="lineChartDom3" style="width: 100%; height: 400px;">

    </div>
  </div>

  <a-alert
      type="info"
      show-icon
      message="About This data"
      description="This data comes from the U.S Energy Information Administration, specifically Form EIA-930. Note that the data might differ from what ISOs/RTOs report..."
      style="margin-bottom: 16px; margin-top: 20px; background-color: #f9f9f9;"
  />


</template>
