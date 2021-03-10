## Api Rules
后台请求统一使用swagger生成, 不允许手动修改 /src/actions下任何文件, 如后台接口有变化, 运行 build:api即可.

请求方式
```
  import {XXXController} from '@controller'

  async ()=> {
    let resp = await this.dispatch(XXXController.xxxAction, form)
    if(!resp.error){
    
    }
  }
```

提交数据
```
提交数据 'form' 包含请求所需的所有数据, 包括 path, query, body 三类
一般情况下不需要区分这三类数据, 统一放在 form 的属性里即可.
  
ex:
 {
  ...path,
  ...query,
  ...body,
 }

特殊情况 例如 body 里提交的参数没有包含 query 或path 参数时,
用以下方式提交

{
  ...path,
  params: {
    ...query
  },
  payload: body,
}
```

## Coding Rules

### Entitle Rules
1. 所有文件夹,文件名 一律使用蛇形命名, 不允许出现大写字母
2. 模块名按层级转化为文件夹名称, 文件名要求简洁
  ex:  admin/user/list.vue

### Js Rules
1. 语句末尾不允许写 ; 号
2. 字符串统一用 单引号
3. 变量名,方法名必须使用驼峰命名
4. 编码使用 Es6 规范, 无特殊情况不允许使用 es5 语法 
```
ex: 
 for(;;)        =>    list.forEach()
 function(){}   =>    () => {}
 var            =>    let , const
 
 user.name = user1.name   =>   user = {...user1}
 user.age  = user1.age
```
### Css Rules
1. 使用 scss 语法, 有层级关系的css必须嵌套, 组件内样式 必须加上  scoped
2. 无特殊情况, 只允许使用 element 官网 定制的 颜色 ,字体
3. 无特殊情况 定位一律使用内置 class
```
 position: relative; => class="position-relative"
 position: absolute; => class="position-absolute"

 m => margin
 ml => margin-left
 mr => margin-right
 mt => margin-top
 mb => margin-bottom

 p => padding
 pl => padding-left
 pr => padding-right
 pt => padding-top
 pb => padding-bottom
 
 size: 0,5,10,20
 
 ex: 
 margin-left: 20px;  => class="ml-20"
 padding-top: 10px;  => class="pt-10"
 padding: 5px;  => class="p-5"
```

### Vue Rules
1. 模板中严禁出现逻辑代码, 只允许调用 data, computed, method, 最多允许使用三元条件表达式
2. vue文件块儿顺序
```
<template></template>
<script></script>
<style></style>
```
3. javascript 元素顺序
```
  name
  mixins
  components
  provide/inject
  props
  computed
  data
  create/mounted
  ...
  destroy
  watch
  methods
```
