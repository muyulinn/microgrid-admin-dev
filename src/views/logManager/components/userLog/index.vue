<template>
  <div class="log-container">
    <div class="top-data common-shadow">
      <div class="left-chart">
        <barChart title="日志统计" :x-line="['全部日志', '类型A', '类型B', '类型C', '类型D']" :chart-data="[10, 22, 28, 22,55]" />
      </div>
      <div class="line" />
      <div class="right-data">
        <div class="line-box">
          <div class="one-line">
            <div class="data1">
              <div style="color:#546BF0">200</div>
              <div>全部日志</div>
            </div>
            <div class="data1">
              <div style="color:#28CE52">150</div>
              <div>类型A</div>
            </div>
            <div class="data1">
              <div style="color:#FF9800">40</div>
              <div>类型B</div>
            </div>
            <div class="data1">
              <div style="color:#F28484">10</div>
              <div>类型C</div>
            </div>
            <div class="data1">
              <div style="color:#484545">10</div>
              <div>类型D</div>
            </div>
          </div>
          <div class="one-line" style="margin-top:21px">
            <div class="data1">
              <div>100%</div>
              <div>占比</div>
            </div>
            <div class="data1">
              <div>75%</div>
              <div>占比</div>
            </div>
            <div class="data1">
              <div>20%</div>
              <div>占比</div>
            </div>
            <div class="data1">
              <div>5%</div>
              <div>占比</div>
            </div>
            <div class="data1">
              <div>5%</div>
              <div>占比</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-table common-shadow">
      <div class="title">计划列表</div>
      <page-table
        ref="pageTable"
        :query="query"
        :selection.sync="selection"
        @reset="queryForm={}"
      >
        <template #query-form>
          <!-- <el-form-item label="人员名称">
            <el-input v-model="queryForm.roleName" />
          </el-form-item> -->
        </template>
        <template #action-new-line>
          <!-- <el-button type="primary" icon="el-icon-circle-plus-outline">添加角色</el-button> -->
        </template>
        <template slot="table-body">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="NO" prop="id" />
          <el-table-column label="创建时间" prop="createTime" />
          <!-- <el-table-column :label="'操作'" width="300">
            <template>
              <div class="common-btn color1">重置密码</div>
              <div class="common-btn color2">权限</div>
              <div class="common-btn color3">查看详情</div>
            </template>
          </el-table-column> -->
        </template>
      </page-table>
    </div>
  </div>
</template>
<script>
import barChart from '@/components/barChart/index'
export default {
  components: {
    barChart
  },
  data() {
    return {
      queryForm: {},
      selection: []
    }
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/user/getRoleList', { ...param, ...this.queryForm })
    }
  }
}
</script>
<style lang="less" scoped>
.log-container {
  .top-data {
     height: 207px;
     margin: 12px 0;
     display: flex;
     padding: 10px 70px 10px 20px;
     .left-chart, .right-data {
       flex: 1;
      }
     .right-data {
       display: flex;
       flex-direction: column;
       justify-content: center;
       .line-box {
         .one-line {
           width: 100%;
           display: flex;
           justify-content: space-between;
           align-items: center;
           .data1 {
             width: 56px;
             text-align: center;
             color: #595959;
             div:nth-child(1) {
               margin-bottom: 4px;
               color: #101010;
             }
             }
           }
         }
      }
     .line {
       margin: 0 52px;
       width: 1px;
       background-color: #e6e6e6;
       height: 100%;
     }
   }
   .bottom-table {
     margin-bottom: 3px;
     overflow: hidden;
     min-height: 480px;
     padding: 6px;
     .title {
      font-weight: bold;
      color: #101010;
      margin: 10px 0;
     }
   }
}
</style>
