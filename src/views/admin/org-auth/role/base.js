import { RoleController, MenuController, FunctionController } from '@controller'

export default {
  methods: {
    async getResourceByRole(roleId) {
      let resp = await this.dispatch(RoleController.loadWholeResources, {
        id: roleId,
      })
      if (!resp.error) {
        return resp.data
      } else return []
    },
  },
}
