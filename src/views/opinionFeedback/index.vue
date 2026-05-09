<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <div class="oper-box">
        <i class="el-icon-search" />
      </div>
    </switchBar>
    <div class="content-box">
      <opinionFeedbackMain v-if="outerIndex === 'FEEDBACK'" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import opinionFeedbackMain from './components/opinionFeedbackMain/index.vue'
export default {
  name: 'PersonManager',
  components: { switchBar, opinionFeedbackMain },
  data() {
    return {
      outerIndex: 'FEEDBACK',
      leftMenu: [
        { value: 'FEEDBACK', label: '意见反馈' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'FEEDBACK'
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
