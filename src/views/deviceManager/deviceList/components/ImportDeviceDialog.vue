<!--
设备导入
by lcs
-->
<template>
  <el-dialog title="设备导入" visible :modal-append-to-body="false" destroy-on-close width="400px" @close="$emit('close')">
    <el-form ref="dataForm" :model="dataForm" :rules="rules" :loading="loading" label-width="110px">
      <el-alert :closable="false" type="warning">
        <template #default>
          请下载模板，按格式修改后导入 <el-button><el-link target="_blank" href="https://oss.jiahuagd.com.cn/public/projects/microgrid/file/设备导入模板.xlsx">下载模版</el-link></el-button>
        </template>
      </el-alert>
      <el-form-item label="选中设备节点">
        {{ propDataForm.deviceName }}
      </el-form-item>

      <el-form-item label="">
        <el-upload v-permission="'deviceInfo.btn_import'" action="" :http-request="uploadFile" style="display: inline; margin: 10px;" :show-file-list="false">
          <el-button type="info">选择文件</el-button>
        </el-upload>
        <span v-if="dataForm.code">已选文件</span>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="excelImport">确定导入</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { upload } from '@/utils'
import { Message } from 'element-ui'
export default {
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
      rules: {
      },
      dataForm: {}
    }
  },

  created() {},
  async mounted() {
    this.dataForm = { parentId: this.propDataForm.id }
  },
  methods: {
  /**
   * 文件文件
   * @param {*} e
   */
    async uploadFile(e) {
      this.loading = true
      const { code } = await upload(e.file)
      this.dataForm = { ...this.dataForm, code }
      this.loading = false
    },
    /**
     * excel数据导入
     */
    async excelImport() {
      if (!this.dataForm.code) {
        Message.error('请先上传文件')
        return
      }

      this.loading = true
      await this.$http.post('adminDevice/excelImport', { ...this.dataForm })
      this.loading = false
      this.$success('导入成功')
      this.$emit('done')
      this.$emit('close')
    }
  }
}
</script>

