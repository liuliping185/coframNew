<template>
  <el-dialog :visible.sync="dialogVisible" width="550px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="资源名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="资源编码" prop="code">
              <el-input :maxlength="50" v-model="form.code" :disabled="formType === 'edit'"></el-input>
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
import { MenuController, FunctionController, ResGroupController } from '@controller'
export default {
  name: 'resource-add',
  mixins: [BaseVue, Form],
  components: {},
  computed: {
    title() {
      return `${this.formType === 'add' ? '新增' : '编辑'}资源`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : 'add'
    },
  },
  props: {
    groupId: String,
    type: String,
  },
  data() {
    return {
      formRef: 'roleGroupForm',
      rules: {
        name: [
          { required: true, message: '资源名称不能为空!' },
          { validator: Validator.name },
        ],
        code: [
          { required: true, message: '资源编码不能为空!' },
          { validator: Validator.code },
        ],
      },
      model: model,
      form: _.cloneDeep(model),
    }
  },
  methods: {
    async validateResolve() {
      let resp = {}
      if (this.formType === 'add') {
        resp = await this.dispatch(ResGroupController.create, { ...this.form })
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(ResGroupController.update, { ...this.form })
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
    async createGroup(val) {
      let resp =  await this.dispatch(ResGroupController.create, {
        name: '功能',
        code: `${this.form.code}-CATEGORY-FUNCTION`,
        resType: 'FUNCTION',
        type: 'CATEGORY',
        tenantId: 'default',
        parentId: val.id,
      })
      if (!resp.error) {
        resp = await this.dispatch(ResGroupController.create, {
          name: '菜单',
          code: `${this.form.code}-CATEGORY-MENU`,
          resType: 'MENU',
          type: 'CATEGORY',
          tenantId: 'default',
          parentId: val.id,
        })
        if (!resp.error) {
          this.$message({
            message: '新增成功!',
            type: 'success',
          })
          this.$emit('success')
          this.cancel()
        }
      }
    },
  },
}
</script>

<style scoped></style>
