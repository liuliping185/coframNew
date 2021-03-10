<template>
  <div>
    <el-tree
      v-if="authTemplates"
      node-key="id"
      :data="authTemplates"
      :props="defaultProps"
      :highlight-current="true"
      :expand-on-click-node="false"
      @node-click="nodeClick"
    >
      <div style="width:100%;" class="custom-tree-node" slot-scope="{ node, data }">
        <el-row style="width:100%;" type="flex">
          <el-col :span="14" style="padding-top:8px;">
            <span>{{ node.label }}</span>
          </el-col>
          <el-col :span="10" class="text-right">
            <el-button type="text" icon="el-icon-edit" @click.stop="openEdit(data)"></el-button>
            <el-button type="text" icon="el-icon-delete" @click.stop="remove(data)"></el-button>
          </el-col>
        </el-row>
      </div>
    </el-tree>
  </div>
</template>
<script>
import { BaseVue, List } from '@lib'
import { AuthTplController } from '@controller'
export default {
  name: 'authority-template-tree',
  mixins: [BaseVue, List],
  props: {
    authTemplates: {},
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
      }
    }
  },
  methods: {
    nodeClick(data) {
      this.$emit('chooseNode', data)
    },
    search() {
      this.$emit('search')
    },
    async removeResolve(data) {
      let resp = await this.dispatch(AuthTplController.deleteByIds, {
        ids: data.id,
      })
      if (!resp.error) {
        this.$emit('chooseNode', null)
        this.$message({
          message: '删除成功!',
          type: 'success',
        })
        return resp
      }
    },
    openEdit(data) {
      this.$emit('openEdit', data)
    }
  }
}
</script>
