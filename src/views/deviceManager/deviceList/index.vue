<!--
  设备列表
  by lcs
-->
<template>
  <div v-loading="loading" class="zs-container common-shadow common-list" style="padding: 15px 10px ; ">
    <el-row style="display: flex;">
      <el-col :span="3" class="common-shadow" style="margin-right: 10px; padding: 10px; ">
        <el-tree
          ref="tree"
          style="max-width: 160px;overflow: scroll;"
          :load="loadTreeData"
          :expand-on-click-node="false"
          :default-expanded-keys="['0']"
          node-key="id"
          lazy
          highlight-current
          draggable
          :allow-drop="allowDrop"
          :allow-drag="node=>node.level>1"
          @node-click="clickTree"
          @node-drop="nodeDrop"
        >
          <span slot-scope="{ data }" class="custom-tree-node">
            {{ data.deviceName }}
          </span>
        </el-tree>
      </el-col>
      <el-col :span="21">
        <page-table
          ref="pageTable"
          :query="query"
          :selection.sync="selection"
          @reset="queryForm = {}"
        >
          <template #query-form>
            <el-form-item label="设备名称">
              <el-input v-model="queryForm.deviceName" class="query-form-item" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="queryForm.deviceStatus" clearable>
                <enum-option enum="deviceInfo.deviceStatus" />
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="queryForm.deviceType" clearable>
                <enum-option enum="deviceInfo.deviceType" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备UUID">
              <el-input v-model="queryForm.deviceUuid" class="query-form-item" clearable />
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
            <el-button v-permission="'deviceInfo.btn_add'" type="primary" icon="el-icon-circle-plus-outline" @click="dataForm = { deviceType: 'ROOM' } ,parent={},addDialogVisible = true">创建机房</el-button>
            <!-- <el-button type="success" icon="el-icon-circle-plus-outline" @click="dataForm = { } ,addDialogVisible = true">添加设备</el-button> -->
            <el-button v-permission="'deviceInfo.btn_delete'" type="danger" icon="el-icon-refresh" @click="batchDelete">批量删除</el-button>

            <el-button v-permission="'deviceInfo.btn_import'" type="info" @click="showImportDialog">导入</el-button>

          </template>

          <template slot="table-body">
            <el-table-column type="selection" />
            <el-table-column type="index" label="NO" prop="id" />
            <el-table-column label="名称" prop="deviceName" width="150" />
            <el-table-column label="uuid" prop="deviceUuid" width="260" />
            <el-table-column label="型号" prop="deviceMode" />
            <el-table-column label="标签" prop="deviceLabel" />
            <el-table-column label="所属机构" prop="orgName" width="130" />
            <el-table-column label="状态" prop="deviceStatus" :formatter="$formatEnum('deviceInfo.deviceStatus')" />
            <el-table-column label="类型" prop="deviceType" :formatter="(row, col, val)=>$formatEnum('deviceInfo.deviceType',val).apply(null,[row, col, val])" />
            <el-table-column label="创建时间" prop="createTime" width="160" />
            <el-table-column :label="'操作'" width="300">
              <template #default="{ row }">
                <el-link type="info" plain @click="(dataForm = {...row}), (deviceInfoDialogVisible = true)">查看</el-link>
                <el-link v-permission="'deviceInfo.btn_edit'" type="info" plain @click="editDeviceInfo(row)">编辑信息</el-link>
                <el-link v-permission="'deviceInfo.btn_attr'" type="info" plain @click="(dataForm = { ...row }), (editAttributeDialogVisible = true)">编辑属性</el-link>
                <el-link v-permission="'deviceInfo.btn_add'" type="info" plain @click="(dataForm = { },parent={...row}), addDialogVisible=true">添加设备</el-link>
                <el-link v-permission="'deviceInfo.btn_send_cmd'" type="info" plain @click="(dataForm = { ...row}), sendDeviceControlCmdDialogVisible=true">下发控制</el-link>
                <el-link v-if="row.deviceType === 'ROOM'" v-permission="'deviceInfo.btn_add_rule'" type="info" plain @click="(dataForm = { ...row}), addAlertRuleDialogVisible=true">告警规则</el-link>
              </template>
            </el-table-column>
          </template>
        </page-table>
      </el-col>
    </el-row>

    <add-device-dialog
      v-if="addDialogVisible"
      :prop-data-form="dataForm"
      :parent="parent"
      @close="addDialogVisible=false"
      @done="$refs.pageTable.reload(),reloadTree()"
    />
    <device-attribute-dialog
      v-if="editAttributeDialogVisible"
      :prop-data-form="dataForm"
      @close="editAttributeDialogVisible=false"
      @done="$refs.pageTable.reload()"
    />
    <device-info-dialog
      v-if="deviceInfoDialogVisible"
      :prop-data-form="dataForm"
      @close="deviceInfoDialogVisible=false"
    />
    <SendDeviceControlCmdDialog
      v-if="sendDeviceControlCmdDialogVisible"
      :prop-data-form="dataForm"
      @close="sendDeviceControlCmdDialogVisible=false"
    />
    <AlertRuleDetailDialog
      v-if="addAlertRuleDialogVisible"
      :prop-data-form="dataForm"
      @close="addAlertRuleDialogVisible=false"
    />
    <ImportDeviceDialog
      v-if="importDeviceDialogVisible"
      :prop-data-form="dataForm"
      @close="importDeviceDialogVisible=false"
      @done="$refs.pageTable.reload(),reloadTree()"
    />
  </div>
