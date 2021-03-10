<template>
  <el-tabs v-model="tabName" class="body-no-padding" type="card">
    <el-tab-pane  name="member">
      <div slot="label">
        <svg-icon iconClass="user"></svg-icon>
        平台成员
       </div>
      <Member  v-if="tabName === 'member'" ref="member" :permission="permission"></Member>
    </el-tab-pane>
    <el-tab-pane name="roleConfig" >
      <div slot="label">
        <svg-icon iconClass="role-group"></svg-icon>
        角色设置
       </div>
      <Authorization :offsetHeight="60"></Authorization>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import Member from './member'
  import Authorization from './role'
  import {FuncCode} from '@/permission/index.js'
  export default{
    components: {
      Member,
      Authorization
    },
    data(){
      return {
        tabName: 'member'
      }
    },
    computed:{
      permission(){
        return {
          add: FuncCode.cof_f_member_add,
          del: FuncCode.cof_f_member_del,
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>


</style>
