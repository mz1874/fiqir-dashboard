<script setup lang="ts">
import {ref, onMounted} from "vue";
import {CaretRightOutlined, CaretLeftOutlined, MonitorOutlined, ReloadOutlined} from "@ant-design/icons-vue";
import * as echarts from 'echarts';
import type {ECharts} from "echarts";
import maplibregl from "maplibre-gl";
import {getPJMFuelMixData, getLocationalMarginalPrice} from "@/api/pjwApi";

const lineChartOption = ref('DPL');

const inputValue = ref();

// 刷新表格数据
const refresh = () => {
  console.log("刷新")
}

// 表格数据
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const data = [...Array(100)].map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));


const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

const focus = () => {
  console.log('focus');
};

// Map的定位地点
const malaysiaPlots = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [101.6869, 3.139], // 吉隆坡
      },
      properties: {
        name: 'Kuala Lumpur',
        value: 'Some data here',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [100.3354, 5.4141], // 槟城
      },
      properties: {
        name: 'Penang',
        value: 'Another info here',
      },
    },
  ],
};


const mapContainerId = 'geojson-detail'
// 构建地图
const buildMap = () => {
  const map = new maplibregl.Map({
    container: mapContainerId,
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: [103.8, 1.5], // 聚焦马来西亚中心
    zoom: 5,
  });
  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  map.on('load', async () => {
    // 加载全球国家数据
    const world = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson').then(r => r.json());
    const malaysia = {
      type: 'FeatureCollection',
      features: world.features.filter((f: any) => f.properties.ISO_A3 === 'MYS'),
    };
    // 加省级边界 GeoJSON
    const malaysiaADM1 = await fetch('/geoBoundaries-MYS-ADM1_simplified.geojson')
        .then(r => r.json());

    console.log(malaysiaADM1);

    map.addSource('malaysia-country', {type: 'geojson', data: malaysia as any});
    map.addSource('malaysia-states', {type: 'geojson', data: malaysiaADM1});

    map.addLayer({
      id: 'malaysia-fill',
      type: 'fill',
      source: 'malaysia-country',
      paint: {'fill-color': '#f1f3f8', 'fill-opacity': 0.3},
    });
    map.addLayer({
      id: 'state-fill',
      type: 'fill',
      source: 'malaysia-states',
      paint: {'fill-color': '#ffdda0', 'fill-opacity': 0.4},
    });
    map.addLayer({
      id: 'state-outline',
      type: 'line',
      source: 'malaysia-states',
      paint: {'line-color': '#f0a500', 'line-width': 1},
    });

    // 添加标记点的 GeoJSON 数据源
    map.addSource('malaysia-plots', {
      type: 'geojson',
      data: malaysiaPlots as any,
    });

// 点图层
    map.addLayer({
      id: 'plot-points',
      type: 'circle',
      source: 'malaysia-plots',
      paint: {
        'circle-radius': 6,
        'circle-color': '#e63946',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
      },
    });

// 鼠标悬停事件：显示 popup
    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on('mouseenter', 'plot-points', (e: any) => {
      map.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features[0].geometry.coordinates.slice();
      const {name, value} = e.features[0].properties;

      popup.setLngLat(coordinates)
          .setHTML(`<strong>${name}</strong><br/>${value}`)
          .addTo(map);
    });

    map.on('mouseleave', 'plot-points', () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });

    map.fitBounds(malaysiaADM1.features[0].geometry.coordinates.flat(2).reduce((bounds: any, coord: any) => {
      bounds.extend(coord);
      return bounds;
    }, new maplibregl.LngLatBounds()));
  });
}

const activeKey = ref('1');
const dayValue = ref();
const stackLineChart = ref<HTMLElement | null>(null);
const renewablesLineChart = ref<HTMLElement | null>(null);
const loadLineChart = ref<HTMLElement | null>(null);
const zonalLoadLineChart = ref<HTMLElement | null>(null);
const outagesChart = ref<HTMLElement | null>(null);


const outagesOption: echarts.EChartsOption = {
  title: {
    text: 'Stacked Area Chart'
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
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '15%',
    bottom: '20%',
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      step: 'middle',
      name: 'Email',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      step: 'middle',
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      step: 'middle',
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      step: 'middle',
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      step: 'middle',
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320]
    }
  ]
};


