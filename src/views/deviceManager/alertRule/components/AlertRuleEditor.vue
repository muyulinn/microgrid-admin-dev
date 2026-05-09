<!--
  规则编辑器
  by lcs
  2023-04-07
-->
<template>
  <el-form :model="dataForm" label-width="60px">
    <el-form-item label="指标">
      <el-select v-model="dataForm.mertric" placeholder="请选择" :disabled="disabled">
        <el-option v-for="(item,index) in deviceAttribute" :key="index" :label="item.keyName" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item label="操作">
      <el-row v-for="(item,index) in dataForm.operateList" :key="index">
        <el-col :span="3">
          <el-select v-model="item.operate" placeholder="请选择" :disabled="disabled">
            <el-option label="相加" value="+" />
            <el-option label="相减" value="-" />
            <el-option label="乘以" value="*" />
            <el-option label="除以" value="/" />
            <el-option label="取模" value="%" />
            <el-option label="等于" value="==" />
            <el-option label="不等于" value="!=" />
            <el-option label="大于" value=">" />
            <el-option label="大于等于" value=">=" />
            <el-option label="小于" value="<" />
            <el-option label="小于等于" value="<=" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input v-model="item.value" type="number" :disabled="disabled" />
        </el-col>
        <el-col v-if="!disabled" :span="3">
          <el-button type="danger" icon="el-icon-remove" @click="dataForm.operateList.splice(index,1),dataForm={...dataForm}" />
        </el-col>
      </el-row>
      <el-row v-if="!disabled">
        <el-button type="primary" icon="el-icon-circle-plus" @click="dataForm.operateList.push({}),dataForm={...dataForm}" />
      </el-row>
    </el-form-item>

  </el-form>
</template>

<script >
export default {
  props: {
    expr: {
      type: String,
      default: ''
    },
    roomId: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default() { return false }
    }
  },
  data() {
    return {
      dataForm: {
        operateList: []
      },
      deviceAttribute: []
    }
  },
  watch: {
    dataForm: {
      handler() {
        const mertric = `${this.dataForm.mertric}{roomId="${this.roomId}"}`
        const operate = this.dataForm.operateList.filter(item => item.operate !== void 0 && item.value !== void 0).map(item => `${item.operate} ${item.value}`).join(' ')
        this.$emit('update:expr', `${mertric} ${operate}`)
      },
      deep: true
    },
    expr() {
      this.coverToFormData()
    }
  },
  async mounted() {
    this.coverToFormData()
    this.deviceAttribute = await this.$http.getParam('/adminDevice/deviceAttribute', { deviceId: this.roomId }) || []
  },
  methods: {
    coverToFormData() {
      if (/^\w+/.test(this.expr)) {
        this.dataForm.mertric = this.expr.match(/^\w+/)[0]
        const opers = this.expr.replace(/^\w+(\s*\{[^\}]*\})?/, '').match(/([\+\-\*\/\%\=\!\>\>\<\<]+\s*[\d\.]+\s*)/g)
        this.dataForm.operateList = (opers || []).map(str => ({ operate: str.match(/^[\+\-\*\/\%\=\!\>\>\<\<]+/)[0], value: str.match(/[\d\.]+\s*/)[0].trim() }))
      }
    }
  }
}
</script>
