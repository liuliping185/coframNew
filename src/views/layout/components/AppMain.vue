<template>
  <section class="app-main" id="app-main">
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <keep-alive :include="cachedViews"> <router-view :key="key"></router-view> </keep-alive>
    <!-- </transition> -->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      console.log("======cachedViews=======",this.$store.state.tagsView.cachedViews);
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      console.log("=====fullPath======",this.$route.fullPath)
      return this.$route.fullPath
    },
  },
}
</script>
<style>
.app-main {
  overflow: auto;
}
</style>
