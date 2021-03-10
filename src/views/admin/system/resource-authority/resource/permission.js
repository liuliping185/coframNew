import _ from 'lodash'

export default {
  data() {
    return {
      permission: [],
      localGridData: [],
      types:[
        {
          key:'MENU',label:'菜单',
        },
        {
          key:'FUNCTION',label:'功能',
        },
      ]
    }
  },
  watch: {
    gridData: {
      deep: true,
      handler(){
        if (this.deep === 0) {
          this.listenController()
        }
      }
    }
  },
  methods: {
    getTypeLabel(type){
      return this.types.find(t => t.key === type).label
    },
    listenController() {
      this.permission = []
      this.localGridData = _.cloneDeep(this.gridData)
      this.recurrenceData(this.localGridData)
      this.permission.sort()
    },
    recurrenceData(object) {
      object.forEach(item => {
        if (item.level < 3 && item.children.length > 0) {
          this.recurrenceData(item.children)
        } else if (item.level === 3) {
          if (item.menus.length > 0) {
            item.menus.forEach(menuItem => {
              this.permission.push(`${this.changeToUnderline(menuItem.code)}:'${menuItem.code}', //${menuItem.name}  menu`)
            })
          } else if (item.functions.length > 0) {
            item.functions.forEach(functionItem => {
              this.permission.push(`${this.changeToUnderline(functionItem.code)}:'${functionItem.code}', //${functionItem.name}  function`)
            })
          }
        }
      })
    },
    changeToUnderline(code){
      return code.replace(/-/g, '_')
    },
    showPermission(){
      this.visible.permission = true
    }
  },
}
