<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">

        <h3 class="title ">
          <img class="mr-10 " src="/static/images/logo.png" style="transform:translate(0px, -4px);width:32px;vertical-align: middle;"></img>
          <span>
            {{title}}
          </span>
        </h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login"> <svg-icon style="margin-left:-8px;" icon-class="user" /> </span>
        <el-input v-model="loginForm.username" autoComplete="off" placeholder="username" @keypress.enter.native="handleLogin" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container"> <svg-icon style="margin-left:-6px;" icon-class="password" /> </span>
        <el-input v-model="loginForm.password" :type="passwordType" @keypress.enter.native="handleLogin" autoComplete="off" placeholder="password" />
        <span class="show-pwd" @click="showPwd"> <svg-icon icon-class="eye" /> </span>
      </el-form-item>

      <el-button size="small" type="success" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin"
      >{{ $t('login.logIn') }}
      </el-button>
      <div class="text-center" style="color:#ffffff;">
        Primeton Technologies Ltd.
      </div>
    </el-form>
  </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  import store from '@util/sessionStore'
  import vue from 'vue'
  import request from '@/utils/request'
  import ajaxUtil from '@/libs/ajaxUtil'
  import { login } from '@/api/login.js'

  import JsEncrypt from 'jsencrypt'




  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('Please enter the correct user name'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      let loginForm = {
        username: '',
        password: '',
      }
      // if (process.env.NODE_ENV === `development`) {
        loginForm = {
          username: 'sysadmin',
          password: '000000',
        }
      // }
      return {
        title: vue.config.title,
        loginForm: loginForm,
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        },
        passwordType: 'password',
        loading: false,
        showDialog: false,
      }
    },
    watch: {},
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },

      handleLogin() {
        this.$refs.loginForm.validate(async valid => {
          if (valid) {
            this.loading = true
            var jsEncrypt = new JsEncrypt();
            jsEncrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgu9ZuZD0xO5gke/KOthup9vrO
OgYeksBbZp5hf9kyR/ZdCurRK9ka0EuOjERzXy242nvRiSUt+3NXH+yniLHGonGx
th0lJLHw4OUizJrtiYTo8cQCa7VVWWNTWkOJpnIfD3DWTAouFaF4T74V4SdPoXVk
0lfWFsy1kNXttL2MowIDAQAB
-----END PUBLIC KEY-----`);
            this.loginForm.password = jsEncrypt.encrypt(this.loginForm.password)
            login(this.loginForm)
              .then(response => {
                this.$store
                  .dispatch('LoginByUsername', {
                    userId: response.data.id,
                    username: this.loginForm.username,
                    token: response.headers.authorization,
                  })
                  .then(() => {
                    this.$router.push({ path: '/' })
                  })
                  .catch(() => {})
                this.loading = false
              })
              .catch(error => {
                this.loginForm.password = ''
                this.$message({
                  message: '登录失败!',
                  type: 'error',
                })
                
                this.loading = false
              })
          }
        })
      },
    },
    created() {
      store.set('system', null)
      store.set('platform', null)
    },
    destroyed() {},
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    background: #ffffff;
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
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url(/static/images/home/bg1.png) repeat;
    .login-form {
      background: rgba(45,59,104,.6);
      border-radius: 4px;
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
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
      right: 35px;
      bottom: 28px;
    }
  }
</style>
