<!--
  设备添加、修改
-->
<template>
  <el-dialog :title="isEdit ? '编辑' : '添加'" visible :modal-append-to-body="false" destroy-on-close @close="$emit('close')">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" :loading="loading" label-width="110px">
      <el-form-item v-if="!isRoom" label="所属上级">
        <el-input v-model="parent.deviceName" disabled />
      </el-form-item>
      <el-form-item label="名称" prop="deviceName" required>
        <el-input v-model="dataForm.deviceName" />
      </el-form-item>
      <el-form-item v-if="propDataForm.deviceType !== 'ROOM'" label="分类" prop="deviceType" required>
        <el-select v-model="dataForm.deviceType">
          <enum-option enum="deviceInfo.deviceType" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isEdit" label="状态" prop="deviceStatus" required>
        <el-select v-model="dataForm.deviceStatus">
          <enum-option enum="deviceInfo.deviceStatus" />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="chargeName">
        <el-input v-model="dataForm.chargeName" />
      </el-form-item>
      <el-form-item label="负责人电话" prop="chargePhone">
        <el-input v-model="dataForm.chargePhone" />
      </el-form-item>
      <el-form-item label="位置" prop="position">
        <el-input v-model="dataForm.position" />
      </el-form-item>
      <el-form-item label="uuid" prop="deviceUuid">
        <el-input v-model="dataForm.deviceUuid" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="档案附件" prop="attachmentList">
        <el-col :span="24">
          <el-tag v-for=" (item,index) in dataForm.attachmentList" :key="index" closable style="margin-right: 3px;" @close="removeItem(index)">
            {{ item.name }}
          </el-tag>
          <el-upload v-if="dataForm.attachmentList.length < 5" :disabled="uploading" action="" :http-request="uploadAttachment" style="display: inline; margin: 10px;" :show-file-list="false">
            <el-button type="primary" :loading="uploading">上传</el-button>
          </el-upload>
        </el-col>
      </el-form-item>

      <template v-if="!isRoom">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签" prop="deviceLabel">
              <el-input v-model="dataForm.deviceLabel" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="deviceModel">
              <el-input v-model="dataForm.deviceModel" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="通讯协议" prop="protocol">
              <el-input v-model="dataForm.protocol" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="串口号" prop="serialPort">
              <el-input v-model="dataForm.serialPort" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="通讯地址" prop="address">
              <el-input v-model="dataForm.address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="波特率" prop="baudRate">
              <el-input v-model="dataForm.baudRate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="寄存器地址" prop="regStartAddr">
              <el-input v-model="dataForm.regStartAddr" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="寄存器数量" prop="regNumber">
              <el-input v-model="dataForm.regNumber" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="保修截止" prop="expireTime">
              <el-date-picker
                v-model="dataForm.expireTime"
                value-format="yyyy-MM-dd 00:00:00"
                type="date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维护周期" prop="maintainSchedule">
              <el-input v-model="dataForm.maintainSchedule" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="生产日期" prop="produceTime">
              <el-date-picker
                v-model="dataForm.produceTime"
                value-format="yyyy-MM-dd 00:00:00"
                type="date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="producer">
              <el-input v-model="dataForm.producer" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="安装日期" prop="installDate">
              <el-date-picker
                v-model="dataForm.installDate"
                value-format="yyyy-MM-dd 00:00:00"
                type="date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装单位" prop="installUnit">
              <el-input v-model="dataForm.installUnit" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="验收日期" prop="acceptanceDate">
              <el-date-picker
                v-model="dataForm.acceptanceDate"
                value-format="yyyy-MM-dd 00:00:00"
                type="date"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用年限" prop="userAge">
              <el-input v-model="dataForm.userAge" type="number" min="0">
                <template slot="append">年</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="购买日期" prop="purchaseDate">
              <el-date-picker
                v-model="dataForm.purchaseDate"
                value-format="yyyy-MM-dd 00:00:00"
                type="date"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="使用年限" prop="userAge">
              <el-input v-model="dataForm.userAge" type="number" />年
            </el-form-item>
          </el-col> -->
        </el-row>

      </template>
      <template v-else>
        <el-form-item label="所属机构" prop="orgId">
          <el-select v-model="dataForm.orgId">
            <el-option
              v-for="item in orgList"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="isEdit ? edit() : add()">确定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { required } from '@/utils/rules'
import { upload } from '@/utils'
import { Message } from 'element-ui'
export default {
  name: 'AddDeviceDialog',
  props: {
    propDataForm: {
      type: Object,
      default: () => ({})
    },
    parent: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      uploading: false,
      rules: {
        deviceName: [{ ...required, message: '*' }],
        deviceType: [required]
      },
      dataForm: {
        attachmentList: []
      },
      orgList: []
    }
  },
  computed: {
    isEdit() {
      return !!this.dataForm.id
    },
    isRoom() {
      return this.propDataForm.deviceType === 'ROOM'
    }
  },
  created() {},
  async mounted() {
    this.dataForm.parentId = this.parent?.id
    if (this.propDataForm.id) {
      this.dataForm = { ...this.propDataForm }
    }
    if (this.isRoom) {
      this.orgList = await this.$http.getParam('/user/getOrganizationVoList', { size: 5000 }).then(json => json.records)
    }
    this.dataForm.attachmentList = this.dataForm.attachmentList || []
  },
  methods: {
    /**
     *  添加
     */
    async add() {
      await this.$refs.dataForm.validate()
      this.loading = true
      this.dataForm.deviceType = this.dataForm.deviceType || this.propDataForm.deviceType
      await this.$http.post('adminDevice/add', this.dataForm)
      this.$success('创建成功')
      this.$emit('close')
      this.$emit('done')
    },
    /**
     * 更新
     */
    async edit() {
      await this.$refs.dataForm.validate()
      this.loading = true
      await this.$http.post('adminDevice/update', this.dataForm)
      this.$success('操作成功')
      this.$emit('close')
      this.$emit('done')
    },
    /**
     * 附件上传
     */
    async uploadAttachment({ file }) {
      this.uploading = true
      let code
      try {
        code = await upload(file).then(a => a.code)
      } catch (e) {
        Message.error('上传失败')
        return
      } finally {
        this.uploading = false
      }

      this.$success('上传成功')
      const name = file.name
      let type = file.name.match(/\.\w+$/)
      type = type ? type[0] : 'unknow'
      this.dataForm.attachmentList.push({ code, type, name })

      this.dataForm.attachmentList = [...this.dataForm.attachmentList]
    },
    /**
     * 移除附件
     */
    removeItem(index) {
      this.dataForm.attachmentList.splice(index, 1)
      this.dataForm.attachmentList = [...this.dataForm.attachmentList]
    }

  }
}
</script>

<style lang="scss" scoped>
.el-date-editor.el-input{
  width: 100%;
}
</style>
