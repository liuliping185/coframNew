<template>
  <el-select v-model="value" placeholder="请选择角色" @change="changeRole" clearable>
    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
  import {RoleController} from '@controller'
  import {BaseVue} from '@lib'
  export default {
    name: 'platform-member-select',
    mixins: [BaseVue],
    computed: {},
    props: {
      value: {
        type: String,
        default: null,
      },
      keyPayload: {
        type: Object,
        default: {
          ownerId: 'platform',
          ownerType: 'platform',
        }
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
        let resp = await this.dispatch(RoleController.pagingByCriteria, this.keyPayload)
        console.log("=+++++===============",resp)
        if (!resp.error) {
          this.options = resp.data.content
        }
      },

      changeRole(val) {
        if (val === null) {
          this.$emit('change', {id: null})
        }
        this.options.forEach(item => {
          if (item.id === val) {
            this.$emit('change', item)
          }
        })
      },
    },
  }
</script>
