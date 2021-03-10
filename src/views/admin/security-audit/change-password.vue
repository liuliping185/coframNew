<template>
  <el-dialog title="修改密码" :visible.sync="value" :width="'460px'" top="5vh">
    <el-form v-loading="loading" labelWidth="100px" :rules="rules" :model="form" ref="form">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" autocomplete="new-password" autoComplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" autocomplete="new-password" autoComplete="new-password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="form.confirmPassword" autocomplete="new-password" autoComplete="new-password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="UserController.modifyPassword.loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import _ from 'lodash'
  import {BaseVue} from '@lib'
  import {UserController} from '@controller'

  const form = {userName: null, oldPassword: null, newPassword: null}

  export default {
    name: 'change-password',
    mixins: [BaseVue],
    components: {},
    props: {
      value: {
        default: false,
      },
    },

    data() {
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback()
        }
      }

      return {
        form: {...form},
        loading: false,
        rules: {
          oldPassword: [
            {required: true, trigger: 'change', message: '请输入原密码!'},
            //          { min: 8, max: 20, trigger: 'change', message: '密码为8-20位!' },
          ],
          newPassword: [
            {required: true, trigger: 'change', message: '请输入新密码!'},
            {min: 6, max: 20, trigger: 'change', message: '密码为6-20位!'},
          ],
          confirmPassword: [
            {required: true, trigger: 'change', message: '请输入确认密码!'},
            {min: 6, max: 20, trigger: 'change', message: '密码为6-20位!'},
            {trigger: 'blur', validator: validatePassCheck},
          ],
        },
      }
    },
    mounted() {
      this.loadData()
    },
    watch: {
      value(val) {
        if (!val) {
          this.$emit('input', false)
          this.form = {...form}
          this.$refs['form'].resetFields()
        } else {
          this.loadData()
        }
      },
    },
    methods: {
      loadData() {
        this.form.userName = this.userInfo.userName
      },
      cancel() {
        this.$emit('input', false)
      },
      submit() {
        this.$refs['form'].validate(async valid => {
          if (valid) {
            let resp = await this.dispatch(UserController.modifyPassword, {
              id: this.userInfo.userId,
              payload:{
                ...this.form,
              }
            })
            if (!resp.error) {
              this.$message({message: '修改密码成功!', type: 'success'})
              this.cancel()
            }
          }
        })
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
