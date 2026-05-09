<template>
  <div class="bottom-table common-shadow">
    <div class="title">构建物列表</div>
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
        <el-table-column type="index" label="NO" prop="id" />
        <el-table-column label="构筑物ID" prop="buildCode" />
        <el-table-column label="构筑物名称" prop="buildName" />
        <el-table-column label="所属机构" prop="orgId" :formatter="orgFormatter" />
        <el-table-column label="创建人" prop="createBy" />
        <el-table-column label="创建日期" prop="createTime" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column :label="'操作'" width="300">
          <template #default="{row}">
            <el-button type="danger" @click="deleteRow(row)">删除</el-button>
            <el-button type="primary" @click="openDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </page-table>
    <dialogConstruct :show.sync="dialogVisibleConstrcut" :is-edit="isEdit" :current-row="currentRow" :org-select="orgSelect" @reload="$refs.pageTable.reload()" />
  </div>
</template>
<script>
import dialogConstruct from '../../commonDialog/dialogConstruct.vue'
export default {
  components: {
    dialogConstruct
  },
  data() {
    return {
      queryForm: {},
      selection: [],
      dialogVisibleConstrcut: false,
      isEdit: false,
      currentRow: {},
      orgSelect: []
    }
  },
  created() {
    this.$http.getParam('/user/getOrganizationVoList', { size: 5000 }).then(res => {
      this.orgSelect = res.records
    })
  },
  methods: {
    orgFormatter(row) {
      return this.orgSelect.find(item => item.id === row.orgId).orgName
    },
    query(param = {}) {
      return this.$http.getParam('/patrol/getPatrolBuildVoIPage', { ...param, ...this.queryForm })
    },
    deleteRow(row) {
      if (row.id) {
        this.$confirm('确定删除该构建物？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.post('/patrol/batchDelPatrolBuildVo', { patrolBuildVoList: this.selection.map(item => { return { id: item.id } }) }).then(res => {
          this.$http.post('/patrol/batchDelPatrolBuildVo', { patrolBuildVoList: [{ id: row.id }] }).then(res => {
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
      this.dialogVisibleConstrcut = true
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
