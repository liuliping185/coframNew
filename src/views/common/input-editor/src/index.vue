<template>
  <div v-if="disabled" class="mt-5">{{ value }}</div>
  <div v-else class="input-editor-container" @click.stop="edit($event, false)">
    <el-input
      :style="inputStyle"
      @blur="save"
      :size="size"
      :ref="`input-${fieldName}`"
      :disabled="ffDisabled"
      v-model="value"
      :type="type"
      :rows="rows"
    ></el-input>
    <span class="btn-group">
      <el-button-group v-if="editFlag" >
        <el-button icon="el-icon-check" @click.stop="save()"></el-button>
        <el-button icon="el-icon-close" @click="edit($event, true)"></el-button>
      </el-button-group>
    </span>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'input-editor',
    components: {},
    computed: {
      ffDisabled() {
        if (navigator.userAgent.indexOf('Firefox') > -1) {
          return false
        } else {
          return !this.editFlag
        }
      },
    },
    props: {
      size: {
        default: 'mini'
      },
      fontSize: {
        default: '12px',
      },
      fieldName: {},
      disabled: {
        default: false,
      },
      type: {
        default: 'text',
      },
      rows: {
        default: 1,
      },
      saveField: {
        type: Function,
      },
      value: {
        type: String,
      },
      valueConvert: {
        type: Function,
      },
      entity: {
        type: Function,
      },
      inputStyle: {
        type: String,
        default: '',
      },
      saveAction: {
        type: Function,
      },
    },
    watch: {
    },
    data() {
      return {
        oldValue: null,
        loading: false,
        editFlag: false,
      }
    },
    created() {
    },
    mounted() {
      this.oldValue = this.value
      this.save = _.debounce(async () => {
        setTimeout(async () => {
          if (this.oldValue === this.value) {
            this.editFlag = false
            return
          }
          this.loading = true
          this.$emit('input', this.value)
          if (await this.saveAction(this.entity)) {
            this.oldValue = this.value
          } else {
            this.$emit('input', this.oldValue)
          }
          this.editFlag = false
          this.loading = false
        }, 100)
      }, 100)
    },
    methods: {
      reset(){
        setTimeout(() => {
          if (!this.loading) {
            console.log('reset')
            this.value = this.oldValue
            this.$emit('input', this.value)
          }
        }, 10)
      },

      edit(e, f) {
        if (e) {
          e.stopImmediatePropagation && e.stopImmediatePropagation()
        }
        this.cancel = true
        this.editFlag = !f
        if (!f) {
          this.$nextTick(() => {
            let ref = this.$refs[`input-${this.fieldName}`]
            ref.focus()
          })
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .input-editor-container {
    position: relative;
    .btn-group {
      position: absolute;
      top: 30px;
      right: 0px;
      z-index: 2000;
    }
    border: 1px solid transparent;
    border-radius: 4px;
    transition: border -5s ease;
    &:hover {
      border: 1px solid #d0d0d0;
      .btn-group {
        display: block;
      }
    }
  }
</style>
