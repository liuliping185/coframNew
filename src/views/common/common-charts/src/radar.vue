<template>
<div id="contant">
    <div id="myCharts" ref="myCharts" style="width: 600px;height:400px;"></div>
</div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {		
      }
    },
    mounted() {
      this.myEcharts();
    },
    methods: {	
      myEcharts(){
        // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(this.$refs.myCharts);

        // 指定图表的配置项和数据
       var dataBJ = [
          [55,45,56,30,70,65,100,50,100,20,150,50,10,80,60,90,55,60,90,80,100,75,50,40,60]
      ];

      // var dataGZ = [
      //     [26,37,27,1.163,27,13,1]
      // ];

      // var dataSH = [
      //     [91,45,125,0.82,34,23,1]
      // ];

      var lineStyle = {
          normal: {
              width: 1.5,  // 雷达网状图线的宽度
              opacity: 1
          }
      };

      // 查官网 https://echarts.apache.org/zh/option.html#title
      var option = {
          backgroundColor: '#fff',  // 画布背景颜色
          title: {
              text: '标题',  // 主标题文本，支持使用\n换行
              left: 'left',  // 对齐方式
              textStyle: {
                  color: '#000'  // 字体颜色
              }
          },
        //   legend: {
        //     bottom: 5,
        //     data: ['北京', '上海', '广州'],
        //     itemGap: 20,
        //     textStyle: {
        //         color: '#fff',
        //         fontSize: 14
        //     },
        //     selectedMode: 'single'
        //  },
          radar: {
              indicator: [    // 指定雷达图多个变量
                  {
                    name: '90',  // 指示器名称
                    max: 300,    // 指示器最大值
                  },
                  {name: '', max: 250},
                  {name: '', max: 300},
                  {name: '', max: 100},
                  {name: '', max: 200},
                  {name: '', max: 100},
                  {
                    name: '180',  // 指示器名称
                    max: 300,    // 指示器最大值
                  },
                  {name: '', max: 250},
                  {name: '', max: 300},
                  {name: '', max: 100},
                  {name: '', max: 200},
                  {name: '', max: 100},
                  {name: '270', max: 25, // 这个max设置坐标轴上的值
                    axisTick: {    // 坐标轴
                      show: true,  // 是否显示坐标轴
                      length:200,    // 坐标轴长度
                      lineStyle: {
                        color: "#000"  // 刻度线颜色
                      }
                    },
                    axisLabel: {    // 坐标轴刻度相关设置
                      show: true,    // 是否显示刻度
                      margin:210    // 刻度标签与轴线之间的距离
                    }
                  },
                  {name: '', max: 300},
                  {name: '', max: 100},
                  {name: '', max: 200},
                  {name: '', max: 100},
                  {name: '', max: 100},
                  {name: '', max: 200},
                  {name: '', max: 100},
                  {name: '', max: 150},
                  {name: '', max: 200},
                  {name: '', max: 100},
                  {name: '', max: 100},
              ],
              shape: 'circle',  // 雷达图回执类型  "polygon"  "circle"
              splitNumber: 5,    // 轴分割段数
              name: {
                  textStyle: {
                      color: '#0000ff'  // 刻度文字颜色
                  }
              },
              splitLine: {
                  lineStyle: {  // 分割线颜色，可以设置成带个颜色，也可以设置成颜色数组，分割线会按数组中颜色的顺序依次循环设置颜色
                      color: ['#0000ff'].reverse()
                  }
              },
              splitArea: {  // 是否显示分割区域
                  show: false
              },
              axisLine: {  // 坐标轴轴线颜色
                  lineStyle: {
                      color: '#0000ff'
                  }
              }
          },
          series: [
              {
                  name: '北京',  // 系列名称，用于tooltip的显示，legend的图例筛选，在setOption更新数据和配置项时用于指定对应的系列。
                  type: 'radar', // radar是雷达图
                  lineStyle: lineStyle, // 线条样式
                  data: dataBJ, // 系列中的数据内容数组，可以是多维数组
                  symbol: 'none',  // 设置为none交点不会有图形
                  itemStyle: {  // 折线拐点标志的样式
                      color: '#ff0000'
                  },
                  // areaStyle: {  // 区域填充样式
                  //     opacity: 0.1
                  // }
              },
              // {
              //     name: '上海',
              //     type: 'radar',
              //     lineStyle: lineStyle,
              //     data: dataSH,
              //     symbol: 'none',
              //     itemStyle: {
              //         color: '#B3E4A1'
              //     },
              //     areaStyle: {
              //         opacity: 0.05
              //     }
              // },
              // {
              //     name: '广州',
              //     type: 'radar',
              //     lineStyle: lineStyle,
              //     data: dataGZ,
              //     symbol: 'none',
              //     itemStyle: {
              //         color: 'rgb(238, 197, 102)'
              //     },
              //     areaStyle: {
              //         opacity: 0.05
              //     }
              // }
          ]
      };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
		  }
    }
  }
</script>

<style scoped>
</style>
