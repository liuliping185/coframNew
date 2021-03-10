<template>
  <div id="app">
    <transition name="el-fade-in-linear" leave-to-class="leave-to-class">
      <router-view v-if="isRouterAlive"> </router-view>
    </transition>
  </div>
</template>

<script>
import store from '@/utils/sessionStore'

export default {
  name: 'App', 
  provide() {
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
  },
  created() {
    let platform = store.get('platform')
    if (platform) {
      this.$store.dispatch('setPlatform', platform)
    }
  },
}
</script>

<style lang="scss" scoped>
.leave-to-class {
  display: none;
}
</style>
