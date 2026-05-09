<template>
  <el-carousel height="220px" :interval="10000" style="width: 100%;padding: 5px 0;" indicator-position="none">
    <el-carousel-item style="display: flex;align-items: center;">
      <div @click="changeBig('https://monitor.139.jiahuagd.com.cn/rtsp.html?url=https://rtsp.139.jiahuagd.com.cn/stream/C02_main/index.m3u8')">
        <iframe
          class="iframe"
          style="transform: scale(1.5) translateY(18%) translateX(2%);pointer-events: none;"
          frameborder="0"
          height="240px"
          width="auto"
          src="https://monitor.139.jiahuagd.com.cn/rtsp.html?url=https://rtsp.139.jiahuagd.com.cn/stream/C02_main/index.m3u8"
        />
      </div>
    </el-carousel-item>
    <el-carousel-item style="display: flex;align-items: center;">
      <div @click="changeBig('https://monitor.139.jiahuagd.com.cn/rtsp.html?url=https://rtsp.139.jiahuagd.com.cn/stream/C01_main/index.m3u8')">
        <iframe
          class="iframe"
          style="transform: scale(1.5) translateY(18%) translateX(2%);pointer-events: none;"
          frameborder="0"
          height="240px"
          width="auto"
          src="https://monitor.139.jiahuagd.com.cn/rtsp.html?url=https://rtsp.139.jiahuagd.com.cn/stream/C01_main/index.m3u8"
        />
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    changeBig(src) {
      this.$emit('clickItem', src)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