</template>

<script>
import AddDeviceDialog from './components/AddDeviceDialog'
import DeviceAttributeDialog from './components/DeviceAttributeDialog'
import DeviceInfoDialog from './components/DeviceInfoDialog'
import SendDeviceControlCmdDialog from './components/SendDeviceControlCmdDialog.vue'
import AlertRuleDetailDialog from './components/AddAlertRuleDialog.vue'
import ImportDeviceDialog from './components/ImportDeviceDialog.vue'
import { Message } from 'element-ui'

const ROOT_KEY = 0
export default {
  name: 'DeviceList',
  components: { AddDeviceDialog, DeviceAttributeDialog, DeviceInfoDialog, SendDeviceControlCmdDialog, AlertRuleDetailDialog, ImportDeviceDialog },
  props: {},
  data() {
    return {
      editAttributeDialogVisible: false,
      sendDeviceControlCmdDialogVisible: false,
      addDialogVisible: false,
      addAlertRuleDialogVisible: false,
      deviceInfoDialogVisible: false,
      importDeviceDialogVisible: false,
      queryForm: {},
      parent: {},
      loading: true,
      selection: []
    }
  },

  created() {},
  mounted() {
    this.query()
  },
  methods: {
    /**
     * 加载设备树数据
     */
    async loadTreeData({ level, data }, resolve) {
      if (level === 0) {
        return resolve([{
          deviceName: '所有',
          id: ROOT_KEY,
          children: []
        }])
      }
      const param = { size: 1000 }
      if (level === 1) {
        param.deviceType = 'ROOM'
      } else {
        param.parentId = data.id
      }

      const list = await this.$http.getParam('/adminDevice/page', param).then(json => json.records)
      resolve(list.sort((a, b) => a.sortNum - b.sortNum))
    },
    /**
     *重新加载树
     */
    async reloadTree() {
      const node = this.$refs.tree.getNode(this.parent.id || ROOT_KEY)
      node.loaded = false
      node.expand()
    },

    /**
     * 列表查询
     */
    query(param = {}) {
      return this.$http.getParam('/adminDevice/page', { ...param, ...this.queryForm })
    },

    /**
     * 点击树进行过滤查询
     * @param {*} data
     */
    clickTree(data) {
      if (!data.id) {
        this.queryForm = { parentId: null, includeChild: null }
      } else {
        this.queryForm = { parentId: data.id, id: data.id, includeChild: 1 }
      }
      this.$refs.pageTable.reload()
    },
    /**
     * 打开编辑窗口
     */
    async editDeviceInfo(row) {
      this.loading = true
      this.parent = {}
      if (row.parentId) {
        this.parent = await this.$http.getParam('adminDevice/deviceInfo', { id: row.parentId })
      }
      this.dataForm = { ...row }
      this.addDialogVisible = true
    },
    /**
     * 批量删除
     */
    async batchDelete() {
      await this.$refs.pageTable.checkSelection()
      this.loading = true
      let ids = this.selection.map(i => i.id)
      const subIds = await Promise.all(ids.map(parentId => this.$http.getParam('/adminDevice/page', { size: 100, parentId, includeChild: 1 }).then(json => json.records.map(({ id }) => id))))
      ids = ids.concat(subIds.flat())
      ids = Array.from(new Set(ids))
      await this.$confirm(`共删除 ${ids.length} 条记录，确认操作`)
      await this.$http.post('adminDevice/deleteDevices', { ids, deviceStatus: 0 })
      this.$success('操作成功')
      this.$refs.pageTable.reload()
      this.parent = {}
      this.reloadTree()
    },
    /**
     * excel数据导入
     */
    async showImportDialog() {
      await this.$refs.pageTable.checkSelection('请先选一行记录作为上级', 1, 1)
      this.dataForm = this.selection[0]
      if (!this.dataForm) {
        Message.error('请先选一行记录作为上级')
        return
      }
      this.importDeviceDialogVisible = true
    },

    /**
     * 判断节点能否拖拽
     * @param {*} dragNode
     * @param {*} dropNode
     * @param {*} ev
     */
    allowDrop(dragNode, dropNode, ev) {
      console.log('allowDrop', dragNode, dropNode, ev)

      if (dragNode.data.deviceType === 'ROOM') {
        if (dropNode.data.parentId) return false
        if (dropNode.level !== 2) return false
        if (ev === 'inner') return false
        return true
      } else {
        if (dropNode.data.treeLevel <= 0) return false
        const dragNodeRootId = dragNode.data.treePath.match(/^\d+/)[0] * 1
        const dropNodeRootId = dropNode.data.treePath.match(/^\d+/)[0] * 1
        console.log('dragNodeRootId', dragNodeRootId, dropNodeRootId)
        if (dragNodeRootId !== dropNodeRootId) return false
        return true
      }
      // return false
    },
    /**
     * 拖拽结束
     * @param {*} dragNode
     * @param {*} dropNode
     * @param {*} ev
     * @param {*} e
     */
    async nodeDrop(dragNode, dropNode, ev, e) {
      console.log('nodeDrop', dragNode, dropNode, ev, e)
      const parentNode = this.$refs.tree.getNode(dropNode.data.parentId || ROOT_KEY)
      this.loading = true

      try {
        await this._updateParent(dragNode, dropNode, ev, parentNode)
        await this._updateDeviceSorte1(parentNode, ev)
      } catch (e) {
        parentNode.loaded = false
        parentNode.expand()
        throw e
      }
    },

    /**
     * 更新父节点
     * @param {*} dragNode
     * @param {*} dropNode
     * @param {*} ev
     */
    async _updateParent(dragNode, dropNode, ev) {
      let parentId = dropNode.data.parentId
      if (ev === 'inner') {
        await this.$confirm(`确认移到【${dropNode.data.deviceName}】下面`)
        parentId = dropNode.data.id
      }
      if (dragNode.data.parentId !== parentId) {
        await this.$http.post('/adminDevice/updateDeviceParent', { id: dragNode.data.id, parentId })
      }
    },

    /**
     * 更新设备排序
     * @param {*} dragNode
     * @param {*} dropNode
     * @param {*} ev
     */
    async _updateDeviceSorte1(parentNode, ev) {
      console.log('parentNode', parentNode)
      if (ev === 'inner') {
        return
      }
      const param = parentNode.childNodes.map((node, sortNum) => ({ id: node.data.id, sortNum }))
      if (param.length > 1) {
        await this.$http.post('/adminDevice/updateDeviceSort', param)
      }

      // this.$refs.tree.getNode(dropNode)
      // dropNode
    },

    /**
     * 异步方法结束统一处理
     */
    _finallyHandle() {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.zs-container{
  ::v-deep {
    .el-table{
      overflow-y: scroll; height: calc(100vh - 320px);
    }
  }
}
</style>
