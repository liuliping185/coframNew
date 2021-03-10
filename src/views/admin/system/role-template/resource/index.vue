<template>
  <div>
    <el-tabs v-if="deep < 2" :type="tabType">
      <el-tab-pane :label="item.name" v-for="item in data">
        <resource
          :data="item.children"
          :deep="nextDeep"
          :roleId="roleId"
          v-if="item.children && item.children.length > 0"
          :offsetHeight="offsetHeight"
        ></resource>
        <template v-else></template>
      </el-tab-pane>
    </el-tabs>
    <div v-else :style="`height:calc(100vh - ${290 + offsetHeight}px);overflow-y: auto;`">
      <div v-for="(item, index) in data" :key="index" class="row">
        <RowCheckbox v-model="data[index]"></RowCheckbox>
      </div>
    </div>
  </div>
</template>
<script>
  import RowCheckbox from './permission-row'

  export default {
    name: 'resource',
    computed: {
      tabType() {
        if (this.deep === 0) {
          return 'border-card'
        }
        if (this.deep === 1) {
          return 'card'
        }
        if (this.deep === 2) {
          return ''
        }
        return ''
      },
      nextDeep() {
        return this.deep + 1
      },
    },
    components: {RowCheckbox},
    watch: {
      data: {
        deep: true,
        handler(val) {
          this.$emit('changeData', val)
        },
      },
    },
    props: {
      offsetHeight:{
        default: 0,
      },
      data: {
        default: [],
      },
      deep: {
        default: 0,
      },
    },
    /*methods:{
     changeData(){
     this.data
     }
     }*/
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .row {
    min-height:36px;
    line-height:36px;
    border-bottom: 1px solid #ebeef5;
    &:nth-child(even) {
      background: #FAFAFA;

    }
  }
</style>
