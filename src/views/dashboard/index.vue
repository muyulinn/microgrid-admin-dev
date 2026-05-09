<template>
  <div class="dashboard-container common-shadow common-list">
    <div class="top-data">
      <div class="title">
        <div>统计信息</div>
        <div>刷新</div>
      </div>
      <div class="data-box">
        <div class="data">
          <div class="num">{{ total }}</div>
          <div class="desc">
            <img src="@/assets/jiahua/dashboard/icon1.png" alt="">
            <div>设备总数</div>
          </div>
        </div>
        <div class="data">
          <div class="num">{{ photovoltaic }}</div>
          <div class="desc">
            <img src="@/assets/jiahua/dashboard/icon2.png" alt="">
            <div>光伏设备</div>
          </div>
        </div>
        <div class="data">
          <div class="num">{{ machine }}</div>
          <div class="desc">
            <img src="@/assets/jiahua/dashboard/icon3.png" alt="">
            <div>机房设备</div>
          </div>
        </div>
        <div class="data">
          <div class="num">{{ humidity || '-' }}</div>
          <div class="desc">
            <!-- <img src="@/assets/jiahua/dashboard/icon4.png" alt=""> -->
            <span class="fa-class fa fa-tint" style="color: #79bbff;" />
            <div>湿度</div>
          </div>
        </div>
        <div class="data">
          <div class="num">{{ temperature || '-' }}</div>
          <div class="desc">
            <!-- <img src="@/assets/jiahua/dashboard/icon5.png" alt=""> -->
            <span class="fa-class fa fa-thermometer-full" style="color: #f89898;" />
            <div>温度</div>
          </div>
        </div>
        <div class="data">
          <div class="num" :style="{color: water == '0' ? '#56a64b' : '#f00'}">{{ smoke | status }}</div>
          <div class="desc">
            <!-- <img src="@/assets/jiahua/dashboard/icon6.png" alt=""> -->
            <span class="fa-class fa fa-warning" style="color: #b1b3b8;" />
            <div>烟感</div>
          </div>
        </div>
        <div class="data">
          <div class="num" :style="{color: water == '0' ? '#56a64b' : '#f00'}">{{ water | status }}</div>
          <div class="desc">
            <span class="fa-class fa fa-warning" style="color: #337ecc;" />
            <!-- <img src="@/assets/jiahua/dashboard/icon7.png" alt=""> -->
            <div>水浸</div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-box">
      <div class="top-chart">
        <div ref="chart1" class="chart" />
        <div ref="chart2" class="chart" />
      </div>
      <div class="bottom-chart">
        <div ref="chart3" class="chart" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  filters: {
    status(val) {
      if (val === '0') return '正常'
      else if (val === '1') return '异常'
      else return '-'
    }
  },
  data() {
    return {
      total: 0,
      machine: 0,
      photovoltaic: 0,
      roomId: '104',
      humidity: 0,
      temperature: 0,
      smoke: '',
      water: '',
      color: ['#e0b400', '#56a64b', '#5794f2', '#e02f44', '#5794f2', '#fa6400'],
      chartOption1: {
        title: {
          text: '市电',
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
          data: ['在线数', '全部'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          axisLabel: {
            formatter: (val) => val.substring(10, 16)
          }
        },
        yAxis: {
          type: 'value',
          name: '',
          position: 'left',
          axisLabel: {
            formatter: '{value}kWh'
          }
        },
        series: [
          {
            name: '在线数',
            color: '#3bbefb',
            data: [10, 22, 28, 23, 19, 10, 22, 28, 23, 19, 55, 66],
            type: 'bar',
            smooth: true,
            barWidth: '20%',
            itemStyle: {
              barBorderRadius: 2,
              borderWidth: '2px',
              borderType: 'solid',
              borderColor: '#7688f0'
            }

          },
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
          text: '光伏',
          left: '0%',
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
          data: ['光伏'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => value + 'kWh'
        },
        xAxis: {
          axisLabel: {
            formatter: (val) => val.substring(10, 16)
          }
        },
        yAxis: {
          type: 'value',
          position: 'left',
          axisLabel: {
            formatter: '{value} 度'
          }
        },
        series: [

        ]
      },
      chartOption3: {
        title: {
          text: '设备数据统计图',
          left: '0%',
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
          data: ['异常', '离线'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => value + 'kWh'
        },
        xAxis: {
          axisLabel: {
            formatter: (val) => val.substring(10, 16)
          }
        },
        yAxis: {
          type: 'value',
          name: '',
          position: 'left',
          axisLabel: {
            formatter: '{value} kWh'
          }
        },
        series: []
      }
    }
  },
  async mounted() {
    this.getMachine()
    this.getEnvironment()
    await this.getElectricSupply()
    await this.getPhotovoltaic()
    await this.getElectricityConsumption()
    this.initChart()
  },
  methods: {
    format(date, fmt) { // author: meizz
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
      return fmt
    },
    initChart() {
      const chart1 = this.$echarts.init(this.$refs.chart1)
      chart1.setOption(this.chartOption1)
      const chart2 = this.$echarts.init(this.$refs.chart2)
      chart2.setOption(this.chartOption2)
      const chart3 = this.$echarts.init(this.$refs.chart3)
      chart3.setOption(this.chartOption3)
      window.addEventListener('resize', function() {
        chart1.resize()
        chart2.resize()
        chart3.resize()
      })
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function() {
          chart1.resize()
          chart2.resize()
          chart3.resize()
        })
      })
    },
    async getMachine() {
      let query = `sum(count_values("count", count by(deviceId) ({ roomId=~"${this.roomId}" })))`
      const time = new Date()
      const param = JSON.stringify({ query, time })
      await this.$http.post('/api/adminDevice/prom/query', param).then(res => {
        this.total = res.result[0].value[1]
        // this.machine = res.result[0].value[1]
      })
      query = `sum(count_values("count", count by(deviceId) (T_dev{ roomId=~"${this.roomId}" }))) + sum(count_values("count", count by(deviceId) ( p_solar )))`
      await this.$http.post('/api/adminDevice/prom/query', JSON.stringify({ query, time })).then(res => {
        this.photovoltaic = res.result[0].value[1]
      })
      this.machine = this.total - this.photovoltaic
    },
    async getEnvironment() {
      const param = {
        query: `{__name__=~"W|YG|H|T"}`,
        time: new Date()
      }
      const result = await this.$http.post('/api/adminDevice/prom/query', param)
      result.result.forEach(item => {
        if (item.metric.__name__ === 'W') this.water = item.value[1]
        if (item.metric.__name__ === 'YG') this.smoke = item.value[1]
        if (item.metric.__name__ === 'H') this.humidity = item.value[1]
        if (item.metric.__name__ === 'T') this.temperature = item.value[1]
      })
    },
    // 市电chart
    async getElectricSupply() {
      const query = `max(delta(p_active_energy[1h])) > 0 < 8000`
      const end = new Date() * 1 / 1000
      const start = (new Date() * 1 - 24 * 60 * 60 * 1000) / 1000
      const step = '1h'
      const result = await this.$http.post('/api/adminDevice/prom/queryRange', JSON.stringify({ query, start, end, step }))
      const legend = []; const series = []
      let xAxis = []
      const data = result.result[0].values.map(item => {
        xAxis.push(item[0])
        return parseFloat(item[1]).toFixed(2)
      })
      series.push({
        name: '市电',
        areaStyle: {
          color: this.color[0],
          opacity: 0.1
        },
        data,
        type: 'line',
        smooth: true
      })
      xAxis = xAxis.map(item => {
        return this.format(new Date(item * 1000), 'yyyy-MM-dd hh:00:00')
      })
      this.chartOption1.series = series
      this.chartOption1.legend.data = legend
      this.chartOption1.xAxis.data = xAxis
    },
    async getPhotovoltaic() {
      const query = `sum(delta(p_solar[1h]))`
      const end = new Date(this.format(new Date(), 'yyyy-MM-dd hh:00:00')) / 1000
      const start = new Date(this.format(new Date(new Date() * 1 - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:00:00')) / 1000
      const step = '1h'
      // const param = JSON.stringify({ query, end, start, step })
      const result = await this.$http.post('/api/adminDevice/prom/queryRange', JSON.stringify({ query, start, end, step }))
      const legend = []; const series = []; let xAxis = []

      for (let i = 0; i < result.result.length; i++) {
        const data = []; const xList = []
        for (let j = 0, k = 0; j < result.result[i].values.length; j++, k++) {
          if (k === 0 || result.result[i].values[j][0] - xList[k - 1] === 3600) {
            xList.push(result.result[i].values[j][0])
            data.push(parseFloat(result.result[i].values[j][1]).toFixed(2))
          } else {
            xList.push(xList[k - 1] + 3600)
            data.push('')
            j = j - 1
          }
        }
        series.push({
          name: result.result[i].metric.deviceName,
          areaStyle: {
            color: this.color[i] + '11'
          },
          data,
          // type: 'bar',
          type: 'line',
          smooth: true,
          opacity: 0.1
        })
        xAxis = xList
      }
      xAxis = xAxis.map(item => {
        return this.format(new Date(item * 1000), 'yyyy-MM-dd hh:00:00')
      })
      this.chartOption2.series = series
      this.chartOption2.legend.data = legend
      this.chartOption2.xAxis.data = xAxis
    },
    async getElectricityConsumption() {
      const query = `delta(p_active_energy{roomId=~"${this.roomId}"}[1h]) > 0 < 2000`
      const end = new Date(this.format(new Date(), 'yyyy-MM-dd hh:00:00')) / 1000
      const start = new Date(this.format(new Date(new Date() * 1 - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:00:00')) / 1000
      const step = '1h'
      const result = await this.$http.post('/api/adminDevice/prom/queryRange', JSON.stringify({ query, start, end, step }))
      const legend = []; const series = []; let xAxis = []

      for (let i = 0; i < result.result.length; i++) {
        const data = []; const xList = []
        for (let j = 0, k = 0; j < result.result[i].values.length; j++, k++) {
          if (k === 0 || result.result[i].values[j][0] - xList[k - 1] === 3600) {
            xList.push(result.result[i].values[j][0])
            data.push(parseFloat(result.result[i].values[j][1]).toFixed(2))
          } else {
            xList.push(xList[k - 1] + 3600)
            data.push('')
            j = j - 1
          }
        }
        series.push({
          name: result.result[i].metric.deviceName,
          areaStyle: {
            color: this.color[i] + '11'
          },
          data,
          type: 'line',
          smooth: true,
          opacity: 0.1
        })
        xAxis = xList
      }
      xAxis = xAxis.map(item => {
        return this.format(new Date(item * 1000), 'yyyy-MM-dd hh:00:00')
      })
      this.chartOption3.series = series
      this.chartOption3.legend.data = legend
      this.chartOption3.xAxis.data = xAxis
    }
  }
}
</script>
<style lang="less">
  .dashboard-container{
    position: relative;
    height: calc(100% - 0px);
    overflow-y: auto;
    font-family: 'SourceHanSansCN-Medium', Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    font-weight: Medium;
    color: #101010;
    padding: 0 18px;
    font-size: 14px;
    // background-color: white;
    .top-data {
      .title {
        padding: 24px 0 14px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgb(231, 231, 231);
        div:nth-child(1) {
          font-weight: bold;
        }
        div:nth-child(2) {
          width: 67px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: #546BF0;
          border: 1px solid #546BF0;
        }
      }
      .data-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30px 0;
        border-bottom: 1px solid rgb(231, 231, 231);
        .data {
          padding: 0 44px;
          border-right: 1px solid rgb(231, 231, 231);
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          .num {
            font-size: 28px;
            margin-bottom: 12px;
          }
          .desc {
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 25px;
              height: 25px;
              margin-right: 5px;
            }
            .desc {
              color: #8A8A8A;
            }
          }
        }
        .data:nth-last-child(1) {
          border-right: none;
        }
      }
    }
    .chart-box {
      margin-top: 12px;
      border-top: 1px solid rgb(231, 231, 231);
      .top-chart {
        display: flex;
        align-items: center;
        padding: 11px 0 0 0;
        .chart {
          width:50%;
          height:300px
        }
      }
      .bottom-chart {
        margin-bottom: 20px;
        .chart {
          width:100%;
          height:300px
        }
      }
    }
  }
  .fa-class {
    font-size: 18px !important;
    margin-right: 5px;
  }
</style>
