<template>
  <!-- 菜单管理 -->
  <div class="containter  common-shadow common-list">
    <!-- 菜单按钮 -->
    <div class="buttonRow">
      <el-button v-permission="['menuManagementAddBtn']" type="primary" icon="el-icon-plus" @click="addMenuBtn()">新增</el-button>
      <el-button v-permission="['menuManagementEditBtn']" type="primary" icon="el-icon-edit" :disabled="disabled" @click="editMenuBtn()">编辑</el-button>
      <el-button v-permission="['menuManagementDeleteBtn']" type="danger" icon="el-icon-delete" :disabled="disabled" @click="deleteMenuBtn()">删除</el-button>
    </div>
    <!-- 菜单树形表格 -->
    <div>
      <el-table
        ref="singleTable"
        :header-cell-style="headerBgColor"
        :data="tableData1"
        style="width: 100%"
        row-key="id"
        lazy
        highlight-current-row
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @current-change="menuHandleSelectionChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column type="index" label="序列" width="55" />  -->
        <!-- <el-table-column prop="menuAttribution" label="菜单归属" /> -->
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="menuType" label="菜单类型" :formatter="menuTypeFormat" />
        <el-table-column prop="icon" label="icon" />
        <el-table-column prop="component" label="组件" />
        <el-table-column prop="url" label="路径" />
        <el-table-column prop="sortNo" label="排序" />
      </el-table>
    </div>
    <!-- 新增或者修改抽屉 -->
    <el-drawer
      :title="isEdit?'编辑菜单':'新增菜单'"
      :wrapper-closable="false"
      :body-style="{ paddingBottom: '80px' }"
      :visible.sync="editOrAddMenuDrawerVisible"
      :modal-append-to-body="false"
    >
      <div class="formInDrawerBox">
        <el-form ref="form" :model="editOrAddMenuForm" size="medium" label-width="150px">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="menuType" @change="menuTypeChange">
              <el-radio :label="0">一级菜单</el-radio>
              <el-radio :label="1">子菜单</el-radio>
              <el-radio :label="2">按钮/权限</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="menuType === 0 || menuType === 1" label="菜单标题">
            <el-input v-model="editOrAddMenuForm.name" style="width: 300px" />
          </el-form-item>
          <el-form-item v-if="menuType === 2" label="按钮/权限(名称)">
            <el-input v-model="editOrAddMenuForm.name" style="width: 300px" />
          </el-form-item>
          <el-form-item v-if="menuType === 2" label="权限按钮标识">
            <el-popover :disabled="permissionTree.length === 0">
              <div style="max-height: 300px; overflow-y: scroll;">
                <el-tree :data="permissionTree" default-expand-all :expand-on-click-node="false" @node-click="({value})=>(editOrAddMenuForm = {...editOrAddMenuForm,permissionFlag:value})" />
              </div>
              <el-input slot="reference" v-model="editOrAddMenuForm.permissionFlag" style="width: 300px" />
            </el-popover>
          </el-form-item>
          <el-form-item v-if="menuType === 1 || menuType === 2" label="上级菜单">
            <!-- <el-input v-model="editOrAddMenuForm.parentId" style="width: 300px" /> -->
            <TreeSelect v-model="parentId" :data="tableData1" style="width: 240px" :props="{ label: 'name', children: 'children' }" />
          </el-form-item>
          <el-form-item v-if="menuType === 0 || menuType === 1" label="菜单路径">
            <el-input v-model="editOrAddMenuForm.url" style="width: 300px" />
          </el-form-item>
          <el-form-item v-if="menuType === 0 || menuType === 1" label="组件">
            <el-popover :disabled="permissionTree.length === 0">
              <div style="max-height: 300px; overflow-y: scroll;">
                <el-tree :data="permissionTree" default-expand-all :expand-on-click-node="false" @node-click="({value})=>(editOrAddMenuForm = {...editOrAddMenuForm,component:value})" />
              </div>
              <el-input slot="reference" v-model="editOrAddMenuForm.component" style="width: 300px" />
            </el-popover>
          </el-form-item>
          <el-form-item v-if="menuType === 0" label="一级菜单跳转地址">
            <el-input v-model="editOrAddMenuForm.redirect" style="width: 300px" />
          </el-form-item>
          <el-form-item v-if="menuType === 0 || menuType === 1" label="菜单图标">
            <el-input v-model="editOrAddMenuForm.icon" style="width: 300px">
              <el-button slot="suffix" icon="el-icon-s-tools" type="primary" style="margin-right:-10px;" @click="menuIcon()" />
            </el-input>
          </el-form-item>
          <el-form-item v-if="menuType === 0 || menuType === 1" label="排序">
            <el-input v-model="editOrAddMenuForm.sortNo" style="width: 300px" />
          </el-form-item>
          <el-form-item v-if="menuType === 0 || menuType === 1" label="是否路由菜单">
            <el-switch v-model="isRoute" />
          </el-form-item>
          <el-form-item v-if="menuType === 0 || menuType === 1" label="非展示路由">
            <el-switch v-model="showRoute" />
          </el-form-item>
        </el-form>
      </div>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <el-button size="medium" @click="cancelEditOrAddMenuBtn()">取消</el-button>
        <el-button size="medium" type="primary" @click="confirmEditOrAddMenuBtn()">确定</el-button>
      </div>
    </el-drawer>
    <!-- 图标选择框 -->
    <div>
      <el-dialog
        title="图标"
        :visible.sync="iconDialogVisible"
        width="50%"
        destroy-on-close
        :before-close="iconHandleClose"
        :modal-append-to-body="false"
      >
        <elementIcon @handleChange="getIconName" />
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="iconHandleClose()">取 消</el-button>
          <el-button size="medium" type="primary" @click="confirmSelectIcon">确 定</el-button>
        </span>

      </el-dialog>
    </div>
  </div>
