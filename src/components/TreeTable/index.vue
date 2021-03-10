<template>
  <div>
    <el-table :data="formatData" :row-style="showRow" v-bind="$attrs" v-on="$listeners">
      <slot name="before"></slot>
      <el-table-column v-if="columns.length === 0" width="150">
        <template slot-scope="scope">
          <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
          <span class="tree-ctrl" v-if="iconShow(0, scope.row)" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right"></i> <i v-else class="el-icon-caret-bottom"></i>
          </span>
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width">
        <template slot-scope="scope">
          <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
          <span class="tree-ctrl" v-if="iconShow(index, scope.row)" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right"></i> <i v-else class="el-icon-caret-bottom"></i>
          </span>
          {{ scope.row[column.value] }}
        </template>
      </el-table-column>
      <slot name="after"></slot>
      <slot></slot>
    </el-table>
  </div>
</template>

<script>

import treeToArray from './eval'
export default {
  name: 'treeTable',
  props: {
    data: {
      type: [Array, Object],
      required: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        this.formatData = this.format(val)
      },
    },
  },
  data() {
    return {
      formatData: [],
    }
  },
  methods: {
    // 格式化数据源
    format(data) {
      if (!data) {
        return
      }
      let tmp
      if (!Array.isArray(data)) {
        tmp = [data]
      } else {
        tmp = data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]

      return func.apply(null, args)
    },
    showRow: function(row) {
      const show = row.row.parent ? row.row.parent._expanded && row.row.parent._show : true
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 切换下级是否展开
    async toggleExpanded(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
      if (record._expanded) {
        this.$emit('expand', record)
      }
    },
    // 图标显示
    iconShow(index, record) {
      //      return true
      return index === 0
    },
  },
}
</script>
<style rel="stylesheet/css" scoped>
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: '';
  }
}

.processContainer {
  width: 100%;
  height: 100%;
}

table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  margin-left: -$space-width;
}
</style>
