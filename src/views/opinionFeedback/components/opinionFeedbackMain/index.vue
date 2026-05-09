<template>
  <div class="bottom-table common-shadow">
    <div class="title">意见反馈</div>
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
        <el-table-column label="用户登录手机号" prop="memberPhone" />
        <el-table-column label="意见内容" prop="fbContent" />
        <el-table-column label="意见图片" prop="fbImg">
          <template #default="{row}">
            <div v-if="row.fbImg">
              <fs-img v-for="(item,index) in row.fbImg.split(',')" :key="index" :code="item" alt="" style="width: 60px;height:60px" />
            </div>
            <div v-else>暂无图片</div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="'操作'" width="300">
          <template #default="{row}">
            <el-button type="danger" @click="deleteRow(row)">删除</el-button>
            <el-button type="primary" @click="openDialog(row)">编辑</el-button>
          </template>
        </el-table-column> -->
      </template>
    </page-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryForm: {},
      selection: [],
      isEdit: false,
      currentRow: {}
    }
  },
  created() {
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/user/getFeedBackVoIPage', { ...param, ...this.queryForm })
    },
    download(item) {
      window.open(
        `${this.imgHost}/${item.code}.${item.suffix ? item.suffix : ''}`,
        '_blank'
      )
    },
    deleteRow(row) {
      if (row.id) {
        this.$confirm('确定删除该工单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.post('/patrol/batchDelPatrolBuildVo', { patrolBuildVoList: this.selection.map(item => { return { id: item.id } }) }).then(res => {
          // this.$http.post('/patrol/batchDelPatrolBuildVo', { patrolBuildVoList: [{ id: row.id }] }).then(res => {
          //   this.$message.success('删除成功')
          //   this.$refs.pageTable.reload()
          // })
        })
      } else {
        this.$message.info('请选择至少一条数据')
      }
    },
    openDialog(row) {
      this.isEdit = false
      // if (row && row.id) {
      //   this.isEdit = true
      //   this.currentRow = row
      // }
      // this.dialogVisibleConstrcut = true
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
