<template>
  <div id="list-demo" class="demo">
    <transition-group name="list" tag="p">
      <div v-for="(item,index) in items" v-bind:key="index" class="list-item">
        <div>
          {{ item }}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'scroll',
  data () {
    return {
      items: [
        "1111111111111111111111111111111111111111111",
        "2222222222222222222222222222222222222",
        "3333333333333333333333333333333333333",
        "4444444444444444444444444444444444444",
        "5555555555555555555555555555555555555",
        "6666666666666666666666666666666666666",
        "7777777777777777777777777777777777777",
        "8888888888888888888888888888888888888",
      ],
    }
  },
  computed: {
    
  },
  mounted () {
    setInterval((item,index)=>{
      this.add();
    },1000)
  },
  methods: {
    add: function () {
      this.items.splice(0, 0, this.items[this.items.length-1])
      this.items.splice(this.items.length-1, 1)
    },
  }
}
</script>

<style scoped>
.list-item {
  font-size: 30px;
}
/* .list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
 {
  opacity: 0;
  transform: translateX(30px);
} */
</style>