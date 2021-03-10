<template>
  <el-tabs type="card" v-if="dictType">
    <el-tab-pane label="字典项">
      <div class="float-right">字典类型: {{ dictType.name }}</div>
      <el-button-group>
        <el-button type="primary" v-permission="FuncCode.cof_f_dict_entry_add" @click="openAdd" v-if="!dictType.parent">
          新增
        </el-button>
        <el-button type="primary" :disabled="selectRows.length !== 1" @click="openAddChild">新增子字典项</el-button>
        <el-button type="primary" :disabled="selectRows.length === 0" @click="batchDelete">批量删除</el-button>
      </el-button-group>
      <TreeTable
        class="mt-5"
        stripe
        height="calc(100vh - 280px)"
        :data="gridList"
        :columns="columns"
        @expand="expand"
        :highlight-current-row="true"
        @row-click="chooseType"
        @selection-change="handleSelectionChange"
      >
        <el-table-column slot="before" type="selection" width="55px"></el-table-column>
        <el-table-column slot="after" label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" v-permission="FuncCode.cof_f_dict_entry_edit"
                       @click="openEdit(scope.row)">编辑
            </el-button>
            <el-button type="text" icon="el-icon-edit" v-permission="FuncCode.cof_f_dict_entry_del"
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
      <DictEntryAdd
        :dialogVisible.sync="dialogVisible"
        :parentEntry.sync="parentEntry"
        :formData="selectRow"
        :dictType="dictType"
        @success="refresh"
      ></DictEntryAdd>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import _ from 'lodash'
  import {BaseVue, List} from '@lib'
  import form from './model'
  import {DictEntryController} from '@controller'
  import TreeTable from '@/components/TreeTable/index.vue'
  import DictEntryAdd from './add.vue'

  export default {
    name: 'dict-entry-index',
    components: {TreeTable, DictEntryAdd},
    mixins: [BaseVue, List],
    props: {
      dictType: {},
    },
    data() {
      return {
        parentEntry: null,
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
          offset: 1,
          limit: 10,
        },
      }
    },
    mounted() {
      this.search()
    },
    watch: {
      dictType: 'search',
    },
    methods: {
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
        let resp = await this.dispatch(DictEntryController.deleteByIds, {
          ids,
        })
        if (!resp.error) {
          this.$message({message: '删除成功', type: 'success'})
          return true
        } else return false
      },
      async expand(row) {
        let resp = await this.dispatch(DictEntryController.findByCriteria, {
          offset: 1,
          limit: 5000,
          parentId: row.id,
        })
        if (!resp.error) {
          row.children = _.cloneDeep(resp.data.content)
        }
      },
      openAdd() {
        this.parentEntry = null
        this.dialogVisible = true
      },
      openAddChild() {
        this.parentEntry = _.cloneDeep(this.selectRows[0])
        this.dialogVisible = true
      },
      handleSelectionChange(row) {
        this.selectRows = row
      },
      chooseEntry(row) {
        this.$emit('selectOne', row)
      },
      async searchBody() {
        if (this.dictType) {
          return await this.dispatch(DictEntryController.findByCriteria, {
            ...this.query,
            dictTypeId: this.dictType.id,
          })
        } else return null
      },
      refresh(row) {
        if (row.parentId) {
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
