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
import { setToken } from '@/utils/auth'
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
      loading: false,
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
      immediate: true
    }
  },
  created() {
    this.getCookie()
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
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
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return false
        if (this.checked) {
          this.setCookie(this.loginForm.userName, this.loginForm.password, 7)
        } else {
          this.clearCookie()
        }
        this.loading = true
        const param = new URLSearchParams()
        const grant_type = 'user_token'
        param.append('grant_type', grant_type)
        param.append('userName', this.loginForm.userName)
        param.append('password', this.loginForm.password)
        this.$http
          .post('/oauth/token', param)
          .then((data) => {
            this.loading = false
            setToken(`${data.token_type} ${data.access_token}`)
            this.$router.push('/main-dashboard2')
          })
          .finally(() => {
            this.loading = false
          })
      })
    },

    // 设置cookie
    setCookie(c_name, c_pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + c_name + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
        'password' + '=' + c_pwd + ';path=/;expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie: function() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
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
$bg: #fff;
$light_gray: #808080;
$cursor: #9f9f9f;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
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
