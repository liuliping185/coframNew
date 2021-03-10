<template>
  <div v-loading="loading">
    <el-row class="mt-5" :gutter="10">
      <el-col :span="12">
        <el-row class="mb-5">
          <el-col :span="8">
            <label>待选人员</label>
          </el-col>
          <el-col :span="16">
            <SearchInput v-model="query.name" @submit="searchFn"></SearchInput>
          </el-col>
        </el-row>
        <el-table
          stripe
          border
          ref="userTable"
          :highlight-current-row="isRadio"
          :data="gridList"
          height="407px"
          style="width: 100%"
          :row-key="getRowKey"
          @current-change="radio"
          @selection-change="multiple">
          <el-table-column
            :reserve-selection="true"
            :type="isRadio ? '' : 'selection'"
            width="55">
          </el-table-column>
          <el-table-column
            label="名称"
            prop="name">
          </el-table-column>
          <!--<el-table-column-->
          <!--label="状态"-->
          <!--prop="status">-->
          <!--<template slot-scope="scope">-->
          <!--{{ staticDictName(scope.row.status) }}-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
        <Pagination
          :layout="'prev, pager, next, sizes'"
          :pageSize="query.limit"
          @size-change="changePageSizerFn"
          @current-change="changePageFn"
          :current-page.sync="query.offset"
          :total="gridTotal"
        ></Pagination>
      </el-col>
      <el-col :span="10">
        <el-row class="mb-5">
          <el-col :span="8">
            <label>选中人员</label>
          </el-col>
          <el-col :span="16">
            <SearchInput v-model="keyword"></SearchInput>
          </el-col>
        </el-row>
        <el-table border stripe :data="selectItems | KwFilter(keyword,'name')" height="407px">
          <no-data slot="empty"></no-data>
          <el-table-column
            label="名称"
            prop="name">
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <a class="blue" @click="remove(scope.row)" icon="el-icon-delete">移除</a>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-10">
          <span v-if="selectItems.length > 0">已选中 {{ selectItems.length }} 条数据</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {BaseVue, List, _} from '@lib'
  import {UserController, EmployeeController} from '@controller'
  export default {
    name: 'user-select-list',
    mixins: [BaseVue, List],
    props: {
      listData: Object,
      type: String,
      keyPayload: {
        type: Object,
        default: {
          ownerId: 'platform',
          ownerType: 'platform',
          memberState: 'notMember'
        }
      }
    },
    computed: {
      isRadio() {
        return _.endsWith(this.type, 'radio')
      },
      isUser() {
        return _.startsWith(this.type, 'user')
      },
      isEmployees() {
        return _.startsWith(this.type, 'employees')
      },
      isRole() {
        return _.startsWith(this.type, 'role')
      },
    },
    data() {
      return {
        keyword: null,
        selectItems: [],
        query: {
          name: null,
          limit: 10,
          offset: 1
        },
        loading: false,
        isUpdate: false
      }
    },
    watch: {
      listData: {
        deep: true,
        immediate: true,
        handler() {
          if (!this.isUpdate) {
            this.clearSelection()//选择不同角色/删除/新增需要清除选中的数据
          }
          this.isUpdate = false
          this.search()
        }
      }
    },
    methods: {
      async searchBody() {
        let resp = {}
        if (this.isRole) {
          resp = this.listData
        } else {
          this.loading = true
          if (this.isUser) {
            resp = await this.dispatch(UserController.pagingByCriteria, {
              ...this.query,
              ...this.keyPayload
            })
          } else if (this.isEmployees) {
            resp = await this.dispatch(EmployeeController.pagingByCriteria, {
              ...this.query
            })
          }
          this.loading = false
        }
        return resp
      },
      changePageSizerFn(limit) {
        if (this.isRole) {
          this.query.limit = limit
          this.update()
        } else {
          this.changePageSizer(limit)
        }
      },
      changePageFn(offset) {
        if (this.isRole) {
          this.update()
        } else {
          this.changePage(offset)
        }
      },
      searchFn() {
        if (this.isRole) {
          this.update()
        } else {
          this.search()
        }
      },
      update() {
        this.isUpdate = true
        this.$emit('updateUserList', this.query)
      },
      getRowKey(row) {
        return row.id
      },
      radio(item) {
        this.$emit('radio', item)
      },
      multiple(items) {
        this.selectItems = items
        this.$emit('multiple', items)
      },
      clearSelection() {
        this.$nextTick(() => {
          this.$refs.userTable && this.$refs.userTable.clearSelection()
        })
      },
      reset() {
        this.query.offset = 1
        this.clearSelection()
        this.search()
      },
      remove(user) {

        if(this.$refs.userTable){
          this.$refs.userTable.toggleRowSelection(user, false)
          this.$refs.userTable.toggleRowSelection(this.gridList.find(u => u.id === user.id), false)
        }
      },
      staticDictName(status) {
        if (status) {
          return this.getStaticDictName('EnableStatus', status)
        } else {
          return '无'
        }
      }
    }
  }
</script>
