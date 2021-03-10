<template>
  <el-dialog :visible.sync="dialogVisible" width="550px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="模块编码" prop="code">
              <!--<el-input :maxlength="50" v-model="form.code" ></el-input>-->
              <el-input :maxlength="50" v-model="form.code" :disabled="formType === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模块名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序" prop="sortNo">
              <el-input-number maxlength="10" v-model="form.sortNo"></el-input-number>
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
import { BaseVue, Form, Validator, _ } from '@lib'
import model from './model'
import { ResGroupController } from '@controller'
export default {
  name: 'permission-group-add',
  mixins: [BaseVue, Form],
  components: {},
  computed: {
    title() {
      return `${this.formType === 'add' ? '新增' : '编辑'}模块`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : 'add'
    },
  },
  props: {
    parentId: String,
    type: String,
  },
  data() {
    const validateSortNo = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(this.form.sortNo)) {
        callback(new Error('序号只能由数字组成'))
      } else {
        callback()
      }
    }
    return {
      formRef: 'roleGroupForm',
      rules: {
        name: [
          { required: true, message: '模块名称不能为空!' },
          { validator: Validator.name },
        ],
        sortNo: [{ required: true, message: '排序序号不能为空!' }, { validator: Validator.number, trigger: 'blur' }],
        code: [
          { required: true, message: '模块编码不能为空!' },
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
      this.form.parentId = this.parentId
      if (this.formType === 'add') {
        resp = await this.dispatch(ResGroupController.create, { ...this.form, resType: this.type, type: 'MODULE' })
      } else if (this.formType === 'edit') {
        resp = await this.dispatch(ResGroupController.update, { ...this.form })
      }
      if (!resp.error) {
        this.$message({
          message: '保存成功!',
          type: 'success',
        })
        this.$emit('success', this.form)
        this.cancel()
      }
    },
  },
}
</script>

<style scoped></style>
