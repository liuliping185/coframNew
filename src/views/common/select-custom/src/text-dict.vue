<template>
  <span>{{ text }}</span>
</template>

<script>
import _ from 'lodash'
import { VueUtil, FormUtil } from '@lib'

import { IBusinessDictController } from '@controller'

export default {
  name: 'select-text-dict',
  components: {},
  computed: {
    ...VueUtil(this)
      .select([IBusinessDictController])
      .state(),
    text() {
      if (this.dictList.length > 0) {
        try {
          return this.dictList.filter(d => d[this.valueField] === this.value)[0][this.textField]
        } catch (e) {
          return ''
        }
      }
      return ''
    },
  },
  props: {
    value: {},
    valueField: {
      type: String,
    },
    textField: {
      type: String,
    },
    dictTypeId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dictList: [],
    }
  },
  mounted() {
    VueUtil(this)
      .ajax(IBusinessDictController.getBizDict, { dictTypeId: this.dictTypeId })
      .then(res => {
        this.dictList = res.data.dictList
      })
      .catch(error => {})
  },
  watch: {},
  methods: {
    ...VueUtil(this)
      .select([IBusinessDictController])
      .actions(),
  },
}
</script>
