<template>
  <div>
    <dv-full-screen-container >
     <!-- <dv-border-box-11 title="标题"> -->
       <dv-charts :option="option"/>
       <dv-active-ring-chart :config="config" style="width:300px;height:300px" />
       <dv-capsule-chart :config="capsuleChart" style="width:300px;height:200px;color:#000;" />
       <dv-water-level-pond :config="waterLevelPond" style="width:150px;height:200px" />
       <dv-percent-pond :config="percentPond" style="width:200px;height:100px;" />
       <dv-flyline-chart :config="flylineChart" style="width:100%;height:100%;" />
       <dv-conical-column-chart :config="conicalColumnChart" style="width:400px;height:200px;" />
       <!-- <dv-digital-flop :config="digitalFlop" style="width:200px;height:50px;" /> -->
       <dv-scroll-board :config="scrollBoard" style="width:500px;height:220px" />
       <dv-scroll-ranking-board :config="rankingBoard" style="width:500px;height:300px" />
     <!-- </dv-border-box-11> -->
    </dv-full-screen-container>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      option: {
        title: {
          text: '剩余油量表',
          style: {
            fill: '#000'
          }
        },
        series: [
          {
            type: 'gauge',
            data: [ { name: 'itemA', value: 55 } ],
            center: ['50%', '55%'],
            axisLabel: {
              formatter: '{value}%',
              style: {
                fill: '#000'
              }
            },
            axisTick: {
              style: {
                stroke: '#000'
              }
            },
            animationCurve: 'easeInOutBack'
          }
        ]
      },
      config: {
        digitalFlopStyle: {
          fontSize: 25,
          fill: '#000'
        },
        data: [
          {
            name: '周口',
            value: 55
          },
          {
            name: '南阳',
            value: 120
          },
          {
            name: '西峡',
            value: 78
          },
          {
            name: '驻马店',
            value: 66
          },
          {
            name: '新乡',
            value: 80
          }
        ]
      },
      capsuleChart: {
        data: [
          {
            name: '南阳',
            value: 167
          },
          {
            name: '周口',
            value: 67
          },
          {
            name: '漯河',
            value: 123
          },
          {
            name: '郑州',
            value: 55
          },
          {
            name: '西峡',
            value: 98
          }
        ]
      },
      waterLevelPond: {
        data: [55],
        shape: 'round'
      },
      percentPond: {
        value: 66
      },
      flylineChart: {
        centerPoint: [0.48, 0.35],
        points: [
          [0.52, 0.23],
          [0.43, 0.29],
          [0.59, 0.35],
          [0.53, 0.47],
          [0.45, 0.54],
          [0.36, 0.38],
          [0.62, 0.55],
          [0.56, 0.56],
          [0.37, 0.66],
          [0.55, 0.81],
          [0.55, 0.67],
          [0.37, 0.29],
          [0.20, 0.36],
          [0.76, 0.41],
          [0.59, 0.18],
          [0.68, 0.17],
          [0.59, 0.10]
        ],
        bgImgUrl: '/img/flylineChart/map.jpg'
      },
      conicalColumnChart: {
        data: [
          {
            name: '周口',
            value: 55
          },
          {
            name: '南阳',
            value: 120
          },
          {
            name: '西峡',
            value: 71
          },
          {
            name: '驻马店',
            value: 66
          },
          {
            name: '新乡',
            value: 80
          },
          {
            name: '信阳',
            value: 35
          },
          {
            name: '漯河',
            value: 15
          }
        ],
        img: [
          '/img/conicalColumnChart/1st.png',
          '/img/conicalColumnChart/2st.png',
          '/img/conicalColumnChart/3st.png',
          '/img/conicalColumnChart/4st.png',
          '/img/conicalColumnChart/5st.png',
          '/img/conicalColumnChart/6st.png',
          '/img/conicalColumnChart/7st.png'
        ]
      },
      digitalFlop: [
        {
          number: [100],
          toFixed: 2,
          content: '{nt}个'
        },
        {
          number: [999],
          toFixed: 2,
          content: '{nt}个'
        }
      ],
      scrollBoard: {
        header: ['列1', '列2', '列3'],
        data: [
          ['行1列1', '行1列2', '行1列3'],
          ['行2列1', '行2列2', '行2列3'],
          ['行3列1', '行3列2', '行3列3'],
          ['行4列1', '行4列2', '行4列3'],
          ['行5列1', '行5列2', '行5列3'],
          ['行6列1', '行6列2', '行6列3'],
          ['行7列1', '行7列2', '行7列3'],
          ['行8列1', '行8列2', '行8列3'],
          ['行9列1', '行9列2', '行9列3'],
          ['行10列1', '行10列2', '行10列3']
        ]
      },
      rankingBoard: {
        data: [
          {
            name: '周口',
            value: 55
          },
          {
            name: '南阳',
            value: 120
          },
          {
            name: '西峡',
            value: 78
          },
          {
            name: '驻马店',
            value: 66
          },
          {
            name: '新乡',
            value: 80
          },
          {
            name: '信阳',
            value: 45
          },
          {
            name: '漯河',
            value: 29
          }
        ]
      }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
  }

  .border-box-content {
    color: rgb(66,185,131);
    font-size: 40px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
