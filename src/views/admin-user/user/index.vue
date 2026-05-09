<template>
  <div class="zs-container common-shadow common-list" style="padding:15px 10px">
    <page-table
      ref="pageTable"
      :query="query"
      :selection.sync="selection"
      @reset="queryForm={}"
    >
      <template #query-form>
        <el-form-item label="身份证号">
          <el-input v-model="queryForm.idCard" class="query-form-item" :placeholder="'请输入身份证号'" clearable />
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
      <template #action-new-line>
        <el-button v-permission="['btn-add-user']" type="primary" icon="el-icon-circle-plus-outline" @click="userForm = {status:'ACTIVE'}, editUserDialogVisible = true">添加登陆账号</el-button>
        <el-button v-permission="['btn-reset-password']" type="danger" icon="el-icon-refresh" @click="resetPassword">重置密码</el-button>

      </template>

      <template slot="table-body">
        <!-- <el-table-column type="selection" /> -->
        <el-table-column type="index" label="NO" prop="id" />
        <el-table-column label="id" prop="id" />
        <el-table-column v-permission="'col-user.name'" label="姓名" prop="name" />
        <el-table-column label="登陆账号" prop="userName" />
        <el-table-column label="手机号" prop="telephone" />
        <el-table-column label="状态" prop="status" :formatter="$formatEnum('user.status')" />
        <el-table-column v-permission="'col-user.roleName'" label="角色" prop="roleName">
          <template #default="{row}">
            {{ row.roleName }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column :label="'操作'" width="200">
          <template #default="{row}">
            <el-link type="info" plain @click="userForm = row,userInfoDialogVisible = true">查看</el-link>
            <el-link v-permission="'btn-edit-user'" type="info" plain @click="userForm = {...row},editUserDialogVisible = true">编辑</el-link>
            <el-link v-permission="'btn-update-user-role'" type="info" plain @click="userForm = {...row},showUserRoleDialog()">设置角色</el-link>
          </template>
        </el-table-column>
      </template>
    </page-table>

    <el-dialog title="用户信息" :visible.sync="userInfoDialogVisible" :modal-append-to-body="false">
      <el-form label-width="110px">
        <el-form-item label="用户名">
          {{ userForm.userName }}
        </el-form-item>
        <el-form-item label="状态">
          {{ userForm.status | user.status }}
        </el-form-item>
        <el-form-item label="角色">
          {{ userForm.roleName }}
        </el-form-item>
        <el-form-item label="手机号">
          {{ userForm.telephone }}
        </el-form-item>
        <el-form-item label="创建时间">
          {{ userForm.createTime }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="userInfoDialogVisible = false" v-text="'确定'" />
      </div>
    </el-dialog>

    <el-dialog :title="isEdit?'编辑':'添加'" :visible.sync="editUserDialogVisible" :modal-append-to-body="false">
      <el-form ref="userForm" :model="userForm" :rules="rules" :loading="loading" label-width="110px">
        <el-form-item label="用户名" prop="userName" required>
          <el-input v-model="userForm.userName" :readonly="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password" required>
          <el-input v-model="userForm.password" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="确认密码" prop="rePassword" required>
          <el-input v-model="userForm.rePassword" />
        </el-form-item>
        <el-form-item label="状态" prop="status" required>
          <el-select v-model="userForm.status">
            <enum-option enum="user.status" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone" required>
          <el-input v-model="userForm.telephone" />
        </el-form-item>
        <el-form-item label="所属机构" prop="orgId">
          <el-select v-model="userForm.orgId" clearable>
            <el-option
              v-for="item in orgList"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="editUserDialogVisible = false" v-text="'取消'" />
        <el-button type="primary" :loading="loading" @click="isEdit?editUserInfo():addUserInfo()" v-text="'确定'" />
      </div>
    </el-dialog>

    <el-dialog :title="'设置角色'" :visible.sync="editUserRoleDialogVisible" :loading="loading" :modal-append-to-body="false">
      <el-row>
        <el-transfer
          v-model="selectedRoles"
          :titles="['角色', '已选']"
          :data="roleList"
          :props="{key: 'id',label:'roleName'}"
        />
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="editUserRoleDialogVisible = false" v-text="'取消'" />
        <el-button type="primary" :loading="loading" @click="updateUserRole()" v-text="'确定'" />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { initValidate, required } from '@/utils/rules'
export default {
  name: 'UserList',
  props: {},
  data() {
    return {
      userInfoDialogVisible: false,
      editUserDialogVisible: false,
      editUserRoleDialogVisible: false,
      userForm: {},
      orgList: [],
      pickerOptions: {},
      queryForm: {},
      loading: false,
      roleList: [],
      selectedRoles: [],
      selection: [],
      rules: {
        rePassword: [
          required,
          initValidate((val, assert) => {
            assert(this.userForm.rePassword === this.userForm.password, '密码不一致')
          }, { trigger: 'blur' })]
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.userForm.id
    }
  },

  async  created() {
    this.orgList = await this.$http.getParam('/user/getOrganizationVoList', { size: 5000 }).then(json => json.records)
  },
  mounted() {
    this.query()
    this.queryRole()
  },
  methods: {
    /**
     * 列表查询
     */
    query(param = {}) {
      console.debug('param', param)
      return this.$http.getParam('/user/getUserList', { ...param, ...this.queryForm }).then(data => {
        console.debug('getUserPage', data)
        return data
      })
    },
    /**
     * 添加用户
     */
    async addUserInfo() {
      this.loading = true
      await this.$refs.userForm.validate()
      await this.$http.post('user/addUser', this.userForm)
      this.loading = false
      this.editUserDialogVisible = false
      this.$refs.pageTable.reload()
    },
    /**
     * 编辑用户
     */
    async editUserInfo() {
      this.loading = true
      await this.$refs.userForm.validate()
      await this.$http.post('user/updateUser', this.userForm)
      this.$refs.pageTable.reload()
      this.editUserDialogVisible = false
      this.loading = false
    },
    /**
     * 重置密码
     */
    async resetPassword() {
      this.loading = true
      await this.$refs.pageTable.checkSelection()
      const id = this.selection.map(item => item.id)[0]
      await this.$confirm('确认操作')
      await this.$http.getParam('user/resetUserPassword', { id })
      this.loading = false
      this.$success('操作成功')
      this.$refs.pageTable.reload()
    },
    /**
     * 打开角色设置窗口
     */
    async showUserRoleDialog() {
      const userId = this.userForm.id
      this.editUserRoleDialogVisible = true
      this.loading = true
      const userRoles = await this.$http.getParam('user/getUserRole', { userId })
      this.selectedRoles = userRoles.map(item => item.id)
      this.loading = false
    },
    /**
     * 更新用户角色
     */
    async updateUserRole() {
      await this.$refs.pageTable.checkSelection()
      const userId = this.selection.map(item => item.id)[0]
      this.loading = true
      await this.$http.post('user/updateUserRole', { userIds: [userId], roleIds: this.selectedRoles })
      this.loading = false
      this.editUserRoleDialogVisible = false
      this.$refs.pageTable.reload()
    },
    /**
     * 加载角色
     */
    async queryRole(roleName) {
      const { records } = await this.$http.getParam('user/getRoleList', { roleName, size: 1000 })
      this.roleList = records
    }

  }
}
</script>

<style lang="scss" scoped>
.common-list {
  min-height: calc(100% - 35px);
  margin: 0;
  margin-top: 12px;
}
</style>
