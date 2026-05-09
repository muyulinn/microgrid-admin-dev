<template>
  <div class="center-container common-shadow">
    <el-form class="form-box">
      <el-form-item label="登陆账号" :label-width="labelWidth">
        <el-input v-model="centerForm.a" placeholder="请输入登陆账号" />
      </el-form-item>
      <el-form-item label="*用户姓名" :label-width="labelWidth">
        <el-input v-model="centerForm.b" placeholder="请输入用户姓名" />
      </el-form-item>
      <el-form-item label="用户手机" :label-width="labelWidth">
        <el-input v-model="centerForm.c" placeholder="请输入用户手机" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="labelWidth">
        <el-input v-model="centerForm.d" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="用户头像" :label-width="labelWidth">
        <UploadImgs
          ref="uploadImgs"
          :max-length="1"
          :show-edit-data="centerForm.e"
          @dataChange="updateImg"
        />
      </el-form-item>
      <el-form-item label="登录密码" :label-width="labelWidth">
        <el-input v-model="centerForm.f" type="password" placeholder="请输入登录密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UploadImgs from '@/components/UploadImgs'
export default {
  components: {
    UploadImgs
  },
  data() {
    return {
      centerForm: {},
      labelWidth: '80px'
    }
  },
  methods: {
    updateImg(val) {
      this.centerForm.e = val
    }
  }
}
</script>
<style lang="less" scoped>
.center-container {
  margin-top: 12px;
  height: calc(100% - 40px);
  .form-box {
    width: 550px;
    padding: 26px;
  }
}
</style>
