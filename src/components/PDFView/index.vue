<!--<template>-->
  <!--<div>-->
    <!--<div class="tools">-->
      <!--<el-input-number size="mini" style="width:100px;" :min="1"  :max="numPages || 1" v-model.number="page"></el-input-number>-->
      <!--/{{numPages}}页-->
            <!--<el-select style="width:90px;" placeholder="缩放" v-model="size">-->
      <!--<el-option v-for="v in sizes" :key="v" :value="v" :label="`${v}%`"></el-option>-->
    <!--</el-select>-->
      <!--<el-button-group style="margin-left:5px;">-->
        <!--<el-button @click="rotate += 90">&#x27F3;</el-button>-->
        <!--<el-button @click="rotate -= 90">&#x27F2;</el-button>-->
        <!--<el-button @click="$refs.pdf.print()">print</el-button>-->
      <!--</el-button-group>-->
    <!--</div>-->
    <!--<div class="pdf-body">-->
      <!--<div :style="`margin-left:${(100 - size )/ 2}%;width:${size}%;`">-->
        <!--<VuePdf v-if="src" ref="pdf" :src="src" :page="page" :rotate="rotate" @password="password"-->
                <!--@progress="loadedRatio = $event" @error="error" @num-pages="numPages = $event"-->
                <!--@link-clicked="page = $event"></VuePdf>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->
<!--<script>-->
  <!--import VuePdf from 'vue-pdf'-->
  <!--export default{-->
    <!--name: 'pdf-view',-->
    <!--components: {VuePdf},-->
    <!--props: {-->
      <!--src: {-->
        <!--default: null,-->
      <!--},-->
      <!--sizes: {-->
        <!--default: [20, 40, 60, 80, 100],-->
      <!--},-->
      <!--size: {-->
        <!--default: 40-->
      <!--},-->
    <!--},-->
    <!--mounted(){-->
    <!--},-->
    <!--data(){-->
      <!--return {-->
        <!--loadedRatio: 0,-->
        <!--page: 1,-->
        <!--numPages: 0,-->
        <!--rotate: 0,-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->
<!--<style rel="stylesheet/scss" lang="scss" scoped>-->
  <!--.tools{-->
    <!--background:#d1dbe5;padding:5px;text-align: right;-->
  <!--}-->
  <!--.pdf-body{-->
    <!--text-align: center;background:#606266;-->
  <!--}-->
<!--</style>-->
