<script setup lang="ts">
import { ref, onMounted } from "vue";
import { CaretRightOutlined, CaretLeftOutlined, MonitorOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import * as echarts from 'echarts';
import type { ECharts } from "echarts";
import maplibregl from "maplibre-gl";
import { getPJMFuelMixData, getLocationalMarginalPrice, getLocationalLMP, getStandardized5MinData, getPJMDailyOutages } from "@/api/pjwApi";

const lineChartOption = ref('DPL');
const outagesChartValue = ref('Mid Atlantic - Dominion');
const inputValue = ref();

// 刷新表格数据
const refresh = () => {
  fetchLinesTable("market");
}

// 表格数据
const columns = [
  {
    title: 'Location',
    dataIndex: 'location',
    width: 150,
  },
  {
    title: 'Location short name',
    dataIndex: 'location_short_name',
    width: 150,
  },
  {
    title: 'Location Type',
    dataIndex: 'location_type',
    width: 100,
  },
  {
    title: 'LMP',
    dataIndex: 'lmp',
    width: 100,
    sorter: (a: any, b: any) => a.lmp - b.lmp,
  },
  {
    title: 'Energy',
    dataIndex: 'energy',
    width: 100,
  },
  {
    title: 'Congestion',
    dataIndex: 'congestion',
    width: 120,
  },
  {
    title: 'Loss',
    dataIndex: 'loss',
    width: 100,
  },

  {
    title: 'Interval Start',
    dataIndex: 'interval_start_local',
    width: 200,
  },
];



const tableData = ref<any[]>([]);


const handleChange = (value: string) => {
  fetchLinesChart(value);
}

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

const handleChangeOutagesChart = (value: string) => {
  fetchOutagesData(value);
}

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

    map.addSource('malaysia-country', { type: 'geojson', data: malaysia as any });
    map.addSource('malaysia-states', { type: 'geojson', data: malaysiaADM1 });

    map.addLayer({
      id: 'malaysia-fill',
      type: 'fill',
      source: 'malaysia-country',
      paint: { 'fill-color': '#f1f3f8', 'fill-opacity': 0.3 },
    });
    map.addLayer({
      id: 'state-fill',
      type: 'fill',
      source: 'malaysia-states',
      paint: { 'fill-color': '#ffdda0', 'fill-opacity': 0.4 },
    });
    map.addLayer({
      id: 'state-outline',
      type: 'line',
      source: 'malaysia-states',
      paint: { 'line-color': '#f0a500', 'line-width': 1 },
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
      const { name, value } = e.features[0].properties;

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
// 负载图标
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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
      emphasis: { disabled: true },
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

// 昨天
const start = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
// 今天
const end = new Date().toISOString().split("T")[0];

/**
 * 获取第一个堆叠图
 */
function fetchStackLineChart() {

  const res = getPJMFuelMixData(start, end, "market")
  res.then(data => {
    console.log(data, "调用");
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

function fetchOutagesData(filter_value: string) {
  const start = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const end = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  getPJMDailyOutages(start, end, "market", filter_value).then(res => {
    const records = res.data.data;

    // 每小时完整日期数组
    const dates = records.map((item: any) => new Date(item.interval_start_local));

    // X 轴每小时显示数据，但标签只显示每天一次
    const xAxisData = dates.map(d =>
      d.toLocaleString("en-US", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
    );

    // series 数据
    const plannedData = records.map((item: any) => item.planned_outages_mw);
    const maintenanceData = records.map((item: any) => item.maintenance_outages_mw);
    const forcedData = records.map((item: any) => item.forced_outages_mw);

    // 未来阴影范围：从今天开始到数据最后一条
    const today = new Date();
    const futureStartIndex = dates.findIndex(d => d >= today);
    const futureEndIndex = dates.length;

    const outagesOption: echarts.EChartsOption = {
      title: { text: 'Generation Outages: PJM' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } } },
      legend: { data: ['Planned Outages', 'Maintenance Outages', 'Forced Outages'] },
      toolbox: { feature: { saveAsImage: {} } },
      grid: { left: '5%', right: '5%', top: '15%', bottom: '20%' },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
          axisLabel: {
            formatter: function (value: string, index: number) {
              // 每天显示一次标签（小时为 0 的点）
              const date = dates[index];
              return date.getHours() === 0 ? `${date.getMonth() + 1}/${date.getDate()}` : '';
            }
          },
          axisPointer: { type: 'shadow' }
        }
      ],
      yAxis: [{ type: 'value', name: 'MW' }],
      series: [
        {
          name: 'Planned Outages',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: { focus: 'series' },
          data: plannedData,
          // 使用 markArea 显示未来日期阴影
          markArea: futureStartIndex >= 0 ? {
            itemStyle: { color: 'rgba(150, 150, 150, 0.4)' },
            data: [
              [
                { xAxis: xAxisData[futureStartIndex] },
                { xAxis: xAxisData[futureEndIndex - 1] }
              ]
            ]
          } : undefined
        },
        {
          name: 'Maintenance Outages',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: { focus: 'series' },
          data: maintenanceData
        },
        {
          name: 'Forced Outages',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: { focus: 'series' },
          data: forcedData
        }
      ],
      dataZoom: []
    };

    // 渲染图表
    renderChart(outagesChart.value, outagesOption);
  }).catch(error => {
    console.error("Error fetching outages data:", error);
  });
}



function fetchLinesChart(option: string = "DPL") {
  const res = getLocationalMarginalPrice(start, end, "market", option);
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


function fetchLoadData() {
  getStandardized5MinData(start, end, "market").then(res => {
    const records = res.data.data;

    // 转换时间 & 数据
    const loadData = records.map((item: any) => [
      new Date(item.interval_start_local).getTime(),
      item["load.load"]
    ]);
    const netLoadData = records.map((item: any) => [
      new Date(item.interval_start_local).getTime(),
      item.net_load
    ]);
    const forecastData = records.map((item: any) => [
      new Date(item.interval_start_local).getTime(),
      item["load_forecast.load_forecast"]
    ]);

    const loadLineChartOption: echarts.EChartsOption = {
      title: {
        text: "Load / Net Load / Forecast",
        top: 1,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
      },
      legend: {
        bottom: 0,
        data: ["Load", "Net Load", "Forecast"]
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        containLabel: true
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
        axisLabel: {
          formatter: (value: number) => {
            const d = new Date(value);
            // 格式化成 "MM/DD HH:mm"
            return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }) + " " +
              d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          }
        },
        splitNumber: 6,   // 平均分成 6 段（即 6 小时一个点）
      },
      yAxis: {
        type: "value",
        name: "MW"
      },
      series: [
        {
          name: "Load",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: loadData
        },
        {
          name: "Net Load",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: netLoadData
        },
        {
          name: "Forecast",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: forecastData
        }
      ]
    };

    renderChart(loadLineChart.value, loadLineChartOption);

    const zones = [
      "ae", "aep", "aps", "atsi", "bc", "comed", "dayton", "deok", "dom", "dpl",
      "duq", "ekpc", "jc", "me", "pe", "pep", "pjm_mid_atlantic_region",
      "pjm_rto", "pjm_southern_region", "pjm_western_region",
      "pl", "pn", "ps", "reco", "ug"
    ];

    const zoneSeries = zones.map(zone => ({
      name: zone.toUpperCase(),
      type: "line",
      smooth: true,
      showSymbol: false,
      connectNulls: true,   // 关键配置：跳过缺失点直接连线
      data: records.map((item: any) => {
        const val = item[`load.${zone}`];
        return [
          new Date(item.interval_start_local).getTime(),
          val != null ? Number(val).toFixed(2) : null  // null 表示缺失，不画到0
        ];
      })
    }));


    const zonalLoadLineChartOption: echarts.EChartsOption = {
      title: { text: "Zonal Load", left: "center" },
      tooltip: {
        trigger: "axis",
        valueFormatter: (val: any) => Number(val).toFixed(2) + " MW",
        appendToBody: true   // ✅ tooltip 直接挂到 body，不会被裁剪
      },
      legend: { type: "scroll", bottom: 0 },
      grid: { left: "5%", right: "5%", bottom: "15%", containLabel: true },
      xAxis: {
        type: "time",
        boundaryGap: false,
        splitNumber: 6,
        axisLabel: {
          formatter: (value: number) => {
            const d = new Date(value);
            return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }) + " " +
              d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          }
        }
      },
      yAxis: { type: "value", name: "MW", axisLabel: { formatter: (val: number) => val.toFixed(2) } },
      series: zoneSeries
    };

    renderChart(zonalLoadLineChart.value, zonalLoadLineChartOption);

    // ========== ③ Renewables ==========
    // ========== ③ Renewables ==========
    const renewablesData = records.map((item: any) => {
      const v = Number(item["renewables"]);
      return [
        new Date(item.interval_start_local).getTime(),
        v === 0 ? null : Number(v.toFixed(2))   // ✅ 0 -> null
      ];
    });

    const ratioData = records.map((item: any) => {
      const v = Number(item["renewables_to_load_ratio"]) * 100;
      return [
        new Date(item.interval_start_local).getTime(),
        v === 0 ? null : Number(v.toFixed(2))   // ✅ 0 -> null
      ];
    });

    const renewablesLineChartOption: echarts.EChartsOption = {
      title: { text: "Renewables & Ratio", top: 1, left: "center" },
      tooltip: {
        trigger: "axis",
        appendToBody: true,
        formatter: (params: any) => {
          let result = new Date(params[0].axisValue).toLocaleString() + "<br/>";
          params.forEach((item: any) => {
            if (item.data != null) { // ✅ 忽略 0/null
              if (item.seriesName === "Ratio") {
                result += item.marker + item.seriesName + ": " + item.data[1] + " %<br/>";
              } else {
                result += item.marker + item.seriesName + ": " + item.data[1] + " MW<br/>";
              }
            }
          });
          return result;
        }
      },
      legend: { bottom: 0, data: ["Renewables", "Ratio"] },
      grid: { left: "5%", right: "5%", bottom: "15%", containLabel: true },
      xAxis: {
        type: "time",
        boundaryGap: false,
        splitNumber: 6,
        axisLabel: {
          formatter: (value: number) => {
            const d = new Date(value);
            return (
              d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }) +
              " " +
              d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            );
          }
        }
      },
      yAxis: [
        {
          type: "value",
          name: "MW",
          axisLabel: { formatter: (val: number) => val.toFixed(2) }
        },
        {
          type: "value",
          name: "%",
          position: "right",
          min: 0,   // ✅ 固定 0
          max: 100, // ✅ 固定 100
          axisLabel: { formatter: (val: number) => val.toFixed(2) + "%" }
        }
      ],
      series: [
        {
          name: "Renewables",
          type: "line",
          smooth: true,
          showSymbol: false,
          connectNulls: true,
          yAxisIndex: 0,
          data: renewablesData
        },
        {
          name: "Ratio",
          type: "line",
          smooth: true,
          showSymbol: false,
          connectNulls: true,
          yAxisIndex: 1,
          data: ratioData
        }
      ]
    };
    renderChart(renewablesLineChart.value, renewablesLineChartOption);


  }).catch(err => {
    console.error("fetchLoadData error:", err);
  });
}



