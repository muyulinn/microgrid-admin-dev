<template>
  <!-- <div>部门列表</div> -->
  <div class="container common-shadow common-list">
    <el-row :gutter="25">
      <el-col :span="12">
        <div>
          <el-form :model="departmentQueryForm">
            <el-form-item label="部门名称:">
              <el-input v-model="departmentQueryForm.departmentName" clearable placeholder="请输入部门名称" class="query-form-input" />
              <el-button type="primary" style="margin-left:15px;" @click="departmentQuery">查询</el-button>
              <el-button @click="resetBtn">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 部门管理按钮 -->
        <div style="display:flex;margin-bottom: 10px;margin-top:-10px;">
          <el-button v-permission="['departmentManagementAddBtn']" type="primary" icon="el-icon-plus" @click="addDepartmentBtn()">新增</el-button>
          <el-button v-permission="['departmentManagementEditBtn']" type="primary" icon="el-icon-edit" :disabled="editDisabled" @click="updateDepartmentBtn()">编辑</el-button>
          <el-button v-permission="['departmentManagementDeleteBtn']" type="danger" icon="el-icon-delete" :disabled="editDisabled" @click="deleteDepartmentBtn()">删除</el-button>
        </div>
        <el-table
          ref="singleTable"
          highlight-current-row
          stripe
          :header-cell-style="{ background: '#f5f7fe', color: '#000' }"
          :data="departmentTableData"
          tooltip-effect="dark"
          style="width: 100%"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          row-key="id"
          lazy
          @current-change="departmentSelectionChange"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column label="部门名称" prop="orgName" width="350px" />
          <!-- <el-table-column label="部门简称" prop="shortName" /> -->
          <!-- <el-table-column label="部门类型" prop="departType">
            <template slot-scope="scope">
              {{ scope.row.departType === 1 ? '一级部门' : '子部门' }}
            </template>
          </el-table-column> -->
          <el-table-column label="负责人" prop="orgCharge" />
          <!-- <el-table-column label="部门电话" prop="orgChargePhone" /> -->
          <!-- <el-table-column label="编码" prop="orgLicenseCode" /> -->
          <el-table-column label="描述" prop="remark" />
          <!-- <el-table-column label="创建时间" prop="createTime" /> -->
        </el-table>
        <!-- 用户分页 -->
        <!-- <div class="block" style="display: flex;flex-direction: row-reverse;margin-top:15px;">
      <el-pagination
        background
        :current-page="departmentCurrent"
        :page-sizes="pageSizes"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="departmentPageHandleSizeChange"
        @current-change="departmentPageHandleCurrentChange"
      />
    </div> -->
      </el-col>
      <el-col v-if="currentRow.id" :span="12">
        <div>
          <el-form :model="userQueryForm">
            <el-form-item label="用户名称:">
              <el-input v-model="userQueryForm.userName" clearable placeholder="请输入部门名称" class="query-form-input" />
              <el-button type="primary" style="margin-left:15px;" @click="userQuery">查询</el-button>
              <el-button @click="userResetBtn">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 部门管理按钮 -->
        <div style="display:flex;margin-bottom: 10px;margin-top:-10px;">
          <el-button v-permission="['departmentManagementAddBtn']" type="primary" icon="el-icon-plus" @click="existingUsersBtn">批量添加已有用户</el-button>
          <!-- <el-button v-permission="['departmentManagementEditBtn']" type="primary" icon="el-icon-edit" :disabled="userEditDisabled">编辑</el-button> -->
          <el-button v-permission="['departmentManagementDeleteBtn']" type="danger" icon="el-icon-delete" :disabled="userCurrentRow.length <= 0" @click="romoveExistUser">批量删除已有用户</el-button>
        </div>
        <el-table
          ref="singleTableUser"
          highlight-current-row
          stripe
          :header-cell-style="{ background: '#f5f7fe', color: '#000' }"
          :data="userTableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="userSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" />
          <el-table-column label="用户名" prop="userName" />
        </el-table>
        <!-- 用户分页 -->
        <div class="block" style="display: flex;flex-direction: row-reverse;margin-top:15px;">
          <el-pagination
            background
            :current-page="userQueryForm.current"
            :page-sizes="pageSizes"
            :page-size="userQueryForm.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userTotal"
            @size-change="userPageHandleSizeChange"
            @current-change="userPageHandleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
    <!-- 新增或修改弹框 -->
    <div>
      <el-dialog
        :title="isEdit?'编辑':'新增'"
        :visible.sync="addOrEditDepartmentDialogVisible"
        width="30%"
        :before-close="addOrEditDepartmentHandleClose"
        :modal-append-to-body="false"
      >
        <el-form ref="ruleForm" :model="departmentForm" label-width="80px" size="medium" class="AddOrEditDepartmentBox">
          <el-form-item label="部门类型" prop="departType">
            <el-radio-group v-model="departmentForm.departType">
              <el-radio :label="1">一级部门</el-radio>
              <el-radio :label="2">子部门</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="部门类别" prop="departType2">
            <el-radio-group v-model="departmentForm.departType2">
              <el-radio :label="1">公司</el-radio>
              <el-radio :label="2">组织机构</el-radio>
              <el-radio :label="3">岗位</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="上级部门" prop="parentId">
            <el-cascader
              ref="cascaderCompany"
              v-model="departmentForm.parentId"
              :options="departmentOptions"
              :props="{ label: 'orgName', value: 'id', children: 'children',checkStrictly: true }"
              style="width: 100%"
              @change="handleChangeCas"
            />
          </el-form-item>
          <el-form-item label="部门名称" prop="orgName">
            <el-input v-model="departmentForm.orgName" placeholder="部门名称" />
          </el-form-item>
          <el-form-item label="部门简称" prop="shortName">
            <el-input v-model="departmentForm.shortName" placeholder="部门简称" />
          </el-form-item>
          <el-form-item label="负责人" prop="orgCharge">
            <el-input v-model="departmentForm.orgCharge" placeholder="负责人" />
          </el-form-item>
          <el-form-item label="部门电话" prop="orgChargePhone">
            <el-input v-model="departmentForm.orgChargePhone" placeholder="部门电话" />
          </el-form-item>
          <el-form-item label="编码" prop="orgLicenseCode">
            <el-input v-model="departmentForm.orgLicenseCode" placeholder="编码" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="departmentForm.remark" placeholder="描述" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="addOrEditDepartmentHandleClose()">取 消</el-button>
          <el-button size="medium" type="primary" @click="confirmAddOrEditDepartment()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新增已有用户 -->
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
            :current-page="dialogUserForm.current"
            :page-sizes="pageSizes"
            :page-size="dialogUserForm.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dialogUserTotal"
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
export default {
  data() {
    return {
      editDisabled: true,
      total: 0,
      size: 5,
      pageSizes: [10, 20, 30],
      departmentCurrent: 1,
      departmentTableData: [],
      villageSelection: [],
      departmentQueryForm: {},
      // disabled: true,
      currentRow: [],
      addOrEditDepartmentDialogVisible: false,
      isEdit: false,
      departmentForm: {
        departType: 1,
        // departType2: '',
        parentId: '',
        orgName: '',
        shortName: '',
        orgCharge: '',
        orgChargePhone: '',
        orgLicenseCode: '',
        remark: ''
      },
      // 右边用户列表
      departmentOptions: [],
      userTotal: 0,
      userTableData: [],
      userQueryForm: {
        current: 1,
        size: 10
      },
      userCurrentRow: [],
      userEditDisabled: true,
      // 新增用户对话框
      originalUserVisible: false,
      originalUserTableData: [],
      dialogUserTotal: 0,
      dialogUserForm: {
        current: 1,
        size: 10
      },
      dialogUserCurrentRow: []

    }
  },
  watch: {
    currentRow(val) {
      // console.log(val)
      if (val) {
        this.editDisabled = false
      } else {
        this.editDisabled = true
      }
      this.userQueryForm.current = 1
      this.userQuery()
    },
    userCurrentRow(val) {
      // console.log(val)
      if (val) {
        this.userEditDisabled = false
      } else {
        this.userEditDisabled = true
      }
    },
    'departmentForm.departType': {
      handler(newVal) {
        this.departmentOptions = []
        if (newVal === 1) {
          this.$http.getParam('/api/user/getOrganizationVoAllListByOne').then(res => {
            this.departmentOptions = res
            this.$forceUpdate()
          })
        } else {
          this.$http.getParam('/api/user/getOrganizationVoAllListByTwo').then(res => {
            this.departmentOptions = res
            this.$forceUpdate()
          })
        }
      },
      deep: true
    }
  },
  created() {
    this.departmentQuery()
  },
  methods: {
    getDepartmentCas() {
      this.$http.getParam('/api/user/getOrganizationVoAllListByOne').then(res => {
        this.departmentOptions = res
      })
    },
    resetBtn() {
      this.departmentQueryForm = {}
    },
    userResetBtn() {
      this.userQueryForm = {}
    },
    departmentPageHandleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.size = val
      this.departmentCurrent = 1
      this.departmentQuery()
    },
    userPageHandleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.userQueryForm.size = val
      this.userQueryForm.current = 1
      this.userQuery()
    },
    departmentPageHandleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.departmentCurrent = val
      this.departmentQuery()
    },
    userPageHandleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.userQueryForm.current = val
      this.userQuery()
    },
    // 部门列表查询
    departmentQuery(param) {
      return this.$http.getParam('/api/user/getOrganizationVoAllListByDepart', { ...param, ...this.departmentQueryForm }).then(data => {
        // console.log(data)
        // this.departmentTableData = data.records
        // this.total = data.total
        this.departmentTableData = data
      })
    },
    userQuery(param) {
      return this.$http.getParam('/api/user/getUserVoIPageByDepartId', { ...param, ...this.userQueryForm, depId: this.currentRow.id }).then(data => {
        this.userTableData = data.records
        this.userTotal = data.total
      })
    },
    // 选择一条部门数据触发的事件
    departmentSelectionChange(row) {
      this.currentRow = row
    },
    userSelectionChange(row) {
      this.userCurrentRow = row
    },
    // 新增部门
    addDepartmentBtn() {
      this.isEdit = false
      this.addOrEditDepartmentDialogVisible = true
      this.getDepartmentCas()
    },
    // 修改部门
    updateDepartmentBtn() {
      this.isEdit = true
      this.getDepartmentCas()
      this.addOrEditDepartmentDialogVisible = true
      const temp = JSON.parse(JSON.stringify(this.currentRow))
      this.departmentForm.departType = temp.departType
      // this.departmentForm.departType2 = temp.departType2
      this.departmentForm.parentId = temp.parentId
      this.departmentForm.orgName = temp.orgName
      this.departmentForm.shortName = temp.shortName
      this.departmentForm.orgCharge = temp.orgCharge
      this.departmentForm.orgChargePhone = temp.orgChargePhone
      this.departmentForm.orgLicenseCode = temp.orgLicenseCode
      this.departmentForm.remark = temp.remark
      // this.$http.getParam('/api/user/getDepartmentById', { id: this.currentRow.id }).then(data => {
      //   this.departmentForm = data
      //   delete this.departmentForm.createTime
      //   delete this.departmentForm.isDel
      //   delete this.departmentForm.memberCount
      //   delete this.departmentForm.uersId
      // })
    },
    // 删除部门
    deleteDepartmentBtn() {
      this.$confirm('此操作将删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/user/delOrganizationVoByDepart', { id: this.currentRow.id }).then(data => {
          this.departmentQuery()
          this.$message.success('删除成功!')
          this.editDisabled = true
        })
      }).catch(() => {
        this.$message.error('删除失败')
      })
    },
    addOrEditDepartmentHandleClose() {
      this.addOrEditDepartmentDialogVisible = false
      Object.assign(this.$data.departmentForm, this.$options.data().departmentForm)
    },
    confirmAddOrEditDepartment() {
      const submitForm = JSON.parse(JSON.stringify(this.departmentForm))
      // if (submitForm.departType === 1) {
      //   submitForm.parentId = ''
      //   // delete submitForm.parentId
      // }
      console.log(submitForm)
      if (this.isEdit) {
        this.$http.post('/api/user/editOrganizationVoByDepart', { id: this.currentRow.id, ...submitForm }).then(data => {
          this.addOrEditDepartmentDialogVisible = false
          this.$message.success('修改成功')
          this.departmentQuery()
          Object.assign(this.$data.departmentForm, this.$options.data().departmentForm)
          this.editDisabled = true
          // this.disabled = true
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$http.post('/api/user/addOrganizationVoByDepart', { ...submitForm }).then(data => {
          this.addOrEditDepartmentDialogVisible = false
          this.$message.success('添加成功')
          this.departmentQuery()
          Object.assign(this.$data.departmentForm, this.$options.data().departmentForm)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleChangeCas(val) {
      if (val === undefined) return
      this.$refs.cascaderCompany.dropDownVisible = false
      const nodeContent = this.$refs['cascaderCompany'].getCheckedNodes()
      this.departmentForm.parentId = nodeContent[0].value
    },
    // 新增用户部分
    // 已有用户按钮
    existingUsersBtn() {
      this.originalUserVisible = true
      this.getExistingUsers()
    },
    originalUserHandleClose() {
      this.originalUserVisible = false
    },
    originalUserhandleSelectionChange(row) {
      // console.log('---------------------', row)
      this.dialogUserCurrentRow = row
    },
    getExistingUsers(param) {
      return this.$http.getParam('/api/user/getUserList', { ...param, ...this.dialogUserForm }).then(data => {
        this.originalUserTableData = data.records
        this.dialogUserTotal = data.total
      })
    },
    originalUserPageHandleSizeChange(val) {
      this.dialogUserForm.current = 1
      this.dialogUserForm.size = val
      this.getExistingUsers()
    },
    originalUserPageHandleCurrentChange(val) {
      this.dialogUserForm.current = val
      this.getExistingUsers()
    },
    originalUserHandleConfirm() {
      if (this.dialogUserCurrentRow.length > 0) {
        var param = {
          depId: this.currentRow.id,
          userVoList: this.dialogUserCurrentRow.map(item => {
            return { id: item.id }
          })
        }
        this.$http.post('/api/user/batchAddDepartUser', { ...param }).then(data => {
          this.$message.success('添加成功')
          this.userQuery()
          this.originalUserVisible = false
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message('请选择用户')
      }
    },
    romoveExistUser() {
      if (this.userCurrentRow.length > 0) {
        this.$confirm('此操作将移除选中的用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            depId: this.currentRow.id,
            userVoList: this.userCurrentRow.map(item => {
              return { id: item.userId }
            })
          }
          this.$http.post('/api/user/batchDelDepartUser', { ...param }).then(data => {
            this.$message.success('删除成功')
            this.userQuery()
            this.originalUserVisible = false
          }).catch(err => {
            console.log(err)
          })
        })
      } else {
        this.$message('请选择用户')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container{
    padding: 10px;
  }
  .AddOrEditDepartmentBox{
    padding-right:20px;
  }
  .query-form-input {
    margin-bottom: 10px;
    width: 180px;
}
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f7fe!important;
}
::v-deep .el-table::before {
  height: 0px!important;
}
::v-deep .el-table th.is-leaf, ::v-deep .el-table td {
  border-bottom: none!important;
}
.common-list {
  min-height: calc(100% - 35px);
  margin: 0;
  margin-top: 12px;
}
</style>
