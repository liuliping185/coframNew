<template>
  <el-tooltip v-if="!isOld" :content="content" placement="top">
    <span v-if="$slots.default" v-clipboard:copy="data" v-clipboard:success="clipboardSuccess">
    <slot></slot>
    </span>
    <el-button v-else type="text" size="mini"
               v-clipboard:copy="data" v-clipboard:success="clipboardSuccess">
      <svg-icon :style="`color:${color};`" iconClass="my-clone"></svg-icon>
    </el-button>
  </el-tooltip>
</template>

<script>
  import {OtherUtil} from '@lib'
  import clip from '@/utils/clipboard' // use clipboard directly
  import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

  export default {
    name: 'clip-button',
    directives: {
      clipboard,
    },
    props: {
      data: {
        type: String,
        default: '',
      },
      content: {
        default: '复制到剪贴板'
      },
      color: {
        default: '#409EFF',
      }
    },
    data(){
      return {
        isOld: false
      }
    },
    mounted(){
      this.isOld = OtherUtil.isOldBrowse()

    },

    methods: {
      clipboardSuccess() {
        this.$message({
          message: '已将内容复制到剪贴板',
          type: 'success',
          duration: 1500,
        })
      },
    },
  }
</script>
