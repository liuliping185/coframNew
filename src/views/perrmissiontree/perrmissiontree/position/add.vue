<template>
  <el-dialog :visible.sync="dialogVisible" width="600px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="岗位代码" prop="code">
              <el-input :maxlength="50" v-model="form.code" :disabled="formType === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="岗位名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>

<!--          <el-col :span="12">-->
<!--            <el-form-item label="岗位类型" prop="type">-->
<!--              <el-input maxlength="10" v-model="form.type"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" :maxlength="200" v-model="form.description"></el-input>
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
        v-loading="PositionController.create.loading || PositionController.update.loading"
        >保存并继续</el-button
      >
      <el-button type="primary" @click="submit(false)" :loading="PositionController.create.loading || PositionController.update.loading"
        >保存</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { BaseVue, Form, Validator, _ } from '@lib'
import model from './model'
import Base from '../base'

import { PositionController } from '@controller'
export default {
  name: 'position-add',
  props: {
    parentObj: {},
  },
  computed: {
    title() {
      return `${this.formType === 'add' ? '新增' : '编辑'}岗位`
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
          { required: true, message: '岗位名称不能为空!' },
          { validator: Validator.name },
        ],
        code: [
          { required: true, message: '岗位代码不能为空!' },
          { validator: Validator.code },
        ],
        type: { required: true, message: '岗位类型不能为空!' }
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
        if (this.isOrganization(this.parentObj)) {
          this.form.organization = {
            id: this.parentObj.id,
          }
        }
        resp = await this.dispatch(PositionController.create, this.form)
      } else if (this.formType === 'edit') {
        //未知的bug： JSON.stringfy 无法解析this.form
        //this.form结构复杂
        //PositionController.update请求参数parent可以为{}
        if(this.form.parent) {
          this.form.parent = {}
        }
        resp = await this.dispatch(PositionController.update, this.form)
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
