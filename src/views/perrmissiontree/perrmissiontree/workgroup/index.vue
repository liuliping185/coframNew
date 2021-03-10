<template>
  <div class="p-10">
    <el-table stripe :data="list" height="calc(100vh - 260px)">
      <no-data slot="empty"></no-data>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="编码"></el-table-column>
      <el-table-column width="150px">
        <template slot-scope="scope">
          <CommonButton buttonType="edit" v-permission="FuncCode.cof_f_workgroup_edit" @click="openEdit(scope.row)"></CommonButton>
          <CommonButton buttonType="delete" v-permission="FuncCode.cof_f_workgroup_del" @click="removeRow(scope.row)"></CommonButton>
        </template>
      </el-table-column>
    </el-table>
    <Add :dialogVisible.sync="dialogVisible" :formData="selectRow" :parentObj="parentObj" @success="success"></Add>
  </div>
</template>

<script>
import { BaseVue, List } from '@lib'
import { PositionController } from '@controller'
import Add from './add.vue'
import Base from '../base.js'

export default {
  name: 'workgroup-index',
  mixins: [BaseVue, List, Base],
  inject: ['freshTreeNode'],
  components: { Add },
  props: {
    parentObj: {},
  },
  data() {
    return {
      list: [],
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
      this.freshTreeNode()
      this.loadData()
    },
    async loadData() {
      if (this.isOrganization(this.parentObj)) {
        this.list = await this.loadOrgSubWorkgroups(this.parentObj)
      } else if (this.isWorkgroup(this.parentObj)) {
        this.list = await this.loadWorkgroupsSubWorkgroups(this.parentObj)
      }
    },
    removeRow(row) {
      this.remove({
        ...row,
      }).then(this.success)
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
