<template>
  <div>
    <secondary-menu :offsetHeight="offsetHeight">
      <div slot="left-title">
        {{title}}

        <el-tooltip placement="right" :content="`新增${title}`">
          <el-button icon="el-icon-plus" @click="openAdd" type="text"
                     v-permission="permission[keyPayload.ownerType].role_del"></el-button>
        </el-tooltip>
      </div>
      <div slot="left-body">
        <TreeList :removable="allow(permission[keyPayload.ownerType].role_del)"
                  :editable="allow(permission[keyPayload.ownerType].role_edit)"
                  v-loading="treeLoading" :data="gridList" v-model="selectRole" @remove="remove"
                  @edit="openEdit"></TreeList>
      </div>
      <div slot="right-title" v-if="selectRole">
        <el-row>
          <el-col :span="18">
            <div class="pl-5 f-22 f-bold">
              <svg-icon iconClass="role-group"></svg-icon>
              {{ selectRole.name }}


            </div>
          </el-col>
          <el-col :span="6" class="text-right">
            <el-button
              type="primary"
              @click="saveRoles"
              class="float-right"
              :loading="RoleController.handleRoleTplResource.loading"
            >保存更新

            </el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="right-body" class="p-5" v-if="selectRole">
        <div :style="`height:calc(100vh - ${140 + offsetHeight}px);overflow-y:auto;`">
          <div style="line-height:25px;">
            <svg-icon style="font-size:24px;" iconClass="my-avatar"></svg-icon>
            <el-tag class="mr-5" v-for="user in users" v-if="user.employee">{{user.employee.name}}</el-tag>
          </div>
          <Resource :offsetHeight="80" class="mt-5" :data="resources" @changeData="changeData"
                    v-loading="authLoading"></Resource>
        </div>
      </div>
    </secondary-menu>
    <roleAdd :keyPayload="keyPayload" :dialogVisible.sync="dialogVisible" @success="search" :groupId="groupId"
             :formData.sync="selectRow"></roleAdd>
  </div>
</template>

<script>
  import {BaseVue, List, _} from '@lib'
  import {RoleController} from '@controller'
  import roleAdd from './add'
  import Base from '@/views/admin/system/role-template/base.js'
  import Resource from '@/views/admin/system/role-template/resource'
  import {FuncCode} from '@/permission/index.js'
  import Vue from 'vue'
  export default {
    name: 'index',
    mixins: [BaseVue, List, Base],
    components: {roleAdd, Resource},
    props: {
      offsetHeight: {},
      roleType: {
        default: 'platform',
      },
      keyPayload: {
        type: Object,
        default: {
          ownerId: 'platform',
          ownerType: 'platform',
        }
      }
    },
    computed: {
      title() {
        return `${this.keyPayload.ownerType === 'platform' ? '平台角色' : '系统角色'}`
      },
      groupId(){
        return this.keyPayload.ownerType === 'platform' ? Vue.config.platformRoleTmpId : this.currentSystem.roleTplGrpId
      }
    },
    data() {
      return {
        permission: {
          platform: {
            role_add: FuncCode.cof_f_role_add,
            role_del: FuncCode.cof_f_role_del,
            role_edit: FuncCode.cof_f_role_edit,
            role_edit_res: FuncCode.cof_f_role_edit_res,
          },
          system: {
            role_add: FuncCode.governor_f_role_add,
            role_del: FuncCode.governor_f_role_del,
            role_edit: FuncCode.governor_f_role_edit,
            role_edit_res: FuncCode.governor_f_role_edit_res,
          },
        },
        treeLoading: false,
        selectRole: null,
        resources: [],
        initialData: [],
        authLoading: false,
        operatableResources: [],
        query: {
          limit: 9999
        }
      }
    },

    async mounted() {
      await this.search()
      if (this.gridList.length) {
        this.selectRole = this.gridList[0]
      }
    },
    watch: {
      selectRole(val) {
        this.searchResource(val)
        this.searchRoleUser(val)
      },
    },
    methods: {
      async searchBody() {
        this.treeLoading = true
        let resp = await this.dispatch(RoleController.pagingByCriteria, {
          ...this.keyPayload,
          ...this.query
        })
        this.treeLoading = false
        return resp
      },
      async searchRoleUser(val) {
        let resp = await this.dispatch(RoleController.getUsersByRoleId, {
          id: val.id,
          limit: 100,
          offset: 1
        })
        if (!resp.error) {
          this.users = resp.data.content
        } else {
          this.users = []
        }
      },
      async searchResource(val) {
        this.authLoading = true
        let resp = await this.dispatch(RoleController.loadWholeResources, {
          id: val.id,
        })
        this.authLoading = false
        if (!resp.error) {
          this.resources = resp.data
          this.initialData = _.cloneDeep(this.resources)
        } else {
          return []
        }
      },
      async saveRoles() {
        this.operatableResources = []
        this.beforeModifyRoleData(this.resources)
        let resp = await this.dispatch(RoleController.handleRoleTplResource, {
          id: this.selectRole.id,
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
        let resp = await this.dispatch(RoleController.deleteByIds, [row.id])
        if (!resp.error) {
          this.$message({
            message: '删除成功!',
            type: 'success',
          })
          this.selectRole = null
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

