<template>
  <div>
    {{ details }}
  </div>
</template>
<script>
import { BaseVue } from '@lib'
import { AuthTplController } from '@controller'
export default {
  mixins: [BaseVue],
  props: {
    data: {},
  },
  data() {
    return {
      details: null,
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.loadData()
      },
    },
  },
  methods: {
    async loadData() {
      let resp = await this.dispatch(AuthTplController.findById, {
        id: this.data.id,
      })
      if (!resp.error) {
        this.details = resp.data
      }
    },
  },
}
</script>
