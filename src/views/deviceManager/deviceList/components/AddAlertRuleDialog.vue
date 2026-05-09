<!--
告警规则
by lcs
-->

<template>

  <el-drawer :title=" '告警规则: ' + propDataForm.deviceName" visible append-to-body destroy-on-close size="80%" @close="$emit('close')">
    <AlertRule :room-id="propDataForm.id" />
  </el-drawer>
</template>

<script>

import AlertRule from '../../alertRule/index.vue'
export default {
  components: { AlertRule },
  props: {
    propDataForm: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>

</style>
