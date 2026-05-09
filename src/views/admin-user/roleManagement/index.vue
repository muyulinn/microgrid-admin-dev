<template>
  <div class="container common-list common-shadow">
    <div class="head">
      <div class="headleft">
        <el-tabs v-model="activeName">
          <!-- 角色管理 -->
          <el-tab-pane label="角色管理" name="first">
            <page-table
              ref="pageTable"
              class="tableBox"
              :query="roleQuery"
              :selection.sync="roleSelection"
              @reset="queryRoleForm = {}"
              @selection-change="roleSelectionChange"
            >
              <!-- 角色搜索框 -->
              <template #query-form>
                <el-form-item label="角色名">
                  <el-input v-model="queryRoleForm.roleName" clearable placeholder="请输入角色名" class="query-form-input" />
                </el-form-item>
              </template>
              <!-- 角色管理按钮 -->
              <template #action-new-line>
                <div style="display:flex">
                  <el-button v-permission="['roleManagementAddBtn']" type="primary" icon="el-icon-plus" @click="addRoleBtn">新增角色</el-button>
                  <el-button v-permission="['roleManagementEditBtn']" type="primary" icon="el-icon-edit" :disabled="disabled" @click="updateRoleBtn()">修改角色</el-button>
                  <el-button v-permission="['roleManagementDeleteBtn']" type="danger" :disabled="disabled" icon="el-icon-delete" @click="deleteRoleBtn()">删除角色</el-button>
                  <el-button v-permission="['roleManagementMandateBtn']" type="primary" :disabled="disabled" icon="el-icon-plus" @click="authorizationBtn()">授权</el-button>
                  <!-- <el-upload class="avatar-uploaders-btn" action="" :http-request="xlsxUploadRequest" :show-file-list="false" :before-upload="beforeUpload" :disabled="importDataDisabled">
                    <el-button v-permission="['roleManagementImportBtn']" type="primary" :icon="importDataBtnIcon" :disabled="importDataDisabled">
                      {{ importDataBtnText }}
                    </el-button>
                  </el-upload> -->
                  <!-- <el-button v-permission="['roleManagementExportBtn']" type="primary" @click="exportBtn('isDetails')">导出</el-button> -->
                </div>
              </template>

              <template slot="table-body">
                <el-table-column type="index" label="" fixed />
                <el-table-column label="角色" prop="roleName" width="200" />
                <el-table-column label="创建时间" prop="createTime" width="200" />
              </template>
            </page-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 用户管理 -->
      <div v-if="index === 2" :class="index === 2?'headright':'headleft1'">
        <i class="el-icon-circle-close closeIcon" @click="closeIcon" />
        <el-tabs v-model="activeName1">
          <el-tab-pane label="用户管理" name="first">
            <div>
              <el-form :model="queryUserForm">
                <el-form-item label="用户名:">
                  <el-input v-model="queryUserForm.userName" clearable placeholder="请输入用户名" class="query-form-input" />
                  <el-button type="primary" @click="userQuery">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- 用户管理按钮 -->
            <div style="display:flex;margin-bottom: 10px;margin-top:-10px;">
              <el-button v-permission="['roleManagementAddUserBtn']" type="primary" icon="el-icon-plus" @click="addUserBtn">新增用户</el-button>
              <el-button v-permission="['roleManagementAddExistingUsersBtn']" type="success" icon="el-icon-plus" @click="existingUsersBtn">已有用户</el-button>
              <el-button v-permission="['roleManagementRemoveExistingUsersBtn']" type="danger" :disabled="disabled1" @click="romoveRoleBtn">移出角色</el-button>
            </div>
            <el-table
              ref="multipleTable"
              border
              :data="userTableData"
              tooltip-effect="dark"
              style="width: 100%"
              @select="userSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" width="55" />
              <el-table-column label="用户名" prop="userName" width="220" />
            </el-table>
            <!-- 用户分页 -->
            <div class="block" style="display: flex;flex-direction: row-reverse;margin-top:15px;">
              <el-pagination
                background
                :current-page="userCurrent"
                :page-sizes="pageSizes1"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1"
                @size-change="userPageHandleSizeChange"
                @current-change="userPageHandleCurrentChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 授权抽屉 -->
    <el-drawer
      title="授权处理"
      :visible.sync="authorizationDrawer"
      :wrapper-closable="false"
      :modal-append-to-body="false"
    >
      <div class="treeBox">
        <el-tree
          :props="props"
          :data="treeData"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultCheckedKeys"
          @check="treeHandleCheckChange"
        />
      </div>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <el-button style="magin-right: 10px" size="medium" @click="authorizationHandleCancel">取消</el-button>
        <el-button type="primary" size="medium" @click="authorizationHandleOK">确定</el-button>
      </div>
    </el-drawer>
    <!-- 新增/修改角色 -->
    <div>
      <el-dialog
        :title="isEdit?'编辑角色':'新增角色'"
        :visible.sync="editOrAddDialogVisible"
        width="30%"
        :before-close="cancelEditOrAddRole"
        :modal-append-to-body="false"
      >
        <el-form ref="ruleForm" :model="roleRuleForm" label-width="100px" size="medium" class="editOrAddRoleBox">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleRuleForm.roleName" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="cancelEditOrAddRole()">取 消</el-button>
          <el-button type="primary" size="medium" @click="comfirmEditOrAddRole()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 新增用户 -->
    <div>
      <el-dialog
        title="新增用户"
        :visible.sync="addUserVisible"
        width="30%"
        :before-close="addUserHandleClose"
        :modal-append-to-body="false"
      >
        <el-form ref="ruleForm" :model="userRoleForm" label-width="100px" size="medium" class="addUserBox">
          <el-form-item label="用户名" prop="userName" required>
            <el-input v-model="userRoleForm.userName" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userRoleForm.name" />
          </el-form-item>
          <el-form-item label="密码" prop="password" required>
            <el-input v-model="userRoleForm.password" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword" required>
            <el-input v-model="userRoleForm.rePassword" show-password />
          </el-form-item>
          <el-form-item label="角色" prop="roleList" required>
            <el-select v-model="roleLists" multiple placeholder="请选择角色">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="cancelAddUser()">取 消</el-button>
          <el-button type="primary" size="medium" @click="confirmAddUser()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 新增已有用户 -->
    <div>
      <el-dialog
        title="新增已有用户"
        :visible.sync="originalUserVisible"
        width="35%"
        :before-close="originalUserHandleClose"
        :modal-append-to-body="false"
      >
        <el-table
          ref="singleTable"
          :data="originalUserTableData"
          tooltip-effect="dark"
          style="width: 100%"
          highlight-current-row
          @select="originalUserhandleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="userName" label="用户名" width="220" />
        </el-table>
        <!-- 已有用户分页 -->
        <div class="block" style="display: flex;flex-direction: row-reverse;margin-top:15px;">
          <el-pagination
            background
            :current-page="originalUserCurrentSize"
            :page-sizes="pageSizes"
            :page-size="size1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="originalUserPageHandleSizeChange"
            @current-change="originalUserPageHandleCurrentChange"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="originalUserHandleClose()">取 消</el-button>
          <el-button type="primary" size="medium" @click="originalUserHandleConfirm()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { upload } from '@/utils'
