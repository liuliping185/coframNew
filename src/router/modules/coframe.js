import FuncCode from '@/permission/FuncCode'
const _import = require('../_import_' + process.env.NODE_ENV)

import Layout from '@/views/layout/Layout'

export default [
// {
//   path: '/role3',
//   component: Layout,
//   // funccode: FuncCode.role,
//   group: 'role3',
//   redirect: 'noredirect',
//   alwaysShow: true,
//   name: 'role3',
//   meta: {
//     title: 'icon图标查询',
//     icon: 'devops_logo',
//   },
//   children: [{
//       path: 'llptest1',
//       // funccode: FuncCode.role,
//       component: _import('llptest1/role1'),
//       name: '',
//       // funccode:FuncCode.cof_m_role_template,
//       meta: {
//         title: '图标列表',
//       },
//     }
//   ]
// }
{
  path: '/index',
  component: Layout,
  // funccode: FuncCode.role,
  group: 'index',
  redirect: 'noredirect',
  alwaysShow: true,
  name: 'index',
  meta: {
    title: 'dataV',
    icon: 'devops_logo',
  },
  children: [{
      path: 'datav',
      // funccode: FuncCode.role,
      component: _import('index/datav'),
      name: '',
      // funccode:FuncCode.cof_m_role_template,
      meta: {
        title: 'dataV',
      },
    }
  ]
}
]
