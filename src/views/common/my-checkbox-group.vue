<template>
  <el-checkbox-group v-model="convertValue">
    <el-checkbox v-for="(v, k) in list" :key="k" :label="k">{{ v }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue } from '@lib'

export default {
  name: 'my-checkbox-group',
  mixins: [BaseVue],
  components: {},
  computed: {
    convertValue: {
      get: function() {
        if (this.value) return this.value.split(',')
        else return []
      },
      set: function(val) {
        this.$emit('input', val.join(','))
      },
    },
  },
  props: {
    value: {},
    list: {},
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-checkbox {
  margin-left: 0px;
  margin-right: 30px;
}
</style>
