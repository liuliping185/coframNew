<template>
  <el-dialog :visible.sync="dialogVisible" width="550px" title="展示全部权限">
    <div style="max-height:400px;overflow-y:auto">
      <div v-for="item in permissionData">
        <span>{{item}}</span>
      </div>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <clip-button :data="addChangeLine"></clip-button>
    </div>
  </el-dialog>
</template>

<script>
  import { BaseVue, Form } from '@lib'
  import _ from 'lodash'

  export default {
    name: 'show-permission',
    mixins: [BaseVue, Form],
    components: {  },
    computed: {
      addChangeLine() {
        let data = 'export default {\n'
        this.permissionData.forEach(item => {
          data = `${data}${item}\n`
          //return item
        })
        data=`${data}}`
        return data
      },
    },
    props: {
      permissionData: {
        type: Array,
        default: [],
      },
    },
    methods: {


    },
  }
</script>

<style scoped>

</style>
