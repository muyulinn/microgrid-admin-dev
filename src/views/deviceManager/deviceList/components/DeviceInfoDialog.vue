<!--
  设备信息
-->
<template>
  <el-dialog :title="'详情: ' + dataForm.deviceName" visible :modal-append-to-body="false" destroy-on-close @close="$emit('close')">
    <el-tabs style="min-height:500px">
      <el-tab-pane :label="isRoom?'机房信息':'设备信息'">
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item label="名称">
            {{ dataForm.deviceName }}
          </el-descriptions-item>
          <el-descriptions-item label="记录ID" :rowspan="2">
            {{ dataForm.id }}
            <el-link v-clipboard:copy="dataForm.id" v-clipboard:success="()=>$success('复制成功')" type="primary">
              复制
            </el-link>
            <el-popover
              placement="top-start"
              trigger="click"
            >
              <qrcode-vue ref="rqCode" class="print-code" :value="qrcodeValue" :size="122" level="Q" />
              <span>
                使用微信小程序查看
              </span>
              <el-button slot="reference" style="margin-left: 5px; padding: 5px 3px;" size="small">
                <svg-icon icon-class="qrcode" style="font-size: 16px;" />
              </el-button>
            </el-popover>

          </el-descriptions-item>

          <template v-if="!isRoom">
            <el-descriptions-item label="分类">
              {{ dataForm.deviceType | deviceInfo.deviceType }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              {{ dataForm.deviceStatus | deviceInfo.deviceStatus }}
            </el-descriptions-item>
            <el-descriptions-item label="型号">
              {{ dataForm.deviceModel }}
            </el-descriptions-item>
            <el-descriptions-item label="标签">
              {{ dataForm.deviceLabel }}
            </el-descriptions-item>
            <el-descriptions-item label="通讯协议">
              {{ dataForm.protocol }}
            </el-descriptions-item>
            <el-descriptions-item label="串口号">
              {{ dataForm.serialPort }}
            </el-descriptions-item>
            <el-descriptions-item label="通讯地址">
              {{ dataForm.address }}
            </el-descriptions-item>
            <el-descriptions-item label="波特率">
              {{ dataForm.baudRate }}
            </el-descriptions-item>
            <el-descriptions-item label="寄存器地址">
              {{ dataForm.regStartAddr }}
            </el-descriptions-item>
            <el-descriptions-item label="寄存器数量">
              {{ dataForm.regNumber }}
            </el-descriptions-item>
            <el-descriptions-item label="保修截止">
              {{ dataForm.expireTime|dateFormat }}
            </el-descriptions-item>
            <el-descriptions-item label="维护周期">
              {{ dataForm.maintainSchedule }}
            </el-descriptions-item>
            <el-descriptions-item label="生产日期">
              {{ dataForm.produceTime |dateFormat }}
            </el-descriptions-item>
            <el-descriptions-item label="生产厂家">
              {{ dataForm.producer }}
            </el-descriptions-item>
          </template>

          <el-descriptions-item label="所属机构">
            {{ dataForm.orgName }}
          </el-descriptions-item>

          <el-descriptions-item label="负责人">
            {{ dataForm.chargeName }}
          </el-descriptions-item>
          <el-descriptions-item label="负责人电话">
            {{ dataForm.chargePhone }}
          </el-descriptions-item>
          <el-descriptions-item label="位置">
            {{ dataForm.position }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ dataForm.createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="档案附件">
        <DeviceAttachmentTab :attachment-list="dataForm.attachmentList" />
      </el-tab-pane>
      <el-tab-pane label="属性列表">
        <el-table :data="dataForm.attributeList">
          <el-table-column type="index" />
          <el-table-column prop="key" label="属性值" />
          <el-table-column prop="keyName" label="属性名" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="unit" label="单位" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="告警事件">
        <DeviceAlertTab :prop-data-form="propDataForm" />
      </el-tab-pane>
      <el-tab-pane label="告警记录">
        <DeviceAlertRecordTab :device-id="dataForm.id" />
      </el-tab-pane>
      <el-tab-pane label="实时读数">
        <RealTimeMetricsTab
          :data-form="dataForm"
        />
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">关闭</el-button>
    </div>
  </el-dialog>

</template>

<script>
import clipboard from '@/directive/clipboard/clipboard'
import DeviceAlertRecordTab from './DeviceAlertRecordTab'
import RealTimeMetricsTab from './RealTimeMetricsTab'
import DeviceAttachmentTab from './DeviceAttachmentTab'
import DeviceAlertTab from './DeviceAlertTab.vue'
import QrcodeVue from 'qrcode.vue'
import { parseTime } from '@/utils'
export default {
  name: 'AddDeviceDialog',
  components: { DeviceAlertRecordTab, RealTimeMetricsTab, DeviceAttachmentTab, QrcodeVue, DeviceAlertTab },
  directives: { clipboard },
  filters: {
    dateFormat(val) {
      return parseTime(val, '{y}-{m}-{d}')
    }
  },
  props: {
    propDataForm: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      dataForm: {}
    }
  },
  computed: {
    isRoom() {
      return this.propDataForm.deviceType === 'ROOM'
    },
    qrcodeValue() {
      return `https://miniprogram.microgrid.jiahuagd.com.cn/deviceInfo?id=${this.dataForm.id}`
    }

  },
  created() {},
  async mounted() {
    this.dataForm = { ...this.propDataForm }
    console.log('this.dataForm', this.dataForm)
  }
}
</script>

<style lang="scss" scoped>

</style>

