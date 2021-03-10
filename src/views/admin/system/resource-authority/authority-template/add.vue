<template>
  <el-dialog :visible.sync="dialogVisible" width="550px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input :maxlength="200" :rows="3" type="textarea" v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit" :loading="sureLoading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { BaseVue, Form, Validator , _} from '@lib'
import { AuthTplController } from '@controller'
import model from './model'
export default {
  name: 'authority-template-add',
  mixins: [BaseVue, Form],
  computed: {
    title() {
      return `${this.formType === 'add' ? '新增' : '编辑'}权限模板`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : 'add'
    }
  },
  data() {
    return {
      formRef: 'authTemplateForm',
      rules: {
        name: [
          { required: true, message: '名称不能为空!' },
          { validator: Validator.name },
          ],
      },
      model: model,
      form: _.cloneDeep(model),
      sureLoading: false
    }
  },
  methods: {
    async validateResolve() {
      this.sureLoading = true
      let resp = {}
      if (this.formType === 'add') {
        resp = await this.dispatch(AuthTplController.create, this.form)
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(AuthTplController.update, this.form)
      }
      if (!resp.error) {
        this.$message({
          message: '保存成功!',
          type: 'success',
        })
        this.sureLoading = false
        this.$emit('success')
        this.cancel()
      }
    },
  }
}
</script>
