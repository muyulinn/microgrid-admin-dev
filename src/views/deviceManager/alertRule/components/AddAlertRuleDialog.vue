<!--
  告警类型添加、修改
-->
<template>
  <el-dialog v-loading="loading" :title="title" visible append-to-body destroy-on-close @close="$emit('close')">

    <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="110px">
      <el-form-item label="告警规则名称" prop="alertRuleName" required>
        <el-input v-model="dataForm.alertRuleName" />
      </el-form-item>
      <el-form-item label="告警等级" prop="alertLevel" required>
        <el-select v-model="dataForm.alertLevel">
          <enum-option :data="$store.getters.enumData.alertRule.alertLevel.filter(a=>a.val!== 'L0')" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="alertStatus" required>
        <el-select v-model="dataForm.alertStatus">
          <enum-option enum="alertRule.alertStatus" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sortNum" required>
        <el-input v-model="dataForm.sortNum" type="number" />
      </el-form-item>
      <el-form-item label="告警规则" prop="expr" required>
        <el-radio-group v-model="dataForm.editorMode" size="mini">
          <el-radio-button label="code" />
          <el-radio-button label="builder" />
        </el-radio-group>
        <JsonEditor v-if="dataForm.editorMode === 'code'" v-model="dataForm.expr" mode="js" type="textarea" rows="3" />
        <AlertRuleEditor v-else :room-id="dataForm.roomId" :expr.sync="dataForm.expr" style="border:1px solid rgb(220, 223, 230);border-radius:4px ;" />
        <!-- <el-input v-model="dataForm.expr" type="textarea" /> -->
      </el-form-item>
      <el-form-item label="马上告警" prop="now" required>
        <el-col :span="6">
          <el-radio v-model="dataForm.now" :label="true">马上告警</el-radio>
        </el-col>
        <el-col :span="18">
          <el-radio v-model="dataForm.now" :label="false">延迟告警</el-radio>
          持续<el-input v-model="dataForm.lastFor" :disabled="dataForm.now" type="number" style="width:100px" />分钟后告警
        </el-col>
      </el-form-item>
      <el-form-item label="告警消息模版" prop="message" required>
        <!-- <JsonEditor v-model="dataForm.message" mode="yaml" type="textarea" rows="3" /> -->
        <el-input v-model="dataForm.message" type="textarea" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="isEdit ? edit() : add()">确定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { required } from '@/utils/rules'
import AlertRuleEditor from './AlertRuleEditor.vue'
import JsonEditor from '@/components/JsonEditor'
export default {
  components: { AlertRuleEditor, JsonEditor },
  props: {
    propDataForm: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      yaml: {},
      rules: {
        alertRuleName: [required],
        alarmLevel: [required],
        alarmStatus: [required],
        sortNum: [required],
        rules: [required]
      },
      dataForm: {
        sortNum: 0
      },
      roomInfo: {}
    }
  },
  computed: {
    isEdit() {
      return !!this.dataForm.id
    },
    title() {
      return `${this.isEdit ? '编辑' : '添加'} | 当前机房：${this.roomInfo.deviceName}`
    }

  },
  created() {},
  async mounted() {
    this.dataForm = { now: true, ...this.dataForm, ...this.propDataForm }
    this.roomInfo = await this.$http.getParam('adminDevice/deviceInfo', { id: this.dataForm.roomId })
  },
  methods: {
    async add() {
      debugger
      await this.$refs.dataForm.validate()
      let lastFor = '0s'
      if (!this.dataForm.now) {
        lastFor = this.dataForm.lastFor + 'm'
      }
      this.loading = true

      await this.$http.post('adminAlert/addAlertRule', { ...this.dataForm, lastFor })
      this.$success('操作成功')
      this.$emit('close')
      this.$emit('done')
    },
    async edit() {
      await this.$refs.dataForm.validate()
      this.loading = true
      let lastFor = '0s'
      if (!this.dataForm.now) {
        lastFor = this.dataForm.lastFor + 'm'
      }
      await this.$http.post('adminAlert/updateAlertRule', { ...this.dataForm, lastFor })
      this.$success('操作成功')
      this.$emit('close')
      this.$emit('done')
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
