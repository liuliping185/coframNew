<template>
  <div class="p-10">
    <div class="text-right">
      <el-button type="primary" @click="openAdd">关联员工</el-button>
    </div>
    <el-table class="mt-10" stripe :data="list" height="calc(100vh - 300px)">
      <no-data slot="empty"></no-data>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="编码"></el-table-column>
      <el-table-column width="150px">
        <template slot-scope="scope">
          <CommonButton buttonType="delete" @click="removeRow(scope.row)" label="解除关联"></CommonButton>
        </template>
      </el-table-column>
    </el-table>
    <EmployeeAdd :parentObj="parentObj" :dialogVisible.sync="dialogVisible" :bindState="bindState"
                 @success="success"></EmployeeAdd>
  </div>
</template>

<script>
  import {BaseVue, List} from '@lib'
  import EmployeeAdd from '../member-management/add.vue'
  import Base from '../base.js'

  export default {
    name: 'employee-index',
    mixins: [BaseVue, List, Base],
    inject: ['freshTreeNode'],
    components: {EmployeeAdd},
    props: {
      parentObj: {},
    },
    data() {
      return {
        list: [],
        bindState: ''
      }
    },
    watch: {
      parentObj: {
        immediate: true,
        handler: 'loadData',
      },
    },
    methods: {
      async success() {
        this.loadData()
//      this.freshTreeNode()
      },
      async loadData() {
        this.list = await this.loadSubEmployees(this.parentObj)
      },
      removeRow(row) {
        this.remove({
          ...row,
        }, this.parentObj).then(this.success)
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
