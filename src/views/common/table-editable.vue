<template>
  <div>
    <el-table stripe size="small" border :data="gridData">
      <no-data slot="empty"></no-data>
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isEdit" size="mini" v-model="scope.row.name"></el-input>
          <span v-else>{{ scope.row.name }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="值">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isEdit" size="mini" v-model="scope.row.value"></el-input>
          <span v-else>{{ scope.row.value }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="描述">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isEdit" size="mini" v-model="scope.row.description"></el-input>
          <span v-else>{{ scope.row.description }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="是否作为入参">
        <template slot-scope="scope">
          <el-checkbox v-if="scope.row.isEdit" :true-label="1" :false-label="0" size="mini" v-model="scope.row.asParameter"></el-checkbox>
          <span v-else> {{ scope.row.asParameter === 1 ? '是' : '否' }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" v-if="allowEdit && !scope.row.isEdit" type="text" size="mini" @click="edit(scope.$index)">修改 </el-button>

          <el-button icon="el-icon-delete" v-if="allowDelete && !scope.row.isEdit" type="text" size="mini" @click="remove(scope.$index)"
            >删除
          </el-button>

          <el-button
            :disabled="!scope.row.name || !scope.row.value"
            icon="el-icon-edit"
            v-if="(allowEdit || allowCreate) && scope.row.isEdit"
            type="text"
            size="mini"
            @click="saveRows"
            >暂存
          </el-button>
          <el-button
            icon="el-icon-close"
            v-if="(allowEdit || allowCreate) && scope.row.isEdit"
            type="text"
            size="mini"
            @click="cancelEdit(scope.$index)"
            >取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="border-bottom-1 mt-10"></div>
    <div>
      <el-button icon="el-icon-plus" size="mini" type="text" class="mt-20" @click="addRow" v-if="allowCreate"> 新增一行 </el-button>
      <!-- <el-button icon="el-icon-edit" size="mini" type="text" class="mt-20" @click="saveRows">暂 存</el-button> -->
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue } from '@lib'
const form = {
  value: null,
  description: null,
  asParameter: 0,
  name: null,
  isEdit: true,
}
export default {
  name: 'table-editable',
  mixins: [BaseVue],
  components: {},
  computed: {},
  props: {
    value: {
      type: Array,
      default: [],
    },
    allowCreate: {
      default: true,
    },
    allowEdit: {
      default: true,
    },
    allowDelete: {
      default: true,
    },
  },

  data() {
    return {
      gridData: [],
    }
  },
  mounted() {
    this.loadData(this.value)
  },
  watch: {
    value(val) {
      this.loadData(val)
    },
  },
  methods: {
    loadData(val) {
      if (val) this.gridData = val
    },

    addRow() {
      if (!this.gridData) {
        this.gridData = []
      }
      this.gridData.push({ ...form })
    },
    edit(index) {
      this.gridData[index].isEdit = true
      this.fresh()
    },
    cancelEdit(index) {
      if (!this.gridData[index].name || !this.gridData[index].value) {
        this.gridData = this.gridData.filter((d, i) => i !== index)
      } else {
        this.gridData[index].isEdit = false
      }
      this.fresh()
      this.$emit('input', this.gridData)
      this.$emit('save', this.gridData)
    },
    remove(index) {
      this.gridData.splice(index, 1)
      this.$nextTick(this.saveRows)
    },
    saveRows() {
      this.gridData = this.gridData.filter(d => {
        d.isEdit = false
        return d.name && d.value
      })
      this.fresh()
      this.$emit('input', this.gridData)
      this.$emit('save', this.gridData)
    },
    saveRow(index) {
      this.gridData[index].isEdit = false
      this.fresh()
    },
    fresh() {
      this.gridData = _.cloneDeep(this.gridData)
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
