<template>
  <el-cascader
    expand-trigger="hover"
    :show-all-levels="false"
    :options="list"
    :props="props"
    v-model="selectedOptions"
    @change="onChanged">
  </el-cascader>
</template>
<script>
  import {BaseVue} from '@lib'
  import { RoleTplController } from '@controller'

  export default {
    name: 'role-template-select',
    mixins: [BaseVue],
    components: {},
    props: {
      value: {},
      groupId: {},
    },
    mounted() {
      this.loadData()
    },
    data() {
      return {
        list: [],
        props: {
          value: 'id',
          label: 'name'
        },
        selectedOptions: []
      }
    },
    methods: {
      onChanged(value){
        this.$emit('input',value[value.length - 1])
      },
      async loadData() {

        let resp
        if(this.groupId) {
          resp = await this.dispatch(RoleTplController.findByCriteria, {
          })
        }else {
          debugger
          resp = await this.dispatch(RoleTplController.findByCriteria)
        }
        if (!resp.error) {
          let group = {}
          resp.data.forEach((tpl) => {
            if(!tpl.tplGroup) {
              return false
            }
            if(!group[tpl.tplGroup.id]) {
              group[tpl.tplGroup.id] = tpl.tplGroup
              group[tpl.tplGroup.id].children = []
              group[tpl.tplGroup.id].children.push({
                id: tpl.id,
                name: tpl.name
              })
              this.list.push(tpl.tplGroup)
            }else {
              group[tpl.tplGroup.id].children.push({
                id: tpl.id,
                name: tpl.name
              })
            }
          })
        }
      },
      reset() {
        this.selectedOptions = []
      }
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
