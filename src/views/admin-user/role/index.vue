<template>
  <div class="zs-container">
    <page-table
      ref="pageTable"
      :query="query"
      :selection.sync="selection"
      @reset="queryForm={}"
    >
      <template #query-form>
        <el-form-item label="角色名称">
          <el-input v-model="queryForm.roleName" />
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
        <el-button v-permission="'btn-add-role'" type="primary" icon="el-icon-circle-plus-outline" @click="roleForm = {}, editRoleDialogVisible = true">添加角色</el-button>
      </template>

      <template slot="table-body">
        <el-table-column type="index" label="NO" prop="id" />
        <el-table-column label="角色" prop="roleName">
          <template #defaule="{row}">
            {{ row.roleName }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column :label="'操作'" width="300">
          <template #default="{row}">
            <el-link v-permission="'btn-edit-role'" type="info" plain @click="roleForm = {...row},editRoleDialogVisible = true" v-text="'编辑'" />
            <el-link v-permission="'btn-update-role-permission'" type="info" plain @click="showRolePermissionDialog(row)" v-text="'设置权限'" />
          </template>
        </el-table-column>
      </template>
    </page-table>

    <el-dialog :title="isEdit?'编辑':'添加'" :visible.sync="editRoleDialogVisible" :modal-append-to-body="false">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" :loading="loading" label-width="110px" @submit.native.prevent>
        <el-form-item label="角色" prop="roleName" required>
          <el-input v-model="roleForm.roleName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="editRoleDialogVisible = false" v-text="'取消'" />
        <el-button type="primary" :loading="loading" @click="isEdit?editRole():addRole()" v-text="'确定'" />
      </div>
    </el-dialog>

    <el-dialog :title="'设置权限'" :visible.sync="editRolePermissionDialogVisible" :loading="loading" :modal-append-to-body="false">
      <h3>当前角色: {{ roleForm.roleName }}</h3>
      <el-tree
        ref="permissionTree"
        v-loading="loading"
        :load="loadNode"
        lazy
        node-key="name"
        show-checkbox
        check-on-click-node
        default-expand-all
      >
        <span slot-scope="{ data }" class="resource-tree-node">
          {{ data.title || data.meta.title }}
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="editRolePermissionDialogVisible = false" v-text="'取消'" />
        <el-button type="primary" :loading="loading" @click="updateRolePermission" v-text="'确定'" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { asyncRoutes } from '@/router'
export default {
  name: 'RoleList',
  props: {},
  data() {
    return {
      permissionTree: [],
      editRoleDialogVisible: false,
      editRolePermissionDialogVisible: false,
      roleForm: {},
      pickerOptions: {},
      queryForm: {},
      loading: false,
      selection: [],
      leafKeys: [],
      rules: {
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.roleForm.id
    }
  },
  created() {},
  async mounted() {
    this.query()
  },
  methods: {
    /**
     * 列表查询
     */
    query(param = {}) {
      return this.$http.getParam('/user/getRoleList', { ...param, ...this.queryForm })
    },
    /**
     * 添加角色
     */
    async addRole() {
      await this.$refs.roleForm.validate()

      this.loading = true
      await this.$http.post('user/addRole', this.roleForm)
      this.loading = false
      this.editRoleDialogVisible = false
      this.$refs.pageTable.reload()
    },
    /**
     * 编辑角色
     */
    async editRole() {
      await this.$refs.roleForm.validate()
      this.loading = true
      await this.$http.post('user/updateRole', this.roleForm)
      this.loading = false
      this.editRoleDialogVisible = false
      this.$refs.pageTable.reload()
    },
    /**
     * 打开权限设置窗口
     */
    async showRolePermissionDialog({ id }) {
      this.roleForm = { id }
      this.editRolePermissionDialogVisible = true
      this.loading = true
      const rolePermission = await this.$http.getParam('user/getRolePermission', { roleId: id })

      if (!this.leafKeys || !this.leafKeys.length) {
        await this.$nextTick()
        this.leafKeys = Object.values(this.$refs.permissionTree.store.nodesMap || {}).filter(item => item.isLeaf).map(item => item.key)
      }

      const checkedPermissions = rolePermission.map(item => item.permissionValue).filter(path => this.leafKeys.includes(path))
      this.$refs.permissionTree.setCheckedKeys(checkedPermissions)

      this.loading = false
    },
    /**
     * 加载权限树（菜单）
     */
    loadNode(node, resolve) {
      if (node.level === 0) return resolve(asyncRoutes)
      resolve(node.data.buttonList || node.data.children || [])
    },
    /**
     * 更新角色权限
     */
    async updateRolePermission() {
      this.loading = true
      const rolePermissions = this.$refs.permissionTree.getCheckedNodes(false, true).map(item => ({ permissionValue: item.name, permissionTitle: item.title || item.meta.title }))
      await this.$http.post('user/updateRolePermission', { roleIds: [this.roleForm.id], rolePermissions })
      this.loading = false
      this.editRolePermissionDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
