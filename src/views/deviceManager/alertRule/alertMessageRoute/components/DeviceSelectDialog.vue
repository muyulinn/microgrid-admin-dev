<template>

  <el-dialog
    width="80%"
    title="选择设备"
    :visible="true"
    append-to-body
    @close="$emit('close')"
  >
    <el-row style="display: flex;">
      <el-col :span="3" class="common-shadow" style="margin-right: 10px; padding: 10px;">
        <RoomTree :show-child="true" @selectNode="clickTree" />
      </el-col>
      <el-col :span="21">
        <page-table
          ref="pageTable"
          :query="query"
          :selection.sync="selection"
          @reset="queryForm = {}"
        >
          <template #query-form>
            <el-form-item label="设备名称">
              <el-input v-model="queryForm.deviceName" class="query-form-item" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="queryForm.deviceStatus" clearable>
                <enum-option enum="deviceInfo.deviceStatus" />
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="queryForm.deviceType" clearable>
                <enum-option enum="deviceInfo.deviceType" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备UUID">
              <el-input v-model="queryForm.deviceUuid" class="query-form-item" clearable />
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
            <el-table-column type="index" label="NO" prop="id" />
            <el-table-column label="名称" prop="deviceName" />
            <el-table-column label="uuid" prop="deviceUuid" width="260" />
            <el-table-column label="型号" prop="deviceMode" />
            <el-table-column label="标签" prop="deviceLabel" />
            <el-table-column label="所属机构" prop="orgName" width="120" />
            <el-table-column label="状态" prop="deviceStatus" :formatter="$formatEnum('deviceInfo.deviceStatus')" />
            <el-table-column label="类型" prop="deviceType" :formatter="(row, col, val)=>$formatEnum('deviceInfo.deviceType',val).apply(null,[row, col, val])" />
            <el-table-column label="创建时间" prop="createTime" width="160" />
          </template>
        </page-table>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="selected">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RoomTree from '../../components/RoomTree.vue'
export default {
  components: { RoomTree },
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
      return this.$http.getParam('/adminDevice/page', { ...param, ...this.queryForm })
    },
    /**
     * 点击树进行过滤查询
     * @param {*} data
     */
    clickTree(data) {
      if (!data.id) {
        this.queryForm = { ...this.queryForm, parentId: null, includeChild: null }
      } else {
        this.queryForm = { ...this.queryForm, parentId: data.id, includeChild: 1 }
      }
      this.$refs.pageTable.reload()
    },
    /**
     * 确定选中
     */
    async selected() {
      await this.$refs.pageTable.checkSelection('只能选一行', 1, 1)
      this.$emit('close')
      this.$emit('done', this.selection[0])
    }
  }
}
</script>

<style>

</style>
