<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <div class="oper-box">
        <i class="el-icon-search" />
      </div>
      <div class="oper-box" style="padding: 0 20px">
        新增
      </div>
      <div class="oper-box">
        <i class="el-icon-monitor" />
      </div>
    </switchBar>
    <div class="content-box">
      <deviceManage v-if="outerIndex === 'VIDEO_DEVICE'" />
      <deviceList v-if="outerIndex === 'DEVICE_LIST'" />
      <deviceCamrea v-if="outerIndex === 'VIDEO_CHECK'" />
      <deviceDetail v-if="outerIndex === 'DEVICE_DETAIL'" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import deviceManage from './components/deviceManage/index.vue'
import deviceList from './components/deviceList/index.vue'
import deviceCamrea from './components/deviceCamrea/index.vue'
import deviceDetail from './components/deviceDetail/index.vue'
export default {
  name: 'DataWatcher',
  components: { switchBar, deviceManage, deviceList, deviceCamrea, deviceDetail },
  data() {
    return {
      outerIndex: 'VIDEO_DEVICE',
      leftMenu: [
        { value: 'VIDEO_DEVICE', label: '监控设备' },
        { value: 'DEVICE_LIST', label: '设备列表' },
        { value: 'VIDEO_CHECK', label: '视频监控' },
        { value: 'DEVICE_DETAIL', label: '设备详情' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'VIDEO_DEVICE'
    }
  },
  methods: {
    getLeftIndex(e) {
      this.$router.replace({ path: this.$route.path, query: { index: e }})
      this.outerIndex = e
    }
  }
}
</script>
<style lang="less">
</style>
