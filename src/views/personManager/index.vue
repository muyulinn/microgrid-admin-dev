<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <div class="oper-box" style="padding: 0 20px">
        添加人员
      </div>
      <div class="oper-box">
        <i class="el-icon-s-fold" />
      </div>
      <div class="oper-box">
        <i class="el-icon-search" />
      </div>
    </switchBar>
    <div class="content-box">
      <personList v-if="outerIndex === 'PERSON_ALL'" />
      <personListType2 v-if="outerIndex === 'PERSON_LIST'" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import personList from './components/personList/index.vue'
import personListType2 from './components/personListType2/index.vue'
export default {
  name: 'PersonManager',
  components: { switchBar, personList, personListType2 },
  data() {
    return {
      outerIndex: 'PERSON_ALL',
      leftMenu: [
        { value: 'PERSON_ALL', label: '全部人员' },
        { value: 'PERSON_LIST', label: '人员管理列表' }
        // { value: 2, label: '企业人员' },
        // { value: 3, label: '备案人员' },
        // { value: 3, label: '禁用人员' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'PERSON_ALL'
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
