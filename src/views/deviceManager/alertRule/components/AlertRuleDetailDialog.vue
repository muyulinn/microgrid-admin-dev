<!--
  告警类型详情
-->
<template>
  <el-dialog title="详情" visible append-to-body destroy-on-close @close="$emit('close')">
    <el-tabs>
      <el-tab-pane label="规则详情">
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item label="告警规则名称">
            {{ dataForm.alertRuleName }}
          </el-descriptions-item>
          <el-descriptions-item label="告警等级">
            {{ dataForm.alertLevel|alertRule.alertLevel }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            {{ dataForm.alertStatus|alertRule.alertStatus }}
          </el-descriptions-item>
          <el-descriptions-item label="马上告警">
            <pre>{{ dataForm.lastFor | lastFor }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="备注" span="2">
            {{ dataForm.remark }}
          </el-descriptions-item>
          <el-descriptions-item label="告警规则" span="2">
            <!-- <pre>{{ dataForm.rules }}</pre> -->
            <AlertRuleEditor :expr="dataForm.expr" :disabled="true" :room-id="dataForm.roomId" />
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <pre>{{ dataForm.createTime }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <pre>{{ dataForm.updateTime }}</pre>
          </el-descriptions-item>
          <el-descriptions-item label="消息模版" span="2">
            <pre>{{ dataForm.message }}</pre>
          </el-descriptions-item>

        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="告警事件">
        <DeviceAlertTab :prop-data-form="{'roomId':roomId}" :data-filter="deviceAlertFilter" />
      </el-tab-pane>
      <el-tab-pane label="告警记录">
        <DeviceAlertRecordTab :query-form="{'alertRuleId':dataForm.id}" />
      </el-tab-pane>

    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">关闭</el-button>
    </div>
  </el-dialog>

</template>

<script>
import AlertRuleEditor from './AlertRuleEditor.vue'
import DeviceAlertRecordTab from '../../deviceList/components/DeviceAlertRecordTab.vue'
import DeviceAlertTab from '../../deviceList/components/DeviceAlertTab.vue'

export default {
  components: { AlertRuleEditor, DeviceAlertTab, DeviceAlertRecordTab },
  filters: {
    lastFor(val) {
      const num = val.match(/\d+/)[0] * 1
      if (num) {
        return `持续${num}钟后告警`
      }
      return '马上告警'
    }
  },
  props: {
    propDataForm: {
      type: Object,
      default: () => ({})
    },
    roomId: {
      type: Number,
      default: () => null
    }

  },
  data() {
    return {
      loading: false,
      rules: {

      },
      dataForm: {
        sortNum: 0
      }
    }
  },
  computed: {

  },
  created() {},
  async mounted() {
    this.dataForm = { ...this.dataForm, ...this.propDataForm }
  },
  methods: {
    deviceAlertFilter({ alertRuleId }) {
      return alertRuleId === this.dataForm.id
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
