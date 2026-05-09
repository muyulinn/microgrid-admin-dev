<!--
告警规则
-->

<template>
  <div v-loading="loading" class="zs-container common-shadow common-list" style="padding: 15px 10px ; ">
    <el-row style="display: flex;">
      <el-col :span="3" class="common-shadow" style="margin-right: 10px; padding: 10px; ">
        <RoomTree @selectNode="clickTree" />
      </el-col>
      <el-col>
        <page-table
          ref="pageTable"
          :query="query"
          :selection.sync="selection"
          @reset="queryForm = {}"
        >
          <template #query-form>
            <el-form-item label="名称">
              <el-input v-model="queryForm.alertName" class="query-form-item" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="queryForm.alertStatus" clearable>
                <enum-option enum="alertRule.alertStatus" />
              </el-select>
            </el-form-item>
            <el-form-item label="告警等级">
              <el-select v-model="queryForm.alertLevel" clearable>
                <enum-option :data="$store.getters.enumData.alertRule.alertLevel.filter(a=>a.val!== 'L0')" />
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
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="roomId?(dataForm = { roomId} ,addDialogVisible = true):$message({ message:'请选择一个机房' })">添加</el-button>
            <el-button type="danger" icon="el-icon-refresh" @click="batchDelete">删除</el-button>
          </template>

          <template slot="table-body">
            <el-table-column type="selection" />
            <el-table-column type="index" label="NO" prop="id" />
            <el-table-column label="名称" prop="alertRuleName" />
            <el-table-column label="告警等级" prop="alertLevel" :formatter="$formatEnum('alertRule.alertLevel')" />
            <el-table-column label="状态" prop="alertStatus" :formatter="$formatEnum('alertRule.alertStatus')" />
            <el-table-column label="排序" prop="sortNum" />
            <el-table-column label="创建时间" prop="createTime" width="150" />
            <el-table-column :label="'操作'" width="300" fixed="right">
              <template #default="{ row }">
                <el-link type="info" plain @click="(dataForm = {...row}), (detailDialogVisible = true)">查看</el-link>
                <el-link type="info" plain @click="dataForm = {...row } ,addDialogVisible = true">编辑</el-link>
                <el-link type="info" plain @click="dataForm = {...row,id:null,alertName:row.alertName+' copy' } ,addDialogVisible = true">复制</el-link>
                <el-link v-if="row.alertStatus === 'ENABLE'" type="info" plain @click="updateStatus(row,'DISABLE')">停用</el-link>
                <el-link v-if="row.alertStatus === 'DISABLE'" type="info" plain @click="updateStatus(row,'ENABLE')">启用</el-link>
              </template>
            </el-table-column>
          </template>
        </page-table>
      </el-col>
    </el-row>

    <AddAlertRuleDialog
      v-if="addDialogVisible"
      :prop-data-form="dataForm"
      @close="addDialogVisible=false"
      @done="$refs.pageTable.reload()"
    />
    <AlertRuleDetailDialog
      v-if="detailDialogVisible"
      :prop-data-form="dataForm"
      :room-id="roomId"
      @close="detailDialogVisible=false"
      @done="$refs.pageTable.reload()"
    />

  </div>
</template>

<script>
import AddAlertRuleDialog from './components/AddAlertRuleDialog.vue'
import AlertRuleDetailDialog from './components/AlertRuleDetailDialog.vue'
import RoomTree from './components/RoomTree.vue'

export default {
  components: { AddAlertRuleDialog, AlertRuleDetailDialog, RoomTree },
  data() {
    return {
      addDialogVisible: false,
      detailDialogVisible: false,
      queryForm: {},
      loading: false,
      selection: [],
      roomId: null,
      roomName: null
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
    async query(param = {}) {
      if (!this.roomId) return {}
      return this.$http.getParam('/adminAlert/listAlertRule', { roomId: this.roomId, ...param, ...this.queryForm })
    },
    /**
     * 点击树进行过滤查询
     * @param {*} data
     */
    clickTree(data) {
      this.roomId = data.id
      this.roomName = data.deviceName
      this.$refs.pageTable.reload()
    },

    /**
     * 批量删除
     */
    async batchDelete() {
      await this.$refs.pageTable.checkSelection()
      this.loading = true
      const ids = this.selection.map(i => i.id)
      await this.$confirm(`确认操作`)
      await this.$http.post('adminAlert/deleteAlertRules', ids)
      this.$success('操作成功')
      this.$refs.pageTable.reload()
    },
    /**
     * 更新状态
     * @param {*} row
     */
    async updateStatus(row, alertStatus) {
      this.loading = true
      await this.$http.post('adminAlert/updateAlertRule', { ...row, alertStatus })
      this.$success('操作成功')
      this.$refs.pageTable.reload()
    },

    /**
     * 异步方法结束统一处理
     */
    _finallyHandle() {
      setTimeout(() => {
        this.loading = false
      }, 1000)
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
