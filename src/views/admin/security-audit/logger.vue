<template>
  <div class="p-5">
    <div class="top-block">
      <el-form label-width="100px" class="view-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="操作类型">
              <el-select v-model="query.operateType">
                <el-option v-for="operateType in operateTypes" :value="operateType.id" :label="operateType.title" :key="operateType.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人">
              <MemberSelect v-model="query.operatorId" type="user" width="195"
                            label="请选择操作人"></MemberSelect>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作时间">
              <DatePicker :begin.sync="query.dateBegin" :end.sync="query.dateEnd" ref="fastTimeRange"></DatePicker>
              <el-button-group>
                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                <el-button @click="reset">重置</el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table stripe height="calc(100vh - 240px)" class="mt-10" :data="gridList">
      <no-data slot="empty"></no-data>
      <el-table-column prop="operateDate" label="日期" width="150px"></el-table-column>
      <el-table-column prop="operateType" label="操作类型" width="100px"></el-table-column>
      <el-table-column prop="operatorName" label="操作人" width="100px"></el-table-column>
      <el-table-column prop="targetModelName" label="目标" width="200px"></el-table-column>
      <el-table-column label="操作描述" prop="message"></el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-document" v-permission="FuncCode.cof_f_optlog_detail_get"
                     @click="openEdit(scope.row)" v-if="scope.row.operateType !== 'OTHER'">查看详情



          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :pageSize="query.limit"
      :pageSizes="[50, 100, 200, 500, 1000]"
      @size-change="changePageSizer"
      @current-change="changePage"
      :current-page.sync="query.offset"
      :total="gridTotal"
    ></Pagination>

    <loggerDetails :dialogVisible.sync="dialogVisible" :formData="selectRow"></loggerDetails>
  </div>
</template>

<script>
  import _ from 'lodash'
  import moment from 'moment'
  import {VueUtil, BaseVue, List} from '@lib'
  import {OperationLogController} from '@controller'
  import loggerDetails from './logger-details.vue'

  const query = {
    operateType: null,
    dateBegin: null,
    dateEnd: null,
    operatorId: null,
    limit: 50,
    offset: 1,
  }
  export default {
    mixins: [BaseVue, List],
    name: 'logger-index',
    components: {
      loggerDetails,
    },
    computed: {
      operateDate: {
        set(val){
          if (val.length > 0)
            this.query.dateBegin = moment(val[0]).format('yyyy-MM-dd HH:mm:ss')
          if (val.length > 1)
            this.query.dateEnd = moment(val[1]).format('yyyy-MM-dd HH:mm:ss')
        },
        get(){
          return [this.query.dateBegin, this.query.dateEnd]
        }
      }
    },
    props: {},

    data() {
      return {
        log: null,
        operateTypes: [
          {title: 'ALL', id: null},
          {title: 'CREATE', id: 'CREATE'},
          {title: 'UPDATE', id: 'UPDATE'},
          {
            title: 'DELETE',
            id: 'DELETE',
          },
          {title: 'OTHER', id: 'OTHER'},
        ],
        query: _.cloneDeep(query),
      }
    },
    mounted() {
      this.search()
    },
    watch: {

    },
    methods: {
      reset(){
        this.query = _.cloneDeep(query)
        this.$refs['fastTimeRange'].reset()
      },

      async searchBody() {
        return await this.dispatch(OperationLogController.pagingOperationLogs, {
          ...this.query,
        })
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
