<template>
  <div class="bottom-table common-shadow">
    <div class="title">巡查点列表</div>
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
        <el-table-column label="巡检点名称" prop="pointName" />
        <el-table-column label="巡检点状态" prop="pointStatus" :formatter="$formatEnum('patrolTask.taskStatus')" />
        <el-table-column label="巡检内容描述" prop="pointContent" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="所属构筑物" prop="patrolBuildId" width="200px">
          <template #default="{row}">
            {{ buildSelect.find(item => item.id === row.patrolBuildId)? buildSelect.find(item => item.id === row.patrolBuildId).buildName : '' }}
          </template>
        </el-table-column>
        <el-table-column label="所属机构" prop="orgId" width="200px">
          <template #default="{row}">
            {{ orgSelect.find(item => item.id === row.orgId) ? orgSelect.find(item => item.id === row.orgId).orgName : '' }}
          </template>
        </el-table-column>
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
        <!-- <el-table-column :label="'启用情况'" width="120">
          <template>
            <el-switch active-color="#13ce66" inactive-color="#ff4949" />
          </template>
        </el-table-column> -->
        <el-table-column :label="'操作'" width="300">
          <template #default="{row}">
            <el-button type="danger" @click="deleteRow(row)">删除</el-button>
            <el-button type="primary" @click="openDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </page-table>
    <dialogMission :show.sync="dialogVisibleMission" :is-edit="isEdit" :current-row="currentRow" @reload="$refs.pageTable.reload()" />
    <dialogManaulCheck :show.sync="dialogVisibleManual" @reload="$refs.pageTable.reload()" />
  </div>
</template>
<script>
import dialogMission from '../../commonDialog/dialogMission.vue'
import dialogManaulCheck from '../../commonDialog/dialogManaulCheck.vue'
import { downloadFile } from '@/utils'
export default {
  components: {
    dialogMission,
    dialogManaulCheck
  },
  data() {
    return {
      queryForm: {},
      selection: [],
      dialogVisibleMission: false,
      isEdit: false,
      currentRow: {},
      dialogVisibleManual: false,
      orgSelect: [],
      buildSelect: []
    }
  },
  created() {
    this.getSelectData()
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/patrol/getPatrolPointVoIPage', { ...param, ...this.queryForm })
    },
    deleteRow(row) {
      if (row.id) {
        this.$confirm('确定删除该巡查点？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.post('/patrol/batchDelPatrolBuildVo', { patrolBuildVoList: this.selection.map(item => { return { id: item.id } }) }).then(res => {
          this.$http.post('/patrol/batchDelPatrolPointVo', { patrolPointVoList: [{ id: row.id }] }).then(res => {
            this.$message.success('删除成功')
            this.$refs.pageTable.reload()
          })
        })
      } else {
        this.$message.info('请选择至少一条数据')
      }
    },
    openDialog(row) {
      this.$router.replace({ path: this.$route.path, query: { index: 3, isEdit: true, ...row }})
    },
    download(item) {
      downloadFile(item.code, item.fileName)
    },
    openDialogManual() {
      this.dialogVisibleManual = true
    },
    getSelectData() {
      this.$http.getParam('/user/getOrganizationVoList', { size: 5000 }).then(res => {
        this.orgSelect = res.records
      })
      this.$http.getParam('/patrol/getPatrolBuildVoIPage', { size: 5000 }).then(res => {
        this.buildSelect = res.records
      })
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
