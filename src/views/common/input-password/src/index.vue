<template>
  <div>
    <el-input v-if="!disabled" :type="password ? 'password' : 'text'" v-model="text" :size="size" autocomplete="new-password" autoComplete="new-password">
      <el-button slot="append" @click="switchType">
        <i class="el-icon-view" v-if="!password"></i>
        <svg-icon icon-class="eye" v-else />
      </el-button>
    </el-input>
    <div v-else>
      <span v-if="!password">{{ value }}</span> <span v-else>******</span>
      <el-button v-if="!disabled" class="float-right" type="text" @click="switchType">
        <i class="el-icon-view" v-if="!password"></i>
        <svg-icon icon-class="eye" v-else />
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'input-password',
  mixins: [],
  components: {},
  computed: {},
  props: {
    size: {},
    disabled: {
      default: false,
    },
    value: {},
  },

  data() {
    return {
      password: true,
      text: null,
    }
  },
  mounted() {},
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.text = val
      },
    },
    text: {
      handler(val) {
        this.$emit('input', val)
      },
    },
  },
  methods: {
    switchType() {
      this.password = !this.password
    },
    changeValue(val) {
      this.$emit('input', val)
    },
  },
}
</script>
