<template>
  <div class="app-wrapper" :class="classObj">
    <!-- <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div> -->
    <sidebar  v-if="!isFullModel" class="sidebar-container"></sidebar>
    <div class="main-container" :style="isFullModel?'margin-left:0px;':''">
      <navbar></navbar>
      <tags-view v-if="!isFullModel"></tags-view>
      <app-main  :style="`height:calc(100vh - ${isFullModel ? 54: 84}px);`"></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import {BaseVue} from '@lib'

export default {
  name: 'layout',

  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
  },
  mixins: [ResizeMixin,BaseVue ],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    // device() {
    //   return this.$store.state.app.device
    // },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
  },
  methods: {
    // handleClickOutside() {
    //   this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    // },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
// .drawer-bg {
//   background: #000;
//   opacity: 0.3;
//   width: 100%;
//   top: 0;
//   height: 100%;
//   position: absolute;
//   z-index: 999;
// }
</style>
