<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入人员姓名" v-model="query.name" clearable>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <div class="text-right">
          <el-button type="primary" icon="el-icon-plus" v-permission="FuncCode.cof_f_emp_add" @click="openAdd">新增

          </el-button>
        </div>
      </el-col>
    </el-row>

      <el-table stripe :data="gridData.content" class="mt-10" height="calc(100vh - 270px)"
                v-loading="EmployeeController.pagingByCriteria.loading">
        <el-table-column prop="name" label="人员姓名"></el-table-column>
        <el-table-column prop="code" label="人员代码"></el-table-column>
        <el-table-column prop="user.name" label="关联用户名"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column width="180px" label="操作">
          <template slot-scope="scope">
            <CommonButton buttonType="edit" label="解绑" icon="el-icon-circle-close" v-if="scope.row.user"
                          @click="unbind(formatData(scope.row))"></CommonButton>
            <CommonButton buttonType="edit" @click="openEdit(formatData(scope.row))"></CommonButton>
            <CommonButton buttonType="delete" v-permission="FuncCode.cof_f_emp_del"
                          @click="remove(scope.row)"></CommonButton>
          </template>
        </el-table-column>
      </el-table>
    <Pagination
      :pageSize="query.limit"
      @size-change="changePageSizer"
      @current-change="changePage"
      :current-page.sync="query.offset"
      :total="gridTotal"
    ></Pagination>
    <Add :dialogVisible.sync="dialogVisible" :formData="selectRow" @success="search" dialogtype="employee"
         :isRelateUser="false"></Add>
  </div>
</template>

<script>
  import {BaseVue, List} from '@lib'
  import Add from './add.vue'
  import {EmployeeController} from '@controller'

  export default {
    name: 'list',
    mixins: [BaseVue, List],
    components: {Add},
    props: {},
    data() {
      return {
        list: [],
      }
    },
    mounted() {
      this.search()
    },
    methods: {
      async searchBody() {
        let res = await this.dispatch(EmployeeController.pagingByCriteria, {...this.query})
        return res
      },
      async removeResolve(row) {
        let resp = await this.dispatch(EmployeeController.deleteByIds, [row.id])
        if (!resp.error) {
          this.$message({
            message: '删除成功!',
            type: 'success',
          })
          this.search()
        }
      },
      formatData(row) {
        let rowData = _.cloneDeep(row)
        let {user = {id: null, status: 'ENABLED'}} = rowData
        let formData = {
          user: user,
          employee: rowData,
        }
        if (formData.employee.user) {
          delete formData.employee.user
        }
        return formData
      },
      unbind(row) {
        this.confirm('此操作将用户与成员解绑, 是否继续?').then(async () => {
          let resp = await this.dispatch(EmployeeController.update, {...row, unbindUser: true})
          if (!resp.error) {
            this.$message({
              message: '解绑成功!',
              type: 'success',
            })
            this.search()
          }
        })
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
