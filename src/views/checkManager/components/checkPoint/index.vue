<template>
  <div class="checkPoint">
    <!-- <div class="timeline common-shadow">
      <el-steps :active="active" finish-status="success">
        <el-step v-for="(activity, index) in activities" :key="index" :title="activity.content" />
      </el-steps>
    </div> -->
    <el-row class="checkPoint-container">
      <el-col :span="5" class="left-nav common-shadow">
        <div class="top-search">
          <span>巡查点列表</span><el-input v-model="listForm.pointName" placeholder="请输入巡查点名称" @change="getLeftNavList" @blur="getLeftNavList" />
        </div>
        <div class="bottom-list">
          <div v-for="(item,index) in leftNavList" :key="index" class="point" :class="item.id === currentNav.id ? 'active' : ''" @click="changeNav(item)">
            <div class="top">
              <div>00001</div>
              <div>上次巡检：{{ item.createTime }}</div>
            </div>
            <div class="middle">
              <div>{{ item.pointName }}</div>
              <div class="check-btn" style="border:none;background-color: #2080ff;color:#fff" :style="item.patrolCategory === 'MAINTAIN' ? 'background-color: #18c344' : ''">{{ $getEnumDesc($store.getters.enumData,'patrolPoint.patrolCategory',item.patrolCategory) }}</div>
            </div>
            <div class="content">
              {{ item.pointContent }}
            </div>
          </div>
        </div>
      </el-col>
      <el-col v-if="rightContent" :span="19" class="right-content  common-shadow">
        <div class="check-title">
          <div class="check-title-left">
            <div>{{ currentNav.pointName }}</div>
            <div class="check-btn" :class="currentNav.pointStatus === 'ON'? 'on' : ''">{{ $getEnumDesc($store.getters.enumData,'patrolTask.taskStatus',currentNav.pointStatus) }}</div>
          </div>
          <div>
            <el-button type="primary" @click="openDialog">编辑</el-button>
            <el-button type="danger" @click="deleteRow">删除</el-button>
          </div>
        </div>
        <el-row class="check-detail">
          <el-col :span="12" class="left">
            <el-form class="line">
              <el-form-item label="巡检点名称">
                <el-input v-model="rightContent.pointName" disabled />
              </el-form-item>
              <el-form-item label="巡检点状态">
                <el-input :value="$getEnumDesc($store.getters.enumData,'patrolPoint.pointStatus',rightContent.pointStatus)" disabled />
              </el-form-item>
              <el-form-item label="执行人">
                <el-input v-model="rightContent.unknown" disabled />
              </el-form-item>
              <el-form-item label="巡检点内容描述">
                <el-input v-model="rightContent.pointContent" type="textarea" disabled :rows="11" />
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="right">
            <el-form class="line">
              <el-form-item label="所属计划">
                <el-input :value="$getEnumDesc($store.getters.enumData,'patrolPoint.patrolPlan',rightContent.patrolPlan)" disabled />
              </el-form-item>
              <el-form-item v-if="rightContent.patrolPlan">
                <template v-if="rightContent.patrolPlan === 'ONCEDAY' || rightContent.patrolPlan === 'TWICEDAY'">
                  <el-time-picker
                    v-model="patrolPlanObj.time"
                    placeholder="请选择时间"
                    value-format="HH:mm:ss"
                    disabled
                    @change="calcPatrolPlanMsg"
                  />
                </template>
                <template v-if="rightContent.patrolPlan === 'ONCEWEEK'">
                  <el-select v-model="patrolPlanObj.week" placeholder="请选择" @change="calcPatrolPlanMsg">
                    <el-option
                      v-for="item in weekSelect"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      disabled
                    />
                  </el-select>
                  <el-time-picker
                    v-model="patrolPlanObj.time"
                    placeholder="请选择时间"
                    value-format="HH:mm:ss"
                    disabled
                    @change="calcPatrolPlanMsg"
                  />
                </template>
                <template v-if="rightContent.patrolPlan === 'ONCEMONTH'">
                  <!-- <el-date-picker v-model="patrolPlanObj.date" type="date" placeholder="选择时间" value-format="yyyy-MM-dd" disabled @change="calcPatrolPlanMsg" /> -->
                  <el-select v-model="patrolPlanObj.date" placeholder="请选择" disabled @change="calcPatrolPlanMsg">
                    <el-option
                      v-for="item in monthSelect"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-time-picker
                    v-model="patrolPlanObj.time"
                    placeholder="请选择时间"
                    value-format="HH:mm:ss"
                    disabled
                    @change="calcPatrolPlanMsg"
                  />
                </template>
              </el-form-item>
              <el-form-item v-if="rightContent.patrolPlan && rightContent.patrolPlan.includes('TWICE')">
                <template v-if="rightContent.patrolPlan === 'TWICEDAY'">
                  <el-time-picker
                    v-model="patrolPlanObj.time2"
                    placeholder="请选择时间"
                    value-format="HH:mm:ss"
                    disabled
                    @change="calcPatrolPlanMsg"
                  />
                </template>
              </el-form-item>
              <el-form-item label="上次巡检点">
                <el-input v-model="rightContent.unknown" disabled />
              </el-form-item>
              <el-form-item label="所属建筑物">
                <!-- <el-input v-model="rightContent.name" disabled />
                 -->
                <el-select v-model="rightContent.patrolBuildId" disabled style="width:100%">
                  <el-option
                    v-for="item in buildSelect"
                    :key="item.id"
                    :label="item.buildName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="巡检点ID">
                <el-input v-model="rightContent.id" disabled />
              </el-form-item>
              <div class="pic-box">
                <span>操作手册</span>
                <div class="img-box">
                  <div v-if="rightContent.operationBook" class="download-box">
                    <div v-for="(item,index) in JSON.parse(rightContent.operationBook)" :key="index" class="item" @click="download(item)">
                      <img src="@/assets/jiahua/download.png" alt="" class="download-pic">
                      <span>{{ item.fileName }}</span>
                    </div>
                  </div>
                  <span v-else>无</span>
                </div>
              </div>
            </el-form>
          </el-col>
        </el-row>
        <div class="bottom-table">
          <el-tabs v-model="activeName">
            <el-tab-pane label="巡检记录" name="0">巡检记录</el-tab-pane>
            <el-tab-pane label="工单" name="1">工单</el-tab-pane>
            <el-tab-pane label="巡检任务" name="2">
              <el-table :data="rightContent.patrolPointTaskVoList" style="width: 100%">
                <el-table-column label="任务名称" prop="taskName" />
                <el-table-column label="任务描述" prop="taskContent" />
                <el-table-column label="预计时间（分钟）" prop="taskMinute" />
                <el-table-column :label="'启用情况'" prop="taskStatus">
                  <template #default="{row}">
                    <el-switch v-model="row.taskStatus" active-color="#13ce66" inactive-color="#ff4949" active-value="ON" inactive-value="OFF" disabled />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activities: [{
        content: '配电房',
        timestamp: '2018-04-15'
      }, {
        content: '1#生产车间',
        timestamp: '2018-04-13'
      }, {
        content: '2#建筑物',
        timestamp: '2018-04-11'
      }, {
        content: '3#构筑物',
        timestamp: '2018-04-11'
      }],
      active: 2,
      queryForm: {},
      selection: [],
      labelWidth: '100px',
      activeName: '2',
      listForm: {
        pointName: ''
      },
      currentNav: {},
      leftNavList: [],
      rightContent: {},
      buildSelect: {},
      patrolPlanObj: {
        time: '',
        week: '',
        date: '',
        time2: ''
      },
      weekSelect: [
        { value: '1', label: '周一' },
        { value: '2', label: '周二' },
        { value: '3', label: '周三' },
        { value: '4', label: '周四' },
        { value: '5', label: '周五' },
        { value: '6', label: '周六' },
        { value: '7', label: '周日' }
      ],
      monthSelect: [
        { value: '01', label: '1日' },
        { value: '02', label: '2日' },
        { value: '03', label: '3日' },
        { value: '04', label: '4日' },
        { value: '05', label: '5日' },
        { value: '06', label: '6日' },
        { value: '07', label: '7日' },
        { value: '08', label: '8日' },
        { value: '09', label: '9日' },
        { value: '10', label: '10日' },
        { value: '11', label: '11日' },
        { value: '12', label: '12日' },
        { value: '13', label: '13日' },
        { value: '14', label: '14日' },
        { value: '15', label: '15日' },
        { value: '16', label: '16日' },
        { value: '17', label: '17日' },
        { value: '18', label: '18日' },
        { value: '19', label: '19日' },
        { value: '20', label: '20日' },
        { value: '21', label: '21日' },
        { value: '22', label: '22日' },
        { value: '23', label: '23日' },
        { value: '24', label: '24日' },
        { value: '25', label: '25日' },
        { value: '26', label: '26日' },
        { value: '27', label: '27日' },
        { value: '28', label: '28日' },
        { value: '29', label: '29日' },
        { value: '30', label: '30日' },
        { value: '31', label: '31日' }
      ]
    }
  },
  mounted() {
    this.getLeftNavList()
    this.getBuildList()
  },
  methods: {
    getBuildList() {
      this.$http.getParam('/patrol/getPatrolBuildVoIPage', { size: 5000 }).then(res => {
        this.buildSelect = res.records
      })
    },
    getLeftNavList(param) {
      this.$http.getParam('/patrol/getPatrolPointVoList', { ...this.listForm }).then(res => {
        this.leftNavList = res
        if (res.length > 0) {
          this.currentNav = res[0]
          this.getRightContent(res[0].id)
        }
      })
    },
    getRightContent(id) {
      this.$http.getParam('/api/patrol/getPatrolPointVoById', { id }).then(res => {
        this.rightContent = res
        this.reShowEditData(res.patrolPlan, res.patrolPlanMsg)
      })
    },
    query(param = {}) {
      return this.$http.getParam('/user/getRoleList', { ...param, ...this.queryForm })
    },
    changeNav(item) {
      this.currentNav = item
      this.getRightContent(item.id)
    },
    download(item) {
      window.open(
        `${this.imgHost}/${item.code}.${item.suffix ? item.suffix : ''}`,
        '_blank'
      )
    },
    deleteRow() {
      if (this.rightContent.id) {
        this.$confirm('确定删除该巡查点？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.post('/patrol/batchDelPatrolBuildVo', { patrolBuildVoList: this.selection.map(item => { return { id: item.id } }) }).then(res => {
          this.$http.post('/patrol/batchDelPatrolPointVo', { patrolPointVoList: [{ id: this.rightContent.id }] }).then(res => {
            this.$message.success('删除成功')
            this.getLeftNavList()
          })
        })
      } else {
        this.$message.info('请选择至少一条数据')
      }
    },
    openDialog() {
      this.$router.replace({ path: this.$route.path, query: { index: 'CREATE_PATROL', isEdit: true, ...this.rightContent }})
    },
    calcPatrolPlanMsg() {
      this.checkForm.patrolPlanMsg = ''
      if (this.checkForm.patrolPlan === 'ONCEDAY') {
        this.checkForm.patrolPlanMsg = this.patrolPlanObj.time
      }
      if (this.checkForm.patrolPlan === 'ONCEWEEK') {
        this.checkForm.patrolPlanMsg = this.patrolPlanObj.week + ',' + this.patrolPlanObj.time
      }
      if (this.checkForm.patrolPlan === 'ONCEMONTH') {
        // this.checkForm.patrolPlanMsg = this.patrolPlanObj.date.split('-')[2] + ',' + this.patrolPlanObj.time
        this.checkForm.patrolPlanMsg = this.patrolPlanObj.date + ',' + this.patrolPlanObj.time
      }
      if (this.checkForm.patrolPlan === 'TWICEDAY') {
        this.checkForm.patrolPlanMsg = this.patrolPlanObj.time + ';' + this.patrolPlanObj.time2
      }
    },
    reShowEditData(patrolPlan, patrolPlanMsg) {
      console.log(patrolPlan, patrolPlanMsg)
      if (patrolPlan === 'ONCEDAY') {
        this.patrolPlanObj.time = patrolPlanMsg
      }
      if (patrolPlan === 'ONCEWEEK') {
        this.patrolPlanObj.week = patrolPlanMsg.split(',')[0]
        this.patrolPlanObj.time = patrolPlanMsg.split(',')[1]
      }
      if (patrolPlan === 'ONCEMONTH') {
        this.patrolPlanObj.date = patrolPlanMsg.split(',')[0]
        this.patrolPlanObj.time = patrolPlanMsg.split(',')[1]
      }
      if (patrolPlan === 'TWICEDAY') {
        this.patrolPlanObj.time = patrolPlanMsg.split(';')[0]
        this.patrolPlanObj.time2 = patrolPlanMsg.split(';')[1]
      }
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="less" scoped>
.checkPoint {
  .timeline {
    margin-top: 12px;
    padding: 10px 40px 10px 10px;
    overflow-x: auto;
    width: 100%;
  }
  .checkPoint-container {
    margin-top: 12px;
    display: flex;
    color: #101010;
    .left-nav {
      overflow-y: auto;
      // height: calc(100vh - 325px);
      height: calc(100vh - 230px);
      margin-right: 12px;
      .top-search {
        padding: 11px;
        display: flex;
        align-items: center;
        span {
          margin-right: 20px;
          width: 103px;
        }
      }
      .bottom-list {
        .point {
          padding: 20px;
          margin-bottom: 15px;
          border-top: 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
          position: relative;
          transition: border-color 0.3s, background-color 0.3s, color 0.3s;
          cursor: pointer;
          .top ,.middle{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 13px;
          }
          .top > div:nth-child(1) {
            font-weight: bold;
          }
          ::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background-color: none;
            transition: background-color 0.3s;
          }
        }
        .point:nth-last-child(1) {
          margin-bottom: 0;
        }
        .active {
          background-color: #eaedfd;
          .middle {
            div:nth-child(1) {
              color: #546BF0;
            }
          }
          ::before {
            background-color: #E99D42;
          }
        }
      }
    }
    .right-content {
      overflow-y: scroll;
      // height: calc(100vh - 325px);
      height: calc(100vh - 230px);
      .check-title {
        display: flex;
        padding: 14px 21px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #bbb;
        .check-title-left {
          display: flex;
          align-items: center;
          .check-btn {
            margin-left: 25px;
            margin-top: -2px;
          }
        }
      }
      .check-detail {
        padding: 15px 10px 0 10px;
        display: flex;
        .left .right {
          .line {
            display: flex !important;
          }
        }
        .left {
          margin-right: 40px;
        }
        .right {
          .line {
            .pic-box {
              span {
                font-size: 14px;
                color: #606266;
                font-weight: bold;
              }
              .img-box {
                // width: 148px;
                // height: 148px;
                // background-color: #cfd1c5;
                cursor: pointer;
                margin-top: 6px;
              }
            }
          }
        }
      }
      .bottom-table {
        padding: 0px 10px 10px 10px;
      }
    }
  }
}
.check-btn {
  width: 85px;
  height: 19px;
  line-height: 19px;
  text-align: center;
  border: 1px solid #ff0000;
  border-radius: 45px;
  background-color: #ffdada;
}
.on {
  background-color: #18c344;
  color: white;
  border: none;
}
</style>
