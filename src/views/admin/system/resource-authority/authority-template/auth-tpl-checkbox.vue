<template>
  <div>
    <el-row type="flex" class="row">
      <el-col style="width:200px" class="pl-10">
        <el-checkbox class="mr-10" v-model="value.seleted"  :disabled="value.seleted ? !allow(FuncCode.cof_f_auth_tpl_rm_res_group) : !allow(FuncCode.cof_f_auth_tpl_add_res_group)" @change="handleCheckedChange">
          {{ value.name }}
        </el-checkbox>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { BaseVue } from '@lib'
import { AuthTplController } from '@controller'
export default {
  name: 'authority-template-checkbox',
  mixins: [BaseVue],
  props: {
    value: Object,
    AuthTplId: String,
  },
  methods: {
    async handleCheckedChange(val) {
      let resp = {}
      if (val) {
        resp = await this.dispatch(AuthTplController.addRootResourceGroups, {
          id: this.AuthTplId,
          resGroupId: this.value.id,
        })
      } else {
        resp = await this.dispatch(AuthTplController.removeRootResourceGroups, {
          id: this.AuthTplId,
          resGroupId: this.value.id,
        })
      }
      if (resp.error) {
        this.value.seleted = !this.value.seleted
      }
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.row {
  min-height: 30px;
  line-height: 30px;
  font-size: 14px;

  &:hover {
    background: #e0e0e0;
  }
}
</style>
