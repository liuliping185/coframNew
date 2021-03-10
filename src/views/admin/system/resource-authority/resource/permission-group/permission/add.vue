<template>
  <el-dialog :visible.sync="dialogVisible" width="880px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="所属模块">
              {{groupName}}



            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限编码" prop="code">
              <el-input :maxlength="50" v-model="form.code" :disabled="formType === 'edit'"></el-input>
              <!--<el-input :maxlength="50" v-model="form.code" ></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="type === 'FUNCTION'">
            <div class="border-bottom-1 mb-10"></div>
            <el-form-item label="绑定服务">
              <el-table :data="form.urls">
                <no-data slot="empty"></no-data>
                <el-table-column label="method" width="150px">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.method">
                      <el-option value="GET" label="GET"></el-option>
                      <el-option value="POST" label="POST"></el-option>
                      <el-option value="PUT" label="PUT"></el-option>
                      <el-option value="DELETE" label="DELETE"></el-option>
                      <el-option value="OPTIONS" label="OPTIONS"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="Path">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.path"></el-input>
                  </template>
                </el-table-column>
                <el-table-column width="50px">
                  <template slot-scope="scope">
                    <el-button type="text" @click="removeRow(scope.$index)" icon="el-icon-delete"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="mt-5">
                <el-button type="primary" icon="el-icon-plus" @click="addRow">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" v-if="!form.id" @click="submit(true)" :loading="loading">保存并继续</el-button>
      <el-button type="primary" @click="submit(false)" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {BaseVue, Form, Validator, _} from '@lib'
  import Permission from '@/views/admin/system/resource-authority/resource/permission.js'
  import model from './model'
  import {MenuController, FunctionController} from '@controller'
  export default {
    name: 'permission-add',
    mixins: [BaseVue, Form, Permission],
    components: {},
    computed: {
      title() {
        return `${this.formType === 'add' ? '新增' : '编辑'}${this.getTypeLabel(this.type)}权限`
      },
      formType() {
        return this.form && this.form.id ? 'edit' : 'add'
      },
      loading(){
        return this.MenuController.create.loading || this.MenuController.update.loading || this.FunctionController.create.loading || this.FunctionController.update.loading
      }
    },
    props: {
      groupId: String,
      groupName: String,
      type: String,
    },
    data() {
      return {
        formRef: 'roleGroupForm',
        rules: {
          name: [
            {required: true, message: '权限名称不能为空!'},
            {validator: Validator.name},
          ],
          code: [
            {required: true, message: '权限编码不能为空!'},
            {validator: Validator.code},
          ],
        },
        model: _.cloneDeep(model),
        form: _.cloneDeep(model),
      }
    },
    methods: {
      removeRow(index){
        this.form.urls.splice(index, 1)
      },
      addRow(){
        if (!this.form.urls) {
          this.form.urls = []
        }
        this.form.urls.push({
          method: null,
          path: null,
        })
      },
      afterCancel(){
        this.$emit('success')
      },
      async validateResolve(goOn) {
        let resp = {}
        this.form.groupId = this.groupId
        let form = _.cloneDeep(this.form)

        if (this.formType === 'add') {
          if (this.type === 'MENU') {
            resp = await this.dispatch(MenuController.create, {...form, resType: 'MENU'})
          } else {
            if(!form.urls){
              delete form.urls
            }
            resp = await this.dispatch(FunctionController.create, {...form, resType: 'FUNCTION'})
          }
        } else if (this.formType === 'edit') {
          if (this.type === 'MENU') {
            resp = await this.dispatch(MenuController.update, {form, groupId: null})
          } else {
            if(!form.urls){
              delete form.urls
            }
            resp = await this.dispatch(FunctionController.update, {form, groupId: null})
          }
        }
        if (!resp.error) {
          this.$message({
            message: '保存成功!',
            type: 'success',
          })

          if (!goOn) {
            this.cancel()
          } else {
            this.form.name = null
            this.form.code = null
            this.form.urls = []
            this.$nextTick(() => {
              this.$refs[this.formRef].clearValidate()
            })
          }

        }
      },
    },
  }
</script>
