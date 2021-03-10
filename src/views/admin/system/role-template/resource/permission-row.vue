<template>
  <div>
    <el-row type="flex" class="row">
      <el-col style="width:200px" class="pl-10">
        <el-checkbox class="mr-10" :label="value.id" @change="handleCheckAllChange" v-model="checkAll" :indeterminate="isIndeterminate">
          {{ value.name }}
        </el-checkbox>
      </el-col>
      <el-col>
        <div v-if="value.menus.length > 0">
          <el-checkbox
            v-for="menu in value.menus"
            :label="menu.id"
            v-model="menu.selected"
            @change="handleCheckedChange"
            style="margin-left: 0px;margin-right:30px"
            >{{ menu.name }}
          </el-checkbox>
        </div>
        <div v-if="value.functions.length > 0">
          <el-checkbox
            v-for="func in value.functions"
            :label="func.id"
            v-model="func.selected"
            @change="handleCheckedChange"
            style="margin-left: 0px;margin-right:30px"
            >{{ func.name }}
          </el-checkbox>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue } from '@lib'

export default {
  name: 'row-checkbox',
  mixins: [BaseVue],
  props: {
    value: Object,
  },

  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.menus.length > 0) {
          this.isCheckedAllRole(val, 'menus')
        } else if (val.functions.length > 0) {
          this.isCheckedAllRole(val, 'functions')
        }
      },
    },
  },
  methods: {
    isCheckedAllRole(val, type) {
      this.checkAll = val[type].every(v => {
        return v.selected === true
      })

      if (!this.checkAll) {
        this.isIndeterminate = val[type].some(v => {
          return v.selected === true
        })
      } else {
        this.isIndeterminate = false
      }
    },

    async handleCheckAllChange(val) {
      this.operatableResources = []
      if (this.value.menus.length > 0) {
        this.filterCheckAllChange('menus', val)
      } else if (this.value.functions.length > 0) {
        this.filterCheckAllChange('functions', val)
      }
      this.$emit('input', this.value)
    },

    async handleCheckedChange(val) {
      this.$emit('input', this.value)
    },

    filterCheckAllChange(type, val) {
      this.value[type].forEach(v => {
        v.selected = val
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.row {
  min-height: 36px;
  line-height: 36px;
  font-size: 14px;

  &:hover {
    background: #e0e0e0;
  }
}
</style>
