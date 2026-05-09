<template>
  <el-row class="deviceCamrea-container">
    <el-col v-for="(item,index) in 15" :key="index" :span="6" class="camrea common-shadow">
      <video poster="@/assets/jiahua/videoDefault.png" src="about.mp4" />
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.deviceCamrea-container {
  margin-top: 21px;
  .camrea {
    width: 280px;
    height: 182px;
    overflow: hidden;
    border-radius: 6px;
    margin: 0 8px 8px 0;
    video {
      width: 280px;
      height: 182px;
      object-fit: cover;
    }
  }
}
</style>
