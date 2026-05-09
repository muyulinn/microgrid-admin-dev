<template>
  <div class="mainDashboard">
    <el-container>
      <el-header>
        <m-header />
      </el-header>
      <el-main style="padding-bottom: 0;">
        <el-row :gutter="10">
          <!-- 左侧 -->
          <el-col :span="4">
            <m-card>
              <company :info="company" />
            </m-card>
            <div class="line" style="display: flex;">
              <m-card class="half">
                <div class="content">
                  <div class="title">本月用电</div>
                  <div class="showInfo" style="padding: 5px 5px;">
                    <m-gauge max="3000" :value="thisMonth" width="120px" height="140px" />
                  </div>
                </div>
              </m-card>
              <m-card class="half">
                <div class="content">

                  <div class="title" style="justify-content: space-between;display: flex;align-items: center;">
                    告警事件
                    <span v-show="warning" class="fa fa-bell" style="animation: blinking 1s infinite;" />
                  </div>
                  <div class="showInfo flex-end cursor" :style="{color: warning ? '#f00' : '', lineHeight: '140px'}" @click="toWarning">
                    {{ warning || '0' }} <span class="unit" style="padding-bottom: 0;margin-bottom: -10px;">件</span>
                  </div>
                </div>
              </m-card>
            </div>
            <m-card width="100%">
              <div style="width: 100%;">
                <div v-if="today != '-'" class="line">
                  <div class="half" style="border-right: 1px solid #aaa;padding-right: 10px;width: 40%;flex: none;">
                    <div class="title">今日发电</div>
                    <div class="showInfo">
                      <m-gauge :value="today2" height="140px" />
                    </div>
                  </div>
                  <div class="half list" style="flex: 1;">
                    <m-four-grid :value="grid1" />
                  </div>
                </div>
                <div v-else class="line empty" style="font-size: 42px;height: 130px;align-items: center;">
                  没有数据
                </div>
              </div>
            </m-card>
            <m-card style="margin-top: 1.2vh;">
              <div class="content">
                <!-- <div class="title">监控</div> -->
                <monitoring @clickItem="changeScreen" />
              </div>
            </m-card>
          </el-col>
          <!-- 中间 -->
          <el-col :span="16">
            <centerScreen :screen-src="src" @close="closeScreen" />
            <div class="line" style="padding-top: 0px;">
              <m-card class="half" style="flex-direction: column;overflow: initial;">
                <div class="title">最近24小时用电度</div>
                <div v-if="chartOption1.series" ref="chart1" class="chart" />
              </m-card>
              <m-card class="half" style="flex-direction: column;overflow: initial;">
                <div class="title">最近24小时相电压</div>
                <div ref="chart2" class="chart" />
              </m-card>
              <m-card class="half" style="flex-direction: column;overflow: initial;">
                <div class="title">最近24小时电流</div>
                <div ref="chart3" class="chart" />
              </m-card>
              <m-card class="half" style="flex-direction: column;overflow: initial;">
                <div class="title">最近24电表读数</div>
                <div ref="chart4" class="chart" />
              </m-card>
            </div>
          </el-col>
          <!-- 右侧 -->
          <el-col :span="4">
            <m-card>
              <div class="content clock-time">
                <div class="clock"><h2>{{ date }}</h2></div>
                <div class="line" style="margin-top: -10px;">
                  <div class="flex-center">
                    <div class="fa fa-cloud" />
                    <div class="environment">{{ weather }}({{ cloud }}%)</div>
                  </div>
                  <div class="flex-center">
                    <div class="fa fa-thermometer-full" />
                    <div class="environment">{{ T }}°C</div>
                  </div>
                </div>
                <div class="line" style="margin-top: 10px;padding-bottom: 20px;">
                  <div class="flex-center">
                    <div class="fa fa-leaf" />
                    <div class="environment">{{ windSpeed }}米/秒</div>
                  </div>
                  <div class="flex-center">
                    <div class="fa fa-compass" />
                    <div class="environment">{{ windDirection }}</div>
                  </div>
                </div>
              </div>
            </m-card>
            <m-card>
              <div class="content">
                <div class="title">系统运行时间</div>
                <div class="showInfo flex-end" style="font-size: 65px;padding: 10px 0;">{{ time }} <span class="unit" style="padding-bottom: 6px;">天</span> </div>
              </div>
            </m-card>
            <m-card>
              <div style="display: flex;flex-direction: column;width: 100%;">
                <div style="display: flex;">
                  <div class="flex-1">
                    <div class="title">湿度</div>
                    <div v-if="humidity != '-'" class="content showInfo3 humidity" style="color: #f00;font-size: 42px;">
                      {{ humidity }}<span class="unit">%H</span>
                    </div>
                    <div v-else class="empty">
                      没有数据
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="title">温度</div>
                    <div v-if="temperature != '-'" class="content showInfo3 temperature" style="font-size: 42px;">
                      {{ temperature }}<span class="unit">℃</span>
                    </div>
                    <div v-else class="empty">
                      没有数据
                    </div>
                  </div>
                </div>
                <div style="display: flex;width: 100%;">
                  <div class="flex-1">
                    <div class="title">烟感</div>
                    <div v-if="water==='0' || water == 1" class="content showInfo2">
                      {{ smoke == 0 ? '正常' : '异常' }}
                    </div>
                    <div v-else class="empty">
                      没有数据
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="title">水浸</div>
                    <div v-if="water==='0' || water == 1" class="content showInfo2">
                      {{ water == 0 ? '正常' : '异常' }}
                    </div>
                    <div v-else class="empty">
                      没有数据
                    </div>
                  </div>
                </div>
              </div>
            </m-card>
            <m-card style="margin-top: 5px;">
              <div style="width: 100%;">
                <div v-if="today != '-'" class="line">
                  <div class="half" style="border-right: 1px solid #aaa;padding-right: 10px;width: 40%;flex: none;">
                    <div class="title">今日用电</div>
                    <div class="showInfo">
                      <m-gauge :value="today" height="140px" />
                    </div>
                  </div>
                  <div class="half list" style="flex: 1;">
                    <m-four-grid :value="grid2" />
                  </div>
                </div>
                <div v-else class="line empty" style="font-size: 42px;height: 130px;align-items: center;">
                  没有数据
                </div>
              </div>
            </m-card>
            <m-card style="flex-direction: column;overflow: initial;display: flex;margin-top: 5px;">
              <div class="title" style="padding-bottom: 15px;">最近24小时光伏发电走势</div>
              <div ref="chart5" class="chart" style="margin-top: 5px;" />
            </m-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import mHeader from './components/m-header.vue'
