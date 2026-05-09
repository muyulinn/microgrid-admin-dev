<template>
  <div class="center" style="overflow: hidden;">
    <div v-if="screenSrc" class="close" @click="close">
      <i class="el-icon-close" style="color: #409EFF;" />
    </div>
    <iframe
      ref="iframe"
      :style="screenStyle2 || screenStyle"
      :src="screenSrc || 'https://monitor.139.jiahuagd.com.cn/earth.html'"
      frameborder="0"
    />
  </div>
</template>

<script>
import { sleep } from '@/utils'
export default {
  props: {
    screenSrc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      screenStyle: {
        width: 'calc((100vw - 10px) / 3 * 2 - 15px )',
        height: 'calc(((100vw - 10px) / 3 * 2 - 15px ) / 10 * 5.99)'
      },
      screenStyle2: null,
      height1: 'calc((100vw / 3 * 2 ) / 9 * 4.2)',
      height2: 'calc(((100vw - 10px) / 3 * 2 - 15px ) / 10 * 5.99)'
    }
  },
  watch: {
    screenSrc(val) {
      if (val) {
        // this.screenStyle2 = {
        //   width: 'calc((100vw - 10px) / 3 * 2 - 15px )',
        //   height: 'calc(((100vw - 10px) / 3 * 2 - 15px )) / 10 * 6'
        // }
      } else {
        this.screenStyle2 = null
      }
    }
  },
  mounted() {
    this.handLoadingIframe()
  },
  destroyed() {
    window.removeEventListener('message', this.onClickMessage)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    onClickMessage({ data }) {
      if (!data) return
      if (!data.type || !data.panelid) return
      const panelid = data.panelid
      if (panelid === '3') {
        this.$router.push('/deviceList/index')
      } else if (panelid === '117') {
        this.$router.push(`/companyManager?index=COMPANY_MANAGER_DETAIL&id=${this.userInfo.orgId}`)
      } else if (panelid === '129') {
        this.$router.push(`/alerting/index`)
      } else if (panelid === 'earth') {
        this.$router.push(`/home`)
      }
    },
    async handLoadingIframe() {
      // const now = new Date()
      this.$refs.iframe.onload = async() => {
        await sleep(1_500)
        // this.iframeLoading = false
      }

      const onmessage = e => {
        // console.log('on message', e.data, new Date() - now)
        if (e.data !== 'GrafanaPanelInit') return
        // this.loading = false
        window.removeEventListener('message', onmessage)
      }

      window.addEventListener('message', onmessage)
      window.removeEventListener('message', this.onClickMessage)
      window.addEventListener('message', this.onClickMessage)

      await sleep(25_000)

      // if (!this.loading) return

      // this.loading = false
      window.removeEventListener('message', onmessage)
      // console.log('on message timeout', new Date() - now)
    }
  }
}
</script>

<style lang='scss' scoped>
.center {
  position: relative;
}
.close {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 24px;
  cursor: pointer;
}
</style>
