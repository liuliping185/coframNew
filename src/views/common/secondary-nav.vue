<template>
  <div class="secondary-nav" :style="`height:calc(100vh - ${85 + offsetHeight}px)`">
    <div class="title " v-if="showTitle">
      {{ title }}

      <slot name="title"></slot>
    </div>
    <div v-if="filterable || navs.length > 10" class="search-input">
      <el-input placeholder="检索..." type="text" v-model="keyword" clearable> <i slot="prefix" class="el-input__icon el-icon-search"></i> </el-input>
    </div>
    <div class="body" :style="`max-height:calc(100vh - ${260 + (!showTitle ? 70 : 0) + offsetHeight}px`">
      <slot name="body">
        <div
          :class="`${value !== null && nav && value && nav[keyField] === value[keyField] ? 'item-select' : 'item'}`"
          v-for="(nav, index) in navsFilter"
          @click="selectOne(nav, index)"
        >
          <el-tooltip :content="nav[labelField]" placement="right" v-if="nav[labelField].length > 12">
            <div class="text-ellipsis">
              <template v-if="nav[iconField]">
                <svg-icon :iconClass="nav[iconField]"></svg-icon>
              </template>
              {{ nav[labelField] }}
            </div>
          </el-tooltip>
          <div v-else>
            <template v-if="nav[iconField]">
              <svg-icon :iconClass="nav[iconField]"></svg-icon>
            </template>
            {{ nav[labelField] }}
          </div>
        </div>
        <div class="text-center no-data-text" v-if="!navs || navsFilter.length === 0">{{ noDataText }}</div>
      </slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue } from '@lib'

export default {
  name: 'secondary-nav',
  mixins: [BaseVue],
  components: {},
  computed: {
    navsFilter() {
      if (this.keyword) {
        let keyword = this.keyword.toUpperCase()
        return this.navs.filter(nav => nav[this.labelField].toUpperCase().indexOf(keyword) > -1)
      } else return this.navs
    },
  },
  props: {
    keyField: {
      type: String,
      default: 'key',
    },
    labelField: {
      type: String,
      default: 'label',
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
    value: {
      type: Object | String,
    },
    navs: {
      type: Array,
      default: [],
    },
    noDataText: {
      type: String,
      default: '暂无数据',
    },
    offsetHeight: {
      type: Number,
      default: 0,
    },
    beforeChange: {
      default: null,
    },
    filterable: {
      default: false,
    },
  },
  data() {
    return {
      keyword: null,
      index: -1,
    }
  },
  mounted() {},
  watch: {
    navs(val) {
      if (val && this.index !== -1) {
        if (this.index === this.navsFilter.length) {
          this.index--
        }
        this.$emit('input', this.navsFilter[this.index])
      }
    },
  },
  methods: {
    selectOne(val, index) {
      if (!!this.beforeChange) {
        this.beforeChange().then(() => {
          this.$emit('input', val)
        })
      } else {
        this.$emit('input', val)
      }
      this.index = index
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.secondary-nav {
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #c0c4cc;
  }
  min-width: 140px;
  background: #eaedf1;
  height: 100%;
  .title {
    font-weight: bold;
    font-size: 14px;
    height: 70px;
    line-height: 70px;
    background: #d9dee4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 30px;
  }
  .body {
    overflow-y: auto;
    overflow-x: hidden;
    .search-input {
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
