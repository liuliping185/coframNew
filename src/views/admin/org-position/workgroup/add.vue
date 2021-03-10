<template>
  <el-dialog :visible.sync="dialogVisible" width="600px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="工作组代码" prop="code">
              <el-input :maxlength="50" v-model="form.code" :disabled="formType === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作组名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" :maxlength="200" :rows="3" v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button
        type="primary"
        v-if="formType === 'add'"
        @click="submit(true)"
        v-loading="loading"
      >保存并继续
      </el-button
      >
      <el-button type="primary" @click="submit(false)" :loading="loading"
      >保存
      </el-button
      >
    </div>
  </el-dialog>
</template>
<script>
  import {BaseVue, Form, Validator, _} from '@lib'
  import model from './model'
  import Base from '../base.js'

  import {WorkgroupController} from '@controller'
  export default {
    name: 'workgroup-add',
    props: {
      parentObj: {},
    },
    computed: {
      loading(){
        return this.WorkgroupController.create.loading || this.WorkgroupController.update.loading
      },
      title() {
        return `${this.formType === 'add' ? '新增' : '编辑'}工作组`
      },
      formType() {
        return this.form && this.form.id ? 'edit' : 'add'
      },
    },
    mixins: [BaseVue, Form, Base],
    data() {
      return {
        formRef: 'domainForm',
        rules: {
          name: [
            {required: true, message: '工作组名称不能为空!'},
            {validator: Validator.name},
          ],
          code: [
            {required: true, message: '工作组代码不能为空!'},
            {validator: Validator.code},
          ],
        },
        model: model,
        form: _.cloneDeep(model),
      }
    },
    watch: {},
    methods: {
      async validateResolve(param) {
        let resp = {}
        if (this.formType === 'add') {
          let form = _.cloneDeep(this.form)
          if (this.isOrganization(this.parentObj)) {
            form.organization = {
              id: this.parentObj.id,
            }
            form.parentId = null
          } else if (this.isWorkgroup(this.parentObj)) {
            form.parentId = this.parentObj.id
            delete form.organization
          } else {
            return
          }
          resp = await this.dispatch(WorkgroupController.create, form)
        } else if (this.formType === 'edit') {
          //未知的bug： JSON.stringfy 无法解析this.form
          //this.form结构复杂
          //OrganizationController.update请求参数parent可以为{},children可不传
          if (this.form.parent) {
            this.form.parent = {}
          }
          if (this.form.children) {
            delete this.form.children
          }
          //若父级是工作组，则删除参数中的organization属性  否则报错
          if (this.isWorkgroup(this.parentObj)) {
            delete this.form.organization
          }
          resp = await this.dispatch(WorkgroupController.update, this.form)
        }
        if (!resp.error) {
          this.$message({
            message: '保存成功!',
            type: 'success',
          })
          if (param) {
            this.resetFields()
          } else {
            this.cancel()
          }
          this.$emit('success')
        }
      },
    },
  }
</script>
