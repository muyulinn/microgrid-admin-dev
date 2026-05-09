<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <!-- <el-button v-permission="'custimerList'"> test permission </el-button> -->
    <h2>欢迎登录{{ title }}</h2>
  </div>
</template>

<script>
import { title } from '@/settings'
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  // components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      title
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard' // editorDashboard
    }
  }
}
</script>
<style lang="less">
  .dashboard-container{
    position: relative;
    height: calc(100vh - 150px);
    font-family: 'SourceHanSansCN-Medium', Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    font-weight: Medium;
    font-size: 30px;
    color: #909399;
    h2 {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 50%;
      transform: translateY(-210%);
    }
  }
</style>
