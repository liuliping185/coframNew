<template>
  <el-button :type="type || buttonTypes[buttonType].type || 'text'" :icon="icon || buttonTypes[buttonType].icon" v-on="$listeners" v-bind="$attrs"
    >{{ label || buttonTypes[buttonType].label }}
  </el-button>
</template>
<script>
export default {
  props: {
    buttonType: {
      default: null,
    },
    label: {
      default: null,
    },
    icon: {
      default: null,
    },
    type: {
      default: null,
    },
  },
  data() {
    return {
      buttonTypes: {
        create: {
          type: 'primary',
          label: '新增',
          icon: 'el-icon-plus',
        },
        edit: {
          type: 'text',
          label: '编辑',
          icon: 'el-icon-edit',
        },
        delete: {
          type: 'text',
          label: '删除',
          icon: 'el-icon-delete',
        },
      },
    }
  },
}
</script>
