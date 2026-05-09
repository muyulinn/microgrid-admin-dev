<template>
  <div class="head-switch common-shadow">
    <div class="left-switch">
      <div v-for="(item,index1) in leftMenu" v-show="item.hidden !== true" :key="index1" class="switch" :class="item.value === tabIndex ? 'active': ''" @click="changeIndex(item.value)">
        <div class="text">{{ item.label }}</div>
        <div class="line" />
      </div>
    </div>
    <div class="right-oper">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'SwitchBar',
  props: {
    leftMenu: {
      type: Array,
      default: () => []
    },
    index: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      tabIndex: '0'
    }
  },
  watch: {
    'index': {
      handler(newValue) {
        this.tabIndex = newValue
      },
      immediate: true
    }
  },
  methods: {
    changeIndex(index) {
      this.tabIndex = index
      this.$emit('leftPress', index)
    }
  }
}
</script>
<style lang="less" scoped>
  .head-switch {
    padding: 0 37px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    .left-switch {
      display: flex;
      align-items: center;
      height: 71px;
      .switch {
        margin-right: 44px;
        margin-top: 10px;
        cursor: pointer;
        transition: border-color 0.3s, background-color 0.3s, color 0.3s;
        .line {
          transition: border-color 0.3s, background-color 0.3s, color 0.3s;
          margin-top: 5px;
          width: 100%;
          height: 3px;
          background-color: none;
        }
      }
      .active {
        color: #546BF0;
        .line {
          background-color: #1684fc!important;
        }
      }
    }
    .right-oper {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .oper-box {
        padding: 0 10px;
        background-color: #546bf0;
        margin-left: 9px;
        color: white;
        height: 28px;
        line-height: 28px;
        border-radius: 6px;
        i {
          font-size: 18px;
        }
      }
    }
  }
</style>
