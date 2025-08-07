<script setup lang="ts">
import {ArrowRightOutlined} from '@ant-design/icons-vue';
import {h, nextTick, onMounted, ref, watch} from 'vue';
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as echarts from 'echarts'
import type {ECharts} from 'echarts'

type EChartsOption = echarts.EChartsOption;

// 多个 chart ref
const priceChartRef = ref<HTMLElement | null>(null)
const priceChartRef2 = ref<HTMLElement | null>(null)
const priceChartRef3 = ref<HTMLElement | null>(null)
const priceChartRef4 = ref<HTMLElement | null>(null)

const priceChartRef5 = ref<HTMLElement | null>(null)
const priceChartRef6 = ref<HTMLElement | null>(null)
const priceChartRef7 = ref<HTMLElement | null>(null)
const priceChartRef8 = ref<HTMLElement | null>(null)

const stackedArea1 = ref<HTMLElement | null>(null)
const stackedArea2 = ref<HTMLElement | null>(null)
const stackedArea3 = ref<HTMLElement | null>(null)
const stackedArea4 = ref<HTMLElement | null>(null)


const lineChart1 = ref<HTMLElement | null>(null)
const lineChart2 = ref<HTMLElement | null>(null)
const lineChart3 = ref<HTMLElement | null>(null)
const lineChart4 = ref<HTMLElement | null>(null)


// var myChart = echarts.init(stackedArea1.value);
// var option: EChartsOption;


const handleCityChange = () => {

}

// 图表实例缓存（避免重复初始化）
const chartMap = new Map<HTMLElement, ECharts>()
// 城市列表和选择值
const cityList = ['New York', 'London', 'Tokyo', 'Beijing']
const selectedCity = ref('New York')

// 通用渲染函数
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

// 通用 option（可复制修改用于不同图表）
const priceOption: echarts.EChartsOption = {
  title: {
    text: 'Price Trend',
    left: 'center',
    textStyle: {
      fontSize: 14
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Day Ahead', 'Real Time']
  },
  grid: {
    top: 60,
    left: 50,
    right: 30,
    bottom: 80
  },
  xAxis: [
    {
      type: 'category',
      data: ['0h', '2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        rotate: 0
      }
    },
  ],
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '${value}'
    }
  },
  series: [
    {
      name: 'Day Ahead',
      type: 'line',
      xAxisIndex: 0,
      data: [22, 24, 21, 23, 25, 26, 27, 29, 31, 30, 28, 26],
      smooth: true,
      lineStyle: {
        color: '#1890ff'
      }
    },
    {
      name: 'Real Time',
      type: 'line',
      xAxisIndex: 0,
      data: [20, 22, 23, 24, 27, 28, 29, 31, 33, 32, 30, 29],
      smooth: true,
      lineStyle: {
        color: '#f5222d'
      }
    }
  ]
}


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


const columns = [
  {
    title: 'ISO',
    dataIndex: 'iso',
    width: 150,
  },
  {
    title: 'Load (MW)',
    dataIndex: 'load',
    width: 150,
  },
  {
    title: 'Net Load (MW)',
    dataIndex: 'netLoad',
  },
  {
    title: 'Price ($/MWh)',
    dataIndex: 'price',
  },
  {
    title: 'Main Source',
    dataIndex: 'mainSource',
    customRender: ({text}) => {
      return h('div', {class: 'last-cell-wrapper'}, [
        h('span', text),
        h(ArrowRightOutlined, {class: 'arrow'})
      ]);
    }
  }
];

const data = [...Array(8)].map((_, i) => ({
  key: i,
  iso: `Edward King ${i}`,
  load: 32,
  netLoad: `London ${i}`,
  price: 32 + i,
  mainSource: `London,${i}`,
}));

const activeKey = ref('1');


var option: EChartsOption;

option = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Gradient Stacked Area Chart'
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
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
  },
  toolbox: {
    feature: {
      saveAsImage: {},
      fullScreen: {}
    }
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
      emphasis: {
        focus: 'series'
      },
      data: [140, 232, 101, 264, 90, 340, 250]
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
      emphasis: {
        focus: 'series'
      },
      data: [120, 282, 111, 234, 220, 340, 310]
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
      emphasis: {
        focus: 'series'
      },
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

var lineChartOptions : EChartsOption;

lineChartOptions = {
  title: {
    text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
    containLabel: true
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '20%',
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


watch(activeKey, async (val) => {
  console.log(val)
  if (val === '2') {
    await nextTick(); // 等待 DOM 更新完
    if (stackedArea1.value) {
      const myChart = echarts.init(stackedArea1.value);
      option && myChart.setOption(option);
      myChart.resize();

      const myChart2 = echarts.init(stackedArea2.value);
      option && myChart2.setOption(option);
      myChart2.resize();

      const myChart3 = echarts.init(stackedArea3.value);
      option && myChart3.setOption(option);
      myChart3.resize();

      const myChart4 = echarts.init(stackedArea4.value);
      option && myChart4.setOption(option);
      myChart4.resize();
    }
  } else if (val === '3') {
    await nextTick();
    const MyLineChart1 = echarts.init(lineChart1.value);
    option && MyLineChart1.setOption(lineChartOptions);
    MyLineChart1.resize();

    const MyLineChart2 = echarts.init(lineChart2.value);
    option && MyLineChart2.setOption(lineChartOptions);
    MyLineChart2.resize();

    const MyLineChart3 = echarts.init(lineChart3.value);
    option && MyLineChart3.setOption(lineChartOptions);
    MyLineChart3.resize();

    const MyLineChart4 = echarts.init(lineChart4.value);
    option && MyLineChart4.setOption(lineChartOptions);
    MyLineChart4.resize();

  }
});



const mapContainerId = 'geojson-map'


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


onMounted(async () => {
  buildMap();
  renderChart(priceChartRef.value, priceOption)
  renderChart(priceChartRef2.value, priceOption)
  renderChart(priceChartRef3.value, priceOption)
  renderChart(priceChartRef4.value, priceOption)

  renderChart(priceChartRef5.value, priceOption)
  renderChart(priceChartRef6.value, priceOption)
  renderChart(priceChartRef7.value, priceOption)
  renderChart(priceChartRef8.value, priceOption)


});
</script>


<template>
  <a-row class="full-height-row">
    <a-col :span="12">
      <a-table
          class="className"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :scroll="{ y: 480 }"
      />
    </a-col>

    <a-col :span="12">
      <div :id="mapContainerId" class="map-container"/>
    </a-col>
  </a-row>

  <a-row style="margin-top: 20px">
    <a-col :span="24">
      <a-tabs v-model:activeKey="activeKey" size="large">
        <a-tab-pane key="1" tab="Prices">
          <a-row>
            <a-col :span="6">
              <div ref="priceChartRef" style="width: 100%; height: 400px;"></div>
              <!-- 城市选择框 -->
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <a-select
                    v-model:value="selectedCity"
                    style="width: 200px"
                    placeholder="选择城市"
                    @change="handleCityChange"
                >
                  <a-select-option v-for="city in cityList" :key="city" :value="city">
                    {{ city }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
            <a-col :span="6">
              <div ref="priceChartRef2" style="width: 100%; height: 400px;"></div>
              <!-- 城市选择框 -->
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <a-select
                    v-model:value="selectedCity"
                    style="width: 200px"
                    placeholder="选择城市"
                    @change="handleCityChange"
                >
                  <a-select-option v-for="city in cityList" :key="city" :value="city">
                    {{ city }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
            <a-col :span="6">
              <div ref="priceChartRef3" style="width: 100%; height: 400px;"></div>
              <!-- 城市选择框 -->
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <a-select
                    v-model:value="selectedCity"
                    style="width: 200px"
                    placeholder="选择城市"
                    @change="handleCityChange"
                >
                  <a-select-option v-for="city in cityList" :key="city" :value="city">
                    {{ city }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
            <a-col :span="6">
              <div ref="priceChartRef4" style="width: 100%; height: 400px;"></div>
              <!-- 城市选择框 -->
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <a-select
                    v-model:value="selectedCity"
                    style="width: 200px"
                    placeholder="选择城市"
                    @change="handleCityChange"
                >
                  <a-select-option v-for="city in cityList" :key="city" :value="city">
                    {{ city }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
          </a-row>

          <a-row>
            <a-col :span="6">
              <div ref="priceChartRef5" style="width: 100%; height: 400px;"></div>
              <!-- 城市选择框 -->
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <a-select
                    v-model:value="selectedCity"
                    style="width: 200px"
                    placeholder="选择城市"
                    @change="handleCityChange"
                >
                  <a-select-option v-for="city in cityList" :key="city" :value="city">
                    {{ city }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
            <a-col :span="6">
              <div ref="priceChartRef6" style="width: 100%; height: 400px;"></div>
              <!-- 城市选择框 -->
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <a-select
                    v-model:value="selectedCity"
                    style="width: 200px"
                    placeholder="选择城市"
                    @change="handleCityChange"
                >
                  <a-select-option v-for="city in cityList" :key="city" :value="city">
                    {{ city }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
            <a-col :span="6">
              <div ref="priceChartRef7" style="width: 100%; height: 400px;"></div>
              <!-- 城市选择框 -->
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <a-select
                    v-model:value="selectedCity"
                    style="width: 200px"
                    placeholder="选择城市"
                    @change="handleCityChange"
                >
                  <a-select-option v-for="city in cityList" :key="city" :value="city">
                    {{ city }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
            <a-col :span="6">
              <div ref="priceChartRef8" style="width: 100%; height: 400px;"></div>
              <!-- 城市选择框 -->
              <div style="display: flex; justify-content: center; margin-top: 10px;">
                <a-select
                    v-model:value="selectedCity"
                    style="width: 200px"
                    placeholder="选择城市"
                    @change="handleCityChange"
                >
                  <a-select-option v-for="city in cityList" :key="city" :value="city">
                    {{ city }}
                  </a-select-option>
                </a-select>
              </div>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Fuel Mix" force-render>
          <a-row>
            <a-col :span="6">
              <div ref="stackedArea1" style="width: 100%; height: 400px;"></div>
            </a-col>
            <a-col :span="6">
              <div ref="stackedArea2" style="width: 100%; height: 400px;"></div>
            </a-col>
            <a-col :span="6">
              <div ref="stackedArea3" style="width: 100%; height: 400px;"></div>
            </a-col>
            <a-col :span="6">
              <div ref="stackedArea4" style="width: 100%; height: 400px;"></div>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Load" force-render>
          <a-row>
            <a-col :span="6">
              <div ref="lineChart1" style="width: 100%; height: 400px;"></div>
            </a-col>
            <a-col :span="6">
              <div ref="lineChart2" style="width: 100%; height: 400px;"></div>
            </a-col>
            <a-col :span="6">
              <div ref="lineChart3" style="width: 100%; height: 400px;"></div>
            </a-col>
            <a-col :span="6">
              <div ref="lineChart4" style="width: 100%; height: 400px;"></div>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="4" tab="Renewables">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>


<style scoped>
::v-deep(.className .ant-table-tbody > tr > td) {
  padding: 10px !important;
  line-height: 15px !important;
  height: 20px !important;
  font-size: 14px;
}

/* 最后一列内容容器 */
::v-deep(.className .last-cell-wrapper) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 默认箭头隐藏 */
::v-deep(.className .arrow) {
  opacity: 0;
  transition: opacity 0.3s;
}

/* 鼠标悬浮整行时，显示最后一列的箭头 */
::v-deep(.className .ant-table-tbody > tr:hover .arrow) {
  opacity: 1;
}

::v-deep(.className .arrow) {
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  color: #1890ff; /* 给箭头上色，可点击感 */
}

.full-height-row {
  display: flex;
  align-items: stretch; /* ✅ 左右列等高 */
}

.map-container {
  width: 100%;
  height: 100%;
  padding: 16px;
}

/* SVG 自适应宽高 */
.map-container svg {
  width: 100%;
  height: 100%;
}


::v-deep(.ant-tabs-ink-bar) {
  background-color: rgb(58, 125, 93) !important;
  height: 4px;
  border-radius: 2px;
}

</style>