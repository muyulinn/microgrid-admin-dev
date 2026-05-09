<template>
  <div :class="{'has-logo':showLogo}">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  // components: { SidebarItem, Logo },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      // return !this.sidebar.opened
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
 /* 重写sidebar样式 */
::v-deep .el-submenu__title .sub-el-icon {
  margin-left: 40px!important;
}
::v-deep div > a > li > i, ::v-deep div > a > li > svg {
    margin-left: 40px!important;
}
::v-deep .el-submenu > .el-menu >  .nest-menu > a > li {
  padding-left: 82px!important;
}
::v-deep .el-menu-item.is-active {
  background-color: #eaedfd!important;
  color: #546BF0 !important;
}
::v-deep .el-menu-item::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 100%;
  background-color: none;
  top: 0;
  left: 0;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
}
::v-deep .el-menu-item.is-active::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 100%;
  background-color: #FFA629;
  top: 0;
  left: 0;
}
</style>
