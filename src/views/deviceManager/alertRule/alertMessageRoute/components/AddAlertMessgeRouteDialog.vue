<!--
  告警通知策略添加、修改
-->
<template>
  <el-dialog v-loading="loading" append-to-body :title="isEdit ? '编辑' : '添加'" visible :modal-append-to-body="false" destroy-on-close @close="$emit('close')">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="110px">
      <el-form-item label="用户" prop="users" required>
        <el-tag
          v-for="(user,index) in dataForm.users||[]"
          :key="user.id"
          style="margin-right:10px;"
          :closable="!isEdit"
          @close="dataForm.users.splice(index,1)"
        >
          {{ user.userName }}
        </el-tag>
        <el-button v-if="!isEdit" type="default" @click="selectUserDialogVisble = true">选择</el-button>
      </el-form-item>
      <el-form-item label="设备" prop="device" required>
        <el-tag
          v-if="dataForm.device"
          style="margin-right:10px;"
          :closable="!isEdit"
          @close="dataForm = {...dataForm,device:null}"
        >
          {{ dataForm.device.deviceName }}
        </el-tag>
        <el-button v-if="!isEdit" type="default" @click="selectDeviceDialogVisble = true">选择</el-button>
      </el-form-item>
      <el-form-item label="是否包含下级" prop="includeChild" required>
        <el-select v-model="dataForm.includeChild">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警等级" prop="alertLevel">
        <el-select v-model="dataForm.alertLevel">
          <enum-option enum="alertRule.alertLevel" />
        </el-select>
      </el-form-item>
      <el-form-item label="通知渠道">
        <el-select v-model="dataForm.channel" disabled>
          <enum-option enum="alertMessageRoute.channel" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="routeStatus" required>
        <el-select v-model="dataForm.routeStatus">
          <enum-option enum="alertMessageRoute.routeStatus" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="isEdit ? update() : create()">确定</el-button>
    </div>
    <UserSelectDialog
      v-if="selectUserDialogVisble"
      @close="selectUserDialogVisble=false"
      @done="({selection}) => (dataForm = {...dataForm,users:selection})"
    />

    <DeviceSelectDialog
      v-if="selectDeviceDialogVisble"
      @close="selectDeviceDialogVisble=false"
      @done="device=>(dataForm = {...dataForm,device})"
    />
  </el-dialog>

</template>

<script>
import { required } from '@/utils/rules'
import UserSelectDialog from './UserSelectDialog.vue'
import DeviceSelectDialog from './DeviceSelectDialog.vue'
import { initValidate } from '@/utils/rules'
export default {
  components: { UserSelectDialog, DeviceSelectDialog },
  props: {
    propDataForm: {
      type: Object,
      default: () => ({})
    }

  },
  data() {
    return {
      loading: false,
      selectUserDialogVisble: false,
      selectDeviceDialogVisble: false,

      rules: {
        routeStatus: [required],
        includeChild: [required],
        users: [initValidate((val, assert) => {
          assert(this.dataForm.users && this.dataForm.users.length > 0, '请至少选一个用户')
        })],
        device: [initValidate((val, assert) => {
          assert(this.dataForm.device, '请选一个设备')
        })]
      },
      dataForm: {
        channel: 'SMS'
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.dataForm.id
    }
  },
  created() {},
  async mounted() {
    this.dataForm = { ...this.dataForm, ...this.propDataForm }
    if (this.dataForm.userName) {
      this.dataForm.users = [{ userName: this.dataForm.userName }]
    }
    if (this.dataForm.deviceName) {
      this.dataForm.device = { deviceName: this.dataForm.deviceName }
    }
  },
  methods: {
    /**
     * 创建策略
     */
    async create() {
      await this.$refs.dataForm.validate()
      const data = { ...this.dataForm,
        userIds: this.dataForm.users.map(a => a.id),
        deviceId: this.dataForm.device.id,
        device: null,
        users: null
      }
      this.loading = true
      await this.$http.post('adminAlert/createAlertMessageRoute', data)
      this.$success('操作成功')
      this.$emit('close')
      this.$emit('done')
    },
    /**
     * 更新
     */
    async update() {
      await this.$refs.dataForm.validate()
      const data = { ...this.dataForm,
        device: null, users: null,
        userIds: [this.dataForm.userId]
      }
      this.loading = true
      await this.$http.post('adminAlert/updateAlertMessageRoute', data)
      this.$success('操作成功')
      this.$emit('close')
      this.$emit('done')
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
