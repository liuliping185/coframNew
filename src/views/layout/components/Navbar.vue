<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger v-if="!isFullModel" class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb v-if="!isFullModel" class="breadcrumb-container"></breadcrumb>
    <span style="cursor: pointer" v-if="isFullModel">
      <span class="logo pl-10" @click="refresh()">
        <img src="/static/images/logo.png" style="border:none;transform:translate(0px, -4px);width:26px;vertical-align: middle;"></img>
        <span style="font-size:20px;" v-if="!isCollapse">{{  config.title }}</span>
      </span>
    </span>
    <div class="right-menu">
      <div class="bang" v-if="!isFullModel"><i class="el-icon-view" v-if="currentPlatformName !== null"></i> {{ currentPlatformName }}</div>
      <ChangePassword v-model="changePasswordShow"></ChangePassword>
      <el-dropdown size="default" class="avatar-container right-menu-item" trigger="click" @command="clickDropDown">
        <div class="avatar-wrapper">
          <span
          ><svg-icon style="transform:translate(0px,5px);font-size:30px;"
                     iconClass="my-avatar"></svg-icon>
            <template v-if="$store.getters.userInfo">
            {{$store.getters.userInfo.name || $store.getters.userInfo.username }}
            </template>
            <i class="el-icon-caret-bottom"></i
            ></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="admin">{{ $t('navbar.admin') }} </el-dropdown-item>
          <el-dropdown-item v-permission="FuncCode.cof_f_user_change_pw" command="changePassword">{{ $t('navbar.changePassword') }}</el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@util/sessionStore'
import Vue from 'vue'
import { BaseVue } from '@lib'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

import ChangePassword from '@/views/admin/security-audit/change-password.vue'

export default {
  mixins: [BaseVue],
  provide() {
    return {
      closeMenu: this.closeMenu,
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker,
    ChangePassword,
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'roles']),
    isAdmin() {
      return ['sysadmin'].some(role => this.$store.getters.roles.some(r1 => r1 === role))
    },
    currentPlatformName() {
      if (this.platform === 'system' || this.platform === 'dubbo') {
        return `当前系统：${this.currentSystem.name}`
      } else if (this.platform === 'admin') {
        return '管理平台'
      } else return null
    },
    hamburgarDisable() {
      return this.$route.name === 'dashboard' && this.currentPlatformName === null
    },
  },
  mounted() {
    if (this.hamburgarDisable) {
      //        this.$store.dispatch('closeSideBar',false)
    }
  },
  data() {
    return {
      config: Vue.config,
      menu: {
        system: true,
      },
      changePasswordShow: false,
    }
  },
  methods: {
    closeMenu(name) {
      this.menu[name] = false
      this.$nextTick(() => {
        this.menu[name] = true
      })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      if (Vue.config.login_type === 'iam') {
        this.$store.dispatch('setNeedGetPermission', true)
        this.$store.dispatch('LogOut')
      } else if (Vue.config.login_type === 'normal') {
        this.$store.dispatch('setNeedGetPermission', true)
        this.$store.dispatch('LogOut')
      } else {
        this.$router.push({name: 'login'})
      }
    },
    goSingleLoginPage(redirectUrl) {
      window.location.href = redirectUrl
    },
    refresh(){
//      window.history.go(0)
    },
    clickDropDown(command) {
      if (command === 'admin') {
        this.choosePlatform('admin')
      } else if (command === 'changePassword') {
        this.changePasswordShow = true
      } else if (command === 'miniTools') {
        this.$router.push({name:'mini-tools-index'})
      }
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  background: #F2F6FC;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  position: relative;
  .bang {
    position: absolute;
    width: 250px;
    text-align: center;
    left: 50%;
    font-size: 16px;
    transform: translate(-125px, 0px);
    cursor: pointer;
    &:hover {
      background: #ebeef5;
    }
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    user-select: none;
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 0px;
    }
    .screenfull {
      height: 50px;
      line-height: 50px;
      transform: translate(0, 10px);
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
      transform: translate(0, 10px);
    }
    .avatar-container {
      cursor: pointer;
      padding: 0px 8px;
      &:hover {
        background: #dcdfe6;
      }
    }
  }
  .workplatform {
    font-size: 14px;
    width: 80px;
    color: #606266;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: #dcdfe6;
    }
  }
}
</style>
