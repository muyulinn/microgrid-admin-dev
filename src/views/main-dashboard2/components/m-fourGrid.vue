<template>
  <div class="fourGrid">
    <div v-for="item in value" :key="item.label" class="item">
      <div class="label">{{ item.label }}</div>
      <div class="value">{{ parseFloat(item.value).toFixed(0) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang='scss' scoped>
.fourGrid {
  display: flex;
  flex-wrap: wrap;
}
.item {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 50%;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  text-align: center;
  &:nth-of-type(2n) {
    border-right: none;
  }
  &:nth-of-type(3), &:nth-of-type(4) {
    border-bottom: none;
  }
}
.label {
  padding-top: 10px;
  padding-bottom: 13px;
}
.value {
  font-weight: 600;
  font-size: 32px;
  color: rgb(86, 166, 75);
}
</style>
