<template>
  <!-- <div class="box"> -->
  <div ref="mainLoading" class="chart-earth loading" />
  <!-- </div> -->
</template>
<script>
// import * as echarts from 'echarts'
// import 'echarts-gl'

import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GlobeComponent } from 'echarts-gl/components'
import { Lines3DChart, Scatter3DChart } from 'echarts-gl/charts'

import './world'

echarts.use([GlobeComponent, CanvasRenderer, Lines3DChart, Scatter3DChart])

export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const geoCoordMap = {
        上海: [120.52, 30.4],
        北京: [115.25, 39.9],
        重庆: [107.7539, 30.1904],
        芬兰: [24.909912, 60.169095],
        美国: [-100.696295, 33.679979],
        日本: [139.710164, 35.706962],
        韩国: [126.979208, 37.53875],
        瑞士: [7.445147, 46.956241],
        德国: [13.402393, 52.518569],
        英国: [-0.126608, 51.208425]
      }

      const CQData = [
        [{
          name: '重庆'
        },
        {
          name: '英国',
          value: 70
        }
        ],
        [{
          name: '重庆'
        },
        {
          name: '芬兰',
          value: 80
        }
        ],
        [{
          name: '重庆'
        },
        {
          name: '美国',
          value: 80
        }
        ]
      ]

      const BJData = [
        [{
          name: '北京'
        },
        {
          name: '日本',
          value: 30
        }
        ],
        [{
          name: '北京'
        },
        {
          name: '德国',
          value: 80
        }
        ]
      ]

      const SHData = [
        [{
          name: '上海'
        },
        {
          name: '韩国',
          value: 80
        }
        ]
      ]
      // 根据起始位置，获得线的地理位置
      // function convertData(data) {
      //   const res = []
      //   for (let i = 0; i < data.length; i++) {
      //     const dataItem = data[i]
      //     const [fromCoord, toCoord] = [
      //       geoCoordMap[dataItem[1].name],
      //       geoCoordMap[dataItem[0].name]
      //     ]

      //     if (fromCoord && toCoord) res.push([fromCoord, toCoord])
      //   }
      //   return res
      // }

      const [series2d, series3d] = [
        [],
        []
      ];
      [
        ['重庆', CQData],
        ['北京', BJData],
        ['上海', SHData]
      ].forEach(function(item) {
        // 2d平面地图 + 散点
        series2d.push({
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 3,
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            fontSize: 24,
            show: true,
            position: 'right',
            formatter: '{b}'
          },
          itemStyle: {
            normal: {
              color: 'rgba(250,250,250,0.8)'
            }
          },
          data: item[1].map(function(dataItem) {
            return {
              name: dataItem[1].name,
              value: geoCoordMap[dataItem[1].name],
              symbolSize: dataItem[1].value / 4
            }
          })
        }, {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 3,
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            show: true,
            position: 'left',
            fontSize: 18,
            formatter: '{b}'
          },
          itemStyle: {
            normal: {
              color: '#fff'
            }
          },
          data: [{
            name: item[0],
            value: geoCoordMap[item[0]],
            symbolSize: parseInt(Math.random() * 20 + 10),
            label: {
              position: 'right'
            }
          }]
        })

        // 3d连线
        series3d.push({
          type: 'lines3D',
          effect: {
            show: true,
            period: 3,
            trailLength: 0.1
          },
          lineStyle: {
            color: 'rgba(38 ,122, 219, 0.8)',
            width: 1.5,
            opacity: 0.6
          },
          tooltip: {
            show: false
          },
          data: item[1]
        }, {
          type: 'scatter3D',
          name: 'location',
          coordinateSystem: 'globe',
          blendMode: 'lighter',
          symbolSize: 10,
          itemStyle: {
            color: 'red',
            opacity: 1
          },
          label: {
            show: true,
            formatter: (param) => param.data.name
          },
          data: [{
            name: '中国',
            value: [116.4551, 40.2539, 0]
          }]
        })
      })

      const baseTexture = echarts.init(document.createElement('canvas'), null, { width: 4096, height: 2048 })
      baseTexture.setOption({ backgroundColor: '#a3dfec', tooltip: { backgroundColor: 'red', alwaysShowContent: true }, geo: { type: 'map', map: 'world', left: 0, top: 0, right: 0, bottom: 0, zoom: 0, boundingCoords: [
        [-180, 90],
        [180, -90]
      ], roam: false, _itemStyle: { borderColor: 'rgb(38 122 219 / 0.4)', borderWidth: 1, areaColor: 'rgb(4 4 63 / 0.6)' }, label: { fontSize: 24 }, regions: [{ name: 'China', selected: true, itemStyle: { areaColor: 'red', color: 'red' }}] }})

      // baseTexture.setOption(
      // {"backgroundColor":"#a3dfec","series":[{"type":"graph","layout":"none","symbolSize":150,"roam":false,"label":{"show":true},"edgeSymbol":["circle","arrow"],"edgeSymbolSize":[4,10],"edgeLabel":{"fontSize":40},"data":[{"name":"Node 1","x":300,"y":1024},{"name":"Node 2","x":800,"y":1024},{"name":"Node 3","x":550,"y":1024},{"name":"Node 4","x":550,"y":1024}]}]}
      // )

      const isPC = window.innerWidth > window.innerHeight
      let pcOption = {}
      let viewControl = {}
      if (isPC) {
        pcOption = {
          // top: 'middle',
          // left: 'center',
          // width: '50%',
          // height: '50%',
        }
      } else {
        viewControl = {
          distance: 300
        }
      }

      const option = {
        backgroundColor: 'transparent',
        // backgroundColor: '#000',
        globe: {
          baseTexture, // : 'https://oss.jiahuagd.com.cn/public/monitor-bg/earth-map2-mini.jpeg',
          // shading: "lambert",
          shading: 'color',
          atmosphere: {
            show: false
          },
          light: {
            ambient: {
              intensity: 0
            },
            main: {
              intensity: 1,
              shadow: false
            },
            ambientCubemap: {
              exposure: 0,
              diffuseIntensity: 0,
              specularIntensity: 0
            }
          },
          viewControl: {
            distance: 400,
            autoRotate: true,
            autoRotateSpeed: 5,
            targetCoord: [116.46, 23],
            ...viewControl
          },
          ...pcOption
        },
        series: [{
          type: 'scatter3D',
          name: 'location',
          coordinateSystem: 'globe',
          blendMode: 'lighter',
          symbolSize: 10,
          itemStyle: {
            color: 'red',
            opacity: 1
          },
          label: {
            type: 'blend',
            show: true,
            formatter: (param) => param.data.name
          }
          // data: [{
          //   name: '中国',
          //   value: [116.4551, 40.2539, 0]
          // }]
        }, {
          type: 'lines3D',
          coordinateSystem: 'globe',
          blendMode: 'lighter',
          effect: {
            show: true,
            trailWidth: 2,
            trailLength: 1.15,
            trailOpacity: 1,
            trailColor: 'rgb(30, 30, 60)'
            // trailColor: '#ffffffba'
          },
          lineStyle: {
            width: 1,
            // color: 'rgb(50, 50, 150)',
            color: '#c0c0c0',
            opacity: 1
          },
          data: [
            [
              [116.4551, 40.2539],
              [120.52, 30.4]
            ],
            [
              [116.4551, 40.2539],
              [115.25, 39.9]
            ],
            [
              [116.4551, 40.2539],
              [113.25, 23.0]
            ],
            [
              [116.4551, 40.2539],
              [107.7539, 30.1904]
            ],
            [
              [116.4551, 40.2539],
              [24.909912, 60.169095]
            ],
            [
              [116.4551, 40.2539],
              [-100.696295, 33.679979]
            ],
            [
              [116.4551, 40.2539],
              [139.710164, 35.706962]
            ],
            [
              [116.4551, 40.2539],
              [126.979208, 37.53875]
            ],
            [
              [116.4551, 40.2539],
              [7.445147, 46.956241]
            ],
            [
              [116.4551, 40.2539],
              [13.402393, 52.518569]
            ],
            [
              [116.4551, 40.2539],
              [-0.126608, 51.208425]
            ]
          ]
        }],
        _series: series3d
      }
      const main = this.$refs.mainLoading
      main.classList.remove('loading')
      echarts.init(main).setOption(option, true)

      baseTexture.getZr().on('click', e => {
        window.top.postMessage({ type: 'click', panelid: 'earth' }, '*')
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .chart-earth {
    background-image: url(https://oss.jiahuagd.com.cn/public/projects/microgrid/img/index.jpeg);
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    position: relative;
    // background: rgba(255, 0, 0, 0.116);

    &::before {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      box-shadow: 0px 0px 20px 6px #9ad2fb inset;
    }
    ::v-deep {
      * {opacity:0.85;}
    }
  }
</style>
