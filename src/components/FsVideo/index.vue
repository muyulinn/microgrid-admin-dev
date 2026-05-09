<template>
  <video :src="url" />
</template>

<script>
import { imgHost } from '@/config'
export default {
  name: 'FsVideo',
  props: {
    code: { type: String }
  },
  data() {
    return {}
  },
  computed: {
    url() {
      return `${imgHost}${this.code}`
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
