<!--
  消息纪录
-->
<template>

  <el-dialog title="消息纪录" :visible="true" append-to-body @close="$emit('close')">
    <page-table
      ref="pageTable"
      :query="query"
      :selection.sync="selection"
      @reset="queryForm={}"
    >

      <template #query-form>
        <el-form-item label="用户名">
          <el-input v-model="queryForm.userName" class="query-form-item" clearable />
        </el-form-item>

        <el-form-item :label="'创建时间'">
          <date-range-picker
            :start.sync="queryForm.createTimeStart"
            :end.sync="queryForm.createTimeEnd"
            :start-placeholder="'创建开始时间'"
            :end-placeholder="'创建结束时间'"
          />
        </el-form-item>
      </template>

      <template slot="table-body">
        <el-table-column type="selection" />
        <el-table-column type="index" label="NO" prop="id" />
        <el-table-column label="用户" prop="userName" />
        <el-table-column label="设备" prop="deviceName" />
        <el-table-column label="机构" prop="orgName" width="200" />

        <el-table-column label="消息内容" prop="message" width="250" />
        <el-table-column label="告警等级" prop="alertLevel" :formatter="(row, col, val)=>$formatEnum('alertRule.alertLevel',val).apply(null,[row, col, val])" />
        <el-table-column label="状态" prop="messageStatus" :formatter="$formatEnum('noticeMessage.messageStatus')" width="80" />

        <el-table-column label="渠道" prop="channel" :formatter="$formatEnum('alertMessageRoute.channel')" width="50" />
        <el-table-column label="标识" prop="channelId" />
        <el-table-column label="发送时间" prop="alertTime" width="150" />
        <el-table-column label="告警时间" prop="alertTime" width="150" />
        <el-table-column label="创建时间" prop="createTime" width="150" />
      </template>
    </page-table>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="$emit('close'),$emit('done',{ selection})">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    propDataForm: Object
  },
  data() {
    return {
      loading: false,
      queryForm: {},
      selection: []
    }
  },

  mounted() {
    this.query()
  },
  methods: {
    /**
     * 列表查询
     */
    query(param = {}) {
      param = { ...param, alertMessageRouteId: this.propDataForm.id }
      return this.$http.getParam('/adminNotice/listNoticeMessage', { ...param, ...this.queryForm })
    }
  }
}
</script>

<style>

</style>
