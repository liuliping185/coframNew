<template>
  <div class="tree-list">
    <el-input v-if="searchable" placeholder="检索..." v-model="keyword" clearable>
      <i
        class="el-icon-search el-input__icon"
        slot="suffix">
      </i>
    </el-input>
    <el-tree
      size="normal"
      ref="tree-list"
      highlight-current
      :node-key="treeProps.id"
      :data="data"
      :filter-node-method="filterNode"
      :props="treeProps"
      :expand-on-click-node="false"
      :current-node-key="currentNodeKey"
      @node-click="handleNodeClick"
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <slot :data="data" name="row">
          <div class="icon" v-if="data.icon">
            <svg-icon :iconClass="data.icon"></svg-icon>
          </div>
          <div class="name">{{ node.label }}</div>
          <div class="btns" v-if="!data.isLock">
            <el-button v-if="$listeners.edit && editable" class="hover-shadow" type="text" icon="el-icon-edit"
                       @click="edit(data)"></el-button>
            <el-button v-if="$listeners.remove && removable" class="hover-shadow" type="text" icon="el-icon-delete"
                       @click="remove(data)"></el-button>
          </div>
        </slot>
      </div>
    </el-tree>
  </div>
</template>
<script>
  export default {
    name: 'tree-list',
    props: {
      value: {
        default: null,
      },
      editable: {
        default: true,
      },
      searchable: {
        default: true,
      },
      removable: {
        default: true,
      },
      treeProps: {
        default: {
          id: 'id',
          label: 'name',
          children: 'children',
        },
      },
      data: {
        type: Array,
        default: [],
      },
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val && val[this.treeProps.id]) {
            this.$nextTick(() => {
              this.setCurrentKey(val[this.treeProps.id])
            })
          }
        }
      },
      keyword(val) {
        this.$refs['tree-list'].filter(val);
      }
    },
    data() {
      return {
        currentNodeKey: null,
        keyword: null,
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true
        return data[this.treeProps.label].indexOf(value) !== -1
      },
      setCurrentKey(key) {
        this.$refs['tree-list'].setCurrentKey(key)
        this.currentNodeKey = key
        this.$forceUpdate()
      },
      handleNodeClick(data) {
        this.$emit('input', data)
      },
      add() {
        this.$emit('add')
      },
      edit(row) {
        this.$emit('edit', row)
      },
      remove(row) {
        this.$emit('remove', row)
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .tree-list {
    /deep/ .el-input .el-input__inner {
      border-radius: 0px;
    }
    /deep/ .el-button + .el-button {
      margin-left: 0px;
    }
    .custom-tree-node {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
      padding-right: 8px;
      .icon {
        position: absolute;
        left: -20px;
      }
      .name {
        left: 25px;
        flex-grow: 3;
      }
      .btns {
        opacity: 0;
        transition: all .3s ease;
        text-align: right;
        flex-grow: 2;
      }
      &:hover {
        .btns {
          color: #0a76a4;
          opacity: 1;
        }
      }
    }
  }


</style>
