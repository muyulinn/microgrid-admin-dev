<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <template v-if="outerIndex === 'CONSTRUCT_LIST'">
        <div class="oper-box" style="padding: 0 20px" @click="$refs.listConstruct.openDialog()">
          创建构建物
        </div>
        <div class="oper-box">
          <i class="el-icon-search" />
        </div>
      </template>
      <template v-if="outerIndex === 'MISSION_LIST'">
        <div class="oper-box" style="padding: 0 20px" @click="$refs.listMission.openDialog()">
          创建任务
        </div>
        <div class="oper-box">
          <i class="el-icon-search" />
        </div>
      </template>
      <template v-if="outerIndex === 'PATROL_PLAN'">
        <div class="oper-box" style="padding: 0 20px" @click="getLeftIndex('CREATE_PATROL')">
          创建巡检点
        </div>
        <div class="oper-box">
          <i class="el-icon-search" />
        </div>
      </template>
      <template v-if="outerIndex === 'CHECK_ORDER_LIST'">
        <div class="oper-box" style="padding: 0 20px" @click="$refs.listCheckOrder.openDialogManual()">
          手动生成巡检
        </div>
        <div class="oper-box">
          <i class="el-icon-search" />
        </div>
      </template>
      <template v-if="outerIndex === 'MAINTAIN_ORDER_LIST'">
        <div class="oper-box" style="padding: 0 20px" @click="$refs.listMaintainOrder.openDialogManual()">
          手动生成保养
        </div>
        <div class="oper-box">
          <i class="el-icon-search" />
        </div>
      </template>
    </switchBar>
    <div class="content-box" :style="outerIndex === 'PATROL_PLAN' || outerIndex === 'REPAIR_ORDER_LIST' ? 'overflow:visible;height:auto': ''">
      <listConstruct v-if="outerIndex === 'CONSTRUCT_LIST'" ref="listConstruct" />
      <listMission v-if="outerIndex === 'MISSION_LIST'" ref="listMission" />
      <checkPoint v-if="outerIndex === 'PATROL_PLAN'" />
      <createCheckPoint v-if="outerIndex === 'CREATE_PATROL'" @getLeftIndex="getLeftIndex" />
      <listCheckOrder v-if="outerIndex === 'CHECK_ORDER_LIST'" ref="listCheckOrder" />
      <listMaintainOrder v-if="outerIndex === 'MAINTAIN_ORDER_LIST'" ref="listMaintainOrder" />
      <checkRecord v-if="outerIndex === 'REPAIR_ORDER_LIST'" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import checkPoint from './components/checkPoint/index.vue'
import checkRecord from './components/checkRecord/index.vue'
import createCheckPoint from './components/createCheckPoint/index.vue'
import listConstruct from './components/listConstruct/index.vue'
import listMission from './components/listMission/index.vue'
import listCheckOrder from './components/listCheckOrder/index.vue'
import listMaintainOrder from './components/listMaintainOrder/index.vue'

export default {
  name: 'CheckManager',
  components: { switchBar, checkRecord, createCheckPoint, listConstruct, listMission, checkPoint, listCheckOrder, listMaintainOrder },
  data() {
    return {
      outerIndex: 'CONSTRUCT_LIST',
      leftMenu: [
        { value: 'CONSTRUCT_LIST', label: '构建物列表' },
        { value: 'MISSION_LIST', label: '任务列表' },
        { value: 'PATROL_PLAN', label: '巡检计划' },
        { value: 'CHECK_ORDER_LIST', label: '巡检工单列表' },
        { value: 'MAINTAIN_ORDER_LIST', label: '保养工单列表' },
        { value: 'REPAIR_ORDER_LIST', label: '维修工单' },
        { value: 'CREATE_PATROL', label: '创建巡检点', hidden: true }

      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'CONSTRUCT_LIST'
    }
  },
  methods: {
    getLeftIndex(e) {
      this.$router.replace({ path: this.$route.path, query: { index: e }})
      this.outerIndex = e
    }
  }
}
</script>
<style lang="less">
</style>
