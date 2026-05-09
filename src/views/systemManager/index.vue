<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <div class="oper-box">
        <i class="el-icon-search" />
      </div>
    </switchBar>
    <div class="content-box">
      <personCenter v-if="outerIndex === 'PERSON_CENTER'" />
      <dataDictionary v-if="outerIndex === 'DATA_DIC'" />
      <!-- <opinionFeedbackMain v-if="outerIndex === 'FEEDBACK'" /> -->
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import personCenter from './components/personCenter/index.vue'
import dataDictionary from './components/dataDictionary/index.vue'
// import opinionFeedbackMain from '../opinionFeedback/components/opinionFeedbackMain/index.vue'
export default {
  name: 'LogManager',
  components: { switchBar, personCenter, dataDictionary },
  data() {
    return {
      outerIndex: 'PERSON_CENTER',
      leftMenu: [
        { value: 'PERSON_CENTER', label: '个人中心' },
        { value: 'DATA_DIC', label: '数据字典' }
        // { value: 'FEEDBACK', label: '意见反馈' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'PERSON_CENTER'
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
