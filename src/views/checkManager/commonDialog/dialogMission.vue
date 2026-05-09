<template>
  <div class="dialog-box">
    <el-dialog :title="isEdit ? '编辑任务': '创建任务'" :visible.sync="show" :modal-append-to-body="false" :before-close="cancel">
      <el-form label-width="110px" size="medium">
        <el-form-item label="任务名称">
          <el-input v-model="form.taskName" placeholder="任务名称" />
        </el-form-item>
        <el-form-item label="巡检任务描述">
          <el-input v-model="form.taskContent" placeholder="巡检任务描述" />
        </el-form-item>
        <el-form-item label="目标完成时间（分钟）">
          <el-input v-model.number="form.taskMinute" placeholder="目标完成时间（分钟）" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="备注" />
        </el-form-item>
        <el-form-item label="巡检任务ID">
          <el-input v-model="form.taskCode" placeholder="巡检任务ID" />
        </el-form-item>
        <el-form-item label="操作手册">
          <UploadMultToJson
            v-if="show"
            ref="uploadMultToJson"
            :max-length="9"
            :show-edit-data="form.operationBook"
            @dataChange="updateImg"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancel">取消</el-button>
        <el-button type="primary" size="medium" @click="confirm">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadMultToJson from '@/components/UploadMultToJson'
export default {
  components: {
    UploadMultToJson
  },
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
    }
  },
  data() {
    return {
      form: {}
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
  methods: {
    cancel() {
      this.$emit('update:show', false)
    },
    confirm() {
      if (this.isEdit) {
        this.$http.post('/patrol/editPatrolTaskVo', this.form).then(res => {
          this.$message.success('编辑成功')
          this.$emit('update:show', false)
          this.$emit('reload')
        })
      } else {
        this.$http.post('/patrol/addPatrolTaskVo', this.form).then(res => {
          this.$message.success('添加成功')
          this.$emit('update:show', false)
          this.$emit('reload')
        })
      }
    },
    // 上传图片
    updateImg(val) {
      this.form.operationBook = val
    }
  }
}
</script>
