<template>
  <div>
    <template v-if="isEdit">
      <el-select v-if="compType === 'select'" on-bind="$attrs" v-model="value" @change="changeValue" clearable filterable>
        <el-option v-for="dict in dicts" :key="dict.dictID" :value="dict.dictID" :label="dict.dictName"></el-option>
      </el-select>
      <template v-else-if="compType === 'checkbox'">
        <el-checkbox-group :disabled="disabled" v-model="value" @change="changeValue">
          <el-checkbox v-for="dict in dicts" :key="dict.dictID" :label="dict.dictID" :true-label="dict.dictID" :false-label="null">
            {{ dict.dictName }}
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else-if="compType === 'radio'">
        <el-radio-group :disabled="disabled" v-model="value">
          <el-radio v-for="dict in dicts" :key="dict.dictID" :label="dict.dictID"> {{ dict.dictName }} </el-radio>
        </el-radio-group>
      </template>
    </template>
    <template v-else>
      <span>{{ text }}</span>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { VueUtil, BaseVue } from '@lib'
import { IBusinessDictController } from '@controller'

export default {
  name: 'select-dict',
  mixins: [BaseVue],
  components: {},
  computed: {
    ...mapGetters(['businessDicts']),
    ...VueUtil(this)
      .select([IBusinessDictController])
      .state(),
    text() {
      if (this.dicts.length > 0) {
        return _.get(this.dicts.find(d => d[this.valueField] === this.value), `[${this.textField}]`, '')
      } else return ''
    },
  },
  props: {
    style: {
      type: String,
      default: 'width:80%',
    },
    ctrl: {
      type: String,
    },
    defId: {
      type: String,
    },
    compType: {
      type: String,
      default: 'select',
    },

    defaultValue: {
      type: Object,
      default: null,
    },
    value: {
      type: String,
    },
    dictTypeId: {
      type: String,
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    valueField: {
      type: String,
    },
    textField: {
      type: String,
    },
    parentId: {
      type: String,
    },
  },

  data() {
    return {
      dicts: [],
    }
  },
  mounted() {
    if (!!this.dictTypeId) {
      this.loadData(this.dictTypeId, this.parentId)
    }
  },
  watch: {
    dictTypeId(val) {
      this.loadData(val, this.parentId)
    },
    parentId(val) {
      this.loadData(this.dictTypeId, val)
    },
  },
  methods: {
    ...VueUtil(this)
      .select([IBusinessDictController])
      .actions(),
    setDicts(dicts) {
      this.dicts = dicts
      if (dicts.filter(d => d.dictID === this.value).length === 0) {
        if (this.value) {
          this.changeValue(null)
        }
      }
    },
    getSelected() {
      return this.list.filter(l => {
        return l[this.valueField] === this.value
      })
    },
    async loadData(dictTypeId, parentId) {
      if (!!parentId) {
        this.setDicts(await this.loadChildrenDict(dictTypeId, parentId))
      } else {
        this.setDicts(await this.loadDict(dictTypeId))
      }
      if (this.defaultValue !== null) {
        this.changeValue(this.defaultValue)
      }
    },
    changeValue(val) {
      this.$emit('input', val)
      this.$emit('change', val, this.defId)
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
