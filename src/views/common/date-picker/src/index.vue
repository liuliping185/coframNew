<template>
  <span>
    <el-date-picker v-bind="$attrs" style="width:205px;" v-model="begin" type="datetime" @change="beginChanged"
                    placeholder="选择日开始时间"></el-date-picker>
    ~
    <el-date-picker v-bind="$attrs" style="width:205px;" v-model="end" type="datetime" @change="endChanged"
                    placeholder="选择结束时间"></el-date-picker>
    <FastTimeRange style="transform: translate(0,-1px);" :showLabel="false" v-if="!$attrs.disabled" width="60" @selectDuration="selectDuration" ref="fastTimeRange"></FastTimeRange>
  </span>
</template>
<script>
  import moment from 'moment'
  export default {
    name: 'date-picker',
    props: {
      begin: {},
      end: {},
      format: {
        default: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    date(){
      return {}
    },
    methods: {
      reset(){
        this.$refs['fastTimeRange'].reset()
      },
      formatTime(time) {
        return moment(time).format(this.format)
      },
      beginChanged(begin){
        if (begin) {
          this.$emit('update:begin', this.formatTime(this.begin))
        } else {
          this.$emit('update:begin', null)
        }
      },
      endChanged(end){
        if (end) {
          this.$emit('update:end', this.formatTime(this.end))
        } else {
          this.$emit('update:end', null)
        }
      },
      selectDuration({begin, end, unit}) {
        this.$emit('update:end', end.format(this.format))
        this.$emit('update:begin', begin.format(this.format))
      },
    }
  }
</script>
