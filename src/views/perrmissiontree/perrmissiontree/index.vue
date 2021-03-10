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
        title: '设备树管理',
        name: 'org-position',
        description: '描述后期补充',
        component: Main,
      },
    ]
    return {
      routes: routes,
    }
  },
}
</script>
