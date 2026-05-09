<template>
  <div class="common-container">
    <switchBar :left-menu="leftMenu" :index="outerIndex" @leftPress="getLeftIndex">
      <template v-if="outerIndex === 'COMPANY_MANAGER'">
        <div class="oper-box" @click="$refs.companyManage.openDialog()">
          创建企业
        </div>
        <div class="oper-box" style="background-color: #f70000" @click="$refs.companyManage.batchDelete()">
          批量删除企业
        </div>
        <div class="oper-box" style="background-color: #898686" @click="$refs.companyManage.batchBan()">
          批量禁用企业
        </div>
        <div class="oper-box" style="background-color: #ffa700" @click="$refs.companyManage.batchUnban()">
          批量恢复企业
        </div>
      </template>
      <template v-if="outerIndex === 'COMPANY_MANAGER_DETAIL'">
        <template v-if="indexDetail === '1'">
          <div class="oper-box" @click="$refs.companyManageDetail.openDialogRoom()">
            创建电房
          </div>
          <div class="oper-box" style="background-color: #f70000" @click="$refs.companyManageDetail.batchDeleteRoom()">
            批量删除电房
          </div>
        </template>
        <template v-if="indexDetail === '2'">
          <div class="oper-box" @click="$refs.companyManageDetail.openDialogCabinet()">
            创建机柜
          </div>
          <div class="oper-box" style="background-color: #f70000" @click="$refs.companyManageDetail.batchDeleteCabinet()">
            批量删除机柜
          </div>
        </template>
      </template>
      <div class="oper-box">
        <i class="el-icon-search" />
      </div>
    </switchBar>
    <div class="content-box">
      <companyManage v-if="outerIndex === 'COMPANY_MANAGER'" ref="companyManage" />
      <companyManageDetail v-if="outerIndex === 'COMPANY_MANAGER_DETAIL'" ref="companyManageDetail" @getDetailIndex="getDetailIndex" />
    </div>
  </div>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import companyManage from './components/companyManage/index.vue'
import companyManageDetail from './components/companyManageDetail/index.vue'
export default {
  name: 'CompanyManager',
  components: { switchBar, companyManage, companyManageDetail },
  data() {
    return {
      outerIndex: 'COMPANY_MANAGER',
      leftMenu: [
        { value: 'COMPANY_MANAGER', label: '企业管理' },
        { value: 'COMPANY_MANAGER_DETAIL', label: '企业管理详情', hidden: true }
      ],
      indexDetail: 0
    }
  },
  mounted() {
    if (this.$route.query.index) {
      this.outerIndex = this.$route.query.index
    } else {
      this.outerIndex = 'COMPANY_MANAGER'
    }
  },
  methods: {
    getLeftIndex(e) {
      this.$router.replace({ path: this.$route.path, query: { index: e }})
      this.outerIndex = e
    },
    getDetailIndex(e) {
      this.indexDetail = e
    }
  }
}
</script>
<style lang="less">
.oper-box {
  padding: 0 20px
}
</style>
