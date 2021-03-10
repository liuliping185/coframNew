<template>
  <div>
    <el-dropdown @command="chooseEmployee" placement="bottom-start" size="small" v-loading="loading" trigger="click"
                 element-loading-spinner="none">
      <el-button type="default" :style="`width: ${width}px`">
        <span style="float:left">{{ currentLabel }}</span
        ><i style="float:right" class="el-icon-arrow-down el-icon--right"></i>
        <i style="float:right;color:rgb(192, 196, 204)" class="el-icon-circle-close" v-if="!!value" @click.stop="reset"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <div>
          <el-input
            class="p-5 pt-0"
            v-model="keyword"
            clearable
            placeholder="检索..."
            @keypress.enter.native.stop="search"
            :validate-event="false"
          >
          </el-input>
          <el-dropdown-item :style="highLightRow(item)" :command="item" v-for="item in tableData" :key="item.id">{{item.name}}</el-dropdown-item>
          <div class="text-right">
            <el-pagination small layout="prev,pager,next" @current-change="changePage" :total="total"></el-pagination>
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {UserController, EmployeeController} from '@controller'
  import {BaseVue, List} from '@lib'
  import _ from 'lodash'
  export default {
    name: 'member-select',
    mixins: [BaseVue, List],
    props: {
      label: {
        type: String,
        default: '请选择用户',
      },
      width: {
        type: String,
        default: '150',
      },
      value: {
        type: String,
        default: null,
      },
      height: {
        type: String,
        default: '300px',
      },
      type: {
        type: String,
        default: 'user',
      },
      isObject: {
        type: Boolean,
        default: false,
      },
      bindState: {
        default: 'binded'
      },
      valuePath: {
        default: 'id'
      },
      userBindState: {
        type: String,
        default: ''
      }
    },
    computed: {
      tableData() {
        return this.employeeData
      },
    },

    data() {
      return {
        keyword: null,
        loading: false,
        employeeData: [],
        currentLabel: null,
        total: 0,
      }
    },

    watch: {
      keyword() {
        this.debouncedGetAnswer()
      },

      value: {
        immediate: true,
        handler(val) {
          if (val === null) {
            this.currentLabel = this.label
          } else {
            let one = this.employeeData.find(emp => _.get(emp, this.valuePath) === val)
            if (one) {
              this.currentLabel = one.name
            } else {
              this.searchEmployeeName(val)
            }
          }
        },
      },
    },
    deactivated(){
      this.query.offset = 1
      this.query.limit = 10
    },
    created: function () {
      this.debouncedGetAnswer = _.debounce(item => {
        this.search()
      }, 300)
    },
    mounted() {
      this.search()
    },
    methods: {

      search(){
        this.query.offset = 1
        this.getEmployeeData()
      },
      async searchEmployeeName(employeeId) {
        let res = null
        if (this.type === 'user') {
          res = await this.dispatch(UserController.pagingByCriteria, {id: employeeId})
        } else if (this.type === 'employee') {
          res = await this.dispatch(EmployeeController.pagingByCriteria, {id: employeeId})
        }
        if(!res.error){
          if (res.data.content.length > 0) {
            this.currentLabel = res.data.content[0].name
          }
        }
      },
      async getEmployeeData() {
        this.loading = true
        let res = null
        if (this.type === 'user') {
          res = await this.dispatch(UserController.pagingByCriteria, {
            ...this.query,
            name: this.keyword,
            bindState: this.userBindState
          })
        } else if (this.type === 'employee') {
          res = await this.dispatch(EmployeeController.pagingByCriteria, {
            ...this.query,
            name: this.keyword,
            bindState: this.bindState
          })
        }
        if(!res.error){
          this.total = res.data.totalElements
          this.employeeData = res.data.content
        }
        this.loading = false
      },
      changePage(offset) {
        this.query.offset = offset
        this.getEmployeeData()
      },
      chooseEmployee(row) {
        this.$emit('input', _.get(row, this.valuePath))
        if (this.isObject) {
          this.$emit('change', _.cloneDeep(row))
        }
      },
      reset() {
        this.$emit('input', null)
        if (this.isObject) {
          this.$emit('reset', {})
        }
      },
      highLightRow(row) {
        if (_.get(row, this.valuePath) === this.value) {
          return `background-color:#f5f7fa`
        } else {
          return {}
        }

      },
    },
  }
</script>

<style scoped></style>
