<template>
  <el-tabs type="card">
    <el-tab-pane label="字典类型">
      <div>
        <el-form class="view-form" label-width="80px">
          <el-row :gutter="5">
            <el-col :span="10">
              <el-form-item label="类型名称">
                <el-input v-model="query.name" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="类型代码">
                <el-input v-model="query.code" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" icon="el-icon-search" @click="search"></el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="border-bottom-1 mb-10"></div>
      <div>
        <el-button-group>
          <el-button type="primary" v-permission="FuncCode.cof_f_dict_type_add" @click="openAdd">新增</el-button>
          <el-button type="primary" :disabled="selectRows.length !== 1" @click="openAddChild">新增子类型</el-button>
          <el-button type="primary" :disabled="selectRows.length === 0" @click="batchDelete">批量删除</el-button>
          <el-button type="primary" v-permission="FuncCode.cof_f_dict_export" @click="exportFile">导出</el-button>
          <el-button type="primary" v-permission="FuncCode.cof_f_dict_import" @click="importFile">导入</el-button>
          <el-button type="primary" v-permission="FuncCode.cof_f_dict_download_tpl" @click="downModel">下载导入模板


          </el-button>
        </el-button-group>
        <TreeTable
          stripe
          class="mt-5"
          :data="gridList"
          height="calc(100vh - 320px)"
          :columns="columns"
          @expand="expand"
          :highlight-current-row="true"
          @row-click="chooseType"
          @selection-change="handleSelectionChange"
        >
          <el-table-column slot="before" type="selection" width="55px"></el-table-column>
          <el-table-column slot="after" label="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" v-permission="FuncCode.cof_f_dict_type_edit"
                         @click="openEdit(scope.row)">编辑


              </el-button>
              <el-button type="text" icon="el-icon-edit" v-permission="FuncCode.cof_f_dict_type_del"
                         @click="remove(scope.row)">删除


              </el-button>
            </template>
          </el-table-column>
        </TreeTable>
        <Pagination
          layout="total, prev, pager, next, sizes"
          :pageSize="query.limit"
          @size-change="changePageSizer"
          @current-change="changePage"
          :current-page.sync="query.offset"
          :total="gridTotal"
        ></Pagination>
      </div>
      <DictTypeAdd :dialogVisible.sync="dialogVisible" :parentType.sync="parentType" :formData="selectRow"
                   @success="refresh"></DictTypeAdd>
      <DictTypeImport v-if="importDialogVisible" :dialogVisible.sync="importDialogVisible"
                      @success="refresh"></DictTypeImport>
      <DownLoadFile v-model="downloadUrl"></DownLoadFile>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import _ from 'lodash'
  import {BaseVue, List, OtherUtil} from '@lib'
  import form from './model'
  import {DictTypeController} from '@controller'
  import TreeTable from '@/components/TreeTable/index.vue'
  import DictTypeAdd from './add.vue'
  import DictTypeImport from './import.vue'

  export default {
    name: 'dict-type-index',
    components: {TreeTable, DictTypeAdd, DictTypeImport},
    inject: ['selectDictType'],
    mixins: [BaseVue, List],

    data() {
      return {
        importDialogVisible: false,
        parentType: null,
        downloadUrl: null,
        selectRows: [],
        columns: [
          {
            text: '代码',
            value: 'code',
            width: 200,
          },
          {
            text: '名称',
            value: 'name',
          },
        ],
        query: {
          name: null,
          code: null,
          listRoot: true,
          offset: 1,
          limit: 10,
        },
      }
    },
    mounted() {
      this.search()
    },
    watch: {},
    methods: {
      exportFile() {
        this.downloadUrl = '/api/dict-types/export-all?locale=zh'
      },
      importFile() {
        this.importDialogVisible = true
      },
      downModel() {
        this.downloadUrl = '/api/dict-types/download-dict-template'
      },
      batchDelete() {
        this.confirm(`此操作将永久删除[${this.selectRows.length}]条数据, 是否继续?`).then(async () => {
          if (await this.deleteData(this.selectRows.map(r => r.id).join(','))) {
            this.search()
          }
        })
      },
      async removeResolve(row) {
        if (await this.deleteData(row.id)) {
          if (row.parent) this.expand(row.parent)
          else {
            this.search()
          }
        }
      },
      async deleteData(ids) {
        let resp = await this.dispatch(DictTypeController.deleteByIds, {
          ids,
        })
        if (!resp.error) {
          this.$message({message: '删除成功', type: 'success'})
          return true
        } else return false
      },
      async expand(row) {
        let resp = await this.dispatch(DictTypeController.findByCriteria, {
          offset: 1,
          limit: 5000,
          parentId: row.id,
        })
        if (!resp.error) {
          row.children = _.cloneDeep(resp.data.content)
        }
      },
      openAddChild() {
        this.parentType = this.selectRows[0]
        this.openAdd()
      },
      handleSelectionChange(row) {
        this.selectRows = row
      },
      chooseType(row) {
        this.$emit('selectOne', row)
      },
      async searchBody() {
        return await this.dispatch(DictTypeController.findByCriteria, {
          ...this.query,
        })
      },
      refresh(row) {
        if (row && row.parentId) {
          this.recurExpend(this.gridList, row.parentId)
        } else {
          this.search()
        }
      },
      recurExpend(list, id) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === id) {
            this.expand(list[i])
            break
          } else if (list[i].children && list[i].children.length > 0) {
            this.recurExpend(list[i].children, id)
          }
        }
      },
    },
  }
</script>
