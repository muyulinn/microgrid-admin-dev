<template>
  <div class="bottom-table common-shadow">
    <div class="title">任务列表</div>
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
        <el-table-column label="操作手册" prop="operationBook" width="200px">
          <template #default="{row}">
            <div style="cursor:pointer">
              <div v-if="row.operationBook" class="download-box">
                <div v-for="(item,index) in JSON.parse(row.operationBook)" :key="index" class="item" @click="download(item)">
                  <img src="@/assets/jiahua/download.png" alt="" class="download-pic">
                  <span>{{ item.fileName }}</span>
                </div>
              </div>
              <span v-else>无</span>
            </div>
          </template>
        </el-table-column>
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
    <dialogMission :show.sync="dialogVisibleMission" :is-edit="isEdit" :current-row="currentRow" @reload="$refs.pageTable.reload()" />
  </div>
</template>
<script>
import dialogMission from '../../commonDialog/dialogMission.vue'
import { downloadFile } from '@/utils'
export default {
  components: {
    dialogMission
  },
  data() {
    return {
      queryForm: {},
      selection: [],
      dialogVisibleMission: false,
      isEdit: false,
      currentRow: {}
    }
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/patrol/getPatrolTaskVoIPage', { ...param, ...this.queryForm })
    },
    deleteRow(row) {
      if (row.id) {
        this.$confirm('确定删除该任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.post('/patrol/batchDelPatrolBuildVo', { patrolBuildVoList: this.selection.map(item => { return { id: item.id } }) }).then(res => {
          this.$http.post('/patrol/batchDelPatrolTaskVo', { patrolTaskVoList: [{ id: row.id }] }).then(res => {
            this.$message.success('删除成功')
            this.$refs.pageTable.reload()
          })
        })
      } else {
        this.$message.info('请选择至少一条数据')
      }
    },
    openDialog(row) {
      this.isEdit = false
      if (row && row.id) {
        this.isEdit = true
        this.currentRow = row
      }
      this.dialogVisibleMission = true
    },
    download(item) {
      downloadFile(item.code, item.fileName)
    }
  }
}
</script>
<style lang="less" scoped>
.bottom-table {
  margin-top: 12px;
  min-height: calc(100% - 35px);
  margin-bottom: 3px;
  overflow: hidden;
  padding: 0 6px;
}
.title {
  font-weight: bold;
  color: #101010;
  margin: 10px 0;
}
</style>
