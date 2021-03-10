<template>
  <div>
    <div v-for="(url, index) in urlList">
      <el-input :class="{'error-input':urlList[index].error}" clearable :disabled="!editable" style="width:300px;"
                class="mb-5"
                v-model="urlList[index].value" @change="valueChanged"></el-input>
      <el-button v-if="index > 0 && editable" icon="el-icon-delete" type="default"
                 @click="removeRow(index)"></el-button>
      <transition enter-active-class="animated flipInX">
      <span v-if="errors[url.value]">
        <i class="el-icon-success success" v-if="errors[url.value].correct"></i>
        <i class="el-icon-error error" v-if="!errors[url.value].correct"></i>
        {{errors[url.value].correct ? '通过' : '未通过'}}
      </span>
      </transition>
    </div>
    <el-button v-if="editable" icon="el-icon-plus" type="warning" @click="addRow"></el-button>
    <span class="error-text" v-if="editable">
      {{errorInfo}}
    </span>
  </div>
</template>
<script>
  import _ from 'lodash'
  export default {
    name: 'url',
    props: {
      value: {},
      errors: {
        default: {},
      },
      editable: {
        default: true,
      },
      validator: {},
      label: {
        default: '地址'
      },
    },
    computed: {},
    data() {
      return {
        urlList: [], errorInfo: ''
      }
    },
    mounted(){
      this.valueChanged = _.debounce(() => {
        this.validate()
      }, 100)
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (val) {
            this.urlList = val.split(',').map(v => {
              return {
                value: v,
                error: false,
              }
            })
          } else {
            this.urlList = [{value: '', error: false,}]
          }
        },
      },
      urlList: {
        deep: true,
        handler: _.throttle(function (val) {
          this.validate()
          this.$emit('input', val.map(v => v.value.replace(/,/gi, '').trim()).join(','))
        }, 300)
      },
    },
    methods: {
      validate(){
        this.errorInfo = ''
        if (this.validator) {
          this.urlList.forEach(item => {
            let valid = this.validator
            if (!_.isArray(this.validator)) {
              valid = [this.validator]
            }
            valid.forEach(v => {
              v.call(this, null, item.value, (error) => {
                if (error && error.message) {
                  this.errorInfo = `${this.label}${error.message}`
                  item.error = true
                }
              })
            })
          })
        }
        return !this.errorInfo
      },
      addRow() {
        this.urlList.push({value: '', error: false,})
      },
      removeRow(index) {
        this.urlList.splice(index, 1)
      },
    },
  }
</script>
