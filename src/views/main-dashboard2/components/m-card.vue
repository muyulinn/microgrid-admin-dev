<template>
  <div class="mCard" :style="{width, height}">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MCard',
  props: {
    width: {
      type: String,
      default: 'auto'
    },
    height: {
      type: String,
      default: 'auto'
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang='scss' scoped>
.mCard {
  padding: 8px;
  border-radius: 8px;
  display: flex;
  margin: .6vh auto;
  border: 1px solid #7c79794a;
  overflow-x: hidden;
}
</style>
