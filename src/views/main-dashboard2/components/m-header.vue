<template>
  <div class="header">
    <span />
    <div class="title">
      <img width="40" src="@/assets/jiahua/head/baricon.png" alt="">
      <span>  {{ title }} </span>
    </div>
    <div class="user-info">
      <el-link :underline="false" @click="enter">{{ userInfo.userName }} </el-link>
      <el-link :underline="false" @click="enter">进入电网系统 </el-link>
      <el-link :underline="false"><Screenfull style="display: inline-block;" /></el-link>
      <el-link :underline="false" @click="logout">退出</el-link>
    </div>
  </div>
</template>

<script>
import { title } from '@/settings'
import Screenfull from '@/components/Screenfull'
export default {
  name: 'MHeader',
  components: { Screenfull },
  data() {
    return {
      title,
      userInfo: {},
      orgId: ''
    }
  },
  mounted() {
    this.loadUserInfo()
  },
  methods: {
    /**
     * 加载用户信息
     */
    async loadUserInfo() {
      this.userInfo = await this.$http.get('/user/getUserInfo')
      this.orgId = this.userInfo.orgId || 11
    },
    /**
     * 点击进入主系统
     */
    enter() {
      this.$router.push('/home')
    },
    /**
     * 用户登出
     */
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
}
.title {
  font-size: 2rem;
  display: flex;
  align-items: center;
  letter-spacing: 5px;
  transform: translateX(100px);
  img {
    margin-right: 5px;
  }
  span{
    margin-left:5px;
  }
}
.user-info {
  font-size: 1rem !important;;
  // color: rgb(204, 204, 220);
  color: var(--main-text-color);
  color: #606266;
  font-weight: 400 !important;
  >*{
    &:not(:last-child)::after{
      content: '/';
      font-size: .8rem;
      color: rgba(117, 117, 117, 0.569);
      margin: 0 8px;
    }
  }
}
</style>
