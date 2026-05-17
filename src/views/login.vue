<template>
  <div class="login-container">
    <div class="login-wrap flexBox columnBox">
      <div class="login-form">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">{{ title }}</h3>
          </div>
          <el-form-item prop="username">
            <span class="svg-container">
              <!-- <i class="el-icon-user" style="font-size: 20px" /> -->
              <img src="@/assets/img/user.png" alt="" style="width:20px;height:20px">
            </span>
            <el-input
              ref="username"
              v-model.trim="loginForm.userName"
              placeholder="用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip
            v-model.trim="capsTooltip"
            content="已开启键盘大写"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <!-- <i class="el-icon-unlock" style="font-size: 20px" /> -->
                <img src="@/assets/img/password.png" alt="" style="width:20px;height:20px">
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model.trim="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
          </el-tooltip>
          <div>
            <el-checkbox
              v-model="checked"
              style="color: #808080"
            >记住账号和密码</el-checkbox>
          </div>
          <div style="margin-top: 30px; color: #808080; font-size: 14px">
            注意：忘记账号和密码，请联系IT课
          </div>
          <el-button
            :loading="loading"
            type="primary"
            style="
              width: 348px;
              height: 40px;
              background: #1E64E4;
              font-size: 14px;
              margin: 30px auto;
              box-shadow: px 0 8px rgba(42, 75, 200, 0.48);
            "
            @click.native.prevent="handleLogin"
          >提交</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
// 导入验证用户名的函数
import { setToken } from '@/utils/auth'
// 导入设置访问令牌的函数,登陆成功后把通行证存起来
import { version } from '@/config'
import { title } from '@/settings'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于8位'))
        // bug：密码不能少于6位，但提示信息写成了8位
      } else {
        callback()
      }
    }
    return {
      title,
      version,
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false, // 登录按钮的加载状态(转圈)
      redirect: null,
      checked: true
    }
  },
  watch: {
    $route: {
      handler: (route) => {
        const query = route.query
        if (query) {
          // this.redirect = query.redirect;
        }
      },
      // 通常用于获取重定向地址。例如：如果你之前想看“订单页面”
      // 但没登录，系统把你踢回登录页后，它会记住你想去
      // “订单页面”，登录成功后直接送你过去。
      immediate: true
    }
  },
  // 数据好了用created
  created() {
    this.getCookie() // 获取cookie
    // 二维码扫描：window.addEventListener('storage', this.afterQRScan)
  },
  // 页面元素好了用mounted
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus() // 光标自动对准
      // $ref是vue实例，$refs是vue实例的一个属性，
      // 存储着所有注册了ref属性的子组件和HTML元素
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus() // 光标自动对准
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) { // 检测CapsLock是否开启
      const { key } = e // const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
        // 转换密码显示后，能继续输入密码。
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        // 进行表单验证
        if (!valid) return false // 验证不通过则停止执行
        if (this.checked) {
          this.setCookie(this.loginForm.userName, this.loginForm.password, 7)
          // 设置cookie，保存7天
        } else {
          this.clearCookie() // 清除cookie
        }
        this.loading = true // 显示加载状态
        const param = new URLSearchParams()
        // 创建URLSearchParams对象，用于构造请求参数
        const grant_type = 'user_token'
        param.append('grant_type', grant_type)
        param.append('userName', this.loginForm.userName)
        param.append('password', this.loginForm.password)
        // 打包授权类型和用户输入的用户名、密码到请求参数中
        this.$http
          .post('/oauth/token', param)
          // 发送POST请求到认证服务器的token端点，获取访问令牌
          .then((data) => { // 请求成功后，处理响应数据
            this.loading = false
            setToken(`${data.token_type} ${data.access_token}`)
            // 将获取到的访问令牌存储在浏览器的cookie中，供后续请求使用
            this.$router.push('/main-dashboard2')
          })
          .finally(() => {
            // 无论请求成功还是失败，都会执行这个回调函数
            this.loading = false
          })
      })
    },

    // 设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays)
      // 保存的天数
      window.document.cookie =
        'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
        'password' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) { // 存在存储的账号密码
        var arr = document.cookie.split('; ')
        // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.loginForm.userName = arr2[1] // 保存到保存数据的地方
          } else if (arr2[0] === 'password') {
            this.loginForm.password = arr2[1]
          }
        }
      }
      console.log(this.loginForm, 'f')
    },
    // 清除cookie
    clearCookie: function() {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    }
  }
}
</script>

<style lang="scss">
$bg: #fff; // 背景白色
$light_gray: #808080; // 输入框文字颜色
$cursor: #9f9f9f; // 输入框光标颜色

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
} // 兼容Safari浏览器，解决输入框文字颜色不正确的问题

.login-container { // UI布局定制
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      font-size: 14px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border-bottom: 1px solid #e6e6e6;
    color: #aaaaaa;
  }
  // 登陆盒子
  .login-wrap {
    width: 560px;
    height: 500px;
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 27px 0px rgba(58, 93, 223, 0.36);
    background: #fff;
  }
}
.login-container .el-checkbox__input.is-checked + .el-checkbox__label{
  color: #808080;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #808080;
$light_gray: #808080;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('https://oss.jiahuagd.com.cn/public/projects/microgrid/img/zsyc-login-bg.jpeg') no-repeat;
  background-size: cover;
  background-position: center;
  // overflow: hidden;
  .login-form {
    position: relative;
    width: 348px;
    max-width: 100%;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
  }

  .tips {
    font-size: 14px;
    color: #aaaaaa;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    color: $dark_gray;
    vertical-align: middle;
    // width: 30px;
    display: inline-block;

  }

  .title-container {
    position: relative;
    margin-bottom: 50px;
    .title {
      font-size: 24px;
      color: rgba(26, 26, 26, 1);
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: 600;
      position: relative;
      &::after {
        position: absolute;
        bottom: -20px;
        left: 50%;
        margin-left: -40px;
        content: "";
        width: 80px;
        height: 4px;
        border-radius: 10px;
        background: #1E64E4;
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
