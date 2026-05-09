<template>
  <div ref="mainLoading" class="chart-earth loading" />
</template>
<script>

import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GlobeComponent } from 'echarts-gl/components'
echarts.use([GlobeComponent, CanvasRenderer])

export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {

    apps() {
      let list = [{ name: '电网系统', 'path': '/home', icon: 'app_系统状态' }]
      list = list.concat(this.$store.getters.permission_routes.filter(r => r.name === '系统管理').map(r => r.children).flat())
      const width = 1000
      const height = width / 2
      const cols = 5
      const rows = Math.round(list.length / cols)
      const symbolSize = 80
      const data = list.map((item, index) => {
        const rowIndex = Math.floor(index / cols)
        return {
          x: (index % cols) * (width / cols),
          y: (height - 200) * ((rowIndex + 1) / (rows + 1) - 1 / 2),
          symbol: 'roundRect',
          symbolSize,
          label: { fontSize: 20 },
          ...item
        }
      })
      console.log(data)
      const baseTexture = echarts.init(document.createElement('canvas'), null, { width, height })
      baseTexture.setOption({ backgroundColor: '#a3dfec',
        series: [
          {
            type: 'graph',
            layout: 'none',
            label: {
              show: true
            },
            symbolSize,
            data
          }
        ]
      })
      return baseTexture
    },

    init() {
      const baseTexture = this.apps()
      const isPC = window.innerWidth > window.innerHeight
      let pcOption = {}
      let viewControl = {}
      if (isPC) {
        pcOption = {
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
          baseTexture, // 'https://oss.jiahuagd.com.cn/public/monitor-bg/earth-map2-mini.jpeg',
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
            targetCoord: [0, 0],
            ...viewControl
          },
          ...pcOption
        }
      }
      const main = this.$refs.mainLoading
      main.classList.remove('loading')
      echarts.init(main).setOption(option, true)

      baseTexture.on('click', 'series', e => {
        console.log('asdfasdfa', e)
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
