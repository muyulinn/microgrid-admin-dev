<template>
  <img :src="imgUrl">
</template>
<script>
import { getFileUrl } from '@/utils'
import { davHost } from '@/config'
export default {
  name: 'FsImg',
  props: {
    code: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      codeUrl: ''
    }
  },
  computed: {
    imgUrl() {
      return this.src || this.codeUrl || this.defaultImg || (davHost + '/img/broken-img.png')
    }
  },
  watch: {
    async code(val1, val2) {
      console.log('code change', val1, val2)
      // this.fileUrl = await getFileUrl(this.code)
    }
  },
  mounted() {
    this.getFileUrl()
  },
  methods: {
    async getFileUrl() {
      if (this.code) {
        this.codeUrl = await getFileUrl(this.code)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
