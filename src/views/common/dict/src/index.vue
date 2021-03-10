<template>
  <el-select v-model="value" v-bind="$attrs" v-on="$listeners" @change="onChange">
    <el-option v-for="op in gridList " :value="op.id" :label="op.name" :key="op.id">
      <slot></slot>
    </el-option>
  </el-select>
</template>
<script>
  import {BaseVue, List} from '@lib'
  import {DictEntryController, DictTypeController} from '@controller'
  export default {
    name: 'dict',
    mixins: [BaseVue, List],
    props: {
      value: {},
      dictTypeCode: {},
    },
    data(){
      return {
        options: []
      }
    },
    watch: {
      dictTypeCode: {
        immediate: true,
        handler(){
          this.search()
        }
      }
    },
    methods: {
      onChange(){
        this.$emit('input',this.value)
        if(this.value){
          this.$emit('change',this.options.find(op => op.id === this.value))
        }
      },
      async searchBody(){
        if (!this.dictTypeCode) {
          return
        }
        return await this.dispatch(DictEntryController.findByCriteria, {
          dictTypeCode: this.dictTypeCode,
          limit:1000,
          offset:1,
        })
      }
    }
  }
</script>
