<!--
指令下发
by lcs
-->

<template>
  <el-dialog :title=" '编辑报文: ' + propDataForm.deviceName" visible :modal-append-to-body="false" destroy-on-close @close="$emit('close')">
    <JsonEditor v-model="cmdMessage" mode="json" type="textarea" rows="10" />
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="send">发送</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { parseTime } from '@/utils'
import JsonEditor from '@/components/JsonEditor'
import md5 from 'js-md5'

export default {
  components: { JsonEditor },

  props: {
    propDataForm: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      cmdMessage: '',
      dataForm: {}
    }
  },

  async mounted() {
    this.cmdMessage = JSON.stringify({ 'cmd': 'reboot' }, null, '  ')
    this.dataForm = { deviceId: this.propDataForm.id }
  },

  methods: {
    /**
     * 指令发送
     */
    async send() {
      this.loading = true
      const cmdMessage = JSON.parse(this.cmdMessage)
      cmdMessage.time = parseTime(new Date())
      const signStr = `${cmdMessage.cmd}${cmdMessage.val || ''}${cmdMessage.time}`
      const sign = md5(signStr)
      console.log('signStr', signStr)
      console.log('sign', sign)
      cmdMessage.sign = sign
      const param = { ...this.dataForm, cmdMessage }
      await this.$http.post('adminDevice/sendDeviceControlCmd', param)
      this.$success('发送成功')
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

<style>

</style>
