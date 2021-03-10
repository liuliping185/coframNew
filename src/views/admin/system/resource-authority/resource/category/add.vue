<template>
  <el-dialog :visible.sync="dialogVisible" width="550px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="20" v-if="formType === 'add'">
          <el-col :span="24">
            <el-form-item label="资源名称" prop="resType">
              <el-select placeholder="请选择" v-model="form.resType">
                <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="资源编码" prop="code">
              <el-input :maxlength="50" :disabled="formType === 'edit'" v-model="form.code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="排序" prop="sortNo">
              <el-input-number :min="0" maxlength="10" v-model="form.sortNo"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(false)">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import { BaseVue, Form, Validator } from '@lib'
import model from './model'
import { ResGroupController } from '@controller'

export default {
  name: 'category-add',
  mixins: [BaseVue, Form],
  components: {},
  computed: {
    title() {
      return `${this.formType === 'add' ? '新增' : '编辑'}资源模块`
    },
    formType() {
      return this.form && this.form.id ? 'edit' : 'add'
    },
    filterOptions() {
      if (this.filterData.length === 0) {
        return this.options
      } else if (this.filterData.length === 1) {
        let filteredData = this.options.filter(item => {
          if (item.value !== this.filterData[0].resType) {
            return item
          }
        })
        return filteredData
      }
    },
  },
  props: {
    parentId: String,
    type: String,
    filterData: {
      default: [],
    },
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
        resType: { required: true, trigger: 'change', message: '请选择新增类型' },
        sortNo: [{ required: true, message: '排序序号不能为空!' }, { validator: Validator.number, trigger: 'blur' }],
        code: [
          { required: true, message: '资源编码不能为空!' },
          { validator: Validator.code },
        ],
      },
      model: model,
      form: _.cloneDeep(model),
      options: [{ value: 'MENU', label: '菜单' }, { value: 'FUNCTION', label: '功能' }],
    }
  },
  methods: {
    async validateResolve(type) {
      let resp = {}
      this.form.parentId = this.parentId
      if (this.formType === 'add') {
        this.form.name = this.form.resType === 'MENU' ? '菜单' : '功能'
        resp = await this.dispatch(ResGroupController.create, { ...this.form })
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
