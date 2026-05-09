<!--
设备告警记录
by lcs
-->
<template>
  <page-table ref="pageTable" :query="query">
    <template slot="table-body">
      <el-table-column type="index" label="NO" prop="id" />
      <el-table-column label="告警类别名称" prop="alertRuleName" />
      <el-table-column label="设备名" prop="deviceName" />
      <el-table-column label="消息" prop="message" />
      <el-table-column label="告警等级" prop="alertLevel" :formatter="(row, col, val)=>$formatEnum('alertRule.alertLevel',val).apply(null,[row, col, val])" />
      <el-table-column label="告警开始" prop="alertTime" width="150" />
      <el-table-column label="告警结束" prop="alertEndTime" width="150" />
    </template>
  </page-table>
</template>

<script>
export default {
  props: {
    deviceId: {
      type: Number,
      default: () => null
    },
    queryForm: {
      type: Object,
      default: () => null
    }

  },
  methods: {
    query(param = {}) {
      param.deviceId = this.deviceId
      return this.$http.getParam('/adminAlert/listAlertRecord', { ...param, ...this.queryForm, recordStatus: 'RESOLVED' })
    }
  }
}
</script>

<style>

</style>
