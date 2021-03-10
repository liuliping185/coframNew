<template>
  <div class="tree-list">
    <el-tree
      v-if="treeReady && roleGroup"
      ref="tree"
      :load="lazyLoad_"
      node-key="id"
      lazy
      :data="treeData"
      :props="defaultProps"
      :highlight-current="true"
      :expand-on-click-node="false"
      :default-expanded-keys="[roleGroup.length > 0 ? roleGroup[0].id : '']"
      @node-click="nodeClick"
    >
      <div style="width:100%;" class="custom-tree-node" slot-scope="{ node, data }">
        <el-row type="flex">
          <el-col :span="14">
            <svg-icon style="color:#000;" iconClass="role-group" v-if="!data.leaf"></svg-icon>
            <span class="text-ellipse">{{ node.label }}</span>
          </el-col>
          <el-col :span="10" class="text-right buttons pr-5">
            <el-button type="text" icon="el-icon-plus" @click.stop="addRole(data, node)" v-permission="FuncCode.cof_f_role_tpl_add" v-if="!data.leaf" class="ml-0"></el-button>
            <el-button type="text" v-if="allowEdit(data)" icon="el-icon-edit" @click.stop="editRole(data, node)" class="ml-0"></el-button>
            <el-button type="text" v-if="allowDelete(data)" icon="el-icon-delete" @click.stop="remove(data)" class="ml-0"></el-button>
          </el-col>
        </el-row>
      </div>
    </el-tree>
    <GroupAdd :dialogVisible.sync="dialogVisible.group" :formData="selectData.group" @success="successSearch"></GroupAdd>
    <RoleAdd :dialogVisible.sync="dialogVisible.role" :formData="selectData.role" @success="successSearch" :groupId="groupId" :groupName="groupName"></RoleAdd>
  </div>
</template>
<script>
import { BaseVue, List } from '@lib'
import { RoleTplController, RoleController,RoleTplGroupController } from '@controller'
import RoleAdd from './role/add'
import GroupAdd from './add'


export default {
  name: 'role-template-group-tree',
  mixins: [BaseVue, List],
  components: { RoleAdd, GroupAdd },
  props: {
    roleGroup: {},
  },
  mounted() {},
  data() {
    return {
      groupId: null,
      groupName: null,
      currentNode: null,
      treeReady: true,
      addType: null,
      dialogVisible: {
        role: false,
        group: false,
      },
      selectData: {
        role: null,
        group: null,
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
      },
    }
  },
  watch: {
    roleGroup: {
      immediate: true,
      handler: 'resetTree',
    },
    dialogVisible: {
      deep: true,
      handler(val) {
        if (!val.group && !val.role) {
          this.selectData = { role: null, group: null }
        }
      },
    },
  },

  methods: {
    nodeClick(data, node) {
      this.currentNode = node
      this.$emit('chooseNode', data)
    },

    async resetTree() {
      this.treeReady = false
      this.$nextTick(() => {
        this.treeReady = true
      })
    },

    async lazyLoad_(node, resolve) {
      if (node.level === 0) {
        return resolve(this.lazyLoadParents())
      }
      resolve(await this.getChildrens(node.data))
    },
    lazyLoadParents() {
      if (this.roleGroup.length > 0) {
        return this.roleGroup.map(item => {
          return {
            id: item.id,
            name: item.name,
            description:item.description,
            type: 'roleGroup',
          }
        })
      } else {
        return []
      }
    },
    async getChildrens(data) {
      let resp = await this.dispatch(RoleTplController.findByCriteria, {
        groupId: data.id,
      })
      if (!resp.error) {
        return resp.data.map(m => {
          return {
            ...m,
            leaf: true,
          }
        })
      }
    },
    allowEdit(row){
      return !row.leaf ? this.allow(this.FuncCode.cof_f_role_tpl_grp_edit) :    this.allow(this.FuncCode.cof_f_role_tpl_edit)
    },
    allowDelete(row){
      return !row.leaf ? this.allow(this.FuncCode.cof_f_role_tpl_grp_del) :    this.allow(this.FuncCode.cof_f_role_tpl_del)
    },
    async removeResolve(data) {
      let resp = {}
      if (data.leaf) {
        resp = await this.dispatch(RoleTplController.deleteByIds, [data.id])
      } else {
        resp = await this.dispatch(RoleTplGroupController.deleteByIds, [data.id])
      }
      if (!resp.error) {
        this.$message({
          message: '删除成功!',
          type: 'success',
        })
        this.$emit('search')
      }
    },
    addRole(data, node) {
      this.groupId = data.id
      this.groupName = data.name
      this.addType = 'role'
      this.dialogVisible[this.addType] = true
    },
    successSearch() {
      this.$emit('search')
    },
    editRole(data, node) {
      this.addType = data.leaf ? 'role' : 'group'
      this.selectData[this.addType] = data
      this.dialogVisible[this.addType] = true
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

  /deep/ .el-button + .el-button {
    margin-left: 0px;
  }
  .custom-tree-node{
    .buttons{
      opacity: 0;
      transition: all .3s ease;
    }
    &:hover{
      .buttons{
        color: #0a76a4;
        opacity: 1;
      }
     }
  }
</style>
