<template>
  <div class="p-10">
    <el-table stripe :data="list" height="calc(100vh - 260px)">
      <no-data slot="empty"></no-data>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="编码"></el-table-column>
      <el-table-column width="150px">
        <template slot-scope="scope">
          <CommonButton buttonType="edit" @click="openEdit(scope.row)"></CommonButton>
          <CommonButton buttonType="delete" @click="removeRow(scope.row)"></CommonButton>
        </template>
      </el-table-column>
    </el-table>
    <Add :dialogVisible.sync="dialogVisible" :formData="selectRow" :parentObj="parentObj" @success="success" :dimension="dimension"></Add>
  </div>
</template>

<script>
import { BaseVue, List } from '@lib'
import { PositionController } from '@controller'
import Add from './add.vue'
import Base from '../perrmissiontree/base.js'

export default {
  name: 'organization-index',
  inject: ['freshTreeNode'],
  mixins: [BaseVue, List, Base],
  components: { Add },
  props: {
    parentObj: {},
    dimension:{}
  },
    data() {
    return {
      list: [],
      dimension: null
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
      if (this.isDimension(this.parentObj)) {
        this.list = await this.loadRootOrganizations(this.parentObj)
      } else if (this.isOrganization(this.parentObj)) {
        this.list = await this.loadOrgSubOrg(this.parentObj)
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
