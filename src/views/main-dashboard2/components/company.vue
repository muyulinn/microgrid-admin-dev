<template>
  <div style="width: 100%;font-family: Inter, Helvetica, Arial, sans-serif; padding: 10px 0;">
    <div class="title">{{ info.orgName }}</div>
    <div class="info">
      <span class="info2">
        <span>地址：{{ info.orgArea || '暂无地址' }}</span>
        <span>负责：{{ info.orgCharge || '暂无负责人' }}</span>
        <span>电话：{{ info.orgChargePhone || '暂无联系方式' }}</span>
      </span>
    </div>
    <div v-if="total || machine" class="data">
      <div class="item">
        <div class="item-title">设备总数</div>
        <div class="item-num">{{ total || '-' }}</div>
      </div>
      <div class="item">
        <div class="item-title">机房</div>
        <div class="item-num">{{ machine || '-' }}</div>
      </div>
      <div class="item">
        <div class="item-title">光伏</div>
        <div class="item-num">{{ photovoltaic || '-' }}</div>
      </div>
    </div>
    <div v-if="!total && !machine && !photovoltaic" class="empty">
      没有数据
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      total: '',
      photovoltaic: ''
    }
  },
  computed: {
    machine() {
      return this.total - this.photovoltaic
    }
  },
  mounted() {
    const roomId = '104'
    let query = `sum(count_values("count", count by(deviceId) ({ roomId=~"${roomId}" })))`
    const time = new Date()
    const param = JSON.stringify({ query, time })
    this.$http.post('/api/adminDevice/prom/query', param).then(res => {
      this.total = res.result[0].value[1]
    })
    query = `sum(count_values("count", count by(deviceId) (T_dev{ roomId=~"${roomId}" }))) + sum(count_values("count", count by(deviceId) ( p_solar )))`
    this.$http.post('/api/adminDevice/prom/query', JSON.stringify({ query, time })).then(res => {
      this.photovoltaic = res.result[0].value[1]
    })
  }
}
</script>

<style lang='scss' scoped>
.title {
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  // padding: 5px 0;
  padding-top: 8px;
}
.info {
  display: flex;
  justify-content: space-evenly;
  margin: 18px 0;
}
.info2 {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  & > span {
    padding-bottom: 6px;
  }
}
.data {
  display: flex;
  justify-content: space-around;
}
.item {
  flex: 1;
  text-align: center;
  .item-title {
    font-size: 14px;
    line-height: 1.4;
    padding-bottom: 8px;
    text-align: center;
  }
  .item-num {
    font-size: 56px;
    font-weight: 500;
    line-height: 1.2;
    position: relative;
    z-index: 1;
    text-align: center;
    color: rgb(86, 166, 75);
  }
}
.empty {
  height: 85px;
  font-size: 66.6667px;
  font-weight: 500;
  line-height: 1.2;
  position: relative;
  z-index: 1;
  text-align: center;
  color: rgb(86, 166, 75);
}
</style>
