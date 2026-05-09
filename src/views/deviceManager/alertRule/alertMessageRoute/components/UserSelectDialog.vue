<template>

  <el-dialog
    title="选择用户"
    :visible="true"
    append-to-body
    @close="$emit('close')"
  >
    <page-table
      ref="pageTable"
      :query="query"
      :selection.sync="selection"
      @reset="queryForm={}"
    >
      <template #query-form>
        <el-form-item label="用户名">
          <el-input v-model="queryForm.userName" class="query-form-item" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status">
            <enum-option enum="user.status" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="queryForm.role" t />
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
        <el-table-column type="selection" />
        <el-table-column type="index" label="NO" prop="id" />
        <el-table-column label="id" prop="id" />
        <el-table-column v-permission="'col-user.name'" label="姓名" prop="name" />
        <el-table-column label="登陆账号" prop="userName" />
        <el-table-column label="状态" prop="status" :formatter="$formatEnum('user.status')" />
        <el-table-column v-permission="'col-user.roleName'" label="角色" prop="roleName">
          <template #default="{row}">
            {{ row.roleName }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
      </template>
    </page-table>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="$emit('close'),$emit('done',{ selection})">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
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
      return this.$http.getParam('/user/getUserList', { ...param, ...this.queryForm })
    }
  }
}
</script>

<style>

</style>
