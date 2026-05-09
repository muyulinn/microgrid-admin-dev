<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <div class="oper-box">
        <i class="el-icon-search" />
      </div>
    </switchBar>
    <div class="content-box">
      <operationLog v-if="outerIndex === 'OPERATION_LOG'" />
      <userLog v-if="outerIndex === 'USER_LOG'" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import operationLog from './components/operationLog/index.vue'
import userLog from './components/userLog/index.vue'
export default {
  name: 'LogManager',
  components: { switchBar, operationLog, userLog },
  data() {
    return {
      outerIndex: 'OPERATION_LOG',
      leftMenu: [
        { value: 'OPERATION_LOG', label: '运维日志' },
        { value: 'USER_LOG', label: '用户日志' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'OPERATION_LOG'
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