import mCard from './components/m-card.vue'
import company from './components/company.vue'
import centerScreen from './components/centerScreen.vue'
import monitoring from './components/monitoring.vue'
import mGauge from './components/m-gauge.vue'
import mFourGrid from './components/m-fourGrid.vue'
export default {
  name: '',
  components: {
    mHeader,
    company,
    mCard,
    centerScreen,
    monitoring,
    mGauge,
    mFourGrid
  },
  data() {
    return {
      date: '',
      roomId: '104',
      temperature: '',
      humidity: '',
      smoke: '',
      water: '',
      thisMonth: '',
      today2: '',
      src: '',
      warning: '',
      electricityConsumption: '',
      ammeter: '',
      weather: '',
      cloud: '',
      T: '',
      windSpeed: '',
      time: '',
      windDirection: '',
      delta1: '', // 市电
      delta2: '', // 机房
      delta3: '', // 光伏
      company: {},
      orgName: '佛山市科技园公司',
      orgId: '11',
      grid1: [
        { label: '市电', value: 0 },
        { label: '光伏', value: 0 },
        { label: '储电', value: 0 },
        { label: '其他', value: 0 }
      ],
      grid2: [
        { label: '机房', value: 0 },
        { label: '充电桩', value: 0 },
        { label: '储电', value: 0 },
        { label: '其他', value: 0 }
      ],
      color: ['#e0b400', '#56a64b', '#5794f2', '#e02f44', '#5794f2', '#fa6400'],
      chartOption1: {
        title: {
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
          bottom: 10,
          top: 20,
          borderColor: '#f4f4f4'
        },
        legend: {
          show: false,
          data: ['在线数', '全部'],
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
            formatter: '{value}kWh'
          }
        },
        series: []
      },
      chartOption2: {
        title: {
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
          bottom: 10,
          top: 20,
          borderColor: '#f4f4f4'
        },
        legend: {
          show: false,
          data: ['在线数', '全部'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => value + 'V'
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
            formatter: '{value}V'
          }
        },
        series: []
      },
      chartOption3: {
        title: {
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
          bottom: 10,
          top: 20,
          borderColor: '#f4f4f4'
        },
        legend: {
          show: false,
          data: ['在线数', '全部'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => value + 'V'
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
            formatter: '{value}V'
          }
        },
        series: []
      },
      chartOption4: {
        title: {
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
          bottom: 10,
          top: 20,
          borderColor: '#f4f4f4'
        },
        legend: {
          show: false,
          data: ['在线数', '全部'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => value + '度'
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
            formatter: '{value}度'
          }
        },
        series: []
      },
      chartOption5: {
        title: {
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
          bottom: 10,
          top: 20,
          borderColor: '#f4f4f4'
        },
        legend: {
          show: false,
          data: ['在线数', '全部'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => value + '度'
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
            formatter: '{value}度'
          }
        },
        series: []
      },
      chartOption6: {
        title: {
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
          bottom: 10,
          top: 20,
          borderColor: '#f4f4f4'
        },
        legend: {
          show: false,
          data: ['在线数', '全部'],
          left: '17%'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => value + '度'
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
            formatter: '{value}度'
          }
        },
        series: []
      }
    }
  },
  computed: {
    exist() {
      return null
    },
    today() {
      return parseFloat(this.grid2[0].value) + parseFloat(this.today2)
    }
  },
  async mounted() {
    setInterval(() => {
      this.date = this.format(new Date(), 'yy年MM月dd日 hh:mm:ss')
    }, 1000)
    await this.getUserInfo()
    this.loadData()

    setInterval(() => {
      this.loadData()
    }, 1000 * 60)

    setInterval(() => {
      this.grid2[0].value = parseFloat(this.grid2[0].value) + this.delta1 / 60
      this.today2 = parseFloat(this.today2) + this.delta3 / 60
    }, 1000)
  },
  methods: {
    async loadData() {
      // 获取天气信息
      this.getWeatherInfo()

      // 最近24小时电度
      await this.getElectricityConsumption()
      // 最近24小时电压
      await this.getVoltage()
      // 最近24小时电流
      await this.getElectric()
      // 最近24小时光伏
      await this.getPhotovoltaic()
      // 最近24小时读表
      await this.getAmmeter()

      // 本月用电
      this.getThisMonth()
      // 温度
      this.getTemperature()
      // 湿度
      this.getHumidity()
      // 烟感
      this.getSmoke()
      // 水浸
      this.getWater()
      // 警告数
      this.getWarning()

      // 市电
      this.getElectricSupply()
      // 光伏
      this.getTodayPhotovoltaic()

      // 初始化图表
      this.$nextTick(() => {
        this.initChart()
      })
    },
    initChart() {
      const chart1 = this.$echarts.init(this.$refs.chart1)
      const chart2 = this.$echarts.init(this.$refs.chart2)
      const chart3 = this.$echarts.init(this.$refs.chart3)
      const chart4 = this.$echarts.init(this.$refs.chart4)
      const chart5 = this.$echarts.init(this.$refs.chart5)
      setTimeout(() => {
        chart1.setOption(this.chartOption1)
        chart2.setOption(this.chartOption2)
        chart3.setOption(this.chartOption3)
        chart4.setOption(this.chartOption4)
        chart5.setOption(this.chartOption5)
      })
      window.addEventListener('resize', function() {
        chart1.resize()
        chart2.resize()
        chart3.resize()
        chart4.resize()
        chart5.resize()
      })
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', function() {
          chart1.resize()
          chart2.resize()
          chart3.resize()
          chart4.resize()
          chart5.resize()
        })
      })
    },
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
    getUserInfo() {
      this.$http.get('/api/user/getUserInfo').then(res => {
        this.orgId = res.orgId || 11
        const today = new Date()
        this.time = Math.floor((today - new Date('2023-03-17')) / (1000 * 3600 * 24))
        this.getCompany()
      })
    },
    getCompany() {
      this.$http.getParam('/api/user/getOrganizationVoById', { id: this.orgId }).then(res => {
        this.company = res
        this.orgName = res.orgName
      })
    },
    async getTemperature() {
      const param = {
        query: `T{roomId=~"${this.roomId}"}`,
        time: new Date()
      }
      const result = await this.getProm(JSON.stringify(param))
      this.temperature = result || '-'
    },
    async getHumidity() {
      const param = {
        query: `H{roomId=~"${this.roomId}"}`,
        time: new Date()
      }
      const result = await this.getProm(JSON.stringify(param))
      this.humidity = (result && parseFloat(result).toFixed(0)) || '-'
    },
    async getSmoke() {
      const param = {
        query: `YG{roomId=~"${this.roomId}"}`,
        time: new Date()
      }
      const result = await this.getProm(JSON.stringify(param))
      this.smoke = result
    },
    async getWater() {
      const param = {
        query: `W{roomId=~"${this.roomId}"}`,
        time: new Date()
      }
      const result = await this.getProm(JSON.stringify(param))
      this.water = result
    },
    getProm(param) {
      return this.$http.post('/api/adminDevice/prom/query', param).then(res => {
        return res?.result[0]?.value[1]
      })
    },
    async getElectricityConsumption() {
      const query = `delta(p_active_energy{roomId=~"${this.roomId}"}[1h]) > 0 < 2000`
      const end = new Date(this.format(new Date(), 'yyyy-MM-dd hh:00:00')) / 1000
      const start = new Date(this.format(new Date(new Date() * 1 - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:00:00')) / 1000
      const step = '1h'
      const param = JSON.stringify({ query, end, start, step })
      const result = await this.queryRange(param)
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
      this.chartOption1.series = series
      this.chartOption1.legend.data = legend
      this.chartOption1.xAxis.data = xAxis
    },
    async getVoltage() {
      const query_a = `avg(u_a < 500 )`
      const query_b = `avg(u_b < 500 )`
      const query_c = `avg(u_c < 500 )`
      const end = new Date(this.format(new Date(), 'yyyy-MM-dd hh:00:00')) / 1000
      const start = new Date(this.format(new Date(new Date() * 1 - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:00:00')) / 1000
      const step = '1h'
      const param_a = JSON.stringify({ query: query_a, end, start, step })
      const param_b = JSON.stringify({ query: query_b, end, start, step })
      const param_c = JSON.stringify({ query: query_c, end, start, step })
      const result_a = await this.queryRange(param_a)
      const result_b = await this.queryRange(param_b)
      const result_c = await this.queryRange(param_c)
      let xAxis = []; const u_a = []; const u_b = []; const u_c = []
      for (let i = 0, j = 0; i < result_a.result[0].values.length; i++, j++) {
        if (i === 0 || result_a.result[0].values[i][0] * 1000 - xAxis[j - 1] === 3600 * 1000) {
          xAxis.push(result_a.result[0].values[i][0] * 1000)
          u_a.push(parseFloat(result_a.result[0].values[i][1]).toFixed(2))
        } else {
          const x = xAxis[j - 1] + 3600000
          xAxis.push(x)
          u_a.push('')
          i = i - 1
        }
      }
      for (let i = 0, j = 0; j < xAxis.length; i++, j++) {
        if (i === 0 || result_b.result[0].values[i][0] * 1000 - xAxis[j] === 0) {
          u_b.push(parseFloat(result_b.result[0].values[i][1]).toFixed(2))
        } else {
          u_b.push('')
          i = i - 1
        }
      }
      for (let i = 0, j = 0; j < xAxis.length; i++, j++) {
        if (i === 0 || result_c.result[0].values[i][0] * 1000 - xAxis[j] === 0) {
          u_c.push(parseFloat(result_c.result[0].values[i][1]).toFixed(2))
        } else {
          u_c.push('')
          i = i - 1
        }
      }
      xAxis = xAxis.map(item => {
        return this.format(new Date(item), 'yyyy-MM-dd hh:00:00')
      })
      const series = [{
        name: 'A',
        color: this.color[0],
        areaStyle: {
          opacity: 0.1
        },
        data: u_a,
        type: 'line',
        smooth: true
      }, {
        name: 'B',
        color: this.color[1],
        areaStyle: {
          opacity: 0.1
        },
        data: u_b,
        type: 'line',
        smooth: true
      }, {
        name: 'C',
        color: this.color[2],
        areaStyle: {
          opacity: 0.1
        },
        data: u_c,
        type: 'line',
        smooth: true
      }]
      this.chartOption2.series = series
      this.chartOption2.legend.data = ['A', 'B', 'C']
      this.chartOption2.xAxis.data = xAxis
    },
    async getElectric() {
      const query_a = `avg(i_a < 500 )`
      const query_b = `avg(i_b < 500 )`
      const query_c = `avg(i_c < 500 )`
      const end = new Date(this.format(new Date(), 'yyyy-MM-dd hh:00:00')) / 1000
      const start = new Date(this.format(new Date(new Date() * 1 - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:00:00')) / 1000
      const step = '1h'
      const param_a = JSON.stringify({ query: query_a, end, start, step })
      const param_b = JSON.stringify({ query: query_b, end, start, step })
      const param_c = JSON.stringify({ query: query_c, end, start, step })
      const result_a = await this.queryRange(param_a)
      const result_b = await this.queryRange(param_b)
      const result_c = await this.queryRange(param_c)
      let xAxis = []; const i_a = []; const i_b = []; const i_c = []
      for (let i = 0, j = 0; i < result_a.result[0].values.length; i++, j++) {
        if (i === 0 || result_a.result[0].values[i][0] * 1000 - xAxis[j - 1] === 3600 * 1000) {
          xAxis.push(result_a.result[0].values[i][0] * 1000)
          i_a.push(parseFloat(result_a.result[0].values[i][1]).toFixed(2))
        } else {
          const x = xAxis[j - 1] + 3600000
          xAxis.push(x)
          i_a.push('')
          i = i - 1
        }
      }
      for (let i = 0, j = 0; j < xAxis.length; i++, j++) {
        if (i === 0 || result_b.result[0].values[i][0] * 1000 - xAxis[j] === 0) {
          i_b.push(parseFloat(result_b.result[0].values[i][1]).toFixed(2))
        } else {
          i_b.push('')
          i = i - 1
        }
      }
      for (let i = 0, j = 0; j < xAxis.length; i++, j++) {
        if (i === 0 || result_c.result[0].values[i][0] * 1000 - xAxis[j] === 0) {
          i_c.push(parseFloat(result_c.result[0].values[i][1]).toFixed(2))
        } else {
          i_c.push('')
          i = i - 1
        }
      }
      const series = [{
        name: 'A',
        color: this.color[0],
        areaStyle: {
          opacity: 0.1
        },
        data: i_a,
        type: 'line',
        smooth: true
      }, {
        name: 'B',
        color: this.color[1],
        areaStyle: {
          opacity: 0.1
        },
        data: i_b,
        type: 'line',
        smooth: true
      }, {
        name: 'C',
        color: this.color[2],
        areaStyle: {
          opacity: 0.1
        },
        data: i_c,
        type: 'line',
        smooth: true
      }]
      xAxis = xAxis.map(item => {
        return this.format(new Date(item), 'yyyy-MM-dd hh:00:00')
      })
      this.chartOption3.series = series
      this.chartOption3.legend.data = ['A', 'B', 'C']
      this.chartOption3.xAxis.data = xAxis
    },
    async getPhotovoltaic() {
      const query = `sum(delta(p_solar[1h]))`
      const end = new Date(this.format(new Date(), 'yyyy-MM-dd hh:00:00')) / 1000
      const start = new Date(this.format(new Date(new Date() * 1 - 24 * 60 * 60 * 1000), 'yyyy-MM-dd hh:00:00')) / 1000
      const step = '1h'
      const param = JSON.stringify({ query, end, start, step })
      const result = await this.queryRange(param)
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
          type: 'bar',
          smooth: true,
          opacity: 0.1
        })
        xAxis = xList
      }
      xAxis = xAxis.map(item => {
        return this.format(new Date(item * 1000), 'yyyy-MM-dd hh:00:00')
      })
      this.chartOption5.series = series
      this.chartOption5.legend.data = legend
      this.chartOption5.xAxis.data = xAxis
    },
    queryRange(param) {
      return this.$http.post('/api/adminDevice/prom/queryRange', param).then(res => {
        return res
      })
    },
    getThisMonth() {
      const day = 24 * 3600 * 1000
      let time = new Date()
      time = new Date(time - (time % day))
      time.setDate(1)
      const start = time * 1
      time.setMonth(time.getMonth() + 1)
      const end = time * 1
      const d = (end - start) / day
      time = end / 1000
      const query = `max(delta(p_active_energy{roomId="${this.roomId}"}[${d}d]))`
      const param = JSON.stringify({ query, time })
      this.$http.post('/api/adminDevice/prom/query', param).then(res => {
        this.thisMonth = res.result[0].value[1]
      })
    },
    async getToday2() {
      const query = `p_solar`
      const time = new Date()
      const param = JSON.stringify({ query, time })
      const result = await this.getProm(param)
      this.today2 = result
    },
    changeScreen(src) {
      this.src = src
    },
    closeScreen() {
      this.src = ''
    },
    async getAmmeter() {
      const query = `(p_active_energy{roomId=~"${this.roomId}"}) > 0`
      const end = new Date() * 1 / 1000
      const start = (new Date() * 1 - 24 * 60 * 60 * 1000) / 1000
      const step = '1h'
      const param = JSON.stringify({ query, end, start, step })
      const result = await this.queryRange(param)
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
      this.chartOption4.series = series
      this.chartOption4.legend.data = legend
      this.chartOption4.xAxis.data = xAxis
    },
    async getWarning() {
      const query = `count(ALERTS{roomId=~"${this.roomId}"})`
      const time = new Date()
      const param = JSON.stringify({ query, time })
      const result = await this.getProm(param)
      this.warning = result
    },
    toWarning() {
      if (this.warning > 0) {
        this.$router.push('/alertRecord/index')
      }
    },
    async getElectricSupply() {
      let time = new Date()

      const now = new Date(new Date() - (new Date() % (1000))) * 1 / 1000 // 当前分钟
      time = new Date(time - (time % (24 * 60 * 60 * 1000))) * 1 / 1000 // 当天
      const query1 = `(delta(p_active_energy{roomId="${this.roomId}"}[${now - time - 120}s])) > 0 < 8000`
      const query2 = `(delta(p_active_energy{roomId="${this.roomId}"}[${now - time - 60}s])) > 0 < 8000`
      const param1 = JSON.stringify({ query: query1, time: now - 120 })
      const param2 = JSON.stringify({ query: query2, time: now - 60 })
      var max = 0; var max2 = 0
      var min = 1000000000; var min2 = 1000000000
      await this.$http.post('/api/adminDevice/prom/query', param1).then(res => {
        for (let i = 0; i < res.result.length; i++) {
          if (res.result[i].value[1] > max) max = res.result[i].value[1]
          if (res.result[i].value[1] < min) min = res.result[i].value[1]
        }
        this.grid1[0].value = parseFloat(max).toFixed(2)
        this.grid2[0].value = parseFloat(min).toFixed(2)
      })
      await this.$http.post('/api/adminDevice/prom/query', param2).then(res => {
        for (let i = 0; i < res.result.length; i++) {
          if (res.result[i].value[1] > max2) max2 = res.result[i].value[1]
          if (res.result[i].value[1] < min2) min2 = res.result[i].value[1]
        }
      })
      // 市电
      this.delta1 = Math.abs(parseFloat(max2) - parseFloat(max))
      // 机房
      this.delta2 = Math.abs(parseFloat(min2) - parseFloat(min))
    },
    async getTodayPhotovoltaic() {
      let time = new Date()
      const now = new Date(time - (time % (60 * 1000))) * 1 / 1000 // 今日
      time = new Date(time - (time % (24 * 60 * 60 * 1000))) * 1 / 1000 // 今日
      const query1 = `sum(delta(p_solar[${now - time - 120}s]))`
      const query2 = `sum(delta(p_solar[${now - time - 60}s]))`
      const param1 = JSON.stringify({ query: query1, time: (now - 120) })
      const param2 = JSON.stringify({ query: query2, time: now - 60 })
      const result1 = await this.getProm(param1)
      const result2 = await this.getProm(param2)
      this.grid1[1].value = parseFloat(result1).toFixed(0)
      this.today2 = parseFloat(result1).toFixed(2)
      this.delta3 = result2 - result1
    },
    async getWeatherInfo() {
      const query_weather = `openweather_currentconditions{location="${this.orgName}"}`
      const query_T = `openweather_temperature{location="${this.orgName}"}`
      const query_cloud = `openweather_cloudiness{location="${this.orgName}"}`
      const query_speed = `openweather_windspeed{location="${this.orgName}"}`
      const query_direction = `openweather_winddegree{location="${this.orgName}"}`
      const time = new Date()
      const param_weather = JSON.stringify({ query: query_weather, time })
      const param_T = JSON.stringify({ query: query_T, time })
      const param_cloud = JSON.stringify({ query: query_cloud, time })
      const param_speed = JSON.stringify({ query: query_speed, time })
      const param_direction = JSON.stringify({ query: query_direction, time })

      const result_T = await this.getProm(param_T)
      const result_cloud = await this.getProm(param_cloud)
      const result_speed = await this.getProm(param_speed)
      const result_direction = await this.getProm(param_direction)

      this.$http.post('/api/adminDevice/prom/query', param_weather).then(res => {
        this.weather = res?.result[0]?.metric.currentconditions
      })

      this.T = result_T
      this.cloud = result_cloud
      this.windSpeed = result_speed

      const arr = [[337.5, 360, '北', '↓'], [292.5, 337.5, '西北', '↘'], [247.5, 292.5, '西', '→'], [202.5, 247.5, '西南', '↗'], [157.5, 202.5, '南', '↑'], [112.5, 157.5, '东南', '↖'], [77.5, 112.5, '东', '←'], [22.5, 77.5, '东北', '↙'], [0, 22.5, '北', '↓']]
      const dir = arr.find(a => result_direction <= a[1])
      this.windDirection = dir[2] + dir[3]
    }
  }
}
</script>

<style lang='scss' scoped>
* {
  --main-bg-color: #9ad2fb;
}
.mainDashboard {
  min-height: 100vh;
}
.content {
  width: 100%;
}
.flex-1 {
  flex: 1;
}
.unit {
  font-size: 26px;
  display: flex;
  align-items: flex-end;
  height: 100%;
  padding-bottom: 15px;
  padding-left: 3px;
}
.line {
  display: flex;
  justify-content: space-around;
  .half {
    flex: 1;
    margin-right: 10px;
    &:nth-last-of-type(1) {
      margin-right: 0;
    }
  }
}

.humidity {
  font-family: Inter, Helvetica, Arial, sans-serif;
  font-size: 42px;
  padding-bottom: 10px;
}
.humidity::before {
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  content: "\f043";
  transform: scale(.7) translateX(-1px);
}
.temperature::before {
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  content: "\f2c7";
  transform: scale(.6) translateX(-1px);
}
.scrollbar {
  height: 240px;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
}
.title {
  font-size: 16px;
  height: 22px;
  line-height: 22px;
  font-weight: 500;
}
.showInfo {
  flex: 1;
  width: 100%;
  display: flex;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
  color: rgb(86, 166, 75);
  font-size: 78px;
  font-weight: 500;
}
.showInfo3 {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  color: rgb(86, 166, 75);
  font-size: 36px;
  height: 82px;
  font-weight: 500;
}
.showInfo2 {
  flex: 1;
  width: 100%;
  display: flex;
  padding-top: 10px;
  justify-content: center;
  align-items: center;
  color: rgb(86, 166, 75);
  font-size: 30px;
  height: 82px;
  font-weight: 500;
}
.flex-end {
  display: flex;
  align-items: flex-end;
}
.list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  & > * {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
  }
}
.clock {
  text-align: center;
  color: #000;
  padding-bottom: 10px;
}
.clock-time {
  color: #56a64b;
}
.el-main {
  padding: 15px;
}
.mainDashboard {
  background-color: var(--main-bg-color);
}
.chart {
  width:100%;
  height:180px
}
.fa-bell::before {
  animation: blinking 1s infinite;
  color: #f00;
  font-size: 22px;
}
@keyframes blinking {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.empty {
  width: 100%;
  color: #56a64b;
  font-size: 20px;
  padding: 25px;
}
.environment {
  padding-left: 6px;
}
.flex-center {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}
.cursor {
  cursor: pointer;
}
</style>
