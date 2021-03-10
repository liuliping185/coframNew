<template>
  <el-dialog :visible.sync="dialogVisible" width="860px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-row :gutter="20">

          <el-col :span="24" v-if="formType === 'add'">
            <el-form-item label="关联已有成员" prop="outDate">
              <el-switch v-model="associateExistMember" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>

          <template v-if="associateExistMember">
            <el-col :span="12">
              <el-form-item label="员工姓名" prop="employee.name">
                <el-select placeholder="请选择">
                  <!--<el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>-->
                </el-select>
              </el-form-item>
            </el-col>
          </template>

          <template v-else>
            <el-col :span="12">
              <el-form-item label="员工姓名" prop="employee.name">
                <el-input maxlength="10" v-model="form.employee.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工代码" prop="employee.code">
                <el-input maxlength="10" v-model="form.employee.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司邮箱" prop="employee.pEmail">
                <el-input :maxlength="50" v-model="form.employee.pEmail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职日期" prop="employee.inDate">
                <el-date-picker value-format="yyyy-MM-dd" maxlength="10" v-model="form.employee.inDate"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="employee.state">
                <el-input maxlength="10" v-model="form.employee.state"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="离职日期" prop="employee.outDate">
                <el-date-picker value-format="yyyy-MM-dd" maxlength="10" v-model="form.employee.outDate"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否关联账户" prop="outDate">
                <el-switch v-model="associateUser" :active-value="true" :inactive-value="false"></el-switch>
              </el-form-item>
            </el-col>
            <template v-if="associateUser">
              <el-col :span="24">
                <el-form-item label="关联已有账户" prop="outDate">
                  <el-switch v-model="associateExistUser" :active-value="true" :inactive-value="false"></el-switch>
                </el-form-item>
              </el-col>
              <template v-if="associateExistUser">
                <el-col :span="24">
                  <el-form-item label="选择关联账号" prop="outDate">
                    <el-input maxlength="10" v-model="form.state"></el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="12">
                  <el-form-item label="用户账号" prop="outDate">
                    <el-input maxlength="10" v-model="form.state"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户名称" prop="employee.name">
                    <el-input :disabled="true" maxlength="10" v-model="form.employee.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="用户密码" prop="outDate">
                    <el-input maxlength="10" v-model="form.state"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="密码失效时间" prop="outDate">
                    <el-date-picker maxlength="10" v-model="form.outDate"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有效开始日期" prop="user.startDate">
                    <el-date-picker maxlength="10" v-model="form.user.startDate"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="有效截止日期" prop="user.endDate">
                    <el-date-picker maxlength="10" v-model="form.user.endDate"></el-date-picker>
                  </el-form-item>
                </el-col>
              </template>
            </template>
          </template>


        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button
        type="primary"
        v-if="formType === 'add'"
        @click="submit(true)"
        v-loading="loading"
      >保存并继续



      </el-button
      >
      <el-button type="primary" @click="submit(false)"
                 :loading="loading"
      >保存



      </el-button
      >
    </div>
  </el-dialog>
</template>
<script>
  import moment from 'moment'
  import {BaseVue, Form, Validator, _} from '@lib'
  import model from './model'

  import {EmployeeController} from '@controller'

  export default {
    name: 'member-add',
    props: {
      parentObj: {},
      formData: {},
    },
    computed: {
      loading(){
        return this.EmployeeController.create.loading || this.EmployeeController.update.loading
      },
      title() {
        return `${this.formType === 'add' ? '新增' : '编辑'}员工`
      },
      formType() {
        return this.form && this.form.employee.id ? 'edit' : 'add'
      },
    },
    mixins: [BaseVue, Form],
    data() {
      return {
        associateUser: false,
        associateExistUser: true,
        associateExistMember: false,
        formRef: 'domainForm',
        rules: {
          ['employee.name']: [
            {required: true, message: '员工姓名不能为空!'},
            {validator: Validator.name}
          ],
          ['employee.code']: [
            {required: true, message: '员工代码不能为空!'},
            {validator: Validator.code}
          ],
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
          if (this.parentObj) {
            this.form[`${this.parentObj.type}Id`] = this.parentObj.id
          }
          let form = _.cloneDeep(this.form)
          if (!this.associateUser) {
            delete form.user
          }
          resp = await this.dispatch(EmployeeController.create, form)
        } else if (this.formType === 'edit') {

          resp = await this.dispatch(EmployeeController.update, this.form)
        }
        if (!resp.error) {
          this.$message({
            message: '保存成功!',
            type: 'success',
          })
          if (param) {
            this.associateUser = false
            this.associateExistUser = false
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
