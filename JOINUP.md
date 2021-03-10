## Coframe前端接入指南

###第一步: 以coframe-ui为基础框架建立项目
```
//执行
npm install
```
###第二步: 配置后台swagger-ui接口地址
/scripts/config.js
```
module.exports = {
  modules: [
    {
      name: 'demo', //全局项目模块标识
      swaggerUrl: 'http://192.168.0.1/v2/api-docs',
    },
  ]
}
```
注意保证该后台服务已经接入 coframe相关 jar包

允许配置多个项目模块,但不能重名

```
//执行
npm run build:api
```
```
//结果
read demo : http://192.168.0.1/v2/api-docs ...
create controller
创建action 成功, 共:38个

Process finished with exit code 0
```
执行成功后, 在 src/actions下可以看到生成的后台服务代码, 这里的代码不可修改,如后台接口发生变化,则重新执行命令即可.

###第三步: 

在/src/views下建立项目模块文件夹, 存放所有模块页面和组件
```
src/views/demo
```
在/src/router/modules 下建立项目模块路由文件, 在 /src/router/index.js中引用并合并该路由
```
src/router/modules/demo.js
```
src/router/index.js
```
...
import Demo from './modules/demo'
...
export const asyncRouterMap = [
  ...
  ...Demo,
  ...
]
...
```
##开发指南
```
//运行
npm run dev
```
默认前端运行端口是 9527, 后端端口是 8081, 建议使用nginx转发请求

nginx.conf
```
location /api{
    proxy_pass http://10.15.15.115:8989/api;
}
location /api/users/login{
    proxy_pass http://10.15.15.115:8989/api/users/login;
}
location /api/users/logout{
    proxy_pass http://10.15.15.115:8989/api/users/logout;
}
```
也可以直接修改配置 /config/index.js 下的 proxyTable来转发请求
```
proxyTable: {
  '/api': {
    target: 'http://localhost:8081/api',
    pathRewrite: {'^/api': ''}
  },
},
```

###基础类封装

```
// 基础引用
import {BaseVue , List, Form } from '@lib'
```

BaseVue里封装了后台调用api的方法,和一些全局方法, 建议业务类组件都使用 mixins 混入该类
```
mixins:[BaseVue], 
```
List 里封装了分页查询页面的常用方法.
```
mixins:[BaseVue, List], 
```
Form 里封装了表单页面的常用方法.
```
mixins:[BaseVue, Form], 
```

通过执行npm run build:api, 我们已经生成了与后端controller 一一对应的接口类, 前端组件在使用时可直接引入

```
//后台 Controller 引用
import {UserController} from '@controller'
```

在方法中我们可以直接调用 this.dispatch来调用后台接口
```
/**
 这里建议使用 es6 的异步处理, async + await 模式.
*/
async getUser(){
  let resp = await this.dispatch(UserController.getUser, ...params)
  
  if(!resp.error){
     alert('success')
  }else{
     alert('failure')
  }
}
```
如此我们就可以像使用后台java方法一样调用rest接口, 不再需要编写rest 接口的url, method 等具体配置, 只需将该接口所需的参数以对象形式传入即可.
```
// 参数的对象化封装
{
 name1: 'demo1', // path 参数
 name2: 'demo2', 
 name3: 'demo3', 
 params:{
  ... // query 参数
 },
 payload:{
  ... // body 参数
 }
}
```
### 权限控制
权限码在coframe菜单系统配置 > 资源权限 > 资源管理中配置

在 src/permission/FuncCode.js 中定义权限码, 
```
export default {
  ...
  cof_f_auth_tpl_add:'cof-f-auth-tpl-add', //新增权限模板  function
  cof_f_auth_tpl_add_res_group:'cof-f-auth-tpl-add-res-group', //权限模板新增资源组  function
  cof_f_auth_tpl_del:'cof-f-auth-tpl-del', //删除权限模板  function
  ...
}
```
使用权限指令控制组件权限
```
<el-button v-permission="FuncCode.cof_f_auth_tpl_add"></el-button>
```
也可使用 BaseVue 中的allow方法控制权限
```
<el-button v-if="allow(FuncCode.cof_f_auth_tpl_add)"></el-button>
```

### 静态资源
静态资源一律按分类放置在 /static 目录下

## 打包发布
```
// 运行 
npm run build:prod 
// 生成
/dist/
```
为优化前端打包效率, 以下类库不参与每次构建打包, 我们称之为固件库, 如果固件库需要升级, 则需运行一次  npm run build:dll,
重新生成 /static/js/vendor.dll.js 即可
```
// 可自行添加或排除固件库
vendor: [
  'vue/dist/vue.esm.js',
  "vue-i18n",
  "vue-router",
  "vuex",
  "xlsx",
  'd3',
  'd3-tip',
  'element-ui',
  'echarts',
  'sortablejs',
  'lodash',
  'lodash.debounce',
  'store',
  'babel-polyfill' 
]
```
