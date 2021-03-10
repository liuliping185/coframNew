<template>
  <el-select v-bind="$attrs" v-on="$listeners" no-data-text="暂无数据" v-model="value">
    <el-option v-for="dict in list" :value="dict.dictid" :label="dict.dictid">
      <span style="float: left">{{ dict.dictid }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictname }}</span>
    </el-option>
  </el-select>
</template>
<script>
import { VueUtil } from '@lib'
import { IBusinessDictController } from '@controller'

const controllers = [IBusinessDictController]

export default {
  name: 'env-type',
  computed: {
    ...VueUtil(this)
      .select(controllers)
      .state(),
  },
  props: {
    value: {},
    projectId: {},
  },

  data() {
    return {
      list: [],
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    ...VueUtil(this)
      .select(controllers)
      .actions(),
    change(value) {
      this.$emit('change', this.list.find(l => l.dictid === value))
    },
    async loadData() {
      let resp = await this.dispatch(IBusinessDictController.getEnvTypeBizDicts, {
        projectId: this.projectId,
      })
      this.list = resp.data.dictList
    },
  },
}
</script>
