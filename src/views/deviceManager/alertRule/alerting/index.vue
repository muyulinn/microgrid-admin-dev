<!--
告警记录
-->
<template>
  <div v-loading="loading" class="zs-container common-shadow common-list" style="padding: 15px 10px ; ">
    <el-row style="display: flex;">
      <el-col :span="3" class="common-shadow" style="margin-right: 10px; padding: 10px; ">
        <RoomTree :show-child="true" @selectNode="selectRoom" />
      </el-col>
      <el-col :span="21">
        <page-table
          ref="pageTable"
          :query="query"
          :show-page="false"
          :selection.sync="selection"
          @reset="queryForm = {}"
        >
          <!-- <template #query-form>
            <el-form-item label="告警类别名称">
              <el-input v-model="queryForm.alertRuleName" class="query-form-item" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="queryForm.recordStatus" clearable>
                <enum-option enum="alertRecord.recordStatus" />
              </el-select>
            </el-form-item>
            <el-form-item label="告警等级">
              <el-select v-model="queryForm.alertLevelList" clearable multiple>
                <enum-option enum="alertRule.alertLevel" />
              </el-select>
            </el-form-item>
            <el-form-item :label="'创建时间'">
              <date-range-picker
                :start.sync="queryForm.alertTimeStart"
                :end.sync="queryForm.alertTimeEnd"
                :start-placeholder="'创建开始时间'"
                :end-placeholder="'创建结束时间'"
              />
            </el-form-item>
          </template> -->
          <template #action-new-line>
            <!-- <el-button type="success" @click="handle()">批量标记为已处理</el-button> -->
          </template>

          <template slot="table-body">
            <el-table-column type="selection" />
            <el-table-column type="index" label="NO" prop="id" />
            <el-table-column label="告警类别名称" prop="alertRuleName" />
            <el-table-column label="设备" prop="deviceName" />
            <el-table-column label="消息" prop="message" />
            <el-table-column label="告警等级" prop="alertLevel" :formatter="(row, col, val)=>$formatEnum('alertRule.alertLevel',val).apply(null,[row, col, val])" />
            <el-table-column label="告警时间" prop="alertTime" width="150" />
            <el-table-column label="创建时间" prop="createTime" width="150" />
            <!-- <el-table-column :label="'操作'" width="300" fixed="right">
          <template #default="{ row }">
            <el-link type="info" plain @click="handle(row.id)">标记处理</el-link>
          </template>
        </el-table-column> -->
          </template>
        </page-table>
      </el-col>
    </el-row></div>
</template>

<script>
import RoomTree from '../components/RoomTree.vue'
export default {
  components: { RoomTree },
  props: {},
  data() {
    return {
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
    async query() {
      let roomIds = []
      let deviceIds = []
      if (this.parent && this.parent.id) {
        roomIds = [this.parent.treePath.match(/^\d+/)[0] * 1]
        if (roomIds[0] !== this.parent.id) {
          deviceIds = await this.$http.getParam('/adminDevice/page', { size: 100, parentId: this.parent.id, id: this.parent.id, includeChild: 1 }).then(json => json.records.map(a => a.id))
        }
        // if (roomIds[0] === deviceIds[0]) {
        //   deviceIds.pop()
        // }
      } else {
        roomIds = await this.$http.getParam('/adminDevice/page', { size: 100, deviceType: 'ROOM' }).then(json => json.records.map(a => a.id))
      }

      const records = await this.$http.getParam('/adminAlert/getDeviceAlert', { roomIds, deviceIds })
      return { records }
    },

    selectRoom(data) {
      this.parent = data
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
