<template>
  <el-dialog :visible.sync="dialogVisible" width="600px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="组织机构树名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="组织机构树代码" prop="code">
              <el-input :disabled="form.id" :maxlength="50" v-model="form.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="是否主机构树" prop="main">
              <el-switch :disabled="form.id" v-model="form.main"> </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit" :loading="DimensionController.create.loading || DimensionController.update.loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from 'lodash'
import { BaseVue, Form, Validator } from '@lib'
import model from './model'

import { DimensionController } from '@controller'
export default {
  name: 'dimension-add',
  computed: {
    title() {
      return `${this.formType === 'add' ? '新增' : '编辑'}组织机构树`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : 'add'
    },
  },
  mixins: [BaseVue, Form],
  data() {
    return {
      formRef: 'domainForm',
      rules: {
        name: [
          { required: true, message: '名称不能为空!' },
          { validator: Validator.name },
        ],
        code: [
          { required: true, message: '代码不能为空!' },
          { validator: Validator.code }
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
        resp = await this.dispatch(DimensionController.create, this.form)
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(DimensionController.update, this.form)
      }
      if (!resp.error) {
        this.$message({
          message: '保存成功!',
          type: 'success',
        })
        this.$emit('success', resp.data)
        this.cancel()
      }
    },
  },
}
</script>
