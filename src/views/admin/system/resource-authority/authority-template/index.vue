<template>
  <div>
    <secondary-menu :offsetHeight="60">
      <div slot="left-title">
        权限模板

        <el-tooltip content="新增权限模板" placement="right">
          <el-button icon="el-icon-plus" v-permission="FuncCode.cof_f_auth_tpl_add" @click="openAdd" type="text">
          </el-button>
        </el-tooltip>
      </div>
      <div slot="left-body">
        <TreeList v-loading="treeLoading" @remove=" remove" :removable="allow(FuncCode.cof_f_auth_tpl_del)"
                  @edit="openEdit" :editable="allow(FuncCode.cof_f_auth_tpl_edit)" :data="gridList" :searchable="gridList && gridList.length >= 5"
                  v-model="selectTpl"></TreeList>
      </div>
      <div slot="right-title" v-if="selectTpl">
            <div class="pl-5 f-22 f-bold"> {{ selectTpl.name }}</div>
      </div>
      <div slot="right-body" class="p-5" v-if="selectTpl">
        <el-tabs v-loading="AuthTplController.queryResGroups.loading" type="border-card"
                 :style="`height:calc(100vh - 180px);`">
          <el-tab-pane label="模板资源">
            <div v-for="(item, index) in resources" :key="index">
              <RowCheckbox :AuthTplId="selectTpl.id" v-model="resources[index]"></RowCheckbox>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </secondary-menu>
    <AuthTplAdd :dialogVisible.sync="dialogVisible" :formData="selectRow" @success="search"></AuthTplAdd>
  </div>
</template>

<script>
  import {BaseVue, List} from '@lib'
  import {AuthTplController} from '@controller'
  import AuthTplAdd from './add'
  import RowCheckbox from './auth-tpl-checkbox'
  export default {
    name: 'authority-template-index',
    mixins: [BaseVue, List],
    components: {
      RowCheckbox,
      AuthTplAdd,
    },
    data() {
      return {
        selectTpl: null,
        resources: [],
      }
    },
    mounted() {
      this.search()
    },
    watch: {
      'selectTpl.id'(val) {
        this.loadPermission(val)
      }
    },
    methods: {
      async searchBody() {
        return await this.dispatch(AuthTplController.queryALLAuthTpls)
      },
      async removeResolve() {
        let resp = await this.dispatch(AuthTplController.deleteByIds, [this.selectTpl.id])
        if (!resp.error) {
          this.selectTpl = null
          this.$message({
            message: '删除成功!',
            type: 'success',
          })
          return resp
        }
      },
      async loadPermission(AuthTplId) {
        this.resources = await this.findTemplateResourcesById(AuthTplId)
      },
      async findTemplateResourcesById(AuthTplId) {
        let resp = await this.dispatch(AuthTplController.queryResGroups, {
          id: AuthTplId,
          showAllRootResGroups: true,
        })
        if (!resp.error) {
          return resp.data
        } else {
          return []
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
