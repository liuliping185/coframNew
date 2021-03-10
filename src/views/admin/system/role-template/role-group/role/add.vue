<template>
  <el-dialog :visible.sync="dialogVisible" width="550px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20" v-if="formType === 'add'">
          <el-col :span="24">
            <el-form-item label="角色模板组">
              {{groupName}}

            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限模板" prop="authTpl">
              <AuthSelect v-model="form.authTpl"></AuthSelect>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {BaseVue, Form, Validator, _} from '@lib'
  import model from './model'
  import AuthSelect from './authtpl-select'
  import {RoleTplController} from '@controller'
  export default {
    name: 'role-template-group-add',
    mixins: [BaseVue, Form],
    components: {AuthSelect},
    computed: {
      title() {
        return `${this.formType === 'add' ? '新增' : '编辑'}角色模板`
      },
      formType() {
        return !this.form.id ? 'add' : 'edit'
      },
      loading(){
          return this.RoleTplController.create.loading || this.RoleTplController.update.loading
      }
    },
    props: {
      groupId: null,
      groupName: null,
    },
    data() {
      return {
        formRef: 'roleGroupForm',
        rules: {
          name: [
            {required: true, message: '名称不能为空!'},
            {validator: Validator.name},
          ],
          authTpl: {required: true, trigger: 'change', message: '请选择权限模板'},
        },
        model: model,
        form: _.cloneDeep(model),
      }
    },
    methods: {
      async validateResolve() {
        let resp = {}
        if (this.formType === 'add') {
          this.form.tplGroup.id = this.groupId
          resp = await this.dispatch(RoleTplController.create, this.form)
        } else if (this.formType === 'edit') {
          this.form.authTpl = null
          resp = await this.dispatch(RoleTplController.update, this.form)
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

<style scoped></style>