const loadLineChartOption: echarts.EChartsOption = {
  title: {
    text: 'Load - PJM',
    top: 1,
    left: 1,
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
    bottom: '20%',
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

const stackLineChartOption: echarts.EChartsOption = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Fuel Mix - PJM',
    left: 'left',
    top: 0
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    },

  },
  legend: {
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  grid: {
    left: 0,
    right: 20,
    top: 50,
    bottom: 70,
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
      smooth: true,
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
      emphasis: {disabled: true},
      data: [0, 232, 101, 264, 90, 340, 250]
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
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
      emphasis: {disabled: true},
      data: [120, 0, 111, 234, 220, 340, 310]
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: true,
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
      emphasis: {disabled: true},
      data: [320, 132, 201, 334, 190, 130, 220]
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: true,
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
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: false,
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
      emphasis: {disabled: true},
      data: [999, 302, 181, 234, 210, 290, 150]
    },
    {
      name: 'Line 6',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: false,
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
      emphasis: {disabled: true},
      data: [999, 302, 181, 234, 210, 290, 150]
    },
    {
      name: 'Line 6',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: false,
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
      emphasis: {disabled: true},
      data: [999, 302, 181, 234, 210, 290, 150]
    },
    {
      name: 'Line 6',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: false,
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
      emphasis: {disabled: true},
      data: [999, 302, 181, 234, 210, 290, 150]
    },
    {
      name: 'Line 6',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: false,
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
      emphasis: {disabled: true},
      data: [999, 302, 181, 234, 210, 290, 150]
    },
    {
      name: 'Line 6',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: false,
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
      emphasis: {disabled: true},
      data: [999, 302, 181, 234, 210, 290, 150]
    },
    {
      name: 'Line 11',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: false,
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
      emphasis: {disabled: true},
    },
  ]
};

const lineChart = ref<HTMLElement | null>(null);




const chartMap = new Map<HTMLElement, ECharts>()
const renderChart = (domRef: HTMLElement | null, option: echarts.EChartsOption) => {
  if (!domRef) return

  let instance = chartMap.get(domRef)
  if (!instance) {
    instance = echarts.init(domRef)
    chartMap.set(domRef, instance)
  }

  instance.setOption(option)
  instance.resize()
}

const start = new Date().toISOString().split("T")[0];  // 今天
const end = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // 明天
/**
 * 获取第一个堆叠图
 */
function fetchStackLineChart() {

  const res = getPJMFuelMixData(start, end, "market")
  res.then(data => {
    // X 轴
    const xAxisData = data.data.data.map((item: any) => item.interval_start_local);
    // 对应 series 的能源字段
    const fuels = ["coal", "gas", "nuclear", "wind", "solar", "hydro", "multiple_fuels", "oil", "storage", "other", "other_renewables"];
    stackLineChartOption.legend!.data = fuels;
    // 更新已有 option，而不是重建
    stackLineChartOption.xAxis[0].data = xAxisData;
    fuels.forEach((fuel, index) => {
      if (stackLineChartOption.series[index]) {
        stackLineChartOption.series[index].name = fuel; // 改 legend 名称
        stackLineChartOption.series[index].data = data.data.data.map(
            (item: any) => item[fuel] ?? 0
        );
      }
    });
    renderChart(stackLineChart.value, stackLineChartOption);

  }).catch(error => {
    console.log(error)
  })
}


function fetchLinesChart() {
  const res = getLocationalMarginalPrice(start, end, "market", lineChartOption.value);
  res.then(data => {
    const xAxisData = data.data.data.map(item => item.interval_start_local); // 横坐标用 local 时间
    const lmpData = data.data.data.map(item => item.lmp); // 纵坐标用 lmp
    const lineChartOptions: echarts.EChartsOption = {
      title: {
        text: 'Locational Marginal Price - PJM',
        top: 0,
        left: 'left',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Day Ahead']   // 只画 LMP
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
        data: xAxisData   // 时间
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: number) => `$${val.toFixed(2)}`  // 保留两位小数
        },
        offset: 10
      },
      series: [
        {
          name: 'Day Ahead',
          type: 'line',
          step: 'end',
          data: lmpData
        }
      ]
    };
    renderChart(lineChart.value, lineChartOptions);
  }).catch(error => {

  })
}

