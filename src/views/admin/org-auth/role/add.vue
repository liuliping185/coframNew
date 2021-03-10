<template>
  <el-dialog :visible.sync="dialogVisible" width="880px" :title="title">
    <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12" v-if="!form.id">
          <el-form-item label="角色模板" prop="roleTpl.id">
            <roleTplSelect clearable filterable style="width: 100%;" ref="roleTplCasacder" :groupId="groupId"
                           v-model="form.roleTpl.id"></roleTplSelect>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色名称" prop="name">
            <el-input clearable :maxlength="20" v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色编码" prop="code">
            <el-input clearable :maxlength="50" v-model="form.code" :disabled="formType === 'edit'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input :maxlength="200" type="textarea" v-model="form.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="submit" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {BaseVue, Form, Validator, _} from '@lib'
  import {RoleController} from '@controller'
  import model from './model'
  import roleTplSelect from './select'

  export default {
    name: 'role-add',
    mixins: [BaseVue, Form],
    components: {roleTplSelect},
    computed: {
      title() {
        return `${this.formType === 'add' ? '新增' : '编辑'}角色`
      },
      formType() {
        return this.form && this.form.id ? 'edit' : 'add'
      },
      loading(){
          return this.RoleController.create.loading || this.RoleController.update.loading
      }
    },
    props: {
      keyPayload: {
        type: Object,
        default: {
          ownerId: 'platform',
          ownerType: 'platform',
        }
      },
      groupId:{
          default: null
      }
    },
    data() {
      return {
        formRef: 'RoleForm',
        rules: {
          ['roleTpl.id']: [
            {required: true, message: '请选择角色模版!'},
          ],
          code: [
            {required: true, message: '角色编码不能为空!'},
            {validator: Validator.code},
          ],
          name: [
            {required: true, message: '角色名称不能为空!'},
            {validator: Validator.name},
          ],
        },
        model: model,
        form: _.cloneDeep(model),
      }
    },
    mounted() {
    },
    methods: {
      async validateResolve() {
        let resp = {}
        Object.assign(this.form, this.keyPayload)
        if (this.formType === 'add') {
          resp = await this.dispatch(RoleController.create, {
            ...this.form,
          })
        } else if (this.formType === 'edit') {
          let role = _.cloneDeep(this.form)
          delete role.roleTpl
          resp = await this.dispatch(RoleController.update, role)
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
      afterCancel() {
        this.$refs['roleTplCasacder'] && this.$refs['roleTplCasacder'].reset()
      }
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
