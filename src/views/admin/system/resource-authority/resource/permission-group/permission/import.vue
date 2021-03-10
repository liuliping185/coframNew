<template>
  <el-dialog :top="`20px`" :visible.sync="dialogVisible" width="960px" :title="title">
    <el-row>
      <el-col :span="20" v-if="!batchModel">
        <el-input clearable v-model="scanUrl" placeholder="扫描应用地址..." style="width:300px;"></el-input>
        <el-input clearable v-model="basePackage" placeholder="扫描包名(选填)" style="width:250px;"></el-input>
        <el-button :loading="ToolsController.scanFunctions.loading" icon="el-icon-view" type="primary" @click="scan"
                   :disabled="!scanUrl">扫描应用功能





        </el-button>
      </el-col>
      <el-col :span="4" :offset="batchModel?20:0" class="text-right">
        <el-button :disabled="!datas ||datas.length === 0" type="primary" @click="switchBatchSetModule">
          {{batchModel ? '< 退出' : '进入'}}批量设置模块
        </el-button>
      </el-col>
    </el-row>
    <div class="mt-5">
      <el-table v-if="!batchModel" height="500px" stripe :data="datas" v-loading="ToolsController.scanFunctions.loading"
                element-loading-text="扫描应用功能中, 请稍等.."
                element-loading-spinner="el-icon-loading"
                @selection-change="handleSelectionChange">
        <NoData slot="empty"></NoData>
        <el-table-column
          :selectable="selectable"
          type="selection"
          width="55px"></el-table-column>
        <el-table-column label="名称" prop="name" width="150px">
          <template slot-scope="scope">
            <el-input  :disabled="scope.row.imported" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="编码" prop="code" width="150px"></el-table-column>
        <el-table-column label="所属模块" width="150px" prop="groupId">
          <template slot-scope="scope">
            <el-select v-model="scope.row.groupId" :disabled="scope.row.imported">
              <el-option v-for="item in groups" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="imported" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.imported"><el-tag type="success">已导入</el-tag></span>
            <span v-else>未导入</span>
          </template>
        </el-table-column>
        <el-table-column label="绑定API" prop="urls">
          <template slot-scope="scope">
            <div v-for="url in scope.row.urls">{{url.method}}-{{url.path}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <el-row :gutter="5">
          <secondary-menu :rightTitle="false" :leftWidth="150" :offsetHeight="200">
            <div slot="left-title">选择设置模块</div>
            <div slot="left-body">
              <TreeList style="width:100%" :searchable="false" :data="groups" v-model="currentGroup"></TreeList>
            </div>
            <div slot="right-body">
              <el-table height="calc(100vh - 280px)" ref="table2" stripe :data="datas"
                        v-loading="ToolsController.scanFunctions.loading"
                        @selection-change="groupSelectionChange">
                <NoData slot="empty"></NoData>
                <el-table-column
                  :selectable="selectable2"
                  type="selection"
                  width="55px"></el-table-column>
                <el-table-column label="名称" prop="name" width="180px"></el-table-column>
                <el-table-column label="编码" prop="code" width="180px"></el-table-column>
                <el-table-column label="状态" prop="imported" width="100px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.imported"><el-tag type="success">已导入</el-tag></span>
                    <span v-else>未导入</span>
                  </template>
                </el-table-column>
                <el-table-column label="所属模块" prop="groupId">
                  <template slot-scope="scope">
                    <el-select :disabled="true" v-model="scope.row.groupId">
                      <el-option v-for="item in groups" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </secondary-menu>
        </el-row>
      </div>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(false)" :loading="FunctionController.importFunctions.loading"
                 :disabled="!selectItems || selectItems.length === 0">导入选中功能




      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import _ from 'lodash'
  import {BaseVue, Form, Validator} from '@lib'
  import model from './model'
  import {ToolsController, FunctionController} from '@controller'
  export default {
    name: 'permission-add',
    mixins: [BaseVue, Form],
    components: {},
    computed: {
      title() {
        return `导入功能权限`
      },
    },
    props: {
      groups: {
        default: []
      },
      groupId: String,
      groupName: String,
      type: String,
    },
    data() {
      return {
        basePackage: '',
        scanUrl: '',
        datas: null,
        batchModel: false,
        currentGroup: null,
        selectItems: [],
        disable: false,
      }
    },
    watch: {
      currentGroup(val){
        this.disable = true
        this.datas.forEach(row => {
          this.$refs['table2'].toggleRowSelection(row, row.groupId === val.id)
        })
        this.disable = false
      }
    },
    methods: {
      selectGroup(group){
        this.currentGroup = group
      },
      switchBatchSetModule(){
        this.batchModel = !this.batchModel
        if (!this.batchModel) {
          this.currentGroup = null
        }
      },
      selectable(row){
        return !row.imported
      },
      selectable2(row){
        return !row.imported && this.currentGroup
      },

      afterCancel(){
        this.selectItems = []
        this.datas = []
        this.currentGroup = []
        this.batchModel = false
        this.basePackage = null
        this.scanUrl = null
      },
      async submit(){
        let resp = await this.dispatch(FunctionController.importFunctions, {
          payload: this.selectItems.map(s => {
            return {
              ...s,
              tenantId: 'default',
            }
          }),
        })
        if (!resp.error) {
          this.$message({
            message: '导入成功!',
            type: 'success'
          })
          this.$emit('success')
          this.cancel()
        }
      },
      groupSelectionChange(items){
        if (!this.disable) {
          items.forEach(item => {
            item.groupId = this.currentGroup.id
          })
        }

      },
      handleSelectionChange(items){
        this.selectItems = items
      },
      async scan(){
        let resp = await this.dispatch(ToolsController.scanFunctions, {
          endpoint: this.scanUrl,
          basePackage: this.basePackage,
          timeout: 0,
        })
        if (!resp.error) {
          this.datas = resp.data
        }
      }
    },
  }
</script>
