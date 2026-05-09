<!--
  设备属性
-->
<template>
  <el-dialog :title=" '编辑属性' " visible :modal-append-to-body="false" destroy-on-close @close="$emit('close')">
    <el-form ref="dataForm" :inline="true" :model="dataForm" :rules="rules" :loading="loading">
      <el-row v-for="(item,index) in attributeList" :key="index">
        <el-form-item>
          {{ index | indexFilter }}
        </el-form-item>
        <el-form-item required>
          <el-autocomplete v-model="item.key" placeholder="属性值" :fetch-suggestions="(str,cb)=>suggestion(str,cb,'key')" @select="selected=>selectedItem(selected,item,index)" />
        </el-form-item>
        <el-form-item required>
          <el-autocomplete v-model="item.keyName" placeholder="属性名" :fetch-suggestions="(str,cb)=>suggestion(str,cb,'keyName')" />
        </el-form-item>
        <el-form-item required>
          <el-autocomplete v-model="item.type" placeholder="类型" :fetch-suggestions="(str,cb)=>suggestion(str,cb,'type')" />
        </el-form-item>
        <el-form-item required>
          <el-autocomplete v-model="item.unit" placeholder="单位" :fetch-suggestions="(str,cb)=>suggestion(str,cb,'unit')" style="width:80px" />
        </el-form-item>

        <template v-if="Object.keys(item).some(k=>item[k])">
          <el-button :disabled="index+1 >= attributeList.length-1" type="primary" icon="el-icon-bottom" circle @click="move(index,+1)" />
          <el-button :disabled="index-1 < 0" type="primary" icon="el-icon-top" circle @click="move(index,-1)" />
          <el-button type="danger" icon="el-icon-delete" @click="attributeList.splice(index, 1)" />
        </template>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="$emit('close') ">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">保存</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { required } from '@/utils/rules'
