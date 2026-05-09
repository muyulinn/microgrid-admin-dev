<!--
设备实时读数
by lcs
-->

<template>
  <div>
    <template v-if="hasData">
      <el-descriptions v-loading="loading" :title="title" class="margin-top" :column="4" border>
        <template slot="extra">
          <el-button type="primary" icon="el-icon-refresh" @click="query">刷新</el-button>
        </template>
        <el-descriptions-item v-for="(item,index) in list" :key="index" :label="item.label">
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </template>
    <template v-else>
      <h5 style="text-align: center;color: #909399;">
        暂无数据
      </h5>
      <div class="center">
        <el-button type="primary" icon="el-icon-refresh" @click="query">刷新</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {

  props: {
    dataForm: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      deviceAttribute: [],
      title: ''
    }
  },
  computed: {
    hasData() {
      return this.list.length > 0
    }
  },
  async mounted() {
    const roomId = this.dataForm.treePath.match(/^\d+/)[0]
    this.deviceAttribute = await this.$http.getParam('/adminDevice/deviceAttribute', { deviceId: roomId }) || []
    this.query()
  },

  methods: {
    async query() {
      this.loading = true
      const deviceId = this.dataForm.id
      let list = await this.$http.post('adminDevice/prom/query', { query: `{deviceId="${deviceId}"}` }).then(res => res.result)
      list = list.filter(item => !/^ALERT/.test(item.metric.__name__))
      if (!list || list.length === 0) {
        return
      }
      this.list = list.map(item => {
        const index = this.deviceAttribute.findIndex(({ key }) => key === item.metric.__name__)
        const attr = this.deviceAttribute[index] || {}
        const label = attr.keyName || item.metric.__name__
        let value = '--'
        if (item.values && item.values.length > 0) {
          value = `${item.values[0][1]} ${attr.unit || ''}`
        }
        if (item.value) {
          value = `${item.value[1]} ${attr.unit || ''}`
        }
        return { label, value, sortNum: index }
      }).sort((a, b) => a.sortNum - b.sortNum)
      this.title = list.map(a => a.value[0]).sort().map(ts => parseTime(ts * 1000, '读数时间：{y}-{m}-{d} {h}:{i}')).pop()
    },
    /**
     * 异步方法结束统一处理
     */
    _finallyHandle() {
      this.loading = false
    }
  }

}
</script>
<style lang="less" scoped>
.center{
  display: flex;
  justify-content: center;
}
</style>
