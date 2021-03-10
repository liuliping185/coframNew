<template>
  <el-dropdown v-if="isActive" trigger="click" @visible-change="visibleChanged" placement="bottom">
    <el-button icon="el-icon-arrow-down" type="warning" style="width:100%;">{{ roleGroup ? roleGroup.name : '请选择角色组' }} </el-button>
    <el-dropdown-menu slot="dropdown" style="width:350px;" class="p-5">
      <el-table class="roleGroup-table" @row-click="selectRoleGroup" :data="gridList">
        <no-data slot="empty"></no-data>
        <el-table-column prop="name">
          <template slot-scope="scope">
            <el-button
              :disable-transitions="true"
              style="min-width:200px;text-align: left;"
              :type="roleGroup && roleGroup.id === scope.row.id ? 'warning' : 'text'"
              :icon="roleGroup && roleGroup.id === scope.row.id ? 'el-icon-check' : ''"
            >
              {{ scope.row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column width="120px">
          <template slot-scope="scope">
            <CommonButton buttonType="edit" @click.stop="openEdit(scope.row)"></CommonButton>
            <CommonButton buttonType="delete" @click.stop="remove(scope.row)"></CommonButton>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-right mt-10">
        <el-button icon="el-icon-plus" @click="openAdd">新增角色组</el-button>
      </div>
    </el-dropdown-menu>
    <Add :dialogVisible.sync="dialogVisible" :formData="selectRow" @success="search"></Add>
  </el-dropdown>
</template>

<script>
import { BaseVue, List } from '@lib'
import { RoleTplController } from '@controller'
import Add from './add'

export default {
  name: 'role-template-choose-role',
  mixins: [BaseVue, List],
  components: { Add },
  mounted() {},
  data() {
    return {
      isActive: true,
      roleGroup: null,
      query: {
        //          limit: 1000,
        //          offset: 1,
      },
    }
  },
  methods: {
    visibleChanged(val) {
      if (val) this.search()
    },
    selectRoleGroup(row) {
      this.roleGroup = row
      this.$emit('roleGroupChanged', row)
      this.isActive = false
      this.$nextTick(() => {
        this.isActive = true
      })
    },

    async searchBody() {
      return await this.dispatch(RoleTplController.findByCriteria)
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.roleGroup && row.id === this.roleGroup.id) {
        return 'select-row'
      } else {
        return ''
      }
    },
    async removeResolve(row) {
      let resp = await this.dispatch(RoleTplController.deleteByIds, {
        ids: row.id,
      })
      if (!resp.error) {
        this.$message({
          message: '删除成功!',
          type: 'success',
        })
      }
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss">
.roleGroup-table {
  .select-row {
    background: #409eff;
  }
}
</style>
