<!--
  登录后首页数据大屏
-->
<template>
  <div>
    <div class="bg" />
    <iframe v-show="orgId " ref="iframe" :src="monitorUrl" :class="'dashboard '+ (iframeLoading?'loading':'')" allowfullscreen frameborder="0" />
    <Header class="header" />
    <!-- <Earth v-if="appsSize.width" class="earth" :style="appsSize" /> -->
    <span v-show="loading" class="loading-text" style="width: 500px; text-align: center;">
      加载中...
    </span>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import { monitorUrl } from '@/config'
import { sleep } from '@/utils'

// const Earth = () => import('./components/earth.vue')
const monitor_url = `${monitorUrl}/d/admin?kiosk&theme=dark_`

export default {
  components: { Header },
  data() {
    return {
      orgId: null,
      loading: true,
      iframeLoading: true
    }
  },
  computed: {
    monitorUrl() {
      return this.orgId ? `${monitor_url}&var-orgId=${this.orgId}` : 'javascript:;'
    }
  },
  async mounted() {
    await this.loadUserInfo()
    this.handLoadingIframe()
    // this.initSystemList()
  },
  destroyed() {
    window.removeEventListener('message', this.onPostMessage)
  },

  methods: {
    /**
     * 加载用户信息
     */
    async loadUserInfo() {
      const userInfo = await this.$http.get('/user/getUserInfo')
      this.orgId = userInfo.orgId || 10
    },
    /**
     * 点击进入主系统
     */
    enter() {
      this.$router.push('/home')
    },

    /**
     * 处理加载iframe
     */
    async handLoadingIframe() {
      const now = new Date()
      if (this.$refs.iframe) {
        this.$refs.iframe.onload = async() => {
          await sleep(1_500)
          this.iframeLoading = false
        }
      }

      const onmessage = e => {
        console.log('on message', e.data, new Date() - now)
        if (e.data !== 'GrafanaPanelInit') return
        this.loading = false
        window.removeEventListener('message', onmessage)
      }

      window.addEventListener('message', onmessage)
      window.removeEventListener('message', this.onPostMessage)
      window.addEventListener('message', this.onPostMessage)

      await sleep(25_000)

      if (!this.loading) return

      this.loading = false
      window.removeEventListener('message', onmessage)
      console.log('on message timeout', new Date() - now)
    },

    /**
     * iframe post message 处理
     * @param {*} param0
     */
    onPostMessage({ data }) {
      console.log('onPostMessage', data)
      if (data.type === 'click') {
        this._onClickMessage(data)
      } else if (data.type === 'panelSize') {
        // this.appsSize = { width: `${data.width}px`, height: `${data.height}px` }
      }
    },
    /**
     * 点击画板
     * @param {*} param0
     */
    _onClickMessage(data) {
      if (!data) return
      if (!data.type || !data.panelid) return
      const panelid = data.panelid
      if (panelid === '3') {
        this.$router.push('/deviceList/index')
      } else if (panelid === '117') {
        this.$router.push(`/companyManager?index=COMPANY_MANAGER_DETAIL&id=${this.orgId}`)
      } else if (panelid === '129') {
        this.$router.push(`/alerting/index`)
      } else if (panelid === 'earth') {
        this.$router.push(`/app-list`)
        // this.showApps = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
* {
  --main-text-color: rgb(30, 30, 30);
  // --main-bg-color: transparent;
  // --main-text-color: rgb(204, 204, 220);;
  --main-bg-color: #9ad2fb;
}
@z-index:0;
.bg {
  position: fixed;
  inset: 0px;
  z-index: @z-index + 1;
  background: var(--main-bg-color);
}
.dashboard {
  position: fixed;
  z-index: @z-index + 2;
  inset: 50px 0 0 0;
  width: 100vw;
  height: calc(100vh - 50px);
  border: none;
  background: var(--main-bg-color);
  // background: #0000008f;
  &.loading{
    visibility: hidden
  }
}
.header{
  z-index: @z-index + 3;;
}

  .loading-text {
      position: fixed;
      bottom: 10%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.3rem;
      z-index: 40;
    }
</style>

<style lang="less" scoped>
@media screen and (orientation:portrait) {
  html {
    position: fixed;
    overflow: hidden;
    height: 100%;
    user-select: none;
    touch-action: none;
  }
	.dashboard {
    top:100px;
    height: calc(100vh - 100px);
  }

}
</style>
