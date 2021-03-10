<template>
  <div class="secondary-menu" :style="`height:calc(100vh - ${85 + offsetHeight}px)`">
    <div class="left" :style="`height:inherit;min-width:${realLeftWidth};width:${realLeftWidth};`">
      <div style="height:inherit;">
        <Hamburger class="hamburger" :toggleClick="toggleSideBar" :isActive="opened"></Hamburger>
        <div :style="`height:${titleHeight}px`" class="title " v-if="showTitle">
          <div v-show="!opened">
            {{ title }}

            <slot name="left-title"></slot>
          </div>
        </div>
        <div :style="`height:30px`" class="title " v-else></div>
        <div v-show="!opened" class="body" style="overflow-x:hidden;overflow-y:auto;height: calc(100% - 40px);">
          <slot name="left-body">

          </slot>
        </div>
        <slot v-show="!opened" name="left-footer"></slot>
      </div>
    </div>
    <div v-if="allowResize" class="handle" @mousedown.stop="mousedown" @mouseup.stop="mouseup" :style="`left:${realLeftWidth};`"></div>
    <div class="right" :style="!resizeBegin?`width:calc(100% - ${realLeftWidth});`:`width:calc(100% - ${beginWidth}px);`">
      <div v-if="rightTitle" class="title" :style="`height:${titleHeight}px`">
        <slot name="right-title"></slot>
      </div>
      <div class="body">
        <slot name="right-body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import {VueUtil, BaseVue} from '@lib'
  import Hamburger from '@/components/Hamburger'

  export default {
    name: 'secondary-menu',
    mixins: [BaseVue],
    components: {Hamburger},
    computed: {
      realLeftWidth() {
        if (this.opened) {
          return '30px'
        } else {
          return this.innerLeftWidth + 'px'
        }
      },
    },
    props: {
      leftWidth: {
        type: String | Number,
        default: 200,
      },
      minLeftWidth: {
        type: String | Number,
        default: 180,
      },
      maxLeftWidth: {
        type: String | Number,
        default: 600,
      },
      rightTitle: {
        type: Boolean,
        default: true,
      },
      titleHeight: {
        type: Number,
        default: 40,
      },
      iconField: {
        type: String,
        default: 'icon',
      },
      title: {
        type: Object | String,
      },
      showTitle: {
        type: Boolean,
        default: true,
      },
      offsetHeight: {
        type: Number,
        default: 0,
      },
      allowResize: {
        default: true,
      },
    },
    data() {
      return {
        innerLeftWidth: 0,
        beginWidth: 0,
        resizeBegin: false,
        keyword: null,
        index: -1,
        opened: false,
      }
    },
    mounted() {
      document.documentElement.addEventListener('mouseup', this.mouseup, true)
      document.documentElement.addEventListener('mousemove', this.mousemove, true)
      this.innerLeftWidth = this.leftWidth
    },
    watch: {
    },
    methods: {
      mousedown(e){
        this.resizeBegin = true
        this.beginWidth = this.innerLeftWidth
        this.beginX = e.clientX
      },
      mousemove(e){
        if (this.resizeBegin) {
          let width = this.beginWidth + (e.clientX - this.beginX)
          if (width > this.minLeftWidth && width < this.maxLeftWidth) {
            this.innerLeftWidth = width
          }
        }
      },
      mouseup(e){
        if (this.resizeBegin) {
          this.resizeBegin = false
        }
      },
      toggleSideBar() {
        this.opened = !this.opened
      },


    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .secondary-menu {
    height: 100%;
    overflow: hidden;
    display: flex;
    .handle {
      min-width: 5px;
      max-width: 5px;
      cursor: col-resize;
      background: transparent;
      transition: all .3s ease;
      background: #eaedf1;
      &:hover {
        background: #909399;
      }
    }
    .left {
      background: #eaedf1;
      position: relative;
      transition: width 0.3s ease;
      .hamburger {
        position: absolute;
        float: right;
        top: 5px;
        right: 5px;
        width: 16px;
        height: 16px;
        z-index: 2000;
      }
      .title {
        font-weight: bold;
        font-size: 14px;
        padding: 0px 10px;
        height: 40px;
        line-height: 40px;
        background: #d9dee4;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .body {
        /*overflow: hidden;*/
        .search-input {
        }
      }
    }
    > .right {
      > .title {
        height: 40px;
        padding: 6px;
        background: #eaedf1;
      }
      .body {
      }
    }

    .no-data-text {
      height: 40px;
      line-height: 40px;
    }
    .sameStyle {
      min-width: 140px;
      height: 32px;
      line-height: 32px;
      display: block;
      color: #333;
      padding-left: 30px;
      cursor: pointer;
      font-size: 12px;
    }
    .item-select {
      @extend .sameStyle;
      background: #ffffff;
    }

    .item {
      @extend .sameStyle;
      &:hover {
        background: #f4f6f8;
      }
    }
  }
</style>