onMounted(() => {
  buildMap();
  fetchStackLineChart(); // 立即调用

  setTimeout(() => {
    fetchLinesChart(); // 1秒后调用
  }, 2000);
  // renderChart(renewablesLineChart.value, lineChartOptions);
  renderChart(loadLineChart.value, loadLineChartOption);
  renderChart(zonalLoadLineChart.value, loadLineChartOption);
  renderChart(outagesChart.value, outagesOption);
})

</script>

<template>
  <h1>PJM</h1>
  <a-row style="margin-top: 20px">
    <a-col :span="24">
      <a-tabs v-model:activeKey="activeKey" size="large">
        <!-- 额外内容插槽（在 tab bar 右侧） -->
        <template #rightExtra>
          <a-date-picker v-model:value="dayValue"/>
          <a-button @click="decrease" style="margin: 5px">
            <template #icon>
              <CaretLeftOutlined/>
            </template>
          </a-button>
          <a-button @click="increase">
            <template #icon>
              <CaretRightOutlined/>
            </template>
          </a-button>
        </template>

        <!--    标签栏开始    -->
        <a-tab-pane key="1" tab="Prices">
          <a-row>
            <a-col :span="6">
              <a-card size="small" :bordered="true">
                <template #title>
                  Load
                  <a-tooltip title="update 3 mins ago">
                    <span class="status-dot"></span>
                  </a-tooltip>
                </template>
                <p><b>87,658</b> <small>MW</small></p>
              </a-card>
            </a-col>

            <a-col :span="6">
              <a-card size="small" :bordered="true">
                <template #title>
                  Net Load
                  <a-tooltip title="update 3 mins ago">
                    <span class="status-dot"></span>
                  </a-tooltip>
                </template>
                <p><b>87,658</b> <small>MW</small></p>
              </a-card>
            </a-col>
            <a-col :span="6">

              <a-card size="small" :bordered="true">
                <template #title>
                  Price
                  <a-tooltip title="update 3 mins ago">
                    <span class="status-dot"></span>
                  </a-tooltip>
                </template>
                <p><b>87,658</b> <small>MW</small></p>
              </a-card>
            </a-col>
            <a-col :span="6">
              <a-card size="small" :bordered="true">
                <template #title>
                  Main Source
                  <a-tooltip title="update 3 mins ago">
                    <span class="status-dot"></span>
                  </a-tooltip>
                </template>
                <p><b>87,658</b> <small>MW</small></p>
              </a-card>
            </a-col>
          </a-row>

          <!--     主要图表开始     -->
          <div style="margin-top: 20px">
            <a-row>
              <a-col span="12">
                <div ref="stackLineChart" class="chart-container" style="width: 98%; height: 400px;"></div>
              </a-col>
              <a-col span="12">
                <div class="map-box">
                  <div class="map-header">
                    <h1 style="margin-top: 10px">Nodal Price Map</h1>
                    <a-button>ss</a-button>
                  </div>
                  <div :id="mapContainerId" class="map-container"></div>

                  <!-- 图例 -->
                  <div class="map-legend">
                    <b>$/MWH</b>
                    <div><span class="legend-color" style="background:#f1f3f8"></span> Country</div>
                    <div><span class="legend-color" style="background:#ffdda0"></span> State</div>
                    <div><span class="legend-color" style="background:#e63946"></span> Plot Point</div>
                  </div>
                </div>
              </a-col>
            </a-row>

            <a-row style="margin-top: 20px">
              <a-col span="12">
                <div ref="lineChart" class="chart-container" style="width: 98%; height: 400px;"></div>
                <a-row style="margin-top: 10px">
                  <a-col :span="24">
                    <a-select
                        ref="select"
                        v-model:value="lineChartOption"
                        style="width: 98%"
                        @focus="focus"
                        @change="handleChange"
                    >
                      <template #suffixIcon>
                        <
                        <MonitorOutlined/>
                      </template>
                      <a-select-option value="AECO">AECO</a-select-option>
                      <a-select-option value="AEP">AEP</a-select-option>
                      <a-select-option value="AEP-DAYTON HUB">AEP-DAYTON HUB</a-select-option>
                      <a-select-option value="AEP GEN HUB">AEP GEN HUB</a-select-option>
                      <a-select-option value="APS">APS</a-select-option>
                      <a-select-option value="ATSI">ATSI</a-select-option>
                      <a-select-option value="ATSI GEN HUB">ATSI GEN HUB</a-select-option>
                      <a-select-option value="BGE">BGE</a-select-option>
                      <a-select-option value="CHICAGO GEN HUB">CHICAGO GEN HUB</a-select-option>
                      <a-select-option value="CHICAGO HUB">CHICAGO HUB</a-select-option>
                      <a-select-option value="COMED">COMED</a-select-option>
                      <a-select-option value="DAY">DAY</a-select-option>
                      <a-select-option value="DEOK">DEOK</a-select-option>
                      <a-select-option value="DOM">DOM</a-select-option>
                      <a-select-option value="DOMINION HUB">DOMINION HUB</a-select-option>
                      <a-select-option value="DPL">DPL</a-select-option>
                      <a-select-option value="DUQ">DUQ</a-select-option>
                      <a-select-option value="EASTERN HUB">EASTERN HUB</a-select-option>
                      <a-select-option value="EKPC">EKPC</a-select-option>
                      <a-select-option value="JCPL">JCPL</a-select-option>
                      <a-select-option value="METED">METED</a-select-option>
                      <a-select-option value="NEW JERSEY HUB">NEW JERSEY HUB</a-select-option>
                      <a-select-option value="N ILLINOIS HUB">N ILLINOIS HUB</a-select-option>
                      <a-select-option value="OHIO HUB">OHIO HUB</a-select-option>
                      <a-select-option value="OVEC">OVEC</a-select-option>
                      <a-select-option value="PECO">PECO</a-select-option>
                      <a-select-option value="PENELEC">PENELEC</a-select-option>
                      <a-select-option value="PEPCO">PEPCO</a-select-option>
                      <a-select-option value="PJM-RTO">PJM-RTO</a-select-option>
                      <a-select-option value="PPL">PPL</a-select-option>
                      <a-select-option value="PSEG">PSEG</a-select-option>
                      <a-select-option value="RECO">RECO</a-select-option>
                      <a-select-option value="WESTERN HUB">WESTERN HUB</a-select-option>
                      <a-select-option value="WEST INT HUB">WEST INT HUB</a-select-option>
                      <a-select-option value="NYIS">NYIS</a-select-option>
                      <a-select-option value="MISO">MISO</a-select-option>
                      <a-select-option value="ONTARIO">ONTARIO</a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="12">
                <div class="chart-container" style="height: 440px">
                  <h3 style="display: flex; align-items: center; gap: 8px; margin: 0;">
                    5-Minute Real-Time LMP
                    <a-tooltip title="Refresh">
                      <a-button
                          type="text"
                          size="small"
                          @click="refresh"
                      >
                        <template #icon>
                          <ReloadOutlined/>
                        </template>
                      </a-button>
                    </a-tooltip>
                  </h3>
                  <a-flex justify="space-between" align="center" style="width: 100%">
                    <label style="white-space: nowrap;">Interval End: 2025-08-27 12:45 PM EDT</label>
                    <a-input
                        v-model:value="inputValue"
                        placeholder="Search location"
                        allow-clear
                        style="width: 200px"
                    />
                  </a-flex>
                  <a-table
                      :columns="columns"
                      :data-source="data"
                      :pagination="false"
                      :scroll="{ y: 300 }"
                      class="custom-table"
                  />

                </div>

              </a-col>
            </a-row>

            <a-row style="margin-top: 20px">
              <a-col :span="12">
                <div class="map-container" style="width: 98%;">
                  <div ref="loadLineChart" class="chart-container" style="width: 100%; height: 400px;"></div>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="map-container">
                  <div ref="renewablesLineChart" class="chart-container" style="width: 98%; height: 400px;"></div>
                </div>
              </a-col>
            </a-row>


            <a-row style="margin-top: 20px">
              <a-col :span="12">
                <div class="map-container" style="width: 98%;">
                  <div ref="zonalLoadLineChart" class="chart-container" style="width: 100%; height: 400px;"></div>
                </div>
              </a-col>
            </a-row>


            <a-row style="margin-top: 20px">
              <a-col :span="24">
                <div class="map-container" style="width: 100%;">
                  <h1>Generation Outages: PJM</h1>
                  <div ref="outagesChart" class="chart-container" style="width: 100%;"></div>
                  <a-row style="margin-top: 10px; margin-bottom: 15px">
                    <a-col :span="24">
                      <a-select
                          ref="select"
                          v-model:value="value1"
                          style="width: 100%"
                          @focus="focus"
                          @change="handleChange"
                      >
                        <template #suffixIcon>
                          <
                          <MonitorOutlined/>
                        </template>
                        <a-select-option value="AECO">AECO</a-select-option>
                        <a-select-option value="AEP">AEP</a-select-option>
                        <a-select-option value="AEP-DAYTON HUB">AEP-DAYTON HUB</a-select-option>
                        <a-select-option value="AEP GEN HUB">AEP GEN HUB</a-select-option>
                        <a-select-option value="APS">APS</a-select-option>
                        <a-select-option value="ATSI">ATSI</a-select-option>
                        <a-select-option value="ATSI GEN HUB">ATSI GEN HUB</a-select-option>
                        <a-select-option value="BGE">BGE</a-select-option>
                        <a-select-option value="CHICAGO GEN HUB">CHICAGO GEN HUB</a-select-option>
                        <a-select-option value="CHICAGO HUB">CHICAGO HUB</a-select-option>
                        <a-select-option value="COMED">COMED</a-select-option>
                        <a-select-option value="DAY">DAY</a-select-option>
                        <a-select-option value="DEOK">DEOK</a-select-option>
                        <a-select-option value="DOM">DOM</a-select-option>
                        <a-select-option value="DOMINION HUB">DOMINION HUB</a-select-option>
                        <a-select-option value="DPL">DPL</a-select-option>
                        <a-select-option value="DUQ">DUQ</a-select-option>
                        <a-select-option value="EASTERN HUB">EASTERN HUB</a-select-option>
                        <a-select-option value="EKPC">EKPC</a-select-option>
                        <a-select-option value="JCPL">JCPL</a-select-option>
                        <a-select-option value="METED">METED</a-select-option>
                        <a-select-option value="NEW JERSEY HUB">NEW JERSEY HUB</a-select-option>
                        <a-select-option value="N ILLINOIS HUB">N ILLINOIS HUB</a-select-option>
                        <a-select-option value="OHIO HUB">OHIO HUB</a-select-option>
                        <a-select-option value="OVEC">OVEC</a-select-option>
                        <a-select-option value="PECO">PECO</a-select-option>
                        <a-select-option value="PENELEC">PENELEC</a-select-option>
                        <a-select-option value="PEPCO">PEPCO</a-select-option>
                        <a-select-option value="PJM-RTO">PJM-RTO</a-select-option>
                        <a-select-option value="PPL">PPL</a-select-option>
                        <a-select-option value="PSEG">PSEG</a-select-option>
                        <a-select-option value="RECO">RECO</a-select-option>
                        <a-select-option value="WESTERN HUB">WESTERN HUB</a-select-option>
                        <a-select-option value="WEST INT HUB">WEST INT HUB</a-select-option>
                        <a-select-option value="NYIS">NYIS</a-select-option>
                        <a-select-option value="MISO">MISO</a-select-option>
                        <a-select-option value="ONTARIO">ONTARIO</a-select-option>
                      </a-select>
                    </a-col>
                  </a-row>
                </div>

              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Fuel Mix" force-render>
        </a-tab-pane>

        <a-tab-pane key="3" tab="Load" force-render>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>


</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 阴影 */
  overflow: hidden; /* 避免圆角外溢 */
}

.map-box {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.chart-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #fff; /* 给阴影对比度 */
  padding: 10px;
}


/* SVG 自适应宽高 */
.map-container svg {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.map-legend.left {
  left: 20px; /* 靠左 */
}

.map-legend.right {
  right: 20px; /* 靠右（默认用这个） */
}

.legend-color {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  border: 1px solid #ccc;
  vertical-align: middle;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 50%;
  background-color: #52c41a; /* 绿色 */
  cursor: pointer;
}

:deep(.custom-table .ant-table-pagination.ant-table-pagination-bottom) {
  margin-top: 40px !important;
  /* 或者使用 transform，避免改变布局流 */
  /* transform: translateY(40px) !important; */
}
</style>
