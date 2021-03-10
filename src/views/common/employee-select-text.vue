<template>
  <div>
    <span>{{ label }}</span>
  </div>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue } from '@lib'
import { IEmployeeController } from '@controller'

export default {
  name: 'employee-select-text',
  components: {},
  computed: {
    ...VueUtil(this)
      .select([IEmployeeController])
      .state(),
    convertValueField() {
      if (this.valueField === 'empId') {
        return 'empId'
      }
      return this.valueField
    },
  },
  mixins: [BaseVue],
  props: {
    valueField: {
      type: String,
    },
    labelField: {
      type: String,
    },
    value: {
      type: String,
    },
  },

  data() {
    return {
      loading: false,
      label: null,
      query: {},
    }
  },
  mounted() {},
  watch: {
    value(val) {
      if (val) {
        this.getEmployeestList()
      }
    },
  },
  methods: {
    ...VueUtil(this)
      .select([IEmployeeController])
      .actions(),
    getEmployeestList() {
      var query = {}
      query[this.convertValueField] = this.value
      VueUtil(this)
        .ajax(IEmployeeController.queryEmployees, { ...query })
        .then(res => {
          if (res.data.data[0]) {
            this.label = res.data.data[0][this.labelField] || ''
          }
        })
    },
  },
}
</script>
