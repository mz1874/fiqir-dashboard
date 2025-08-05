<script setup lang="ts">
import {ArrowRightOutlined} from '@ant-design/icons-vue';
import {h, onMounted, ref} from 'vue';
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as echarts from 'echarts';

const lineChartRef = ref(null)


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


const mapContainerId = 'geojson-map'



onMounted(async () => {
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

    map.addSource('malaysia-country', {type: 'geojson', data: malaysia});
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
      data: malaysiaPlots,
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
            <div ref="lineChartRef" style="width: 100%; height: 400px"></div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Fuel Mix" force-render>Content of Tab Pane 2</a-tab-pane>
          <a-tab-pane key="3" tab="Load">Content of Tab Pane 3</a-tab-pane>
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
   background-color: rgb(58,125,93) !important;
   height: 4px;
   border-radius: 2px;
 }

</style>