const TEMPLATE_DATA = [{ 'key': 'u_a', 'keyName': '相电压A', 'type': '电压', 'unit': 'V', 'subType': '相电压' }, { 'key': 'u_b', 'keyName': '相电压B', 'type': '电压', 'unit': 'V', 'subType': '相电压' }, { 'key': 'u_c', 'keyName': '相电压C', 'type': '电压', 'unit': 'V', 'subType': '相电压' }, { 'key': 'u_ab', 'keyName': '线电压AB', 'type': '电压', 'unit': 'V', 'subType': '线电压' }, { 'key': 'u_bc', 'keyName': '线电压BC', 'type': '电压', 'unit': 'V', 'subType': '线电压' }, { 'key': 'u_ca', 'keyName': '线电压CA', 'type': '电压', 'unit': 'V', 'subType': '线电压' }, { 'key': 'i_a', 'keyName': '相电流A', 'type': '电流', 'unit': 'A', 'subType': '线电流' }, { 'key': 'i_b', 'keyName': '相电流B', 'type': '电流', 'unit': 'A', 'subType': '线电流' }, { 'key': 'i_c', 'keyName': '相电流C', 'type': '电流', 'unit': 'A', 'subType': '线电流' }, { 'key': 'ap_a', 'keyName': '有功功率A', 'type': '功率', 'unit': 'W', 'subType': '有功功率' }, { 'key': 'ap_b', 'keyName': '有功功率B', 'type': '功率', 'unit': 'W', 'subType': '有功功率' }, { 'key': 'ap_c', 'keyName': '有功功率C', 'type': '功率', 'unit': 'W', 'subType': '有功功率' }, { 'key': 'ap_total', 'keyName': '总有功功率', 'type': '功率', 'unit': 'W', 'subType': '有功功率' }, { 'key': 'rap_a', 'keyName': '无功功率A', 'type': '功率', 'unit': 'var', 'subType': '无功功率' }, { 'key': 'rap_b', 'keyName': '无功功率B', 'type': '功率', 'unit': 'var', 'subType': '无功功率' }, { 'key': 'rap_c', 'keyName': '无功功率C', 'type': '功率', 'unit': 'var', 'subType': '无功功率' }, { 'key': 'rap_total', 'keyName': '总无功功率', 'type': '功率', 'unit': 'var', 'subType': '无功功率' }, { 'key': 'sp_a', 'keyName': '视在功率A', 'type': '功率', 'unit': 'VA', 'subType': '视在功率' }, { 'key': 'sp_b', 'keyName': '视在功率B', 'type': '功率', 'unit': 'VA', 'subType': '视在功率' }, { 'key': 'sp_c', 'keyName': '视在功率C', 'type': '功率', 'unit': 'VA', 'subType': '视在功率' }, { 'key': 'sp_total', 'keyName': '总视在功率', 'type': '功率', 'unit': 'VA', 'subType': '视在功率' }, { 'key': 'pf_a', 'keyName': '功率因数A', 'type': '功率', 'unit': '', 'subType': '功率因数' }, { 'key': 'pf_b', 'keyName': '功率因数B', 'type': '功率', 'unit': '', 'subType': '功率因数' }, { 'key': 'pf_c', 'keyName': '功率因数C', 'type': '功率', 'unit': '', 'subType': '功率因数' }, { 'key': 'pf_total', 'keyName': '总功率因数', 'type': '功率', 'unit': '', 'subType': '功率因数' }, { 'key': 'frequency', 'keyName': '频率', 'type': '频率', 'unit': 'HZ', 'subType': '频率' }, { 'key': 'active_energy', 'keyName': '有功电度', 'type': '电度', 'unit': 'kWh', 'subType': '有功电度' }, { 'key': 'reactive_energy', 'keyName': '无功电度', 'type': '电度', 'unit': 'kvarh', 'subType': '无功电度' }, { 'key': 'p_active_energy', 'keyName': '正向有功电度', 'type': '电度', 'unit': 'kWh', 'subType': '有功电度' }, { 'key': 'n_active_energy', 'keyName': '负向有功电度', 'type': '电度', 'unit': 'kWh', 'subType': '有功电度' }, { 'key': 'p_reactive_energy', 'keyName': '正向无功电度', 'type': '电度', 'unit': 'kvarh', 'subType': '无功电度' }, { 'key': 'n_reactive_energy', 'keyName': '负向无功电度', 'type': '电度', 'unit': 'kvarh', 'subType': '无功电度' }, { 'key': 'YG', 'keyName': '烟感', 'type': '烟感', 'unit': 'ppm', 'subType': '烟感' }, { 'key': 'W', 'keyName': '水浸', 'type': '水浸', 'unit': '', 'subType': '水浸' }, { 'key': 'T', 'keyName': '温度', 'type': '温湿度', 'unit': '摄氏度', 'subType': '温度' }, { 'key': 'H', 'keyName': '湿度', 'type': '温湿度', 'unit': '%', 'subType': '湿度' }]
export default {
  filters: {
    indexFilter(val) {
      return ((val + 1) / 1000).toFixed(3).slice(-3)
    }
  },
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
        deviceName: [{ ...required, message: '*' }],
        deviceType: [required]
      },
      dataForm: {},
      attributeList: []
    }
  },

  watch: {
    attributeList() {
      if (this.loading) return
      let hastEdit = true
      if (this.attributeList.length > 0) {
        const last = this.attributeList[this.attributeList.length - 1]
        hastEdit = Object.keys(last).some(k => last[k])
        if (hastEdit) {
          this.attributeList.push({})
        }
      } else {
        this.attributeList.push({})
      }
    }
  },
  created() {},
  async mounted() {
    this.attributeList = this.propDataForm?.attributeList || []
  },
  methods: {
    /**
     * 保存
     */
    async save() {
      await this.$refs.dataForm.validate()
      this.loading = true
      const attributeList = this.attributeList.filter(item => Object.keys(item).filter(k => item[k]).length > 0)
      await this.$http.post('adminDevice/updateDeviceAttribute', { ...this.propDataForm, attributeList })
      this.$success('操作成功')
      this.$emit('close')
      this.$emit('done')
    },
    /**
     * 删除一行
     * @param {*} index
     */
    remove(index) {
      this.attributeList.splice(index, 1)
    },
    /**
     * 下拉建议
     * @param {*} queryString
     * @param {*} cb
     * @param {*} key
     */
    suggestion(queryString, cb, key) {
      const data = TEMPLATE_DATA.filter(item => !queryString ? true : item[key].toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
        .unique((a, b) => a[key] === b[key])
        .map(item => ({ ...item, value: item[key], label: item[key] }))
      console.log('suggestion', data)
      cb(data)
    },
    /**
     * 自动填充
     * @param {*} selected
     * @param {*} item
     * @param {*} index
     */
    selectedItem(selected, item, index) {
      this.attributeList.splice(index, 1, { ...selected, ...item })
    },
    move(index, step) {
      this.attributeList[index + step] = this.attributeList.splice(index, 1, this.attributeList[index + step])[0]
      this.attributeList = [...this.attributeList]
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
