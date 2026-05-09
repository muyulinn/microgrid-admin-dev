<template>
  <div class="person-container common-shadow">
    <!-- <div class="top-data common-shadow">
      <div class="left-chart">
        <barChart title="人员数据信息" :x-line="['全部人员', '系统人员', '企业人员', '备案人员', '禁用人员']" :chart-data="[10, 22, 28, 23, 19]" />
      </div>
      <div class="line" />
      <div class="right-data">
        <div class="line-box">
          <div class="one-line">
            <div class="data1">
              <div style="color:#546BF0">200</div>
              <div>全部人员</div>
            </div>
            <div class="data1">
              <div style="color:#28CE52">150</div>
              <div>系统人员</div>
            </div>
            <div class="data1">
              <div style="color:#FF9800">40</div>
              <div>企业人员</div>
            </div>
            <div class="data1">
              <div style="color:#F28484">10</div>
              <div>备案人员</div>
            </div>
            <div class="data1">
              <div style="color:#484545">10</div>
              <div>禁用人员</div>
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
    </div> -->
    <div class="bottom-table">
      <div class="title">人员列表</div>
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
          <el-table-column label="昵称" prop="nickName" />
          <el-table-column label="真实姓名" prop="realName" />
          <el-table-column label="性别" prop="memberSex">
            <template slot-scope="scoped">
              {{ scoped.row.memberSex === 'MALE' ? '男': (scoped.row.memberSex === 'FEMALE' ? '女' : '') }}
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="memberPhone" />
          <el-table-column label="邮箱" prop="memberEmail" />
          <el-table-column label="身份证号" prop="identityCard" />
          <el-table-column label="头像" prop="avatarUrl">
            <template slot-scope="scoped">
              <fs-img v-if="scoped.row.avatarUrl" :code="scoped.row.avatarUrl" alt="" style="width: 55px;height:55px" />
              <span v-else>暂无头像</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" />
          <el-table-column :label="'操作'" width="300">
            <!-- <template #default="{row}"> -->
            <template>
              <!-- <div class="common-btn color1">重置密码</div>
              <div class="common-btn color2">权限</div>
              <div class="common-btn color3">查看详情</div> -->
              <el-button type="primary" size="mini">重置密码</el-button>
              <el-button type="success" size="mini">权限</el-button>
              <el-button type="primary" size="mini">查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </page-table>
    </div>
  </div>
</template>
<script>
// import barChart from '@/components/barChart/index'
export default {
  components: {
    // barChart
  },
  data() {
    return {
      queryForm: {},
      selection: []
    }
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/user/getMemberVoIPage', { ...param, ...this.queryForm })
    }
  }
}
</script>
<style lang="less" scoped>
.person-container {
  min-height: calc(100% - 35px);
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
     margin-top: 12px;
     margin-bottom: 3px;
     overflow: hidden;
    //  min-height: 480px;
     padding: 6px;
     .title {
      font-weight: bold;
      color: #101010;
      margin: 10px 0;
     }
   }
}
</style>
