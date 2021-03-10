import { RoleController, MenuController, FunctionController, RoleTplController } from '@controller'

export default {
  methods: {
    changeData(val) {
      if (this.resources.length > 0) {
        this.resources = val
      }
    },
    async getResourceByRole(roleId) {
      let resp = await this.dispatch(RoleTplController.loadWholeResources, {
        id: roleId,
      })
      if (!resp.error) {
        return resp.data
      } else return []
    },

    beforeModifyRoleData(val) {

      val.forEach(item => {
        if (item.children.length > 0) {
          this.beforeModifyRoleData(item.children)
        } else {
          if (item.menus.length > 0) {
            item.menus.forEach(menuItem => {
              this.findLeafData(this.initialData, menuItem)
            })
          } else if (item.functions.length > 0) {
            item.functions.forEach(functionItem => {
              this.findLeafData(this.initialData, functionItem)
            })
          }
        }
      })
    },
    findLeafData(val, compareData) {
      val.forEach(item => {
        if (item.children.length > 0) {
          this.findLeafData(item.children, compareData)
        } else {
          if (item.menus.length > 0) {
            item.menus.forEach(menuItem => {
              if (menuItem.id === compareData.id && menuItem.selected !== compareData.selected) {
                this.operatableResources.push({
                  id: compareData.id,
                  operation: compareData.selected ? 'ADD' : 'REMOVE',
                  type: 'MENU',
                })
              }
            })
          } else if (item.functions.length > 0) {
            item.functions.forEach(functionItem => {
              if (functionItem.id === compareData.id && functionItem.selected !== compareData.selected) {
                this.operatableResources.push({
                  id: compareData.id,
                  operation: compareData.selected ? 'ADD' : 'REMOVE',
                  type: 'FUNCTION',
                })
              }
            })
          }
        }
      })
    },
  },
}
