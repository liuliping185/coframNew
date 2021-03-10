<template>
  <div class="card">
    <div ref="body" @mouseover="isNeedFold" class="body" :style="`height:${!isExpand ? minHeight : realHeight}px`"><slot></slot></div>
    <div class="footer" @click="expand" v-if="realHeight > minHeight">
      <div v-show="!isExpand">
        <el-button icon="el-icon-caret-bottom" type="text"></el-button>
        <span class="txt">展开</span>
      </div>
      <div v-show="isExpand">
        <el-button icon="el-icon-caret-top" type="text"></el-button>
        <span class="txt">收起</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  provide() {
    return {
      expand: this.expand,
    }
  },
  props: {
    minHeight: {
      default: 35,
    },
    foldBtnPosition: {
      default: 'bottom',
    },
  },
  data() {
    return {
      realHeight: 0,
      isMounted: false,
      isExpand: false,
    }
  },
  mounted() {
    this.isMounted = true
    this.realHeight = this.getRealHeight()
  },
  methods: {
    isNeedFold() {
      this.realHeight = this.getRealHeight()
    },
    getRealHeight() {
      if (this.$refs['body'].children && this.$refs['body'].children.length > 0) {
        return this.$refs['body'].children[0].scrollHeight
      }
    },
    expand(flag) {
      this.realHeight = this.getRealHeight()
      if (flag !== undefined) {
        this.isExpand = flag
      } else this.isExpand = !this.isExpand
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  /*border: 1px solid #e0e0e0;*/
  border-radius: 4px;
  .body {
    overflow: hidden;
    transition: all 0.4s;
    background: #ffffff;
  }
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
  }

  .footer {
    display: none;
    border-top: 1px solid #e0e0e0;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    .txt {
      display: inline-block;
      width: 30px;
      color: #909399;
      opacity: 0;
      transition: all 0.3s ease;
      transform: translate(20px, 0px);
    }

    &:hover {
      background: #f9fafc;
      .txt {
        opacity: 1;
        transform: translate(0px, 0px);
      }
    }
  }
  &:hover {
    .footer {
      display: block;
    }
  }
}
</style>
