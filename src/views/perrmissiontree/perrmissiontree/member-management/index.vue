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
          title: '人员管理',
          name: 'org-position',
          description: '',
          component: List,
          children: [
            //            {
            //              title: '调用链路详情',
            //              name: 'call-details',
            //              component: Details,
            //            },
          ],
        },
      ]
      return {
        routes: routes,
      }
    },
  }
</script>
