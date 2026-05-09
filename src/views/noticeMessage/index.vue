<!--
  通知消息
-->
<template>
  <div v-loading="loading" class="zs-container common-shadow common-list" style="padding: 15px 10px ; ">
    <page-table
      ref="pageTable"
      :query="query"
      :selection.sync="selection"
      @reset="queryForm = {}"
    >
      <template #query-form>
        <el-form-item label="用户">
          <el-input v-model="queryForm.userName" class="query-form-item" clearable />
        </el-form-item>

        <el-form-item label="设备">
          <el-input v-model="queryForm.deviceName" class="query-form-item" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.messageStatus" clearable>
            <enum-option enum="noticeMessage.messageStatus" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警等级">
          <el-select v-model="queryForm.alertLevel" clearable>
            <enum-option enum="alertRule.alertLevel" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="渠道">
          <el-select v-model="queryForm.channel" clearable>
            <enum-option enum="alertMessageRoute.channel" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="渠道标识">
          <el-input v-model="queryForm.channelId" class="query-form-item" clearable />
        </el-form-item>

        <el-form-item :label="'创建时间'">
          <date-range-picker
            :start.sync="queryForm.createTimeEnd"
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

  </div>
</template>

<script>
export default {
  components: { },
  props: {},
  data() {
    return {
      queryForm: {},
      loading: false,
      selection: []

    }
  },

  created() {},
  mounted() {
    this.query()
  },
  methods: {
    /**
     * 列表查询
     */
    query(param = {}) {
      return this.$http.getParam('/adminNotice/listNoticeMessage', { ...param, ...this.queryForm })
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

<style lang="scss" scoped>
.zs-container{
  ::v-deep {
    .el-table{
      overflow-y: scroll; height: calc(100vh - 320px);
    }
  }
}
</style>

