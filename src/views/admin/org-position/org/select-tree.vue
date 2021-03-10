<template>
  <el-select-tree
    style="width:100%"
    v-if="data"
    ref="select-tree"
    v-model="value"
    empty-text="无数据"
    :data="data"
    :props="props"
    :allowClick="allowClick"
  >
  </el-select-tree>
</template>

<script>
  import {BaseVue} from '@lib'
  import {OrganizationController} from '@controller'
  export default {
    name: 'select-org-tree',
    mixins: [BaseVue],

    props: {
      value: String,
      // 根节点值
      rootData: Object,
      currentId: String,
      allowClick: Function,
    },
    data() {
      return {
        data: [],
        props: {
          value: 'id',
          label: 'name',
          isLeaf: 'leaf'
        },
        ids: []
      }
    },
    watch: {
      value: {
        handler(nval, oval) {
          if (nval !== oval) {
            this.$emit('update:id', nval)
          }
        },
        immediate: true,
      },
      currentId: {
        async handler(val) {
          if (!val) {
            return
          }
          this.ids = []
          await this.loadChildNode(val)
          this.loadNode(this.rootData.id)
        },
        immediate: true
      }
    },
    mounted(){
      this.loadNode(this.rootData.id)
    },
    methods: {
      async loadChildNode(id) {
        let resp = await this.dispatch(OrganizationController.findById, {
          id: id,
          loadLevel: 999,
          loadChildren: true
        })
        if (!resp.error) {
          this.deepTraversal(resp.data)
        }
      },
      deepTraversal(node) {
        this.ids.push(node.id)
        let children = node.children
        children.forEach((c) => {
          this.deepTraversal(c)
        })
      },
      async loadNode(id) {
        let resp = await this.dispatch(OrganizationController.pagingByCriteria, {
          dimensionId: id
        })
        if (!resp.error) {
          //content为含有 树结构 属性的一维数组，关联属性为parentId
          //通过dimensionId请求的数据，没有parentId属性代表content 树结构 的顶层数据（根节点的子集）
          let content = resp.data.content
          //非叶子节点
          this.leaf = false
          //rootData为根节点数据
          this.rootData.children = this.arrayToTree(content, undefined)
          this.data = [this.rootData]
        }
      },
      arrayToTree (data, pid) {
        let result = []
        let temp
        data.forEach(nodeData => {
          //排除下级机构和当前机构
          if (this.ids.includes(nodeData.id)) {
            return
          }
          if (nodeData.parentId === pid) {
            let obj = nodeData
            temp = this.arrayToTree(data, nodeData.id)
            if (temp.length > 0) {
              obj.children = temp
            } else {
              obj.leaf = true
            }
            result.push(obj)
          }
        })
        return result
      },

    }
  }
</script>
