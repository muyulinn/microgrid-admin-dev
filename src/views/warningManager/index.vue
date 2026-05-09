<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <div class="oper-box">
        <i class="el-icon-search" />
      </div>
    </switchBar>
    <div class="content-box">
      <warningLevel v-if="outerIndex === 'ALL'" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import warningLevel from './components/warningLevel/index.vue'
export default {
  name: 'PersonManager',
  components: { switchBar, warningLevel },
  data() {
    return {
      outerIndex: 'ALL',
      leftMenu: [
        { value: 'ALL', label: '全部' },
        { value: 'LV_1', label: '一级预告警' },
        { value: 'LV_2', label: '一级预告警' },
        { value: 'LV_3', label: '一级预告警' },
        { value: 'WARN_ALERT', label: '预警提醒' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'ALL'
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