function formatTime(date: Date, timezone: string): string {
  if (timezone === "UTC") {
    return date.toISOString();
  }

  if (timezone === "market") {
    const parts = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).formatToParts(date);

    const map: any = {};
    parts.forEach(p => { if (p.type !== "literal") map[p.type] = p.value; });
    const local = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;

    // 算偏移
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const marketDate = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" }));
    const offsetMinutes = (marketDate.getTime() - utcDate.getTime()) / (60 * 1000);
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absMinutes = Math.abs(offsetMinutes);
    const hh = String(Math.floor(absMinutes / 60)).padStart(2, "0");
    const mm = String(absMinutes % 60).padStart(2, "0");

    return `${local}${sign}${hh}:${mm}`;
  }

  throw new Error(`Unsupported timezone: ${timezone}`);
}


function fetchLinesTable(timezone: string = "UTC") {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  const endTime = formatTime(now, timezone);
  const startTime = formatTime(fiveMinutesAgo, timezone);

  const res = getLocationalLMP(startTime, endTime, timezone);
  res.then(data => {
    tableData.value = data.data.data;
  }).catch(error => {
    console.error("Error fetching table data:", error);
  });
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

onMounted(async () => {
  buildMap();

  fetchStackLineChart();

  // 等待2秒
  await delay(2000);
  fetchLinesChart();

  // 再等待2秒
  await delay(2000);
  fetchLinesTable("market");

  // 再等待2秒
  await delay(2000);
  fetchLoadData();

  // 再等待2秒
  await delay(2000);
  fetchOutagesData(outagesChartValue.value);
});

</script>

<template>
  <h1>PJM</h1>
  <a-row style="margin-top: 20px">
    <a-col :span="24">
      <a-tabs v-model:activeKey="activeKey" size="large">
        <!-- 额外内容插槽（在 tab bar 右侧） -->
        <template #rightExtra>
          <a-date-picker v-model:value="dayValue" />
          <a-button @click="decrease" style="margin: 5px">
            <template #icon>
              <CaretLeftOutlined />
            </template>
          </a-button>
          <a-button @click="increase">
            <template #icon>
              <CaretRightOutlined />
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
                    <a-select ref="select" v-model:value="lineChartOption" style="width: 98%" @focus="focus"
                      @change="handleChange">
                      <template #suffixIcon>
                        < <MonitorOutlined />
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
                      <a-button type="text" size="small" @click="refresh">
                        <template #icon>
                          <ReloadOutlined />
                        </template>
                      </a-button>
                    </a-tooltip>
                  </h3>
                  <a-flex justify="space-between" align="center" style="width: 100%">
                    <label style="white-space: nowrap;">Interval End: 2025-08-27 12:45 PM EDT</label>
                    <a-input v-model:value="inputValue" placeholder="Search location" allow-clear
                      style="width: 200px" />
                  </a-flex>
                  <a-table :columns="columns" :data-source="tableData" :pagination="false" :scroll="{ y: 300 }"
                    class="custom-table" />

                </div>

              </a-col>
            </a-row>



            <!-- 负载图表开始开始 -->
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

            <a-row style="margin-top: 20px; height: 800px;">
              <a-col :span="24" style="height: 100%;">
                <div class="map-container" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
                  <h1 style="flex: 0 0 auto;">Generation Outages: PJM</h1>
                  <div ref="outagesChart" class="chart-container" style="width: 100%; flex: 1 1 auto;"></div>
                  <a-row style="margin-top: 10px; margin-bottom: 15px; flex: 0 0 auto;">
                    <a-col :span="24">
                      <a-select ref="select" v-model:value="outagesChartValue" style="width: 100%" @focus="focus"
                        @change="handleChangeOutagesChart">
                        <template #suffixIcon>
                          <MonitorOutlined />
                        </template>
                        <a-select-option value="Mid Atlantic - Dominion">Mid Atlantic - Dominion</a-select-option>
                        <a-select-option value="PJM RTO">PJM RTO</a-select-option>
                        <a-select-option value="Western">Western</a-select-option>
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
  border-radius: 8px;
  /* 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  /* 阴影 */
  /* overflow: hidden; */
  overflow: visible !important;
  /* 避免圆角外溢 */
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
  background: #fff;
  /* 给阴影对比度 */
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
  left: 20px;
  /* 靠左 */
}

.map-legend.right {
  right: 20px;
  /* 靠右（默认用这个） */
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
  background-color: #52c41a;
  /* 绿色 */
  cursor: pointer;
}

:deep(.custom-table .ant-table-pagination.ant-table-pagination-bottom) {
  margin-top: 40px !important;
  /* 或者使用 transform，避免改变布局流 */
  /* transform: translateY(40px) !important; */
}
</style>
