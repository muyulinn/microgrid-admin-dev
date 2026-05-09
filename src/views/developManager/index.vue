<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <div v-if="outerIndex === 'INIT_MANAGER'" class="index-flex">
        <div class="oper-box" style="padding: 0 20px">
          数据导出
        </div>
        <div class="oper-box">
          <i class="el-icon-search" />
        </div>
      </div>
      <div v-if="outerIndex === 'DATA_MANAGER' || outerIndex === 'INTERFACE_MANAGER'" class="index-flex">
        <div class="oper-box" style="padding: 0 20px;background-color: #fb5252">
          关闭
        </div>
        <div class="oper-box" style="padding: 0 20px">
          调试
        </div>
        <div class="oper-box" style="padding: 0 20px">
          发送
        </div>
      </div>
    </switchBar>
    <div class="content-box">
      <initManage v-if="outerIndex === 'INIT_MANAGER'" />
      <dataManage v-if="outerIndex === 'DATA_MANAGER'" />
      <interfaceManage v-if="outerIndex === 'INTERFACE_MANAGER'" />
      <interfaceManageDetail v-if="outerIndex === 'INTERFACE_MANAGER_DETAIL'" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import dataManage from './components/dataManage/index.vue'
import initManage from './components/initManage/index.vue'
import interfaceManage from './components/interfaceManage/index.vue'
import interfaceManageDetail from './components/interfaceManageDetail/index.vue'
export default {
  name: 'DevelopManager',
  components: { switchBar, dataManage, initManage, interfaceManage, interfaceManageDetail },
  data() {
    return {
      outerIndex: 'INIT_MANAGER',
      leftMenu: [
        { value: 'INIT_MANAGER', label: '初始化管理' },
        { value: 'DATA_MANAGER', label: '数据管理' },
        { value: 'INTERFACE_MANAGER', label: '接口管理' },
        { value: 'INTERFACE_MANAGER_DETAIL', label: '接口管理详情' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'INIT_MANAGER'
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
