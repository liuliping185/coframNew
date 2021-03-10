<template>
  <div>
    <el-select
      v-model="value"
      clearable
      filterable
      remote
      style="width:100%;"
      v-bind="$attrs"
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option v-for="emp in empList" :key="emp.empId" :label="emp[labelField]" :value="emp[valueField]">
        <slot name="operation" :emp="emp"></slot>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue } from '@lib'

import { IEmployeeController } from '@controller'

export default {
  name: 'employee-select',
  components: {},
  computed: {
    ...VueUtil(this)
      .select([IEmployeeController])
      .state(),
  },
  mixins: [BaseVue],
  props: {
    value: {
      type: String || Array,
      default: null,
    },
    label: {
      type: String,
    },
    valueField: {
      type: String,
    },
    labelField: {
      type: String,
    },
    query: {
      type: Object,
    },
  },

  data() {
    return {
      loading: false,
      empList: [],
      currentEmpName: null,
    }
  },
  mounted() {},
  watch: {
    value(val) {
      this.$emit('input', val)
    },
    label: {
      immediate: true,
      handler(val) {
        this.empList = [
          {
            [this.labelField]: val,

            [this.valueField]: this.value,
          },
        ]
        //          let tmp = this.value
        //          this.value = ' '
        //          setTimeout(() => {
        //            this.value = tmp
        //          },1)
      },
    },
  },
  methods: {
    ...VueUtil(this)
      .select([IEmployeeController])
      .actions(),
    remoteMethod(query) {
      this.loading = true
      this.getEmployeestList(query)
    },
    async getEmployeestList(empName) {
      if (empName && empName.length > 0) {
        this.currentEmpName = empName
        if (this.isIE) {
          empName = encodeURI(empName)
        }
        let res = await this.dispatch(IEmployeeController.queryEmployees, { empName, ...this.query })
        if (res.data.data.length && res.data.data.length > 0) {
          if (res.data.data.length > 50) {
            this.empList = _.cloneDeep(res.data.data.slice(0, 49))
          } else {
            this.empList = _.cloneDeep(res.data.data)
          }
        }
        this.loading = false
      }
    },
  },
}
</script>
