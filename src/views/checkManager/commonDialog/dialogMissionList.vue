<template>
  <div class="dialog-box">
    <el-dialog title="添加任务" :visible.sync="show" :modal-append-to-body="false" :before-close="cancel">
      <page-table
        ref="pageTable"
        :query="query"
        :selection.sync="selection"
        @reset="queryForm={}"
      >
        <template #query-form>
        <!-- <el-form-item label="巡检计划">
            <el-input v-model="queryForm.roleName" />
          </el-form-item> -->
        </template>
        <template #action-new-line>
        <!-- <el-button type="primary" icon="el-icon-circle-plus-outline">添加角色</el-button> -->
        </template>
        <template slot="table-body">
          <el-table-column type="selection" width="55" />
          <el-table-column label="任务ID" prop="taskCode" />
          <el-table-column label="任务名称" prop="taskName" />
          <el-table-column label="预计时间（分钟）" prop="taskMinute" />
          <el-table-column label="创建人" prop="createBy" />
          <el-table-column label="任务描述" prop="taskContent" width="200px" />
          <el-table-column label="创建日期" prop="createTime" width="150" />
          <el-table-column :label="'启用情况'" width="120">
            <!-- <template #default="{row}"> -->
            <template>
              <el-switch active-color="#13ce66" inactive-color="#ff4949" />
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" />
          <el-table-column :label="'操作'" width="300">
            <template #default="{row}">
              <el-button type="danger" @click="deleteRow(row)">删除</el-button>
              <el-button type="primary" @click="openDialog(row)">编辑</el-button>
            </template>
          </el-table-column>
        </template>
      </page-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancel">取消</el-button>
        <el-button type="primary" size="medium" @click="confirm">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {},
      queryForm: {},
      selection: []
    }
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/patrol/getPatrolTaskVoIPage', { ...param, ...this.queryForm })
    },
    cancel() {
      this.$emit('update:show', false)
    },
    confirm() {
      this.$emit('getChosenLine', this.selection)
      this.$emit('update:show', false)
    }
  }
}
</script>