// import fsImg from '@/components/FsImg'
export default {
  components: {
    // fsImg
  },
  data() {
    return {
      // perVillageName:[],
      // perWuyeName:[],
      originalUserCurrentSize: 1,
      originalUserData: '',
      roleLists: [],
      options: [],
      treeCheckId: [],
      selectUserID: [],
      currentUserRow: '',
      size1: 5,
      defaultCheckedKeys: [],
      selectID: '',
      currentRow: '',
      userCurrent: 1,
      size: 5,
      pageSizes1: [5, 10, 20, 30],
      total1: 0,
      userTableData: [],
      disabled1: true,
      pageSizes: [5, 10, 20, 30],
      total: 0,
      originalUserTableData: [],
      originalUserVisible: false,
      imgIsUpload: false,
      value1: '',
      userRoleForm: {},
      addUserVisible: false,
      roleRuleForm: {
        roleName: '',
        roleNamePy: '',
        store: '',
        roleCode: '',
        desc: ''
      },
      editOrAddDialogVisible: false,
      treeData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1'
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }],
      authorizationDrawer: false,
      activeName: 'first',
      activeName1: 'first',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,
      importDataBtnText: '导入',
      disabled: true,
      roleSelection: [],
      userSelection: [],
      queryRoleForm: {},
      queryUserForm: {},
      index: 1,
      props: {
        children: 'children',
        label: 'name'
      },
      count: 1,
      isEdit: false
    }
  },
  watch: {
    currentUserRow(val) {
      var arr = []
      if (val.length >= 1 && val[0] !== null) {
        val.forEach(item => {
          arr.push({ id: item.id })
        })
        this.selectUserID = arr
        // console.log(this.selectUserID)
        this.disabled1 = false
      } else {
        this.disabled1 = true
      }
    },
    currentRow(val) {
      if (val.length >= 1 && val[0] !== null) {
        this.selectID = val[0].id
        this.disabled = false
      } else {
        this.selectID = ''
        this.disabled = true
      }
      this.userQuery()
    }
  },
  methods: {
    cancelAddUser() {
      this.addUserVisible = false
      this.options = []
    },
    confirmAddUser() {
      var arr = []
      this.roleLists.forEach(item => {
        arr.push({ id: item })
      })
      this.userRoleForm.roleList = arr
      this.$http.post('/api/user/addUser', { ...this.userRoleForm }).then(data => {
        this.$message.success('新增成功')
        this.roleLists = []
        this.options = []
        this.userRoleForm = {}
        this.addUserVisible = false
        this.userQuery()
      }).catch(() => {
        // this.$message('已取消新增')
      })
    },
    // 新增角色按钮
    addRoleBtn() {
      this.editOrAddDialogVisible = true
      this.isEdit = false
    },
    // 更新角色按钮
    updateRoleBtn() {
      this.editOrAddDialogVisible = true
      this.isEdit = true
      this.$http.post('/api/user/getRoleOne', { id: this.currentRow[0].id }).then(data => {
        console.log(data)
        this.roleRuleForm = data
      })
    },
    // 删除角色按钮
    deleteRoleBtn() {
      this.$confirm('此操作将删除角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/api/user/delRole', { id: this.currentRow[0].id }).then(data => {
          this.$refs.pageTable.reload()
          this.$message.success('删除成功')
        })
      }).catch(() => {
        this.$message('已取消删除')
      })
    },
    // 授权按钮
    authorizationBtn() {
      this.authorizationDrawer = true
      this.$http.getParam('/api/user/getPermissionVoList').then(data => {
        // console.log(data)
        this.treeData = data
        var arr = []
        this.$http.post('/api/user/getPermissionVoAllListByRoleId', { roleId: this.selectID }).then(data => {
          data.forEach(item => {
            // console.log(item)
            arr.push(item.id)
          })
          console.log(arr)
          this.defaultCheckedKeys = arr
          this.treeCheckId = arr
          console.log(this.defaultCheckedKeys)
        })
      })
    },
    // 导出按钮
    exportBtn() {

    },
    // 新增用户按钮
    addUserBtn() {
      this.addUserVisible = true
      this.$http.getParam('/api/user/getRoleList').then(data => {
        data.records.forEach(item => {
          this.options.push({ id: item.id, roleName: item.roleName })
        })
      })
    },
    comfirmEditOrAddRole() {
      if (this.isEdit) {
        // console.log(this.isEdit)
        this.$http.post('/api/user/updateRole', { id: this.currentRow[0].id, ...this.roleRuleForm }).then(data => {
          this.editOrAddDialogVisible = false
          this.$message.success('修改成功')
          this.roleRuleForm = {}
          this.disabled = true
          this.$refs.pageTable.reload()
          // this.roleQuery()
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$http.post('/api/user/addRole', { ...this.roleRuleForm }).then(data => {
          this.editOrAddDialogVisible = false
          this.$message.success('添加成功')
          this.$refs.pageTable.reload()
          this.userQuery()
          this.roleRuleForm = {}
        }).catch(err => {
          console.log(err)
        })
      }
    },
    cancelEditOrAddRole() {
      this.editOrAddDialogVisible = false
      this.roleRuleForm = {}
    },
    // 已有用户按钮
    existingUsersBtn() {
      this.originalUserVisible = true
      this.existingUsers()
    },
    existingUsers() {
      var param = {
        size: this.size1,
        current: this.originalUserCurrentSize
      }
      return this.$http.getParam('/api/user/getUserList', { ...param }).then(data => {
        console.log(data)
        this.originalUserTableData = data.records
        this.total = data.total
        // console.log(this.userRoleForm)
      })
    },
    originalUserHandleClose() {
      this.originalUserVisible = false
    },
    originalUserHandleConfirm() {
      var param = {
        id: this.selectID,
        userList: this.originalUserData
      }
      if (this.userList !== '') {
        this.$http.post('/api/user/addRoleBatchUser', { ...param }).then(data => {
          this.$message.success('添加成功')
          this.userQuery()
          this.originalUserVisible = false
          this.userRoleForm = {}
          this.originalUserCurrentSize = 1
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message('请选择用户')
      }
    },
    originalUserhandleSelectionChange(row) {
      // console.log('---------------------', row)
      this.originalUserData = row
    },
    originalUserPageHandleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.originalUserCurrentSize = 1
      this.size1 = val
      this.existingUsers()
    },
    originalUserPageHandleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.originalUserCurrentSize = val
      this.existingUsers()
    },
    // 移出角色按钮
    romoveRoleBtn() {
      this.$confirm('此操作将移出格式, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {
          roleUserList: this.selectUserID
        }
        this.$http.post('/api/user/delRoleBatchUser', { id: this.selectID, ...param }).then(data => {
          // console.log(data)
          this.userQuery()
        })
        this.$message.success('移出成功')
        this.disabled1 = true
      }).catch(() => {
        this.$message('已取消移出')
      })
    },
    userPageHandleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.size = val
      this.userCurrent = 1
      this.userQuery()
    },
    userPageHandleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.userCurrent = val
      this.userQuery()
    },
    addUserHandleClose() {
      this.addUserVisible = false
    },
    //  角色列表查询
    roleQuery(param = {}) {
      return this.$http.getParam('/api/user/getRoleList', { ...param, ...this.queryRoleForm }).then(data => {
        // console.log(data)
        return data
      })
    },
    // 选中角色的数据
    roleSelectionChange(row) {
      // console.log(row)
      this.disabled = false
      if (row.length !== 0) {
        this.index = 2
        this.currentRow = row
      } else {
        this.index = 1
      }
    },
    beforeUpload() {
      this.importDataBtnIcon = 'el-icon-loading'
      this.importDataBtnText = '正在导入'
      this.importDataDisabled = true
    },
    // 导入
    xlsxUploadRequest(req) {
    },
    // 根据角色查询用户列表
    userQuery() {
      var param = {
        roleId: this.selectID,
        size: this.size,
        current: this.userCurrent
      }
      this.userTableData = []
      if (this.selectID) {
        return this.$http.getParam('/api/user/getUserByRoleIdPage', { ...param, ...this.queryUserForm }).then(data => {
          // console.log(data)
          // return data
          this.userTableData = data.records
          this.total1 = data.total
          this.pageSize1 = data.size
        })
      }
    },
    treeHandleCheckChange(data, data1) {
      // console.log(data)
      // console.log(data1.checkedKeys)
      this.treeCheckId = data1.checkedKeys
      // console.log(this.treeCheckId)
    },

    // 选中用户的数据
    userSelectionChange(row) {
      if (row.length !== 0) {
        this.currentUserRow = row
      }
    },
    // 关闭图标事件
    closeIcon() {
      this.disabled = true
      this.index = 1
    },
    authorizationHandleCancel() {
      this.authorizationDrawer = false
      this.defaultCheckedKeys = []
      console.log(this.treeCheckId)
    },
    async authorizationHandleOK() {
      // console.log(this.treeCheckId)
      let cancel = false
      if (this.treeCheckId.length === 0) {
        await this.$confirm('是否取消该角色所有权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          cancel = true
        })
      }
      if (cancel) return
      this.authorizationDrawer = false
      var arr = []
      this.treeCheckId.forEach(item => {
        arr.push({ permissionId: item })
      })
      console.log(this.treeCheckId)
      if (this.treeCheckId === '') {
        console.log(this.defaultCheckedKeys)
        arr = this.defaultCheckedKeys
      }
      var param = {
        rolePermissionList: arr,
        id: this.currentRow[0].id
      }
      console.log(param)
      this.$http.post('/api/user/editRolePermission', { ...param }).then(data => {
        // console.log(data)
      })
      this.defaultCheckedKeys = []
    },
    imgUploadRequestAvatarPic(req) {
      // this.imgIsUpload = true
      // this.imgIsSucceed = 0
      upload(req.file).then(data => {
        console.log('data', data)
        // this.imgIsSucceed = 1
        // this.contractReg.idCardPic = data.code
      }).catch(data => {
        // this.imgIsSucceed = 2
      })
    },
    delImg() {
      // this.imgIsUpload = false
      // this.guarantorImgIsUpload = false
      // this.contractImgIsUpload = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 10px;
  background: white;
}
.head{
    display: flex;
}
.headleft{
    width: 100%;
    background-color: #fff;
    padding: 10px;
}
.headright{
    width: 100%;
    margin-left: 10px;
    background-color: #fff;
    padding: 10px;
}
.headleft1{
    width: 50%;
    background-color: #fff;
}
.closeIcon{
    position: relative;
    left: 94%;
    top:10px;
    font-size: 25px;
    padding: 5px;
}
.treeBox{
  padding: 10px;
  height: 800px;
  overflow-y: scroll;
}
.editOrAddRoleBox{
  padding-right: 20px;
}
.addUserBox{
  padding-right: 20px;
}
.showBox{
  margin-top: 18px;
  width: 160px;
  height: 90px;
  // background: rgba(0,0,0,.2);
}
.query-form-input{
  width: 200px;
  margin-right: 15px;
}
.tableBox{
  padding:10px;
}
.common-list {
  min-height: calc(100% - 35px);
  margin: 0;
  margin-top: 12px;
}
</style>
