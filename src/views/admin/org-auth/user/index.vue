<template>
  <Navigation :routes="routes"></Navigation>
</template>
<script>
import List from './list.vue'

export default {
  components: {},
  data() {
    let routes = [
      {
        title: '用户列表',
        name: 'user-list',
        component: List,
        children: [
          //            {
          //              title: '用户列表',
          //              name: 'user-add',
          //              component: Add,
          //            }
        ],
      },
    ]
    return {
      routes: routes,
    }
  },
}
</script>
