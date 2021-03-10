<template>
  <el-dialog :visible.sync="dialogVisible" width="860px" :title="title">
    <div>
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="24" v-if="formType === 'add' && isRelateUser">
            <el-form-item label="关联已有成员" prop="outDate">
              <el-switch v-model="associateExistMember" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <template v-if="associateExistMember">
            <el-col :span="24">
              <el-form-item label="选择关联成员">
                <UserList ref="userList" type="employees-multiple" @multiple="multiple"></UserList>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <el-row :gutter="20"  v-if="!associateExistMember">
          <el-col :span="12">
            <el-form-item label="人员姓名" prop="employee.name">
              <el-input :maxlength="20" v-model="form.employee.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员代码" prop="employee.code">
              <el-input :maxlength="50" v-model="form.employee.code" :disabled="formType === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="employee.gender">
              <el-radio-group v-model="form.employee.gender">
                <el-radio label="MAN">男</el-radio>
                <el-radio label="WOMAN">女</el-radio>
              </el-radio-group>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="employee.status">
              <el-radio-group v-model="form.employee.status">
                <el-radio label="ENABLED">启用</el-radio>
                <el-radio label="DISABLED">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入职日期" prop="employee.inDate">
              <el-date-picker value-format="yyyy-MM-dd" :picker-options="startOptions" v-model="form.employee.inDate"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="离职日期" prop="employee.outDate">
              <el-date-picker value-format="yyyy-MM-dd" :picker-options="endOptions" v-model="form.employee.outDate"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司邮箱" prop="employee.pEmail">
              <el-input :maxlength="50" v-model="form.employee.pEmail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="!isRelate">
            <el-form-item prop="outDate">
              <el-checkbox v-model="associateUser">关联账户</el-checkbox>
              <el-radio-group class="ml-20" v-model="associateExistUser" :disabled="!associateUser"
                              @change="clearUserData">
                <el-radio :label="false">新建账户</el-radio>
                <el-radio :label="true">已有账户</el-radio>
              </el-radio-group>

            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isRelate||(associateUser&&associateExistUser)">
            <el-form-item prop="user.id" label="关联账户">
              <template>
                <MemberSelect v-model="form.user.id" userBindState="unBinded"
                              @change="getUserObject" :bindState="bindState" @reset="resetUserObject"
                              :isObject="true"></MemberSelect>
              </template>
            </el-form-item>
          </el-col>
          <template v-if="associateUser && !associateExistUser">
              <el-col :span="12">
                <el-form-item label="用户名" prop="user.name">
                  <el-input maxlength="20" v-model="form.user.name" autoCompelete='off'
                            autocompelete='off'></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户密码" prop="user.password">
                  <InputPassword clearable maxlength="20" v-model="form.user.password" autoComplete="new-password"
                                 autocomplete="new-password"></InputPassword>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态" prop="status">
                  <el-radio v-model="form.user.status" label="ENABLED">启用</el-radio>
                  <el-radio v-model="form.user.status" label="DISABLED">禁用</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="描述" prop="description">
                  <el-input :maxlength="200" show-word-limit type="textarea"
                            v-model="form.user.description"></el-input>
                </el-form-item>
              </el-col>
          </template>
        </el-row>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :disabled="btnDisabled" type="primary" v-if="formType === 'add' && isRelateUser" @click="submit(true)">保存并继续

      </el-button>
      <el-button :disabled="btnDisabled" type="primary" @click="submit(false)">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import moment from 'moment'
  import Base from '../base'
  import {BaseVue, Form, Validator, _} from '@lib'
  import model from './model'
  import {EmployeeController, OrganizationController, WorkgroupController, PositionController} from '@controller'
  import UserList from '@/views/admin/org-auth/user/select-list'
  export default {
    name: 'add',
    components: {UserList},

    mixins: [BaseVue, Form, Base],
    props: {
      isRelateUser: {
        type: Boolean,
        default: true,
      },
      dialogType: {
        type: String,
        default: 'employee',
      },
      parentObj: {
        type: Object,
      },
      bindState: {
        type: String,
        default: 'binded'
      }
    },
    computed: {
      title() {
        return this.formType === 'add' ? `新增${this.isEmployee}` : `编辑${this.isEmployee}`
      },
      isEmployee() {
        return this.dialogType === 'member' ? '员工' : '人员'
      },
      formType() {
        return this.form && this.form.employee.id ? 'edit' : 'add'
      },
      btnDisabled(){
        return this.associateExistMember && this.addMember.length === 0 || this.loading
      }
    },
    data() {
      const requireImportRelation = (rule, value, callback) => {
        if (this.importUser.id === null) {
          callback(new Error('关联账户不能为空!'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        addMember: [],
        formRef: 'employeeForm',
        associateUser: false,
        associateExistUser: false,
        associateExistMember: true,
        isRelate: false,
        duringDate: null,
        rules: {
          ['employee.code']: [
            {required: true, message: '人员代码不能为空!'},
            {validator: Validator.code},
          ],
          ['employee.name']: [
            {required: true, message: '人员姓名不能为空!'},
            {validator: Validator.name},
          ],
          ['employee.pEmail']: {validator: Validator.email, trigger: 'blur'},
          ['user.name']: [
            {required: true, message: '用户名不能为空!'},
            {validator: Validator.name},
          ],
          ['user.password']: [
            {required: true, message: '用户密码不能为空!'},
            {validator: Validator.password},
          ],
          ['user.id']: {required: true, trigger: 'change', message: '请选择关联账户!'},
          ['importUser']: {validator: requireImportRelation, required: true, trigger: 'change'},
        },
        startOptions: {
          disabledDate() {
            return false
          },
        },
        endOptions: {
          disabledDate() {
            return false
          },
        },
        model: model,
        form: _.cloneDeep(model),
        importUser: {id: null},
      }
    },
    watch: {

      dialogVisible(val) {
        if (val) {
          this.isRelate = (this.formType === 'edit' && this.form.user.id !== null)
          this.associateExistMember = this.isRelateUser
        }
      },

      'form.employee.outDate': {
        immediate: true,
        handler(val) {
          this.startOptions = {
            disabledDate(time) {
              if (val) {
                return time.getTime() > +val
              } else {
                return false
              }
            },
          }
        },
      },
      'form.employee.inDate': {
        immediate: true,
        handler(val) {
          this.endOptions = {
            disabledDate(time) {
              if (val) {
                return time.getTime() < +val
              } else {
                return false
              }
            },
          }
        },
      },
    },
    methods: {
      multiple(selectItems) {
        this.addMember = selectItems.map(item => {
          return item.id
        })
      },
      async validateResolve(param) {
        let resp = null
        if (this.formType === 'add' && !this.associateExistMember) {
          let form = _.cloneDeep(this.form)
          if (!this.associateUser) {
            delete form.user
          }
          if (this.parentObj) {
            form[`${this.parentObj.nodeType}Id`] = this.parentObj.id
          }
          resp = await this.dispatch(EmployeeController.create, form)
        } else if (this.formType === 'add' && this.associateExistMember) {
          resp = await this.importNewEmployee()
        } else if (this.formType === 'edit') {
          let form = _.cloneDeep(this.form)
          if (!this.associateUser && !this.isRelate) {
            delete form.user
          }
          resp = await this.dispatch(EmployeeController.update, form)
        }
        if (resp && !resp.error) {
          this.$message({
            message: '保存成功!',
            type: 'success',
          })
          if (param) {
            this.afterCancel()
            this.resetFields()
          } else {
            this.cancel()
          }
          this.$emit('success')
        }
      },
      afterCancel() {
        this.associateExistMember = true
        this.associateUser = false
        this.associateExistUser = false
        this.isRelate = false
        this.importUser = {id: null}
        this.duringDate = null
        this.addMember = []
        this.$refs['userList'] && this.$refs['userList'].reset()
      },
      clearUserData() {
        this.form.user = _.cloneDeep(model.user)
      },
      async importNewEmployee() {

        let promises = []
        this.addMember.forEach(async member => {
          let form = {employeeIds: member, id: this.parentObj.id}
          if (this.isOrganization(this.parentObj)) {
            promises.push(this.dispatch(OrganizationController.addOrgEmployees, form))
          } else if (this.isWorkgroup(this.parentObj)) {
            promises.push(this.dispatch(WorkgroupController.addWorkgroupEmployees, form))
          } else if (this.isPosition(this.parentObj)) {
            promises.push(this.dispatch(PositionController.addPositionEmployees, form))
          }
        })
        this.loading = true
        let resp = await Promise.all(promises)
        this.loading = false
        if (resp.some(r => r.error)) {
          return {
            error: '有部分用户关联失败!'
          }
        } else {
          return {
            error: null
          }
        }
      },
      getUserObject(row) {
        this.form.user = row
      },
      resetUserObject() {
        this.form.user = _.cloneDeep(model.user)
      },
      changeDate() {
        this.form.user.startDate = this.duringDate[0]
        this.form.user.endDate = this.duringDate[1]
      },
    },
  }
</script>
