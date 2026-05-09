<!--
告警消息策略
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
        <!-- <el-form-item label="通知渠道">
          <el-select v-model="queryForm.channel" class="query-form-item" clearable>
            <enum-option enum="alertMessageRoute.channel" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="状态">
          <el-select v-model="queryForm.routeStatus" clearable>
            <enum-option enum="alertMessageRoute.routeStatus" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="queryForm.userName" clearable />
        </el-form-item>
        <el-form-item label="设备">
          <el-input v-model="queryForm.deviceId" class="query-form-item" clearable />
        </el-form-item>
        <el-form-item label="告警等级">
          <el-select v-model="queryForm.alertLevel" clearable>
            <enum-option enum="alertRule.alertLevel" />
          </el-select>
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
      <template #action-new-line>
        <el-button v-permission="['alertMessageRoute.add']" type="primary" @click="addDialogVisible=true,dataForm={}">创建告警通知策略</el-button>
        <el-button v-permission="['alertMessageRoute.delete']" type="danger" @click="del">删除告警通知策略</el-button>
      </template>

      <template slot="table-body">
        <el-table-column type="selection" />
        <el-table-column type="index" label="NO" prop="id" />
        <el-table-column label="通知渠道" prop="channel" :formatter="$formatEnum('alertMessageRoute.channel')" />
        <el-table-column label="用户名" prop="userName" />
        <el-table-column label="设备" prop="deviceName" />
        <el-table-column label="是否包含子设备" prop="includeChild">
          <template #default="{ row }">
            {{ row.includeChild === 1 ? '是':'否' }}
          </template>
        </el-table-column>
        <el-table-column label="告警等级" prop="alertLevel" :formatter="$formatEnum('alertRule.alertLevel')" />
        <el-table-column label="状态" prop="routeStatus" :formatter="$formatEnum('alertMessageRoute.routeStatus')" />
        <el-table-column label="创建时间" prop="createTime" width="150" />
        <el-table-column :label="'操作'" width="300" fixed="right">
          <template #default="{ row }">
            <el-link v-if="row.routeStatus === 'ENABLE'" v-permission="['alertMessageRoute.updateStatus']" type="info" plain @click="updateStatus(row,'DISABLE')">停用</el-link>
            <el-link v-if="row.routeStatus === 'DISABLE'" v-permission="['alertMessageRoute.updateStatus']" type="info" plain @click="updateStatus(row,'ENABLE')">启用</el-link>
            <el-link v-permission="['alertMessageRoute.update']" type="info" plain @click="dataForm = {...row},addDialogVisible=true">编辑</el-link>
            <el-link v-permission="['alertMessageRoute.record']" type="info" plain @click="dataForm = {...row},noticeMessageDialogVisible=true">发送纪录</el-link>
          </template>
        </el-table-column>
      </template>
    </page-table>
    <AddAlertMessgeRouteDialog
      v-if="addDialogVisible"
      :prop-data-form="dataForm"
      @close="addDialogVisible=false"
      @done="$refs.pageTable.reload()"
    />
    <NoticeMessageDialog
      v-if="noticeMessageDialogVisible"
      :prop-data-form="dataForm"
      @close="noticeMessageDialogVisible=false"
    />
  </div>

</template>

<script>
import AddAlertMessgeRouteDialog from './components/AddAlertMessgeRouteDialog.vue'
import NoticeMessageDialog from './components/NoticeMessageDialog.vue'
export default {
  components: { AddAlertMessgeRouteDialog, NoticeMessageDialog },
  props: {},
  data() {
    return {
      noticeMessageDialogVisible: false,
      addDialogVisible: false,
      queryForm: {},
      parent: {},
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
      return this.$http.getParam('/adminAlert/listAlertMessageRoute', { ...param, ...this.queryForm })
    },

    /**
     * 删除
     */
    async del() {
      const selection = await this.$refs.pageTable.getSelection()
      const ids = selection.map(row => row.id)
      this.loading = true
      await this.$confirm(`确认操作`)
      await this.$http.post('adminAlert/deleteAlertMessageRoute', ids)
      this.$success('操作成功')
      this.$refs.pageTable.reload()
    },
    /**
     * 更新状态
     */
    async updateStatus(row, routeStatus) {
      let ids = []
      if (row) {
        ids = [row.id]
      } else {
        ids = await this.$refs.pageTable.getSelection().then(row => row.id)
      }
      this.loading = true
      await this.$http.post('adminAlert/updateAlertMessageRouteStatus', { ids, routeStatus })
      this.$success('操作成功')
      this.$refs.pageTable.reload()
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
