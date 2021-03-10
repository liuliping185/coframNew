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
        title: '业务字典',
        name: 'biz-dict',
        description: '字典指业务化的枚举类型数据项列表。如：男、女；年、月、日等。',
        component: Main,

      },
    ]
    return {
      routes: routes,
    }
  },
}
</script>
