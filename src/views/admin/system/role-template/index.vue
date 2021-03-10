<template>
  <div>
    <secondary-menu>
      <div slot="left-title">
        平台角色模板组
        <el-tooltip content="新增平台角色模板组" placement="right">
          <el-button icon="el-icon-plus" @click="openAdd" type="text" v-permission="FuncCode.cof_f_role_tpl_grp_add">
          </el-button>
        </el-tooltip>
      </div>
      <div slot="left-body">
        <RoleTemplateTree ref="orgTree" :roleGroup="gridData" @chooseNode="chooseObj"
                          @search="search"></RoleTemplateTree>
      </div>
      <div slot="right-title" v-if="currentObj">
        <el-row  v-if="currentObj.leaf">
          <el-col :span="12">
            <div class="pl-5 f-22 f-bold">
              <svg-icon iconClass="role-group"></svg-icon> {{ currentObj.name }}

            <el-tooltip content="角色描述" placement="top" v-if="selectRole && selectRole.description">
              <el-tag size="mini">{{ selectRole.description }}</el-tag>
            </el-tooltip>
            </div>
          </el-col>
          <el-col :span="12" class="text-right">
            <el-button
              type="primary"
              @click="saveRoles"
              v-permission="FuncCode.cof_f_role_tpl_edit_res"
              :loading="RoleTplController.handleRoleTplResource.loading"
            >保存更新

          </el-button>

          </el-col>
        </el-row>
      </div>
      <div slot="right-body" class="p-5" v-if="currentObj">
        <div :style="`height:calc(100vh - 180px);`" v-if="currentObj.leaf">
          <Resource :data="resources" @changeData="changeData"
                    v-loading="RoleTplController.loadWholeResources.loading"></Resource>
        </div>
      </div>
    </secondary-menu>
    <RoleGroupAdd :dialogVisible.sync="dialogVisible" @success="search"></RoleGroupAdd>
  </div>
</template>

<script>
  import {BaseVue, List, _} from '@lib'
  import {AuthTplController, RoleTplController, RoleController, RoleTplGroupController} from '@controller'
  import RoleTemplateTree from './role-group/tree'
  import Resource from './resource'
  import Base from './base.js'
  import RoleGroupAdd from './role-group/add'

  export default {
    name: 'role-template',
    mixins: [BaseVue, List, Base],
    components: {
      RoleTemplateTree,
      Resource,
      RoleGroupAdd,
    },
    computed: {
      dialogTitle() {
        return `创建角色模板`
      },
    },
    props: {
      availableProjectType: {
        type: String,
        default: 'project',
      },
    },

    data() {
      return {
        roleGroup: null,
        currentObj: null,
        resources: [],
        initialData: [],
        operatableResources: [],
      }
    },
    mounted() {
      this.search()
    },
    watch: {
      currentObj(val) {
        if (val) {
          if (val.leaf) {
            this.loadPermission(val.id)
          }
        }
      },
    },
    methods: {
      async searchBody() {
        return await this.dispatch(RoleTplGroupController.findByCriteria)
      },

      async loadPermission(roleId) {
        this.resources = await this.getResourceByRole(roleId)
        this.initialData = _.cloneDeep(this.resources)
      },

      roleGroupChanged(row) {
        this.roleGroup = row
      },
      chooseObj(row) {
        this.currentObj = null
        this.$nextTick(() => {
          this.currentObj = row
        })
      },

      async saveRoles() {
        this.operatableResources = []
        this.beforeModifyRoleData(this.resources)
        let resp = await this.dispatch(RoleTplController.handleRoleTplResource, {
          id: this.currentObj.id,
          payload: this.operatableResources,
        })
        if (!resp.error) {
          this.$message({
            message: '修改成功!',
            type: 'success',
          })
          this.initialData = _.cloneDeep(this.resources)
        }
      },
      async removeResolve(row) {
        let resp = await this.dispatch(RoleTplController.deleteByIds, [row.id])
        if (!resp.error) {
          this.$message({
            message: '删除成功!',
            type: 'success',
          })
          this.currentObj = null
          this.search()
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .title {
    height: 70px;
    line-height: 70px;
    background: #eaedf1;

    .text {
      margin-left: 10px;
      font-size: 18px;
    }
  }


</style>
