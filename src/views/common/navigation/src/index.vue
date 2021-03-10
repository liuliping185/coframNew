<template>
  <div>
    <div class="header">
      <i style="color:rgb(48, 65, 86);font-size:15px;float:left;margin-right:10px;" class="el-icon-menu"></i>
      <el-breadcrumb>
        <el-breadcrumb-item v-for="(path, index) in paths" :key="index"
        ><a class="blue" @click="goto(path)">{{ path._title || path.title }}</a></el-breadcrumb-item
        >
      </el-breadcrumb>
      <div class="description">
        {{ (currentRoute.props ? currentRoute.props.description : null) || currentRoute.description }}
      </div>
    </div>
    <div class="body" :style="bodyStyle">
      <transition name="el-fade-in-linear" leave-to-class="leave-to-class">
        <keep-alive :include="cacheInclude">
          <component :is="currentRoute.component" ref="componentPage" v-bind="currentRoute.props"
                     @goto="goto"></component>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      routes: {
        type: Array,
      },
      bodyStyle: {
        type: String,
      },
      autoInit: {
        default: true,
      },
      cacheInclude: {
        default: null,
      }
    },
    data() {
      return {
        currentRoute: {},
        paths: [],
      }
    },
    mounted() {
      this.paths = [this.routes[0]]
      if (this.autoInit) {
        this.goto(this.routes[0])
      }
    },
    methods: {
      goto({name, props, title, _title}) {
        let paths = []
        let search = routes => {
          let end = false
          routes.forEach(route => {
            if (route.name === name || (route.children && search(route.children))) {
              if (route.name === name) {
                if (this.$refs['componentPage'] && this.$refs['componentPage'].beforeAfter) {
                  this.$refs['componentPage'].beforeAfter(() => {
                    this.currentRoute = route
                    if (props) {
                      //  route.props = props;
                      route.props = {...route.props, ...props}
                      route._title = _title || title
                    }
                  })
                } else {
                  this.currentRoute = route
                  if (props) {
                    //  route.props = props;
                    route.props = {...route.props, ...props}
                    route._title = _title || title
                  }
                }
              }
              end = true
              paths.push(route)
              return false
            }
          })
          return end
        }
        search(this.routes)
        this.paths = paths.reverse()
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .leave-to-class {
    display: none;
  }

  .header {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding: 12px 5px 5px 10px;
    background: #eaedf1;
    margin-bottom: 5px;
  }

  .body {
    padding: 0px 5px 0px 5px;
  }

  .description {
    text-align: right;
    position: absolute;
    right: 10px;
    top: 0px;
    width: 400px;
    /*line-height:14px;*/
  }
</style>
