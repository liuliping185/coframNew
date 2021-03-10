<template>
  <svg id="wave-process" width="97%" height="250"></svg>
</template>
<script>
  import loadLiquidFillGauge from './main.js'
  export default {
    name: 'wave-process',
    props: {
      value: {},
      config: {
        default: {
//          circleColor: "#D4AB6A",
//          textColor: "#553300",
//          waveTextColor: "#805615",
//          waveColor: "#AA7D39",
          circleThickness: 0.05,
          circleFillGap: 0.2,
          textVertPosition: 0.8,
          waveAnimateTime: 2000,
          waveHeight: 0.3,
          waveCount: 1
        }
      }
    },
    data(){
      return {
        main: null,
      }
    },
    mounted(){
      this.init()
    },
    watch: {
      value(val){
        this.main.update(val)
      }
    },
    methods: {
      init(){
        this.main = loadLiquidFillGauge("wave-process", this.value, this.config);
        console.log(this.main)
      }
    }
  }
</script>
