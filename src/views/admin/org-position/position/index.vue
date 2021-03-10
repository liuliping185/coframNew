<template>
  <div class="p-10">
    <el-table stripe :data="list" height="calc(100vh - 260px)">
      <no-data slot="empty"></no-data>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="编码"></el-table-column>
      <el-table-column width="120px">
        <template slot-scope="scope">
          <CommonButton buttonType="edit" v-permission="FuncCode.cof_f_position_edit" @click="openEdit(scope.row)"></CommonButton>
          <CommonButton buttonType="delete" v-permission="FuncCode.cof_f_position_del" @click="removeRow(scope.row)"></CommonButton>
        </template>
      </el-table-column>
    </el-table>
    <Add :dialogVisible.sync="dialogVisible" :formData="selectRow" @success="success"></Add>
  </div>
</template>

<script>
import { BaseVue, List } from '@lib'
import { PositionController } from '@controller'
import Add from './add.vue'
import Base from '../base.js'

export default {
  name: 'position-index',
  inject: ['freshTreeNode'],
  mixins: [BaseVue, List, Base],
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
      this.loadData()
      this.freshTreeNode()
    },
    async loadData() {
      this.list = await this.loadOrgSubPositions(this.parentObj)
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
