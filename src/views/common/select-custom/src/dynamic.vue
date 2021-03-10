<template>
  <div>
    <el-select
      style="width:80%"
      filterable
      allow-create
      default-first-option
      :clearable="clearable"
      no-data-text="暂无数据"
      :multiple="multiple"
      v-model="value"
      @change="selectChange"
    >
      <el-option v-for="item in list" :value="item[valueField]" :label="item[textField]"></el-option>
    </el-select>
  </div>
</template>

<script>
import _ from 'lodash'
import { VueUtil, BaseVue } from '@lib'
import ajaxUtil from '@lib/ajaxUtil'
import * as auth from '@/utils/auth.js'

export default {
  name: 'select-dynamic',
  mixins: [BaseVue],
  components: {},
  computed: {},
  props: {
    ctrl: {
      default: null,
    },
    defId: {
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    size: {
      type: String,
      default: 'default',
    },
    valueProvider: {
      type: Object | String,
      default: {
        multiSelect: false,
      },
    },
    params: {
      type: Array,
      default: [],
    },
    envType: {
      type: String,
      default: null,
    },
    forms: {
      type: Array,
    },
    currentProjectId: {
      //因为新增了引入其他项目发布定义，所以如果是外部的发布定义的构建详情需要用currentProjectId
      type: String,
      default: null,
    },
  },

  data() {
    return {
      list: [],
      valueField: '',
      textField: '',
      url: null,
      childUrlField: '',
      childName: '',
      childUrl: '',
    }
  },
  mounted() {
    this.loadData(this.valueProvider)
    if (!!this.value) this.selectChange(this.value)
  },
  watch: {
    value(val) {
      this.selectChange(val)
    },
    valueProvider(val) {
      this.loadData(val)
    },
    list(val) {
      //        if (!!val) {
      //          if (!val.some(v => v[this.valueField] === this.value)) {
      //            this.$emit('input', null)
      //          }
      //        }
    },
  },
  methods: {
    loadData(values) {
      if (_.isString(values)) values = JSON.parse(values)
      else return
      let { url, valueField, textField, value, childName, childUrl, childUrlField } = values
      this.valueField = valueField
      this.childUrlField = childUrlField
      this.textField = textField
      this.childName = childName
      this.childUrl = childUrl
      if (this.url !== null && url === null) {
        url = this.url
      }

      if (!url) return
      url = _.replace(url, ':projectId', this.currentProjectId || this.projectId)
      url = _.replace(url, ':envType', this.envType)
      this.params.forEach(p => {
        url = _.replace(url, `:${p.key}`, p.value)
      })
      this.setUrl(url)

      if (this.value === null) this.selectChange(value)
    },

    setUrl(url) {
      this.url = url
      if (/undefined/.test(url)) {
        //        if(/(undefined)|(\/:)|(=null)/.test(url)){
        this.list = []
      } else {
        ajaxUtil
          .headers({
            Authorization: auth.getToken(),
          })
          .ajax({
            url: url,
            method: 'get',
          })
          .then(res => {
            if (res.data.data) {
              this.list = res.data.data
            } else {
              this.list = res.data
            }
          })
          .catch(error => {
            //          this.$message({
            //            message: '动态表单获取失败!' + error,
            //            type: 'error'
            //          })
          })
      }
    },
    getSelected() {
      return this.list.filter(l => {
        return l[this.valueField] === this.value
      })
    },

    setParams(key, value) {
      if (this.params) {
        if (this.params.some(p => p.key === key)) {
          this.params.forEach(p => {
            if (p.key === key) {
              p.value = value === '' ? undefined : value
            }
          })
        } else {
          this.params.push({ key, value })
        }
        this.$emit('setParams', this.params)
      }
    },
    selectChange(val) {
      this.setParams(this.valueField, val)

      if (this.childName && this.childUrl) {
        !!this.forms &&
          this.forms.forEach(f => {
            if (f.attrDefName === this.childName) {
              let valueProvider = JSON.parse(f.valueProvider)
              let url = this.childUrl
              if (!!val) {
                this.params.forEach(p => {
                  url = _.replace(url, `:${p.key}`, p.value)
                })
                if (this.childUrlField) {
                  let child = this.list.filter(l => l[this.valueField] === val)
                  if (child.length === 1) valueProvider.url = _.replace(url, `:${this.childUrlField}`, child[0][this.childUrlField])
                } else {
                  valueProvider.url = _.replace(url, `:${this.valueField}`, val)
                }
              } else {
                valueProvider.url = url
              }

              f.valueProvider = JSON.stringify(valueProvider)
            }
          })
      }

      this.$emit('input', val)
      this.$emit('change', val, `${this.defId}`)
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