</template>

<script>
import elementIcon from '@/components/elementIcon'
import TreeSelect from '@/components/TreeSelect'
import { genPermissionList } from '@/router/views'
export default {
  components: {
    elementIcon,
    TreeSelect
  },
  data() {
    return {
      permissionList: genPermissionList(),
      menuType: 0,
      selectData: [],
      iconDialogVisible: false,
      disabled: true,
      isRoute: false,
      showRoute: false,
      parentId: '',
      editOrAddMenuForm: {
        name: '',
        menuAttribution: '',
        url: '',
        delivery: false,
        icon: '',
        sortNo: '',
        componentName: ''
      },
      isEdit: false,
      editOrAddMenuDrawerVisible: false,
      currentRow: [],
      tableData1: []
    }
  },
  computed: {
    permissionTree() {
      return this.permissionList.filter(item => item.pid === 0)
    }
  },
  watch: {
    selectData: {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      }
    }
  },
  mounted() {
    this.menuQuery()
  },
  methods: {
    menuTypeFormat(val) {
      if (val.menuType === 0) {
        return '一级菜单'
      } else if (val.menuType === 1) {
        return '子菜单'
      } else {
        return '按钮/权限'
      }
    },
    confirmSelectIcon() {
      this.iconDialogVisible = false
      this.editOrAddMenuForm.icon = this.selectIcon
    },
    // 初始化弹框数据
    initData() {
      this.editOrAddMenuForm = {}
      this.isRoute = false
      this.showRoute = false
      this.parentId = ''
      this.menuType = 0
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    menuTypeChange(val) {
      this.initData()
      this.menuType = val
    },
    menuQuery(param = {}) {
      this.$http.getParam('/api/user/getPermissionInfo', { ...param }).then(data => {
        // console.log(data)
        this.tableData1 = data
      })
    },
    addMenuBtn() {
      this.isEdit = false
      this.editOrAddMenuDrawerVisible = true
    },
    editMenuBtn() {
      if (this.selectData.length !== 1) {
        this.$message('只能选中一条数据，请重新选择')
      } else {
        this.isEdit = true
        this.editOrAddMenuDrawerVisible = true
        this.$http.getParam('/api/user/getPermissionInfoById', { id: this.selectData[0].id }).then(data => {
          if (data.hidden) {
            this.showRoute = true
          } else {
            this.showRoute = false
          }
          // this.showRoute = data.hidden
          this.menuType = data.menuType
          this.parentId = data.parentId
          if (data.isRoute === 0) {
            this.isRoute = false
          } else {
            this.isRoute = true
          }
          delete data.menuType
          delete data.parentId
          delete data.isRoute
          delete data.createTime
          delete data.delFlag
          delete data.updateTime
          delete data.hidden
          this.editOrAddMenuForm = data
        })
      }
    },
    // 取消编辑或者新增
    cancelEditOrAddMenuBtn() {
      this.editOrAddMenuDrawerVisible = false
      if (this.isEdit) {
        this.$message('取消编辑操作')
      } else {
        this.$message('取消新增操作')
      }
      this.initData()
    },
    // 确认编辑或者信息
    confirmEditOrAddMenuBtn() {
      if (this.isRoute) {
        this.editOrAddMenuForm.isRoute = 1
      } else {
        this.editOrAddMenuForm.isRoute = 0
      }
      this.editOrAddMenuForm.parentId = this.parentId
      this.editOrAddMenuForm.menuType = this.menuType
      if (this.showRoute) {
        this.editOrAddMenuForm.hidden = 1
      } else {
        this.editOrAddMenuForm.hidden = 0
      }
      if (this.isEdit) {
        this.$http.post('/api/user/editPermissionVo', { ...this.editOrAddMenuForm }).then(data => {
          this.editOrAddMenuDrawerVisible = false
          this.$message.success('编辑成功')
          this.menuQuery()
          this.initData()
        })
      } else {
        this.$http.post('/api/user/addPermission', { ...this.editOrAddMenuForm }).then(data => {
          this.editOrAddMenuDrawerVisible = false
          this.$message.success('添加成功')
          this.menuQuery()
          this.initData()
        })
      }
    },
    deleteMenuBtn() {
      this.$confirm('此操作将删除菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = []
        this.selectData.forEach(item => {
          ids.push(item.id)
        })
        this.$http.post('/api/user/delBatchPermissionInfo', ids).then(res => {
          this.$message.success('删除成功')
          this.menuQuery()
        })
      }).catch(() => {
        this.$message('已取消删除')
      })
    },
    // 表头颜色
    headerBgColor() {
      return 'background: #f5f5f5'
    },
    // 树形表格数据加载
    load(tree, treeNode, resolve) {
    },
    // 菜单选中的数据
    menuHandleSelectionChange(val) {
      this.currentRow = val
      // console.log(val)
      // this.disabled = false
    },
    menuIcon() {
      this.iconDialogVisible = true
      // console.log('您点击了图标')
    },
    iconHandleClose() {
      this.iconDialogVisible = false
      this.editOrAddMenuForm.icon = ''
    },
    getIconName(name) {
      // console.log(name.class)
      this.selectIcon = name.class
    }
  }
}
</script>

<style lang="scss" scoped>
.containter{
  // background: #eee;
  padding: 10px;
}
.buttonRow{
  margin-bottom: 10px;
}
.formInDrawerBox{
  overflow: auto;
  height: 600px;
}
.common-list {
  min-height: calc(100% - 35px);
  margin: 0;
  margin-top: 12px;
}
</style>
