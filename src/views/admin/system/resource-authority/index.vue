<template>
  <el-tabs type="card">
    <el-tab-pane label="权限模板">
      <AuthorityTemplate></AuthorityTemplate>
    </el-tab-pane>
    <el-tab-pane label="资源管理">
      <Resource></Resource>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import AuthorityTemplate from './authority-template'
import Resource from './resource'
export default {
  name: 'resource-authority',
  components: {
    Resource,
    AuthorityTemplate,
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
