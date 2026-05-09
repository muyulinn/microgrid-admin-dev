<!--
设备实时告警事件
by lcs
-->
<template>
  <page-table
    ref="pageTable"
    :query="query"
    :show-page="false"
    @reset="queryForm = {}"
  >
    <template slot="table-body">
      <el-table-column type="index" label="NO" prop="id" />
      <el-table-column label="告警类别名称" prop="alertRuleName" />
      <el-table-column label="设备名" prop="deviceName" />
      <el-table-column label="消息" prop="message" />
      <el-table-column label="告警等级" prop="alertLevel" :formatter="(row, col, val)=>$formatEnum('alertRule.alertLevel',val).apply(null,[row, col, val])" />
      <!-- <el-table-column label="状态" prop="recordStatus" :formatter="(row, col, val)=>$formatEnum('alertRecord.recordStatus',val).apply(null,[row, col, val])" /> -->
      <el-table-column label="告警时间" prop="alertTime" width="150" />
      <!-- <el-table-column label="创建结束" prop="alertEndTime" width="150" /> -->
    </template>
  </page-table>
</template>

<script>
export default {
  props: {
    propDataForm: {
      type: Object,
      default: () => null
    },
    dataFilter: {
      type: Function,
      default: () => () => true
    }
  },
  methods: {
    query() {
      const roomIds = [this.propDataForm.roomId]
      const deviceIds = [this.propDataForm.id]
      return this.$http.getParam('/adminAlert/getDeviceAlert', { roomIds, deviceIds }).then(records => ({ records: records.filter(this.dataFilter) }))
    }
  }

}
</script>

<style>

</style>
