<template>
  <div class="dialog-box">
    <el-dialog :title="isEdit ? '编辑构建物': '创建构建物'" :visible.sync="show" :modal-append-to-body="false" :before-close="cancel">
      <el-form label-width="110px" size="medium">
        <el-form-item label="*构筑物名称">
          <el-input v-model="form.buildName" placeholder="*构筑物名称" />
        </el-form-item>
        <el-form-item label="*构筑物ID">
          <el-input v-model="form.buildCode" placeholder="构筑物ID" />
        </el-form-item>
        <el-form-item label="*所属机构">
          <el-select v-model="form.orgId" placeholder="所属机构">
            <el-option
              v-for="item in orgSelect"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancel">取消</el-button>
        <el-button type="primary" size="medium" @click="confirm">确定创建</el-button>
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
    orgSelect: {
      type: Array,
      default: () => []
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
        this.$http.post('/patrol/editPatrolBuildVo', this.form).then(res => {
          this.$message.success('编辑成功')
          this.$emit('update:show', false)
          this.$emit('reload')
        })
      } else {
        this.$http.post('/patrol/addPatrolBuildVo', this.form).then(res => {
          this.$message.success('添加成功')
          this.$emit('update:show', false)
          this.$emit('reload')
        })
      }
    }
  }
}
</script>
