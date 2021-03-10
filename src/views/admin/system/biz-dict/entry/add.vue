<template>
  <el-dialog :visible.sync="dialogVisible" width="880px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item v-if="oldParentDict || parentEntry" label="字典类型" prop="dictType.id">
              <DictTypeSelect clearable :parentDict="oldParentDict || parentEntry.dictType"
                              v-model="form.dictType.id"></DictTypeSelect>
            </el-form-item>
            <el-form-item v-else label="字典类型">{{ dictType.name }}</el-form-item>
          </el-col>
          <el-col :span="12" v-if="parentEntry">
            <el-form-item label="父字典项">
              {{ parentEntry.name }}

            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典项编码" prop="code">
              <el-input clearable maxlength="50" v-model="form.code" :disabled="formType === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典项名称" prop="name">
              <el-input clearable maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortNo">
              <el-input-number :precision="0" v-model="form.sortNo"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input maxlength="200" type="textarea" v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(true)" v-if="formType === 'add'" :loaidng="loading">保存并继续</el-button>
      <el-button type="primary" @click="submit(false)" :loaidng="loading">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {BaseVue, Form, Validator, _} from '@lib'
  import model from './model'
  import DictTypeSelect from '../type/select.vue'

  import {DictEntryController} from '@controller'
  export default {
    components: {DictTypeSelect},
    props: {
      formData: {},
      parentEntry: {},
      dictType: {},
    },
    computed: {
        loading(){
          return this.DictEntryController.create.loading || this.DictEntryController.update.loading
        },
      oldParentDict() {
        if (this.form.parent) {
          return {id: this.form.parent.dictType.id}
        } else {
          return null
        }
      },
      title() {
        return `${this.formType === 'add' ? '新增' : '编辑'}字典项`
      },
      formType() {
        return this.form && this.form.id ? 'edit' : 'add'
      },
    },
    mixins: [BaseVue, Form],
    data() {
      return {
        formRef: 'dictEntryForm',
        rules: {
          name: [
            {required: true, message: '类型名称不能为空!'},
            {validator: Validator.name},
          ],
          code: [
            {required: true, message: '类型编码不能为空!'},
            {validator: Validator.code},
          ],
          ['dictType.id']: {required: true, message: '字典类型不能为空!'},
        },
        model: model,
        form: _.cloneDeep(model),
      }
    },
    watch: {},
    methods: {
      afterCancel() {
        this.$emit('update:parentEntry', null)
      },
      async validateResolve(goon) {
        let resp = {}
        if (this.formType === 'add') {
          let form = _.cloneDeep(this.form)

          if (this.parentEntry) {
            form.parentId = this.parentEntry.id
          } else {
            form.dictType = {
              id: this.dictType.id,
            }
          }

          resp = await this.dispatch(DictEntryController.create, form)
        } else if (this.formType === 'edit') {

          let form = _.cloneDeep(this.form)
          delete form.parent
          delete form.children
          resp = await this.dispatch(DictEntryController.update, form)
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
