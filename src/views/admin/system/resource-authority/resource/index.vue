<template>
  <div>
    <el-button v-if="deep===0" style="position: absolute;right:20px;top:4px;z-index:1" size="small" type="primary"
               @click="visible.permission = true">显示全部权限
    </el-button>
    <div v-if="deep < 2">
      <el-tabs :type="tabType" :before-leave="beforeLeave" @tab-click="changeTabValue">
        <el-tab-pane v-for="(item, index) in gridData" :key="item.name">
          <div slot="label">
            <span>{{ item.name }}</span>
            <div style="display:inline" v-if="currentTabValue === index">
              <i class="el-icon-edit enlargeIcon" style="margin-left:5px" v-permission="FuncCode.cof_f_res_group_edit"
                 @click="editResource(item)"></i>
              <i class="el-icon-delete enlargeIcon" style="margin-left:3px" @click="remove(item)"
                 v-permission="FuncCode.cof_f_res_group_edit" v-if="!(item.children.length > 0 )"></i>
            </div>
          </div>
          <index
            :parentId="item.id"
            :isLeaf="item.leaf"
            :deep="nextDeep"
            v-if="!isLeaf"
            :style="`height:calc(100vh - 220px);`"
            :type="item.resType"
            :children="item.children"
            @search="isSuccessSearch"
          ></index>
          <template v-else></template>
        </el-tab-pane>
        <el-tab-pane v-if="deep === 0 || (deep === 1 && gridData.length < 2)">
          <span slot="label" style="padding: 4px;font-size:16px" v-permission="FuncCode.cof_f_res_group_add"
                @click="openResource">+</span>
        </el-tab-pane>
      </el-tabs>
      <ShowPermission :dialogVisible.sync="visible.permission" :permissionData="permission"></ShowPermission>
      <ResourceAdd :dialogVisible.sync="visible.resource" :formData="selectRow"
                   @success="isSuccessSearch"></ResourceAdd>
      <CategoryAdd
        :dialogVisible.sync="visible.category"
        :filterData="gridData"
        :formData="selectRow"
        :parentId="parentId"
        @success="isSuccessSearch"
      ></CategoryAdd>
    </div>
    <div v-else>
      <el-row>
        <el-col :span="12">
          <el-input
            style="width:180px"
            placeholder="查找权限"
            v-model="filterPermissionValue"
            prefix-icon="el-icon-search"
            clearable
          ></el-input>

        </el-col>
        <el-col :span="12" class="text-right">
          <el-button type="primary" @click="openAdd" v-permission="FuncCode.cof_f_menu_add" icon="el-icon-plus">新增{{getTypeLabel(type)}}模块
        </el-button>
          <el-button v-if="type === 'FUNCTION'" type="primary" @click="importFunction" v-permission="FuncCode.cof_f_function_scan"
                     icon="el-icon-upload">导入功能
        </el-button>
        </el-col>
      </el-row>
      <el-table class="mt-5" stripe :data="gridData" v-if="gridData.length > 0" :max-height="`calc(100vh - 340px)`"
                height="100%" style="width: 100%">
        <no-data slot="empty"></no-data>
        <el-table-column prop="name" label="模块" width="200">
          <template slot-scope="scope">
            <span style="margin-right: 3px"
            ><b>{{ scope.row.name }}</b></span
            >
            <i class="el-icon-edit" @click="openEdit(scope.row)" style="cursor: pointer"
               v-permission="FuncCode.cof_f_menu_edit"></i>
            <i
              class="el-icon-delete"
              @click="remove(scope.row)"
              style="cursor: pointer"
              v-if="!(scope.row.menus.length > 0 || scope.row.functions.length > 0)"
              v-permission="FuncCode.cof_f_menu_del"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">
            <RowCheckbox :item="scope.row" :filterValue="filterPermissionValue" @search="isSuccessSearch"></RowCheckbox>
          </template>
        </el-table-column>
      </el-table>

      <PermissionGroupAdd
        :dialogVisible.sync="dialogVisible"
        :formData="selectRow"
        @success="isSuccessSearch"
        :type="type"
        :parentId="parentId"
      ></PermissionGroupAdd>
      <ImportFunction
        :dialogVisible.sync="visible.importFunction"
        :formData="selectRow"
        :groups="gridData"
        @success="isSuccessSearch"
        :parentId="parentId"
      ></ImportFunction>
    </div>
  </div>
</template>

<script>
  import {BaseVue, List, _} from '@lib'
  import {ResGroupController} from '@controller'
  import RowCheckbox from './permission-group/permission/permission-row'
  import PermissionGroupAdd from './permission-group/add'
  import ResourceAdd from './root/add'
  import CategoryAdd from './category/add'
  import ImportFunction from  '@/views/admin/system/resource-authority/resource/permission-group/permission/import.vue'

  import Permission from "./permission"
  import ShowPermission from "./show-permission"

  export default {
    name: 'index',
    mixins: [BaseVue, List, Permission],
    components: {RowCheckbox, PermissionGroupAdd, ResourceAdd, CategoryAdd, ShowPermission, ImportFunction},
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
        /**/
      },
      nextDeep() {
        return this.deep + 1
      },
    },
    mounted() {
      if (this.deep === 0) {
        this.search()
      }
    },
    data() {
      return {
        visible: {
          resource: false,
          category: false,
          permission: false,
          importFunction: false,
        },
        currentTabValue: 0,
        filterPermissionValue: '',
      }
    },
    watch: {
      visible: {
        deep: true,
        handler(val) {
          if (!val.resource && !val.category) {
            this.selectRow = null
          }
        },
      },
      children: {
        immediate: true,
        handler(val) {
          this.gridData = []
          this.$nextTick(() => {
            this.gridData = _.cloneDeep(val)
          })
        },
      },
    },
    props: {
      parentId: {
        type: String,
        default: null,
      },
      isLeaf: {
        default: false,
      },
      deep: {
        default: 0,
      },
      type: String,
      children: {
        default: [],
      },
    },
    methods: {
      importFunction(){
        this.visible.importFunction = true
      },
      changeTabValue(item) {
        if (parseInt(item.index) !== this.gridData.length) {
          this.currentTabValue = parseInt(item.index)
        }
      },

      async searchBody() {
        return await this.dispatch(ResGroupController.findByCriteria, {
          listRoot: true,
          loadChildren: true,
          loadOthers: true,
          // loadChildrenLevel: 3
        })
      },
      beforeLeave(val) {
        if (val === String(this.gridData.length) && this.gridData.length > 0) {
          return false
        }
      },

      openResource(val) {
        if (this.deep === 0) {
          this.visible.resource = true
        } else {
          this.visible.category = true
        }
      },
      editResource(row) {
        this.selectRow = row
        let type = this.deep === 0 ? 'root' : 'category'
        this.openResource(type)
      },

      async removeResolve(row) {
        let resp = await this.dispatch(ResGroupController.deleteByIds, {
          ids: row.id,
        })
        if (!resp.error) {
          this.$message({
            message: '删除成功!',
            type: 'success',
          })
          this.isSuccessSearch()
        }
      },
      isSuccessSearch() {
        if (this.deep !== 0) {
          this.$emit('search')
        } else if (this.deep === 0) {
          this.search()
        }
      },
    },
  }
</script>

<style scoped>
  .enlargeIcon:hover {
    transform: scale(1.3);
  }
</style>
