<template>
  <el-dropdown v-if="isActive" trigger="click" @visible-change="visibleChanged" placement="bottom">
    <el-button icon="el-icon-plus" type="text"></el-button>
    <el-dropdown-menu slot="dropdown" style="width:350px;">
      <div class="p-5">
        <el-table class="dimension-table" @row-click="selectDimension" :data="gridList">
          <no-data slot="empty"></no-data>
          <el-table-column label="组织机构树名称" prop="name">
            <template slot-scope="scope">
              <el-button
                :disable-transitions="true"
                style="min-width:200px;text-align: left;"
                :type="dimension && dimension.id === scope.row.id ? 'warning' : 'text'"
                :icon="dimension && dimension.id === scope.row.id ? 'el-icon-check' : ''"
              >
                {{ scope.row.name }}
              {{ scope.row.main === true ? '(主)' : '' }}

            </el-button>
            </template>
          </el-table-column>
          <el-table-column width="120px">
            <template slot-scope="scope">
              <CommonButton buttonType="edit" v-permission="FuncCode.cof_f_dimension_edit" @click.stop="openEdit(scope.row)"></CommonButton>
              <CommonButton buttonType="delete" v-permission="FuncCode.cof_f_dimension_del" @click.stop="remove(scope.row)"></CommonButton>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-10">
          <el-button style="width:100%" icon="el-icon-plus" v-permission="FuncCode.cof_f_dimension_add" @click="openAdd">新增组织机构树</el-button>
        </div>
      </div>
    </el-dropdown-menu>
    <Add :dialogVisible.sync="dialogVisible" :formData="selectRow" @success="searchFn"></Add>
  </el-dropdown>
</template>

<script>
  import {BaseVue, List} from '@lib'
  import {DimensionController} from '@controller'
  import Add from './add.vue'
  export default {
    name: 'dimension-root',
    mixins: [BaseVue, List],
    components: {Add},
    async mounted() {
      let resp = await this.search()
      if (resp && resp.length > 0) {
        let main = resp.find(item => item.main)
        this.selectDimension(main || resp[0])
      }
    },
    data() {
      return {
        isActive: true,
        dimension: null,
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
      selectDimension(row) {
        this.dimension = row
        this.$emit('dimensionChanged', row)
        this.isActive = false
        this.$nextTick(() => {
          this.isActive = true
        })
      },

      async removeResolve({id}) {
        let resp = await this.dispatch(DimensionController.deleteByIds, [id])
        if (!resp.error) {
          this.$message({
            message: '删除成功!',
            type: 'success',
          })
          if (id === this.dimension.id) {
            this.selectDimension(null)
          }
        }
        return resp
      },
      async searchBody() {
        let resp = await this.dispatch(DimensionController.queryByCriteria, {
          ...this.query,
        })
        return resp
      },
      searchFn(dimension) {
        this.search()
        if (dimension.id === this.dimension.id) {
          this.selectDimension(dimension)
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (this.dimension && row.id === this.dimension.id) {
          return 'select-row'
        } else {
          return ''
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .dimension-table {
    /deep/ .select-row {
      background: #409eff;
    }
  }
</style>
