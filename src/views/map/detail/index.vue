<script setup lang="ts">
import maplibregl from "maplibre-gl";
import {computed, onMounted, reactive, ref} from "vue";
import 'maplibre-gl/dist/maplibre-gl.css'
import dayjs, {Dayjs} from 'dayjs';
import {CaretLeftOutlined, CaretRightOutlined, VerticalLeftOutlined} from '@ant-design/icons-vue'

const dayValue = ref<Dayjs>();
const mapContainerId = 'geojson-detail'

const startDate = dayjs('2025-08-01');
const totalDays = 30;

const sliderValue = ref(0);

const selectedDate = computed(() =>
    startDate.add(sliderValue.value, 'day').format('YYYY-MM-DD')
);

const formatTooltip = (val: number) => {
  return startDate.add(val, 'day').format('YYYY-MM-DD');
};


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


const usaPlots = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-74.006, 40.7128], // 纽约
      },
      properties: {
        name: 'New York City',
        value: 'Population: 8.5M',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-118.2437, 34.0522], // 洛杉矶
      },
      properties: {
        name: 'Los Angeles',
        value: 'Population: 4M',
      },
    },
  ],
};

const value = ref<number>(1);
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px',
});


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

    // 加载美国 ADM1
    const usaADM1 = await fetch('/geoBoundaries-USA-ADM1_simplified.geojson')
        .then(r => r.json());

    map.addSource('usa-states', {type: 'geojson', data: usaADM1});
    map.addLayer({
      id: 'state-fill-usa',
      type: 'fill',
      source: 'usa-states',
      paint: {'fill-color': '#90caf9', 'fill-opacity': 0.3},
    });
    map.addLayer({
      id: 'state-outline-usa',
      type: 'line',
      source: 'usa-states',
      paint: {'line-color': '#1d3557', 'line-width': 1},
    });

    // 添加美国标记点
    map.addSource('usa-plots', {type: 'geojson', data: usaPlots});
    map.addLayer({
      id: 'usa-points',
      type: 'circle',
      source: 'usa-plots',
      paint: {
        'circle-radius': 6,
        'circle-color': '#2a9d8f',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
      },
    });


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
    // Popup 悬浮提示（通用）
    const popup = new maplibregl.Popup({closeButton: false, closeOnClick: false});

    const bindPopup = (layerId: string) => {
      map.on('mouseenter', layerId, (e: any) => {
        map.getCanvas().style.cursor = 'pointer';
        const coordinates = e.features[0].geometry.coordinates.slice();
        const {name, value} = e.features[0].properties;

        popup.setLngLat(coordinates)
            .setHTML(`<strong>${name}</strong><br/>${value}`)
            .addTo(map);
      });

      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    };

    bindPopup('plot-points');
    bindPopup('usa-points');

    const getCoordinates = (feature: any) => {
      const geom = feature.geometry;
      const coords = geom.coordinates;

      switch (geom.type) {
        case 'Polygon':
          return coords.flat();
        case 'MultiPolygon':
          return coords.flat(2);
        default:
          return [];
      }
    };

    const allCoords = [
      ...malaysiaADM1.features.flatMap(getCoordinates),
      ...usaADM1.features.flatMap(getCoordinates),
    ];

    const bounds = allCoords.reduce((b: any, coord: any) => {
      if (Array.isArray(coord) && coord.length === 2) {
        b.extend(coord);
      }
      return b;
    }, new maplibregl.LngLatBounds());

  });
}

const value1 = ref('ALL');

const focus = () => {
  console.log('focus');
};

const handleChange = () => {
  console.log(value1.value);
};

onMounted(() => {
  buildMap();
})
</script>


<template>
  <div class="map-wrapper">
    <div class="header">
      <a-select
          v-model:value="value1"
          style="width: 200px"
          @change="handleChange"
      >
        <a-select-option value="jack">Normal Price Map</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select>
      <a-button @click="decrease">
        <template #icon>
          <CaretLeftOutlined/>
        </template>
      </a-button>

      <a-slider v-model:value="sliderValue" :min="0" :max="totalDays" style="flex: 1;" :tip-formatter="formatTooltip"/>
      <a-button @click="increase">
        <template #icon>
          <CaretRightOutlined/>
        </template>
      </a-button>
      <a-button @click="toEndDays">
        <template #icon>
          <VerticalLeftOutlined/>
        </template>
      </a-button>
      <a-date-picker v-model:value="dayValue"/>
    </div>
    <div :id="mapContainerId" class="map-container">
      <div class="map-label">
        <a-row>
          <a-col :span="15">
            <a-input placeholder="Search for a Node"></a-input>

          </a-col>

          <a-col :span="9">
            <a-select
                ref="select"
                v-model:value="value1"
                style="width: 100px; margin-left: 10px"
                @focus="focus"
                @change="handleChange"
            >
              <a-select-option value="jack">ALL</a-select-option>
              <a-select-option value="Malaysia">Malaysia</a-select-option>
              <a-select-option value="US">US</a-select-option>
            </a-select>
          </a-col>
        </a-row>

        <a-row style="margin-top: 10px">
          <a-col :span="21">
            Layers
          </a-col>
          <a-col :span="3">
            Hide
          </a-col>
          <a-col style="margin-top: 10px">
            <a-radio-group v-model:value="value" style="display: flex; flex-direction: column;">
              <a-radio :style="radioStyle" :value="1">Option A</a-radio>
              <a-radio :style="radioStyle" :value="2">Option B</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>


      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 80%;
  margin: 0;
  padding: 0;
}

.map-wrapper {
  display: flex;
  flex-direction: column;
  height: 82vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  padding: 10px;
}

.map-container {
  flex: 1; /* 自动占据剩下的空间 */
  width: 100%;
}

/* SVG 自适应宽高 */
.map-container svg {
  width: 100%;
  height: 80%;
}


.map-label {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 10; /* 确保盖住 maplibre 的图层 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}



</style>