<template>
  <div class="dashboard-container"><component :is="currentPlatform"></component></div>
</template>

<script>
import AdminDashboard from '../admin/dashboard'
import { BaseVue } from '@lib'

export default {
  name: 'dashboard',
  mixins: [BaseVue],
  components: { AdminDashboard},
  data() {
    return {
      currentPlatform: 'AdminDashboard',
    }
  },
  created() {
  },
}
</script>
