/**
 * Created by binwang on 18/5/24.
 */
import _ from 'lodash'
import moment from 'moment'
import store from '@util/sessionStore'
import {mapGetters} from 'vuex'
import {VueUtil, Dict, TimeUtil} from '@lib'
import {FuncCode} from '@/permission/index.js'

import {IBusinessDictController, IProjectController} from '@controller'
import {hasPermission} from '@/directive/permission'

import * as Controllers from '@controller'
const ControllersMap = _.map(Controllers, (value, key) => {
  return value
})

export default {
  inject: ['reload'],
  computed: {
    ...VueUtil(this)
      .select(ControllersMap)
      .state(),

    ...mapGetters(['businessDicts', 'members']),

    workspaceHeight() {
      return `min-height: ${document.body.clientHeight - 125}px;`
    },
    workspaceRealHeight() {
      return `min-height: ${document.body.clientHeight - 85}px;max-height:${document.body.clientHeight - 85}px;`
    },
    workspaceRealHeightNum() {
      return document.body.clientHeight
    },
    workspaceRealWidthNum() {
      return document.body.clientWidth
    },

    isFullModel() {
      return false
    },
    platform() {
      return store.get('platform')
    },
    currentSystem() {
      return store.get('system') || store.get('dubbo')
    },
    currentSystemId() {
      return _.get(store.get('system') || store.get('dubbo'), 'id', null)
    },
    userInfo() {
      return this.$store.getters.userInfo || {}
    },
    roles() {
      return this.$store.getters.roles || []
    },
    isAdmin() {
      return this.roles.some(role => role === 'sysadmin')
    },
    isIE() {
      return window.ActiveXObject || 'ActiveXObject' in window
    },
  },
  data() {
    return {
      Dict: Dict,
      FuncCode: FuncCode,
    }
  },

  methods: {
    ...VueUtil(this)
      .select(ControllersMap)
      .actions(),

    allow(funcCode) {
      return hasPermission(this.$store.getters.permissions.functions, funcCode)
    },
    getDict(dictTypeId) {
      return VueUtil(this).ajax(IBusinessDictController.getBizDict, {
        dictTypeId,
      })
    },

    getStaticDict(dictTypeId, id) {
      if (dictTypeId && id)
        return Dict[dictTypeId].find(d => d.value === id)
      else
        return {}
    },

    getNegativeFromStaticDict(dictTypeId, id) {
      return Dict[dictTypeId].find(d => d.value !== id)
    },

    getStaticDictName(dictTypeId, id) {
      return this.getStaticDict(dictTypeId, id).label
    },

    getDictName(dictTypeId, id) {
      if (this.businessDicts && this.businessDicts[dictTypeId] && this.businessDicts[dictTypeId].length > 0) {
        return this.businessDicts[dictTypeId].find(d => d.dictID === id).dictName
      }
    },

    async loadChildrenDict(dictTypeId, parentId) {
      let key = `${dictTypeId}-${parentId}`
      if (this.businessDicts && this.businessDicts[key] && this.businessDicts[key].length > 0) {
        return this.businessDicts[key]
      }
      let resp = await this.dispatch(IBusinessDictController.getChildDict, {
        dictTypeId,
        parentId,
      })
      if (resp && !resp.error) {
        this.$store.dispatch('setDicts', {
          ...this.businessDicts,
          [key]: resp.data['dictList'],
        })
        return resp.data['dictList']
      } else {
        return []
      }
    },
    async loadDict(dictTypeId) {
      if (this.businessDicts && this.businessDicts[dictTypeId] && this.businessDicts[dictTypeId].length > 0) {
        return this.businessDicts[dictTypeId]
      }
      let resp = await this.dispatch(IBusinessDictController.getBizDict, {
        dictTypeId,
      })
      if (resp && !resp.error) {
        this.$store.dispatch('setDicts', {
          ...this.businessDicts,
          [dictTypeId]: resp.data['dictList'],
        })
        return resp.data['dictList']
      } else {
        return []
      }
    },

    async setDicts(dictId, variableName) {
      this[variableName] = await this.loadDict(dictId)
    },
    goto({name, props, title = null}) {
      this.$emit('goto', {
        title,
        name,
        props,
      })
    },

    choosePlatform(type, val) {
      store.set(store.get('platform'), null)
      store.set('platform', type)
      if (val) {
        store.set(type, val)
      }
      //?????? ??????????????? ???????????????????????????
      this.$router.push({path: '/'})
      this.$store.dispatch('setNeedGetPermission', true)
      this.$store.dispatch('delAllViews')
      this.reload()

      //?????????????????? ?????? router.beforeEach ????????????
      let query = {platform: type}
      this.$router.push({path: '/', query: query})
    },

    // ?????? ??????????????????????????????, ????????????????????????????????????????????????
    setFormStatus(status) {
      this.$store.dispatch('setFormStatus', status)
    },

    // toHome() {
    //   // this.choosePlatform('workplatform')
    // },

    confirm(message) {
      return this.$confirm(message, '??????', {
        confirmButtonText: '??????',
        cancelButtonText: '??????',
        type: 'warning',
      })
    },

    timestempToStr(stemp, format = 'YYYY-MM-DD HH:mm'){
      if (stemp) {
        return moment(stemp * 1).format(format)
      } else {
        return ''
      }
    },

    time19(time = null, length = 19) {
      if (time !== null) return time.substring(0, length)
      else {
        return ''
      }
    },
    timeFormat(second) {
      let hour = '',
        minute = ''
      if (second < 0) {
        second = `0???`
      } else if (second >= 0 && second < 60) {
        second = `${second}???`
      } else if (second >= 60 && second < 3600) {
        minute = `${(second / 60).toFixed(0)}???`
        second = `${second % 60}???`
      } else if (second >= 3600 && second < 3600 * 24) {
        hour = `${(second / 3600).toFixed(0)}??????`
        minute = `${((second % 3600) / 60).toFixed(0)}???`
        second = `${(second % 60).toFixed(0)}???`
      } else {
        second = '????????????'
      }
      return `${hour}${minute}${second}`
    },
    getDateDiff(dateTimeStamp) {
      if (_.isString(dateTimeStamp)) dateTimeStamp = moment(dateTimeStamp).format('X') * 1000
      return TimeUtil.getDateDiff(dateTimeStamp) || '??????'
    },
    getValue(o, f, d) {
      return _.get(o, f, d || '')
    },
    convertArrayToObject(array) {
      var obj = {}
      if (array && array.length > 0) {
        array.map(item => {
          obj[item.k] = item.v
        })
      }
      return obj
    },
    getFileSize(size, unit = 'KB') {
      size = size / 1024
      if (size < 1024) {
        size = size.toFixed(2)
        return `${size} ${unit}`
      } else return this.getFileSize(size, 'MB')
    },
    convertJsonToObject(json) {
      if (json) {
        return JSON.parse(json)
      } else {
        return {}
      }
    },
    startInterval(id, execute, delay = 3000) {
      this.stopInterval(id)
      execute.call(this)
      window[id] = window.setInterval(execute, delay)
    },

    stopInterval(id) {
      if (window[id]) {
        window.clearInterval(window[id])
      }
    },
    substring(str, start, length, suffix = '') {
      if (str.length < length) {
        return str
      } else {
        return str.substring(start, length) + suffix
      }
    },
  },
}
