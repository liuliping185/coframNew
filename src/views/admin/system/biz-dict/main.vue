<template>
  <div class="p-5">
    <el-row :gutter="20">
      <el-col :span="12">
        <DictTypeIndex style="height:calc(100vh - 160px);" @selectOne="selectOne"></DictTypeIndex>
      </el-col>
      <el-col :span="12">
        <DictIndex style="height:calc(100vh - 160px);" :dictType="selectDictType"></DictIndex>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { BaseVue } from '@lib'
import DictTypeIndex from './type/index.vue'
import DictIndex from './entry/index.vue'

export default {
  name: 'biz-dict-index',

  components: { DictTypeIndex, DictIndex },
  mixins: [BaseVue],
  data() {
    return {
      selectDictType: null,
    }
  },
  methods: {
    selectOne(row) {
      this.selectDictType = row
    },
  },
}
</script>
