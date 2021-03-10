<template>
  <div>
    <el-row class="top-block">
      <el-col :span="6">
        <SearchInput v-model="query.userName" placeholder="用户名检索..." @submit="refresh"></SearchInput>
      </el-col>
      <el-col :span="18">
        <div class="text-right">
          <el-button type="primary" @click="openAdd" icon="el-icon-plus" v-permission="permission.add">新增成员</el-button>
          <el-button type="primary" @click="update" v-permission="permission.update">保存变更</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="mt-5 p-5">
      <el-checkbox-group v-model="result">
        <el-table stripe border :data="tableData"
                  v-loading="RoleController.pagingByCriteria.loading||MemberController.pagingMembers.loading"
                  height="calc(100vh - 228px)">
          <no-data slot="empty"></no-data>
          <el-table-column width="200px" fixed label="用户名" prop="user.name"></el-table-column>
          <el-table-column :label="r.name" v-for="r in roles" :key="r.id">
            <template slot-scope="scope">
              <el-checkbox :label="`${scope.row.user.id}#${r.id}`">
                <span></span>
              </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="remove(scope.row)" v-permission="permission.del">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>
    </div>
    <MemberAdd :dialogVisible.sync="dialogVisible" :keyPayload="keyPayload" @success="refresh"></MemberAdd>
  </div>
</template>

<script>
  import {BaseVue, List} from '@lib'
  import {FuncCode} from '@/permission/index.js'
  import MemberAdd from './add'
  import {MemberController, RoleController} from '@controller'
  import _ from 'lodash'

  export default {
    name: 'member-index',
    mixins: [BaseVue, List],
    components: {MemberAdd},
    props: {
      permission: {
        add: FuncCode.cof_f_role_bind,
        update: FuncCode.cof_f_role_bind,
        del: FuncCode.cof_f_role_unbind,
      },
      keyPayload: {
        type: Object,
        default: {
          ownerId: 'platform',
          ownerType: 'platform',
          memberState: 'notMember'
        }
      },
    },
    async mounted() {
      this.refresh()
    },
    data() {
      return {
        result: [],
        roles: [],
        tableData: [],
        members: [],
        query: {
          userName: null,
          limit: 9999
        }
      }
    },

    methods: {
      async refresh(){
        await this.loadRoles()
        await this.loadMembers()

        this.tableData = this.members.map(m => {
          let row = {
            user: m.user,
          }
          this.roles.forEach(r => {
            row[`${m.user.id}#${r.id}`] = m.roles.some(mr => mr.id === r.id)
          })
          return row
        })

        this.result = _.flatten(this.members.map(m => {
          return m.roles.map(r => {
            return `${m.user.id}#${r.id}`
          })
        }))
        this.oldResult = _.cloneDeep(this.result)
      },

      async loadMembers() {
        let resp = await this.dispatch(MemberController.pagingMembers, {
          ...this.keyPayload,
          ...this.query
        })
        if (!resp.error) {
          this.members = _.chain(resp.data.content).uniqBy(u => {
            return u.user.id
          }).sort(u => {
            return u.user.name
          }).value()
        }
      },


      async loadRoles() {
        let resp = await this.dispatch(RoleController.pagingByCriteria, {
          ...this.keyPayload,
          ...this.query
        })
        if (!resp.error) {
          this.roles = resp.data.content
        }
      },

      async removeResolve(row) {
        let resp = await this.dispatch(MemberController.deleteMembers, [{
          ...this.keyPayload,
          ...row
        }])
        if (!resp.error) {
          this.$message({
            message: '删除成功!',
            type: 'success',
          })
          this.refresh()
        }
      },
      update() {
        let promisesAdd = [], promisesRemove = []
        let addData = _.difference(this.result, this.oldResult)
        let removeData = _.difference(this.oldResult, this.result)

        addData = this.wrapData(addData)
        removeData = this.wrapData(removeData)

        if (addData.length > 0) {
          promisesAdd = addData.map(item => {
            return this.dispatch(RoleController.bindRoleToUsers,
              {...item},
            )
          })
        }
        if (removeData.length > 0) {
          promisesRemove = removeData.map(item => {
              return this.dispatch(RoleController.unbindRoleToUsers,
                {...item},
              )
            }
          )
        }

        let promises = promisesAdd.concat(promisesRemove)
        Promise.all(promises).then((resp) => {
          if (!resp.error) {
            this.$message({
              message: '更新成功!',
              type: 'success',
            })
            this.refresh()
          }
        })
      },

      wrapData(data){
        return _.chain(data).groupBy((g) => {
          return g.split('#')[1]
        }).map((m, key) => {
          return {
            id: key,
            userIds: m.map(mm => mm.split('#')[0]).join(','),
          }
        }).value()
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
