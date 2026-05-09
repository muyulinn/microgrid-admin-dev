<template>
  <div>
    <el-row class="create-checkPoint">
      <el-col :span="24" class="right-content  common-shadow">
        <div class="check-title">
          <div>新建巡查点</div>
        </div>
        <el-row class="check-detail">
          <el-col :span="11" class="left">
            <el-form class="line" label-width="120px">
              <el-form-item label="*巡检点名称">
                <el-input v-model="checkForm.pointName" placeholder="输入摄像头名称" style="width:180px" />
              </el-form-item>
              <el-form-item label="*所属计划">
                <el-select v-model="checkForm.patrolPlan" placeholder="请选择所属计划" @change="$forceUpdate()">
                  <!-- <el-option
                    v-for="item in []"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  /> -->
                  <enum-option enum="patrolPoint.patrolPlan" />
                </el-select>
              </el-form-item>
              <el-form-item label="*分配执行人">
                <el-tag
                  v-for="tag in dynamicTags"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-if="inputVisible"
                  ref="saveTagInput"
                  v-model="inputValue"
                  class="input-new-tag"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                />
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="13" class="right">
            <el-form v-if="patrolBuildSelect.length > 0" class="line" label-width="120px">
              <el-form-item label="*所属构建物">
                <el-select v-model="checkForm.patrolBuildId" placeholder="请选择">
                  <el-option
                    v-for="item in patrolBuildSelect"
                    :key="item.id"
                    :label="item.buildName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="checkForm.patrolPlan" label="*第一次巡检创建">
                <template v-if="checkForm.patrolPlan === 'ONCEDAY' || checkForm.patrolPlan === 'TWICEDAY'">
                  <el-time-picker
                    v-model="patrolPlanObj.time"
                    placeholder="请选择时间"
                    value-format="HH:mm:ss"
                    @change="calcPatrolPlanMsg"
                  />
                </template>
                <template v-if="checkForm.patrolPlan === 'ONCEWEEK'">
                  <el-select v-model="patrolPlanObj.week" placeholder="请选择" @change="calcPatrolPlanMsg">
                    <el-option
                      v-for="item in weekSelect"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-time-picker
                    v-model="patrolPlanObj.time"
                    placeholder="请选择时间"
                    value-format="HH:mm:ss"
                    @change="calcPatrolPlanMsg"
                  />
                </template>
                <template v-if="checkForm.patrolPlan === 'ONCEMONTH'">
                  <!-- <el-date-picker v-model="patrolPlanObj.date" type="date" placeholder="选择时间" value-format="yyyy-MM-dd" @change="calcPatrolPlanMsg" /> -->
                  <el-select v-model="patrolPlanObj.date" placeholder="请选择" @change="calcPatrolPlanMsg">
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
                    @change="calcPatrolPlanMsg"
                  />
                </template>
              </el-form-item>
              <el-form-item v-if="checkForm.patrolPlan && checkForm.patrolPlan.includes('TWICE')" label="*第二次巡检创建">
                <template v-if="checkForm.patrolPlan === 'TWICEDAY'">
                  <el-time-picker
                    v-model="patrolPlanObj.time2"
                    placeholder="请选择时间"
                    value-format="HH:mm:ss"
                    @change="calcPatrolPlanMsg"
                  />
                </template>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-form class="line" label-width="120px">
          <el-form-item label="*巡查点状态">
            <el-switch v-model="checkForm.pointStatus" active-color="#13ce66" inactive-color="#ff4949" active-value="ON" inactive-value="OFF" />
          </el-form-item>
          <el-form-item label="*巡查点描述">
            <el-input v-model="checkForm.pointContent" placeholder="输入巡查点描述" style="width:90%" type="textarea" :rows="10" @change="calcPatrolPlanMsg" />
          </el-form-item>
          <el-form-item label="操作手册">
            <UploadMultToJson
              ref="uploadMultToJson"
              :max-length="9"
              :show-edit-data="checkForm.operationBook"
              @dataChange="updateImg"
            />
          </el-form-item>
          <el-form-item label="*巡检类型">
            <!-- <el-input v-model="checkForm.patrolCategory" /> -->
            <el-radio-group v-model="checkForm.patrolCategory" size="medium" :disabled="Boolean(checkForm.id)">
              <el-radio-button v-for="(item,index) in $store.getters.enumData.patrolPoint.patrolCategory" :key="index" :label="item.val">{{ item.desc }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="*巡查点任务">
            <el-button v-if="checkForm.patrolCategory === 'PATROL'" type="primary" icon="el-icon-circle-plus-outline" @click="dialogVisibleMission = true">添加任务</el-button>
            <el-table v-if="checkForm.patrolCategory === 'PATROL'" :data="chosenMissionList" style="width: 100%">
              <el-table-column label="任务名称" prop="taskName" />
              <el-table-column label="任务描述" prop="taskContent" width="200px" />
              <el-table-column label="预计时间（分钟）" prop="taskMinute" />
              <el-table-column label="排序" prop="">
                <template #default="{row}">
                  <el-input v-model="row.taskSort" placeholder="请输入排序" />
                </template>
              </el-table-column>
              <el-table-column :label="'启用情况'" width="120">
                <!-- <template #default="{row}"> -->
                <template>
                  <el-switch active-color="#13ce66" inactive-color="#ff4949" />
                </template>
              </el-table-column>
              <el-table-column :label="'操作'" width="300">
                <template #default="{row}">
                  <el-button v-if="row.isSubmit === true" type="danger" @click="row.isSubmit = false">删除</el-button>
                  <el-button v-if="row.isSubmit === false" type="success" @click="row.isSubmit = true">恢复</el-button>
                  <span v-if="!row.isSubmit" style="margin-left: 10px;color:red">已删除</span>
                </template>
              </el-table-column>
            </el-table>
            <el-button v-if="checkForm.patrolCategory === 'MAINTAIN'" type="primary" icon="el-icon-circle-plus-outline" @click="chosenMissionList.push({ isSubmit: true })">添加任务</el-button>
            <el-table v-if="checkForm.patrolCategory === 'MAINTAIN'" :data="chosenMissionList" style="width: 100%">
              <el-table-column label="任务名称" prop="taskName">
                <template #default="{row}">
                  <el-input v-model="row.taskName" placeholder="请输入任务名称" />
                </template>
              </el-table-column>
              <el-table-column label="任务描述" prop="taskContent" width="200px">
                <template #default="{row}">
                  <el-input v-model="row.taskContent" placeholder="请输入任务描述" />
                </template>
              </el-table-column>
              <el-table-column label="预计时间（分钟）" prop="taskMinute">
                <template #default="{row}">
                  <el-input v-model="row.taskMinute" placeholder="请输入预计时间（分钟)" />
                </template>
              </el-table-column>
              <el-table-column label="排序" prop="">
                <template #default="{row}">
                  <el-input v-model="row.taskSort" placeholder="请输入排序" />
                </template>
              </el-table-column>
              <el-table-column :label="'启用情况'" width="120">
                <!-- <template #default="{row}"> -->
                <template>
                  <el-switch active-color="#13ce66" inactive-color="#ff4949" />
                </template>
              </el-table-column>
              <el-table-column :label="'操作'" width="300">
                <template #default="{row}">
                  <el-button v-if="row.isSubmit === true" type="danger" @click="row.isSubmit = false">删除</el-button>
                  <el-button v-if="row.isSubmit === false" type="success" @click="row.isSubmit = true">恢复</el-button>
                  <span v-if="!row.isSubmit" style="margin-left: 10px;color:red">已删除</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div class="btn-gr">
          <el-button type="primary" size="large" style="margin-right: 30px" @click="createTask">{{ $route.query.isEdit ? '确定编辑' : '确定创建' }}</el-button>
          <el-button type="primary" size="large" plain @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
    <dialogMissionList :show.sync="dialogVisibleMission" @getChosenLine="getChosenLine" />
  </div>
</template>
<script>
import dialogMissionList from '../../commonDialog/dialogMissionList.vue'
import UploadMultToJson from '@/components/UploadMultToJson'

export default {
  components: {
    dialogMissionList,
    UploadMultToJson
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      //
      checkForm: {
        pointName: '',
        patrolPlan: '',
        pointStatus: 'OFF',
        pointContent: '',
        patrolCategory: 'PATROL',
        operationBook: '',
        patrolBuildId: ''
      },
      selection: [],
      queryForm: {},
      dialogVisibleMission: false,
      patrolBuildSelect: [],
      chosenMissionList: [],
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
      ],
      firstEnter: true
    }
  },
  watch: {
    'checkForm.patrolBuildId': {
      handler(newVal) {
        if (newVal) {
          // 找到对应的orgId
          this.checkForm.orgId = this.patrolBuildSelect.find(item => item.id === newVal) ? this.patrolBuildSelect.find(item => item.id === newVal).orgId : ''
        }
      },
      deep: true
    },
    'checkForm.patrolCategory': {
      handler(newVal) {
        this.chosenMissionList = []
        if (newVal === 'MAINTAIN') {
          this.chosenMissionList.push({ isSubmit: true })
        }
      },
      deep: true
    },
    'checkForm.patrolPlan': {
      handler(newVal, oldVal) {
        if (!this.firstEnter) {
          this.patrolPlanObj = {
            time: '',
            week: '',
            date: '',
            time2: ''
          }
          this.checkForm.patrolPlanMsg = ''
        } else {
          this.firstEnter = false
        }
      },
      deep: true
    }
  },
  mounted() {
    this.setEditData()
    this.getPatrolBuild()
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    setEditData() {
      if (this.$route.query.isEdit) {
        this.checkForm = {
          id: this.$route.query.id || '',
          operationBook: this.$route.query.operationBook || '',
          orgId: this.$route.query.orgId || '',
          patrolBuildId: this.$route.query.patrolBuildId || '',
          pointContent: this.$route.query.pointContent || '',
          pointName: this.$route.query.pointName || '',
          pointStatus: this.$route.query.pointStatus || '',
          patrolCategory: this.$route.query.patrolCategory || '',
          patrolPlan: this.$route.query.patrolPlan || '',
          patrolPlanMsg: this.$route.query.patrolPlanMsg || ''
        }
        // 回显数据
        this.firstEnter = true
        this.reShowEditData(this.checkForm.patrolPlan, this.checkForm.patrolPlanMsg)
      }
    },
    getPatrolBuild() {
      this.$http.getParam('/patrol/getPatrolBuildVoList').then(res => {
        this.patrolBuildSelect = res
      })
    },
    query(param = {}) {
      return this.$http.getParam('/electricroom/getSwitchingRoomVoList', { ...param, ...this.queryForm })
    },
    getChosenLine(data) {
      data = JSON.parse(JSON.stringify(data))
      const chosenData = data.filter(item => {
        let isSave = true
        this.chosenMissionList.forEach(item2 => {
          if (item2.id === item.id) {
            isSave = false
          }
        })
        return isSave
      }).map(item => {
        item.isSubmit = true
        return item
      })
      this.chosenMissionList = [...this.chosenMissionList, ...chosenData]
    },
    cancel() {
      this.$emit('getLeftIndex', 'PATROL_PLAN')
    },
    createTask() {
      this.$confirm(this.$route.query.isEdit ? '确定编辑巡查点？' : '确定创建巡查点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const taskVoList = this.chosenMissionList.filter(item => {
          return item.isSubmit
        }).map(item => {
          let o = {
            taskName: item.taskName,
            taskContent: item.taskContent,
            taskSort: item.taskSort,
            taskMinute: item.taskMinute
          }
          if (this.checkForm.patrolPlan === 'MAINTAIN') {
            o = {
              patrolTaskId: item.id,
              taskStatus: item.taskStatus,
              taskSort: item.taskSort
            }
          }
          return o
        })
        // console.log(taskVoList, this.checkForm, 132)
        if (this.$route.query.isEdit) {
          this.$http.post('/patrol/editPatrolPointVo', { ...this.checkForm, patroLPointTaskVoList: taskVoList }).then(res => {
            this.$message.success('编辑成功')
            this.cancel()
          })
        } else {
          this.$http.post('/patrol/addPatrolPointVo', { ...this.checkForm, patroLPointTaskVoList: taskVoList }).then(res => {
            this.$message.success('创建成功')
            this.cancel()
          })
        }
      })
    },
    // 上传图片
    updateImg(val) {
      this.checkForm.operationBook = val
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
  .create-checkPoint {
    margin-top: 12px;
    display: flex;
    color: #101010;
    .right-content {
      .check-title {
        display: flex;
        padding: 14px 21px;
        align-items: center;
        border-bottom: 1px solid #bbb;
        .check-btn {
          margin-left: 25px;
          margin-top: -2px;
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
                width: 148px;
                height: 148px;
                background-color: #cfd1c5;
                margin-top: 6px;
              }
            }
          }
        }
      }
      .bottom-table {
        padding: 0px 10px 10px 10px;
      }
      .btn-gr {
        text-align: center;
        margin: 15px 0;
      }
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
