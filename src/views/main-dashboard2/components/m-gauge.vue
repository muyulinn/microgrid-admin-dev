<template>
  <div class="gauge">
    <div ref="myChart" class="chart" :style="{width, height}" />
    <div ref="myChart2" class="chart2" />
  </div>
</template>

<script>
export default {
  props: {
    max: {
      type: [String, Number],
      default: '200'
    },
    min: {
      type: [Number, String],
      default: 0
    },
    value: {
      type: [String, Number],
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myChart: null,
      myChart2: null,
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          max: this.max,
          radius: '100%',
          center: ['50%', '60%'],
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [0.7, '#56a64b'],
                [0.85, '#ff780a'],
                [1, '#e02f44']
              ]
            }
          },
          axisLabel: {
            show: false
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            },
            length: '60%',
            width: 3
          },
          axisTick: {
            distance: -12,
            length: 3,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          splitLine: {
            distance: -12,
            length: 12,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}',
            color: 'inherit',
            fontSize: '2rem',
            offsetCenter: ['0%', '60%']
          },
          data: [{
            value: 0
          }]
        }
      ],
      series2: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 60,
          axisLabel: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: [[1, '#337ecc']]
            }
          },
          pointer: {
            itemStyle: {
              color: '#000'
            },
            length: '40%',
            width: 1
          },
          axisTick: {
            distance: -12,
            length: 0,
            lineStyle: {
              color: '#fff',
              width: 0
            }
          },
          splitLine: {
            distance: -4,
            length: 2,
            lineStyle: {
              color: '#fff',
              width: 1
            }
          },
          detail: {
            show: false
          },
          data: [
            {
              value: 0
            }
          ],
          animationEasingUpdate: 'linear'
        }
      ]
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        setTimeout(() => {
          this.series[0].data = [{
            // value: parseFloat(val).toFixed(0)
            value: parseFloat(val).toFixed(2)
          }]
          const myChart = this.$echarts.init(this.$refs.myChart)
          myChart.setOption({
            grid: {
              left: 10,
              containLabel: true,
              right: 10,
              bottom: 10,
              top: 20,
              borderColor: '#f4f4f4'
            },
            series: this.series
          })
        })
      }
    }
  },
  mounted() {
    setTimeout(() => {
      const myChart = this.$echarts.init(this.$refs.myChart)
      const myChart2 = this.$echarts.init(this.$refs.myChart2)
      myChart.setOption({
        grid: {
          left: 10,
          containLabel: true,
          right: 10,
          bottom: 0,
          top: 60,
          borderColor: '#f4f4f4'
        },
        series: this.series
      })
      myChart2.setOption({
        // grid: {
        //   left: 10,
        //   containLabel: true,
        //   right: 10,
        //   bottom: 10,
        //   top: 20,
        //   borderColor: '#f4f4f4'
        // },
        series: this.series2
      })
      window.addEventListener('resize', function() {
        myChart.resize()
        myChart2.resize()
      })

      let second = 0
      setInterval(function() {
        // var date = new Date();
        second += 59
        // this.option.animationDurationUpdate = 300;
        myChart2.setOption({
          series: [
            {
              animation: second !== 0,
              data: [{ value: second }]
            }
          ]
        })
        setTimeout(() => {
          second = 0
          myChart2.setOption({
            series: [
              {
                animation: second !== 0,
                data: [{ value: second }]
              }
            ]
          })
        }, 470)
      }, 500)
    })
  }
}
</script>

<style lang='scss' scoped>
.gauge {
  position: relative;
  width: 100%;
  height: 100%;
}
.chart2 {
  position: absolute;
  right: 0;
  top: 0;
  width: 35px;
  height: 35px;
}
.chart {
  // padding: 12px 0;
  // padding-bottom: 12px;
}
</style>
