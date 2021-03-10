<template>
  <iframe src="" style="display: none" ref="download" frameborder="0"></iframe>
</template>
<script>
  import {OtherUtil} from '@lib'
  export default {
    name: 'download-file',
    props: {
      value: {}
    },
    watch: {
      value(url){
        this.download(url)
      }
    },
    methods: {
      download(url){
        if (url) {
          if (['chrome', 'firefox', 'safari'].includes(OtherUtil.getBrowse().name)) {
            this.$refs['download'].src = url
          } else {
            window.open(url)
          }
        }
        this.$emit('input', null)
      }
    }
  }
</script>
