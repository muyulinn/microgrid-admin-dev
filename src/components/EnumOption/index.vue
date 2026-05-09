<!--
by lcs
2020-09-26
-->
<template>
  <el-option-group>
    <el-option v-for="(item,index) in optionData" :key="index" :value="item.val" :label="item.desc" />
  </el-option-group>
</template>

<script>
export default {
  name: 'EnumOption',
  props: {
    enum: {
      type: String, default: null
    },
    data: {
      type: Array, default: () => []
    }
  },
  data() {
    return {
      apiData: []
    }
  },

  computed: {
    optionData() {
      if (this.enum) {
        let data = this.$store.getters.enumData
        this.enum.split('.').forEach(key => {
          if (data && data[key]) {
            data = data[key]
          }
        })
        if (!data) {
          console.warn('no enum data for', this.enum)
        }
        return data
      } else {
        console.warn('enum is empty for', this)
        return this.data.map(item => {
          if (typeof item === 'string' || typeof item === 'number') {
            return { val: item, desc: item }
          }
          return item
        })
      }
    }
  },

  created() {}

}
</script>

<style lang="scss" scoped>

</style>
