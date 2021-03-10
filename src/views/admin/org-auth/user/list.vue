<template>
  <div>
    <el-row>
      <el-col :span="6">

        <el-input placeholder="请输入内容" v-model="query.name" clearable>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <div class="text-right">
          <el-button type="primary" icon="el-icon-plus" v-permission="FuncCode.cof_f_user_add" @click="openAdd">新增</el-button>
        </div>
      </el-col>
    </el-row>
    <el-table class="mt-10" :data="gridList" height="calc(100vh - 270px)">
      <el-table-column label="用户名" prop="name"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="状态" prop="updateTime">
        <template slot-scope="scope">
          <el-switch @change="statusChange(scope.row)" v-model="scope.row.status" active-value="ENABLED" inactive-value="DISABLED" v-permission="FuncCode.cof_f_user_edit_status"></el-switch>
          {{ getStaticDictName('EnableStatus', scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
<!--          <CommonButton buttonType="edit"  v-permission="FuncCode.cof_f_user_edit" @click="openEdit(scope.row)"></CommonButton>-->
          <CommonButton buttonType="edit" v-permission="FuncCode.cof_f_user_reset_pw" @click="resetPassword(scope.row)" label="重置密码" icon="el-icon-refresh"></CommonButton>
          <CommonButton buttonType="delete" v-permission="FuncCode.cof_f_user_del" @click="remove(scope.row)"></CommonButton>
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
    <UserAdd :dialogVisible.sync="dialogVisible" @success="search" :formData="selectRow"></UserAdd>
  </div>
</template>
<script>
import _ from 'lodash'
import { VueUtil, BaseVue, List } from '@lib'
import UserAdd from './add.vue'
import { UserController } from '@controller'

export default {
  name: 'user-list',
  mixins: [BaseVue, List],
  components: { UserAdd },
  props: {},
  computed: {},
  data() {
    return {
      keyword: null,
      query: {
        limit: 10,
        offset: 1,
        name: null,
      },
    }
  },
  mounted() {
    this.search()
  },
  watch: {},
  methods: {
    async searchBody() {
      return await this.dispatch(UserController.pagingByCriteria, { ...this.query })
    },
    async removeResolve({ id }) {
      return await this.dispatch(UserController.deleteByIds, { ids: id })
    },
    async statusChange(user) {
      console.log(user)
      let resp = {}
      if (user.status === 'DISABLED') {
        resp = await this.dispatch(UserController.disableUser, { id: user.id })
      } else if (user.status === 'ENABLED') {
        resp = await this.dispatch(UserController.enableUser, { id: user.id })
      }
      if (!resp.error) {
        this.$message({
          message: '操作成功!',
          type: 'success',
        })
      }

    },
    resetPassword({ id }) {
      this.confirm('确定要重置密码?').then(async () => {
        let resp = await this.dispatch(UserController.resetPassword, { id })
        if (!resp.error) {
          this.$message({
            message: '重置成功!',
            type: 'success',
          })
        }
      })
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
