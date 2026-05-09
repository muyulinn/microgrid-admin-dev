<template>
  <el-date-picker
    v-model="valueArr"
    class="query-form-item2"
    :type="type"
    clearable
    :value-format="valueFormat"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
  />
</template>

<script>
export default {
  name: 'DateRangePicker',
  props: {
    start: {
      type: String,
      default: ''
    },
    end: {
      type: String,
      default: ''
    },
    startPlaceholder: {
      type: String,
      default: ''
    },
    endPlaceholder: {
      type: String,
      default: ''
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    type() {
      return this.valueFormat === 'yyyy-MM-dd HH:mm:ss' ? 'datetimerange' : 'daterange'
    },
    valueArr: {
      get() {
        return [this.start || '', this.end || '']
      },
      set(val) {
        if (!val) {
          this.$emit('update:start', null)
          this.$emit('update:end', null)
        } else {
          let fixed = ''
          if (this.type === 'daterange') {
            fixed = ' 00:00:00'
          }
          this.$emit('update:start', val[0] + fixed)
          this.$emit('update:end', val[1] + fixed)
        }
        return []
      }
    }
  },
  watch: {

  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
