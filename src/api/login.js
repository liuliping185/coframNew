import ajaxUtil from '@/libs/ajaxUtil'
import * as auth from '@/utils/auth.js'
import store from '@/utils/sessionStore'
export function iamLogout() {
  return ajaxUtil.ajax({
    url: '/logout',
    method: 'post',
    Authorization: auth.getToken(),
  })
}
export function logout() {
  return ajaxUtil.ajax({
    url: '/api/users/logout',
    method: 'post',
    Authorization: auth.getToken(),
  })
}
export function login(user) {
  return ajaxUtil.ajax({
    url: '/api/users/login',
    method: 'post',
    data: user,
  })
}

function getOwnerId() {
  if (store.get('platform') === 'system') {
    return store.get('system').id
  } else {
    return 'platform'
  }

}
function getOwnerType() {
  return store.get('platform') === 'system' ? 'system' : 'platform'
}

// const getMenuUrl = (id) => {
//   return isIam() ? `/api/users/menus` :  `/api/users/${id}/menus`
// }
// const getFunctionsUrl = (id) => {
//   return isIam() ?`/api/users/function-codes` :  `/api/users/${id}/function-codes`
// }
const getMenuUrl = (id) => {
  return `/api/users/menus?ownerId=${getOwnerId()}&ownerType=${getOwnerType()}`
}
const getFunctionsUrl = (id) => {
  return `/api/users/function-codes?ownerId=${getOwnerId()}&ownerType=${getOwnerType()}`
}
const getUserUrl = () => `/api/users/get/current-user`
const getRolesUrl = '/api/uc/permissions/employees/authorised'

function getUser(token) {
  return ajaxUtil
    .headers({
      Authorization: token,
    })
    .ajax({
      url: getUserUrl(),
      method: 'get',
    })
}
function getFunctions(empId, token) {
  return ajaxUtil
    .headers({
      Authorization: token,
    })
    .ajax({
      url: getFunctionsUrl(empId),
      method: 'get',
    })
}

function getMenus(empId, token) {
  return ajaxUtil
    .headers({
      Authorization: token,
    })
    .ajax({
      url: getMenuUrl(empId),
      method: 'get',
    })
}

function getRoles(empId, token) {
  return new Promise((resolve, reject) => {
    return ajaxUtil
      .headers({
        Authorization: token,
      })
      .ajax({
        url: getRolesUrl + `?empId=${empId}`,
        method: 'get',
      })
      .then(response => {
        if (response.data.length === 0) {
          //如果没有角色 则赋予游客权限
          // reject('您无权登录!')
          resolve({
            data: [
              {
                roleCode: 'visitor',
              },
            ],
          })
        } else resolve(response)
      })
      .catch(reject)
  })
}
export function getPermissions(empId, token) {
  // if (isIam()) {
  return Promise.all([ getMenus(empId, token), getFunctions(empId, token),getUser(token)])
  // } else {
  // return Promise.all([getMenus(empId, token), getFunctions(empId, token)])
  // }
}
