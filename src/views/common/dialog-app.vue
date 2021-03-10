<template>
  <div>
    <span class="el-dialog__title">{{ title }}</span>
    <el-button style="position: absolute; right: 60px;padding: 0px;" type="text" @click="expandWindow">
      <svg-icon style="font-size:14px;" :iconClass="dialogOption"></svg-icon>
    </el-button>
  </div>
</template>

<script>
import _ from 'lodash'
import { BaseVue } from '@lib'

export default {
  name: 'dialog-app',
  components: {},
  computed: {
    dialogOption() {
      if (this.dialogExpanded) {
        return 'window-min'
      } else {
        return 'window-max'
      }
    },
  },
  mixins: [BaseVue],
  props: {
    title: {
      type: String,
    },
    dialogExpanded: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {}
  },
  mounted() {},
  watch: {},
  methods: {
    expandWindow() {
      this.$emit('expandWindow')
    },
  },
}
</script>
