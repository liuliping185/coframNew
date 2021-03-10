<template>
  <el-select v-model="value" @change="onChanged" v-bind="$attrs">
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>
<script>
  import {BaseVue} from '@lib'
  import { RoleTplGroupController} from '@controller'


  export default {
    name: 'role-template-group-select',
    mixins: [BaseVue],
    components: {},
    props: {
      value: {},
    },
    mounted() {
      this.loadData()
    },
    data() {
      return {
        list: [],
      }
    },
    watch: {},

    methods: {
      onChanged(value){
        this.$emit('input',value)
        this.$emit('change', value)
      },
      async loadData() {
        let resp = await this.dispatch(RoleTplGroupController.findByCriteria)
        if (!resp.error) {
          this.list = resp.data
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
