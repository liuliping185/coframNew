<template>
  <el-dialog :visible.sync="dialogVisible" width="880px" title="新增成员">
    <el-form :ref="formRef" :rules="rules" :model="relationRole" label-width="85px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="成员角色" prop="id">
            <roleSelect v-model="relationRole.id" :keyPayload="keyPayload" @change="changeRole"></roleSelect>
          </el-form-item>
        </el-col> <el-col :span="24">
          <el-form-item label="成员">
            <UserList v-if="dialogVisible" ref="userList" :keyPayload="keyPayload" type="user-multiple" @multiple="multiple"></UserList>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import _ from 'lodash'
  import { BaseVue, Form } from '@lib'
  import { MemberController } from '@controller'
  import roleSelect from './select'
  import UserList from '@/views/admin/org-auth/user/select-list'

  export default {
    name: 'member-add',
    mixins: [BaseVue, Form],
    components: {
      UserList,
      roleSelect,
    },
    props: {
      keyPayload: {
        type: Object,
        default: {
          ownerId: 'platform',
          ownerType: 'platform',
          memberState: 'notMember'
        }
      }
    },
    data() {
      return {
        formRef: 'RoleForm',
        relationRole: { id: null },
        addLoading: false,
        addMember: [],
        rules: {
          id: [
            { required: true,message:'请选择关联角色', trigger: 'change' },
          ],
        },
      }
    },
    computed: {
      isDisabled() {
        return !this.addMember.length > 0
      },
    },
    methods: {
      multiple(selectItems) {
        this.addMember = selectItems.map(item => {
          let formData = {
            ...this.keyPayload,
            user: item,
          }
          return { ...formData }
        })
      },

      async validateResolve() {
        let resp = {}
        this.addMember.forEach(item => {
          item.roles = [this.relationRole]
        })
        resp = await this.dispatch(MemberController.addMembers, this.addMember)
        if (!resp.error) {
          this.$message({
            message: '新增成功!',
            type: 'success',
          })
          this.$emit('success')
          this.cancel()
        }
      },

      afterCancel() {
        this.$refs.userList.reset()
        this.relationRole = { id: null }
      },
      changeRole(val) {
        this.relationRole = _.cloneDeep(val)
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
