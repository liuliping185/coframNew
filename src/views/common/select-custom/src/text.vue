<template>
  <span>{{ text }}</span>
</template>

<script>
import _ from 'lodash'
import { VueUtil, FormUtil } from '@lib'

export default {
  name: 'select-text',
  components: {},
  computed: {
    text() {
      if (this.data && this.data.length > 0) {
        try {
          return this.data.filter(d => d[this.valueField] === this.value)[0][this.textField]
        } catch (e) {
          return ''
        }
      }
      return ''
    },
  },
  props: {
    value: {},
    data: {
      default: [],
    },
    valueField: {
      type: String,
    },
    textField: {
      type: String,
    },
  },
}
</script>
