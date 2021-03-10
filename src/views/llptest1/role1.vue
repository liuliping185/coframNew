<template>
<div id="contant">
    <span v-for="(item,index) in SvgIcon" :key="index">
      <svg-icon class="svgimg" :name="item.default.id.substring(5)" :iconClass="item.default.id.substring(5)"></svg-icon>
      <span class="word">
        {{item.default.id.substring(5)}}
      </span>
    </span>
</div>
</template>

<script>
  export default {
    data() {
      return {		
      }
    },
    methods: {	
    }
  }
</script>

<style scoped>
#contant {
  margin: 20px;
}
.svgimg {
  width: 30px !important;
  height: 30px !important;
  margin: 50px 50px 26px 50px;
}
.word {
  width: 60px !important;
  height: 20px !important;
  color: #666;
  margin-left: -100px;
  display: inline-block;
  text-align: center;
  line-height: 12px;
}
</style>
