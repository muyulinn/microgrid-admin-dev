<template>
  <div ref="chart" class="chart" />
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    xLine: {
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartOption: {
        title: {
          text: this.title,
          axisPointer: { type: 'cross' },
          textStyle: {
            color: '#101010',
            fontSize: 14
          }
        },
        grid: {
          left: 10,
          containLabel: true,
          right: 10,
          top: 30,
          bottom: 0,
          borderColor: '#f4f4f4'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: this.xLine
        },
        yAxis: {
          type: 'value',
          name: '',
          position: 'left',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: this.title,
            color: '#3bbefb',
            data: this.chartData,
            type: 'bar',
            smooth: true,
            barWidth: '20%',
            itemStyle: {
              'color': function(params) {
                var colorarrays = ['#7688f0', '#28bf94', '#ff9800', '#f85d47', '#7d7a7a']
                return colorarrays[params.dataIndex]
              },
              barBorderRadius: 2,
              borderWidth: '2px',
              borderType: 'solid',
              borderColor: '#7688f0'
            }

          }
        ]
      }
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const chart = this.$echarts.init(this.$refs.chart)
      chart.setOption(this.chartOption)
      window.addEventListener('resize', function() {
        chart.resize()
      })
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function() {
          chart.resize()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
