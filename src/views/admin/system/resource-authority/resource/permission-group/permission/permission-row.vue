<template>
  <div>
    <el-row :gutter="20">
      <el-col style="width:100%" class="pl-10" :span="24">
        <el-tag
          :key="tag.id"
          v-for="tag in gridData"
          closable
          :disable-transitions="false"
          @close="remove(tag)"
          v-permission="FuncCode.cof_f_function_del"
          :span="4"
          :color="isFilter(tag.name)"
          :style="changeStyle(tag.name)"
        >
          <span v-permission="FuncCode.cof_f_function_edit" @click="openEdit(tag)" style="cursor:pointer">{{ tag.name }}</span>
        </el-tag>
        <el-button size="mini" v-permission="FuncCode.cof_f_function_add" @click="openAdd" :span="4" style="padding-top:4px;padding-bottom:4px">+</el-button>
      </el-col>
    </el-row>
    <permissionAdd
      :dialogVisible.sync="dialogVisible"
      :groupId="item.id"
      :groupName="item.name"
      :type="item.resType"
      :formData="selectRow"
      @success="isSuccessSearch()"
    ></permissionAdd>
  </div>
</template>

<script>
import { BaseVue, List, _ } from '@lib'
import { MenuController, FunctionController, ResGroupController } from '@controller'
import permissionAdd from './add'

export default {
  name: 'row-checkbox',
  mixins: [BaseVue, List],
  components: { permissionAdd },
  props: {
    item: {
      default: {},
    },
    filterValue: String,
  },
  watch: {
    item: {
      immediate: true,
      handler(val) {
        if (val.resType === 'MENU') {
          this.gridData = _.cloneDeep(val.menus)
        } else {
          this.gridData = _.cloneDeep(val.functions)
        }
      },
    },
    filterValue() {
      this.isFilter()
      this.changeStyle()
    },
  },
  data() {
    return {}
  },
  methods: {
    /*    async searchBody() {
        if (this.item.resType === 'FUNCTION') {
          return await this.dispatch(ResGroupController.findSubFunctionByCriteria, {
            groupId: this.item.id,
          })
        } else {
          return await this.dispatch(ResGroupController.findSubMenuByCriteria, {
            groupId: this.item.id,
          })
        }
      },*/
    async removeResolve(row) {
      let resp = {}
      if (this.item.resType === 'FUNCTION') {
        resp = await this.dispatch(FunctionController.deleteByIds, [row.id])
      } else {
        resp = await this.dispatch(MenuController.deleteByIds, {
          ids: row.id,
        })
      }
      if (!resp.error) {
        this.$message({
          message: '删除成功!',
          type: 'success',
        })
        this.isSuccessSearch()
      }
    },
    isFilter(tagName) {
      if (!!tagName && this.filterValue !== '') {
        return tagName.indexOf(this.filterValue) === -1 ? '' : '#67c23a'
      }
      return ''
    },
    changeStyle(tagName) {
      if (!!tagName && this.filterValue !== '') {
        return tagName.indexOf(this.filterValue) === -1 ? 'margin-right:5px;margin-top:2px' : 'margin-right:5px;margin-top:2px;color:white'
      }
      return 'margin-right:5px;margin-top:2px'
    },
    isSuccessSearch() {
      this.$emit('search')
    },
  },
}
</script>

<style scoped></style>
