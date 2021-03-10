<template>
  <div class="tree-list">
    <div>
      <el-input class="mr-5" v-model="keyword" placeholder="检索..." clearable>
        <i slot="prefix" class="el-icon-search el-input__icon"></i>
      </el-input>
    </div>
    <el-tree
      v-if="treeReady && dimension"
      ref="tree"
      :load="lazyLoad_"
      node-key="id"
      lazy
      :props="defaultProps"
      :default-expanded-keys="[dimension.id]"
      :highlight-current="true"
      :expand-on-click-node="false"
      @node-click="nodeClick"
      :filter-node-method="filterNode"
    >
      <!--<div style="width:100%;" class="custom-tree-node" slot-scope="{ node, data }">
        <el-row style="width:100%;">
          <el-col :span="18">
            <svg-icon style="color:#000;" :iconClass="data.nodeType"></svg-icon>
            <span>{{ node.label }}</span>
          </el-col>
          <el-col :span="6" class="text-right pr-10">
            <el-dropdown size="medium" @command="clickAdd" v-if="!isEmployee(data.nodeType)">
              <span class="el-dropdown-link">
                <el-button size="medium" type="text" icon="el-icon-plus" @click.stop="() => {}"></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ data: data, type: 'organization' }" v-permission="FuncCode.cof_f_org_add"
                                  :disabled="!allowAdd(data, 'organization')">
                  新增机构


                </el-dropdown-item>
                <el-dropdown-item :command="{ data: data, type: 'position' }" v-permission="FuncCode.cof_f_position_add"
                                  :disabled="!allowAdd(data, 'position') ">新增岗位

                </el-dropdown-item>
                <el-dropdown-item :command="{ data: data, type: 'workgroup' }"
                                  v-permission="FuncCode.cof_f_workgroup_add" :disabled="!allowAdd(data, 'workgroup')">
                  新增工作组
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>
              <el-button size="medium" class="ml-0" v-if="!isDimension(node.data) &&  editPower(node.data)" type="text"
                         icon="el-icon-edit" @click.stop="editNode(data, node)"></el-button>
            </span>
            <span>
              <el-button size="medium" class="ml-0" v-if="!isDimension(node.data) && delPower(node.data)"
                         type="text" icon="el-icon-delete" @click.stop="removeNode(data, node)"></el-button>
            </span>
          </el-col>
        </el-row>
      </div>-->
    </el-tree>
    <component
      :is="`${addType}Add`"
      :dimension="dimension"
      :formData.sync="currentObj"
      :parentObj="parentObj"
      :dialogVisible.sync="dialogVisible[addType]"
      @success="opSuccess"
    ></component>
  </div>
</template>
<script>
  import {BaseVue} from '@lib'
  // import {OrganizationController, WorkgroupController, PositionController, EmployeeController} from '@controller'
  import Base from '../base.js'
  // import OrganizationAdd from './add.vue'
  // import WorkgroupAdd from '../workgroup/add.vue'
  // import PositionAdd from '../position/add.vue'
  // import EmployeeAdd from '../member-management/add.vue'
  export default {
    name: 'org-tree',
    mixins: [BaseVue, Base],
    components: {
      // OrganizationAdd,
      // WorkgroupAdd,
      // PositionAdd,
      // EmployeeAdd,
    },
    props: {
      dimension: {},
    },
    mounted() {
    },
    data() {
      return {
        keyword: null,
        currentNode: null,
        currentObj: null,
        treeReady: true,
        parentObj: null,
        addType: null,
        dialogVisible: {
          workgroup: false,
          position: false,
          organization: false,
          employee: false,
        },
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf',
        }
      }
    },
    watch: {
      keyword(val) {
        this.$refs.tree.filter(val)
      },
      dimension: {
        immediate: true,
        handler: 'resetTree',
      },
    },

    methods: {
      filterNode(value, data) {
        if (!value) return true
        if (data.type === 'dimension') {
          return true
        }
        return data.name.indexOf(value) !== -1
      },
      delPower(data) {
        if (this.isOrganization(data)) {
          return this.allow(this.FuncCode.cof_f_org_del)
        }
        if (this.isPosition(data)) {
          return this.allow(this.FuncCode.cof_f_position_del)
        }
        if (this.isWorkgroup(data)) {
          return this.allow(this.FuncCode.cof_f_workgroup_del)
        }
      },
      editPower(data) {
        if (this.isOrganization(data)) {
          return this.allow(this.FuncCode.cof_f_org_edit)
        }
        if (this.isPosition(data)) {
          return this.allow(this.FuncCode.cof_f_position_edit)
        }
        if (this.isWorkgroup(data)) {
          return this.allow(this.FuncCode.cof_f_workgroup_edit)
        }
      },
      clickAdd(command) {
        this.addType = command.type
        this.parentObj = command.data
        this.dialogVisible[command.type] = true
      },
      editNode(data, node) {
        this.addType = data.nodeType
        this.currentObj = data
        this.parentObj = data.parent
        this.dialogVisible[data.nodeType] = true
      },
      allowAdd(data, type) {
        if (this.isDimension(data)) {
          return type === 'organization'
        } else if (this.isOrganization(data)) {
          return true
        } else if (this.isPosition(data)) {
          return type === 'employee'
        } else if (this.isWorkgroup(data)) {
          return type === 'workgroup' || type === 'employee'
        }
      },
      nodeClick(data, node) {
        this.currentNode = node
        this.$emit('chooseNode', data)
      },
      async freshTreeNode() {
        //        let {parent} = this.currentNode
        let {data} = this.currentNode
        this.$refs['tree'].updateKeyChildren(data.id, await this.getChildrens(data.nodeType, data))
      },
      async opSuccess(form) {
        let tree = this.$refs['tree']
        tree.updateKeyChildren(this.parentObj.id, await this.getChildrens(this.parentObj.nodeType, this.parentObj))

        if(this.currentNode){
          this.$nextTick(() => {
            let newNode = tree.getNode(this.currentNode.data.id)
            if(newNode){
              this.nodeClick(newNode.data, newNode)
              tree.setCurrentNode(newNode)
            }
          })
        }


        //更新选择的上级机构树节点
        if (form.id) {
          if (form.parentId !== this.parentObj.id) {
            tree.updateKeyChildren(form.parentId, await this.getChildrens(form.nodeType, {
              id: form.parentId,
              nodeType: form.nodeType
            }))
          }
        }
      },
      async removeNode(data, node) {
        this.remove(data, node.parent.data).then(async resp => {
          if (!resp.error) {
            let {parent} = node
            this.$refs['tree'].updateKeyChildren(parent.data.id, await this.getChildrens(parent.data.nodeType, parent.data))
            this.$emit('removeListener', data)
          }
        })
      },
      async resetTree() {
        this.treeReady = false
        this.$nextTick(() => {
          this.treeReady = true
          this.$nextTick(() => {
            let tree = this.$refs['tree']
            if (this.dimension) {
              tree.setCurrentKey(this.dimension.id)
              this.$emit('chooseNode', {
                ...this.dimension,
                nodeType: 'dimension'
              })
            } else {
              this.$emit('chooseNode', null)
            }
          })
        })
      },

      async lazyLoad_(node, resolve) {
          console.log("==========",node)
        if (node.level === 0) {
          return resolve([
            {
              ...this.dimension,
              nodeType: 'dimension',
            },
          ])
        }
        resolve(await this.getChildrens(node.data.nodeType, node.data))
      },
    },
  }
</script>
