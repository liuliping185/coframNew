<template>
  <Navigation :routes="routes"></Navigation>
</template>
<script>
import Main from './main.vue'

export default {
  components: {},
  data() {
    let routes = [
      {
        title: '机构管理',
        name: 'org-position',
        description: '机构指企业的组织机构，一般包含机构、岗位、工作组、员工等信息',
        component: Main,
      },
    ]
    return {
      routes: routes,
    }
  },
}
</script>
