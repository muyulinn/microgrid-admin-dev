<!-- 头部 -->
<template>
  <div id="handler">
    <h2>企业网站管理后台</h2>
    <ul class="flexBox">
      <li>新建</li>
      <li>查看站点</li>
      <li>清除缓存</li>
      <li>帮助</li>
    </ul>
    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="show">修改密码</el-dropdown-item>
        <!-- <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link> -->
        <el-dropdown-item divided @click.native="logout">
          <span style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      showPass: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    show() {
      this.showPass = true
    },
    close() {
      this.showPass = false
    }
  }
}

</script>

<style lang='less' scoped>
#handler {
  width: 100%;
  background: #001529;
  height: 100px;
  color: #fff;
  h2 {
    margin: 0;
  }
}
.right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
</style>
