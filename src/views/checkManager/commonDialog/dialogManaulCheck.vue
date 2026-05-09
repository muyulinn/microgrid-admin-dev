<template>
  <div class="dialog-box">
    <el-dialog :title="type === 'PATROL' ? '手动生成巡检任务' : '手动生成保养任务'" :visible.sync="show" :modal-append-to-body="false" :before-close="cancel">
      <el-form label-width="110px" size="medium">
        <el-form-item label="*巡检点">
          <el-select v-model="form.id" placeholder="巡检点">
            <el-option
              v-for="item in checkPointSelect"
              :key="item.id"
              :label="item.pointName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="type === 'PATROL' ? '*巡检时间': '*保养时间'">
          <el-date-picker v-model="form.patrolTime" type="datetime" :placeholder="type === 'PATROL' ? '巡检时间': '保养时间'" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancel">取消</el-button>
        <el-button size="medium" type="primary" @click="confirm">确定生成</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      checkPointSelect: []
    }
  },
  watch: {
    'currentRow': {
      handler(newVal) {
        this.form = newVal
      },
      deep: true
    },
    isEdit(newVal) {
      if (!newVal) {
        this.form = {}
      } else {
        this.form = this.currentRow
      }
    }
  },
  created() {
    this.getPatrolPointVoList()
  },
  methods: {
    getPatrolPointVoList(param = {}) {
      if (this.type) {
        param.patrolCategory = this.type
      }
      console.log(param, 456)
      this.$http.get('/patrol/getPatrolPointVoList', { params: param }).then(res => {
        this.checkPointSelect = res
      })
    },
    cancel() {
      this.$emit('update:show', false)
    },
    confirm() {
      if (this.isEdit) {
        // this.$http.post('/patrol/editPatrolBuildVo', this.form).then(res => {
        //   this.$message.success('编辑成功')
        //   this.$emit('update:show', false)
        //   this.$emit('reload')
        // })
      } else {
        let url = '/patrol/genPatrolRecordVoByPatrolPointVo'
        if (this.type === 'MAINTAIN') {
          url = '/patrol/genMainTainPatrolRecordVo'
        }
        this.$http.post(url, this.form).then(res => {
          this.$message.success('添加成功')
          this.$emit('update:show', false)
          this.$emit('reload')
        })
      }
    }
  }
}
</script>
