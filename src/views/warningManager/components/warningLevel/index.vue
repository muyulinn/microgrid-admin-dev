<template>
  <el-row :gutter="30" class="warning-container">
    <el-col :span="13">
      <div v-for="(item,index) in 10" :key="index" class="warning common-shadow">
        <div class="top">
          <div>告警类型：一级告警</div>
          <div>告警时间：2023-03-02  12：00</div>
        </div>
        <div class="bottom">
          <div class="bottom-left">
            告警内容：三号湿度传感器连续超高2分钟
          </div>
          <div class="bottom-right">
            <div class="level">
              <div>告警级别：</div>
              <div class="circle" />
            </div>
            <div class="more">
              查看详情 >
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="11" class="common-shadow">
      <div class="chart-part">
        <!-- <div class="title">告警频次</div> -->
        <div ref="chart1" class="chart" />
      </div>
      <div class="chart-part">
        <!-- <div class="title">告警数据</div> -->
        <div ref="chart2" class="chart" />
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      chartOption1: {
        title: {
          text: '告警频次',
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
          borderColor: '#f4f4f4'
        },
        legend: {
          data: ['全部'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: ['03-02', '03-03', '03-04', '03-05', '03-06', '03-07', '03-08', '03-09', '03-10', '03-11', '03-12', '03-13']
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
            name: '全部',
            color: '#28ce52',
            data: [25, 77, 66, 44, 55, 22, 25, 77, 66, 44, 55, 22],
            type: 'line',
            smooth: true
          }
        ]
      },
      chartOption2: {
        title: {
          text: '告警数据',
          axisPointer: { type: 'cross' },
          textStyle: {
            color: '#101010',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   top: '10%',
        //   left: 'center'
        // },
        series: [
          {
            name: '告警数据',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 15,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '已处理' },
              { value: 735, name: '未处理' }
            ]
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
      const chart1 = this.$echarts.init(this.$refs.chart1)
      chart1.setOption(this.chartOption1)
      const chart2 = this.$echarts.init(this.$refs.chart2)
      chart2.setOption(this.chartOption2)
      window.addEventListener('resize', function() {
        chart1.resize()
        chart2.resize()
      })
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function() {
          chart1.resize()
          chart2.resize()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.warning-container {
  margin-top: 21px;
  margin-right: 0!important;
  .warning {
    margin-bottom: 17px;
    padding: 16px 16px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #757575;
      margin-bottom: 12px;
    }
    .bottom {
      color: #101010;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .bottom-left {
        flex: 1;
        margin-right: 12px;
        line-height: 1.5;
      }
      .bottom-right {
        text-align: right;
        width: 150px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .level {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          .circle {
            width: 12px;
            height: 12px;
            border-radius: 6px;
            background-color: #FF8446;
          }
        }
        .more {
          color: #757575;
          cursor: pointer;
        }
      }
    }
  }
  .chart-part {
    padding: 14px;
    margin-bottom: 40px;
    .title {
      font-weight: bold;
      color: #101010;
    }
    .chart {
      min-height: 300px;
    }
  }
}
</style>
