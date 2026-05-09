<template>
  <div class="person-container">
    <div v-for="(item,index) in userList" :key="index" class="person common-shadow">
      <fs-img v-if="item.avatarUrl" :code="item.avatarUrl" alt="" />
      <img v-else src="@/assets/jiahua/no-image.png" alt="">
      <div class="desc">
        <div>姓名：{{ item.realName || '暂无' }}</div>
        <div>类型：暂无</div>
        <img src="@/assets/jiahua/fill.png" alt="" class="abs-img">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryForm: {},
      selection: [],
      userList: []
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query(param = {}) {
      param.size = 5000
      this.$http.getParam('/user/getMemberVoIPage', { ...param, ...this.queryForm }).then(res => {
        this.userList = res.records
      })
    }
  }
}
</script>
<style lang="less" scoped>
.person-container {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  .person {
    width: 157px;
    height: 214px;
    padding: 8px 10px;
    margin: 0 0 7px 7px;
    color: #626262;
    position: relative;
    img {
      width: 100%;
      height: 140px;
      margin-bottom: 11px;
    }
    .desc {
      div:nth-child(2) {
        margin-top: 10px;
      }
      .abs-img {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>
