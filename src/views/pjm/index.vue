<script setup lang="ts">
import {ref, onMounted} from "vue";
import {CaretRightOutlined, CaretLeftOutlined} from "@ant-design/icons-vue";
import * as echarts from 'echarts';
import type {ECharts} from "echarts";
import maplibregl from "maplibre-gl";

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
const stackLineChartOption = {
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
      emphasis: {
        focus: 'series'
      },
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
      emphasis: {
        focus: 'series'
      },
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
      data: [999, 302, 181, 234, 210, 290, 150]
    }
  ]
};




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

onMounted(() => {
  buildMap();
  renderChart(stackLineChart.value, stackLineChartOption);
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
              <a-card size="small" title="Load" :bordered="true">
                <p>card content</p>
              </a-card>
            </a-col>
            <a-col :span="6">
              <a-card size="small" title="Net Load" :bordered="true">
                <p>card content</p>
              </a-card>
            </a-col>
            <a-col :span="6">
              <a-card size="small" title="Price" :bordered="true">
                <p>card content</p>
              </a-card>
            </a-col>
            <a-col :span="6">
              <a-card size="small" title="Main Source" :bordered="true">
                <p>card content</p>
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
  border-radius: 8px;              /* 圆角 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* 阴影 */
  overflow: hidden;                /* 避免圆角外溢 */
}

.map-box {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  background: #fff; /* 给阴影对比度 */
  padding: 10px;
}



/* SVG 自适应宽高 */
.map-container svg {
  width: 100%;
  height: 100%;
}
</style>
