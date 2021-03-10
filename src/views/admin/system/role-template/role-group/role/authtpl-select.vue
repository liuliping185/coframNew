<template>
    <el-select v-model="value.id" placeholder="请选择权限模板" @change="changeAuthTpl">
      <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-select>
</template>

<script>
import { AuthTplController } from '@controller'
import { VueUtil, BaseVue } from '@lib'
export default {
  name: 'authtpl-select',
  mixins: [BaseVue],
  computed: {},
  props: {
    value: {
      default: null,
    },
  },
  data() {
    return {
      options: [],

    }
  },
  mounted() {
    this.search()
  },
  watch: {},
  methods: {
    async search() {
      let resp = await this.dispatch(AuthTplController.queryALLAuthTpls)
      if (!resp.error) {
        this.options = resp.data
        //console.log(resp)
      }
    },

    changeAuthTpl(val) {
      let currentAuth = this.options.filter(item => {
        if (item.id === val) {
          return item
        }
      })
      this.$emit('input', { ...currentAuth[0] })
    },
  },
}
</script>

<style scoped></style>
