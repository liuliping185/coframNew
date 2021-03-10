<template>
  <el-dialog :visible.sync="dialogVisible" width="800px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24" v-if="parentType">
            <el-form-item label="父类型">
              {{ parentType.name }}

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型编码" prop="code">
              <el-input clearable :maxlength="50" v-model="form.code" :disabled="formType === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型名称" prop="name">
              <el-input clearable :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortNo">
              <el-input-number :precision="0" v-model="form.sortNo"></el-input-number>
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
      <el-button type="primary" @click="submit(true)" v-if="formType === 'add'" :loading="loading">保存并继续</el-button>
      <el-button type="primary" @click="submit(false)" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {BaseVue, Form, Validator, _} from '@lib'
  import model from './model'

  import {DictTypeController} from '@controller'
  export default {
    props: {
      formData: {},
      parentType: {},
    },
    computed: {
      loading(){
        return this.DictTypeController.create.loading || this.DictTypeController.update.loading
      },
      title() {
        return `${this.formType === 'add' ? '新增' : '编辑'}字典类型`
      },
      formType() {
        return this.form && this.form.id ? 'edit' : 'add'
      },
    },
    mixins: [BaseVue, Form],
    data() {
      return {
        formRef: 'dictTypeForm',
        rules: {
          name: [
            {required: true, message: '类型名称不能为空!'},
            {validator: Validator.name}
          ],
          code: [
            {required: true, message: '类型编码不能为空!'},
            {validator: Validator.code}
          ],
        },
        model: model,
        form: _.cloneDeep(model),
      }
    },
    watch: {},
    methods: {
      afterCancel() {
        this.$emit('update:parentType', null)
      },
      async validateResolve(goon) {
        let resp = {}
        if (this.formType === 'add') {
          let form = _.cloneDeep(this.form)
          if (this.parentType) {
            form.parentId = this.parentType.id
          }
          resp = await this.dispatch(DictTypeController.create, form)
        } else if (this.formType === 'edit') {
          resp = await this.dispatch(DictTypeController.update, {
            ...this.form,
            parent: null,
            children: null,
          })
        }
        if (!resp.error) {
          this.$message({
            message: '保存成功!',
            type: 'success',
          })
          this.$emit('success', resp.data)
          if (goon) {
            this.form.name = ''
            this.form.code = ''
            this.form.description = ''
            this.form.sortNo = (this.form.sortNo || 0) + 1
            this.$nextTick(() => {
              this.$refs[this.formRef].clearValidate()
            })
          } else {
            this.cancel()
          }
        }
      },
    },
  }
</script>
