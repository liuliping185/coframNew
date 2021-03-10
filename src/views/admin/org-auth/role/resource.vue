<template>
  <div>
    <el-tabs v-if="deep < 2" :type="tabType">
      <el-tab-pane :label="item.name" v-for="item in data">
        <resource :data="item.children" :deep="nextDeep" :roleId="roleId" v-if="item.children && item.children.length > 0"></resource>
        <template v-else></template>
      </el-tab-pane>
    </el-tabs>
    <div v-else>
      <div v-for="(item, index) in data">
        <rowCheckbox v-model="data[index]"></rowCheckbox>

        <!--<el-row type="flex" class="row">

          <el-col style="width:200px" class="padding-left-10">
            <el-checkbox class="mr-10" :label="item.id">{{ item.name }}</el-checkbox>
          </el-col>
          <el-col>
            <div v-if="item.menus.length > 0">
              <el-checkbox class="mr-10" v-for="menu in item.menus" :label="menu.id">{{ menu.name }}
              </el-checkbox>
            </div>
            <div v-if="item.functions.length > 0">
              <el-checkbox class="mr-10" v-for="func in item.functions" :label="func.id">{{ func.name }}
              </el-checkbox>
            </div>
          </el-col>
        </el-row>-->
      </div>
    </div>
  </div>
</template>
<script>
import rowCheckbox from './row-checkbox'

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
  components: { rowCheckbox },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.$emit('changeData', val)
      },
    },
  },
  props: {
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
<style rel="stylesheet/scss" lang="scss" scoped></style>
