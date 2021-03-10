<template>
  <el-dialog :visible.sync="dialogVisible" width="880px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="name">
              <el-input clearable :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formType === 'add'">
            <el-form-item label="用户密码" prop="password">
              <InputPassword clearable :maxlength="20" v-model="form.password"></InputPassword>
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
      <el-button type="primary" @click="submit" :loading="UserController.create.loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { BaseVue, Form, Validator , _} from '@lib'
import model from './model'
import { UserController } from '@controller'
export default {
  name: 'user-add',
  props: {
    userId: {},
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新增用户' : '编辑用户'}`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : 'add'
    },
  },
  mixins: [BaseVue, Form],
  data() {
    return {
      formRef: 'userForm',
      rules: {
        name: [
          { required: true, message: '用户名称不能为空!' },
          { validator: Validator.name },
        ],
        password: [
          { required: true, message: '密码不能为空!' },
          { validator: Validator.password },
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
        resp = await this.dispatch(UserController.create, this.form)
      } else if (this.formType === 'edit') {
        this.form.status = null
        resp = await this.dispatch(UserController.modifyUser, this.form)
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
