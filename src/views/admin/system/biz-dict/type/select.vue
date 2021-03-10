<template>
  <el-select v-model="value" v-on="$listeners" v-bind="$attrs" @change="valueChange">
    <el-option v-for="item in items" :label="item.name" :value="item.id" :key="item.id"></el-option>
  </el-select>
</template>

<script>
import _ from 'lodash'
import { BaseVue, List } from '@lib'
import form from './model'
import { DictTypeController } from '@controller'

export default {
  name: 'dict-type-select',
  mixins: [BaseVue, List],
  props: {
    parentDict: {},
    value: {},
  },

  data() {
    return {
      items: [],
    }
  },
  mounted() {},
  watch: {
    parentDict: {
      immediate: true,
      handler() {
        this.loadData()
      },
    },
  },
  methods: {
    valueChange(val) {
      this.$emit('input', val)
      this.$emit('change', this.items.find(f => f.id === val))
    },
    async loadData() {
      let params

      if (this.parentDict) {
        params = {
          offset: 1,
          limit: 5000,
          parentId: this.parentDict.id,
        }
      } else {
        params = {
          offset: 1,
          limit: 5000,
          listRoot: true,
        }
      }

      let resp = await this.dispatch(DictTypeController.findByCriteria, params)
      if (!resp.error) {
        this.items = resp.data.content
        if (!this.value && this.items.length === 1) {
          this.valueChange(this.items[0].id)
        }
      }
    },
  },
}
</script>
