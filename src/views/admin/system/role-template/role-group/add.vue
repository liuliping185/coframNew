<template>
  <el-dialog :visible.sync="dialogVisible" width="550px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input clearable :maxlength="20" v-model="form.name"> </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input :maxlength="200" type="textarea" v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import _ from 'lodash'
  import { BaseVue, Form, Validator } from '@lib'
  import model from './model'

  import { RoleTplGroupController } from '@controller'
  export default {
    components: {},
    props: {
      roleTplId: String,
    },
    computed: {
      title() {
        return `${this.formType === 'add' ? '新增角色模板组' : '编辑角色模板组'}`
      },
      formType() {
        return this.form && this.form.id ? 'edit' : 'add'
      },
    },
    mixins: [BaseVue, Form],
    data() {
      return {
        formRef: 'RoleForm',
        rules: {
          name: [
            { required: true, message: '名称不能为空!' },
            { validator: Validator.name },
          ],
        },
        model: model,
        form: _.cloneDeep(model),
      }
    },
    watch: {},
    methods: {
      async validateResolve() {
        let resp = {}
        if (this.formType === 'add') {
          resp = await this.dispatch(RoleTplGroupController.create, {
            ...this.form,
          })
        } else if (this.formType === 'edit') {
          resp = await this.dispatch(RoleTplGroupController.update, this.form)
        }
        if (!resp.error) {
          this.$message({
            message: '保存成功!',
            type: 'success',
          })
          this.$emit('success')
          this.cancel()
        }
      },
    },
  }
</script>
