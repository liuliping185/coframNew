<template>
  <div class="cascade-checkbox-group">
    <el-row type="flex">
      <el-col style="padding:5px 0px;width:150px;border-right:1px solid #DCDFE6;">
        <el-checkbox
          class="mr-20"
          true-label="true"
          false-label="false"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >
          <span>{{ value.permissionName }}</span>
        </el-checkbox>
      </el-col>
      <el-col :span="24" style="padding:5px 0px 5px 40px;">
        <el-checkbox
          :label="c.ischeck"
          true-label="true"
          false-label="false"
          v-model="c.ischeck"
          v-for="c in value.children"
          :key="c.permissionName"
          @change="handleCheckedChange"
          >{{ c.permissionName }}
        </el-checkbox>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'my-check-group',
  props: {
    value: {},
  },
  watch: {
    value() {
      this.handleCheckedChange()
    },
  },
  mounted() {
    this.handleCheckedChange()
  },

  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.value.children.forEach(v => {
        v.ischeck = val
      })
      this.isIndeterminate = false
      this.$emit('input', this.value)
    },
    handleCheckedChange(value) {
      let checkedCount = this.value.children && this.value.children.filter(c => c.ischeck === 'true').length
      this.checkAll = checkedCount === (!this.value.children ? 0 : this.value.children.length)
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.value.children.length
      this.$emit('input', this.value)
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.cascade-checkbox-group {
}
.el-checkbox {
  margin-left: 0px;
  margin-right: 30px;
}
</style>
