<template>
  <el-pagination
    :page-sizes="pageSizes"
    :page-size="pageSize"
    background
    :layout="layout"
    v-on="$listeners"
    v-bind="$attrs"
    class="margin-10 float-right"
  >
  </el-pagination>
</template>
<script>
export default {
  props: {
    pageSizes: {
      default: [10, 20, 30, 40, 50, 100],
    },
    pageSize: {
      default: 10,
    },
    layout: {
      default: 'slot,total, prev, pager, next, sizes,jumper',
    },
  },
}
</script>
