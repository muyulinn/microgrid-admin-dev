<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <div class="oper-box">
        <i class="el-icon-search" />
      </div>
    </switchBar>
    <div class="content-box">
      <roleManagement v-if="outerIndex === 'ROLE'" />
      <user v-if="outerIndex === 'USER'" />
      <menuManagement v-if="outerIndex === 'MENU'" />
      <departmentManagement v-if="outerIndex === 'DEPARTMENT'" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import roleManagement from './roleManagement/index.vue'
import user from './user/index.vue'
import menuManagement from './menuManagement/index.vue'
import departmentManagement from './departmentManagement/index.vue'
export default {
  name: 'AdminUser',
  components: { switchBar, roleManagement, user, menuManagement, departmentManagement },
  data() {
    return {
      outerIndex: 'ROLE',
      leftMenu: [
        { value: 'ROLE', label: '角色列表' },
        { value: 'USER', label: '用户列表' },
        { value: 'MENU', label: '菜单列表' },
        { value: 'DEPARTMENT', label: '部门列表' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'ROLE'
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
