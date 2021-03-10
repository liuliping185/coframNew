<template>
  <el-select multiple filterable="" v-model="convertValue" v-bind="$attrs">
    <el-option v-for="(v, k) in list" :key="k" :value="k" :label="k"></el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue } from '@lib'

export default {
  name: 'my-select-multiple',
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
<style rel="stylesheet/scss" lang="scss" scoped></style>
