/**
 * Created by binwang on 2019/4/2.
 */
import { OrganizationController, WorkgroupController, PositionController, EmployeeController } from '@controller'

export default {
  data() {
    return {
      TypeEnums: {
        dimension: 'dimension',
        organization: 'organization',
        position: 'position',
        workgroup: 'workgroup',
        employee: 'employee',
      },
    }
  },
  methods: {
    isDimension(nodeType) {
      if (typeof nodeType === 'string') {
        return nodeType === this.TypeEnums.dimension
      } else {
       try{
         return nodeType.nodeType === this.TypeEnums.dimension
       }catch(e){
         console.trace()
       }
      }
    },
    isOrganization(nodeType) {
      if (typeof nodeType === 'string') {
        return nodeType === this.TypeEnums.organization
      } else {
        return nodeType.nodeType === this.TypeEnums.organization
      }
    },
    isPosition(nodeType) {
      if (typeof nodeType === 'string') {
        return nodeType === this.TypeEnums.position
      } else {
        return nodeType.nodeType === this.TypeEnums.position
      }
    },
    isWorkgroup(nodeType) {
      if (typeof nodeType === 'string') {
        return nodeType === this.TypeEnums.workgroup
      } else {
        return nodeType.nodeType === this.TypeEnums.workgroup
      }
    },
    isEmployee(nodeType) {
      if (typeof nodeType === 'string') {
        return nodeType === this.TypeEnums.employee
      } else {
        return nodeType.nodeType === this.TypeEnums.employee
      }
    },
    async getChildrens(nodeType, data) {
      if (this.isOrganization(nodeType)) {
        let subOrgs = await this.loadOrgSubOrg(data)
        let subWorkgroups = await this.loadOrgSubWorkgroups(data)
        let subPositions = await this.loadOrgSubPositions(data)
        // let subEmployees = await this.loadSubEmployees(data)
        return subOrgs
          .concat(subPositions)
          .concat(subWorkgroups)
          // .concat(subEmployees)
      }
      if (this.isPosition(nodeType)) {
        // let subMembers = await this.loadSubEmployees(data)
        return []
      }
      if (this.isWorkgroup(nodeType)) {
        let subWorkgroups = await this.loadWorkgroupsSubWorkgroups(data)
        // let subMembers = await this.loadSubEmployees(data)
        // return subWorkgroups.concat(subMembers)
        return subWorkgroups
      }
      if (this.isDimension(nodeType)) {
        let nodes = await this.loadRootOrganizations(data)
        return nodes
      }
    },
    async loadSubEmployees(data) {
      let resp = []
      if (this.isOrganization(data)) {
        resp = await this.dispatch(OrganizationController.querySubEmployees, {
          id: data.id,
          limit: 10000,
        })
      } else if (this.isPosition(data)) {
        resp = await this.dispatch(PositionController.querySubEmployees, {
          id: data.id,
          limit: 10000,
        })
      } else if (this.isWorkgroup(data)) {
        resp = await this.dispatch(WorkgroupController.querySubEmployees, {
          id: data.id,
          limit: 10000,
        })
      }
      if (!resp.error) {
        return resp.data.content.map(m => {
          return {
            ...m,
            parent: data,
            nodeType: this.TypeEnums.employee,
            leaf: true,
          }
        })
      }
    },
    async loadOrgSubOrg(data) {
      let resp = await this.dispatch(OrganizationController.pagingByCriteria, {
        parentId: data.id,
        offset: 1,
        limit: 10000,
      })
      if (!resp.error) {
        return resp.data.content.map(m => {
          return {
            ...m,
            parent: data,
            nodeType: this.TypeEnums.organization,
            leaf: false,
          }
        })
      }
    },
    async loadOrgSubWorkgroups(data) {
      let resp = await this.dispatch(OrganizationController.querySubWorkgroups, {
        id: data.id,
      })
      if (!resp.error) {
        return resp.data.content.map(m => {
          return {
            ...m,
            parent: data,
            nodeType: this.TypeEnums.workgroup,
            leaf: false,
          }
        })
      }
    },
    async loadWorkgroupsSubWorkgroups(data) {
      let resp = await this.dispatch(WorkgroupController.pagingByCriteria, {
        parentId: data.id,
        offset: 1,
        limit: 10000,
      })
      if (!resp.error) {
        return resp.data.content.map(m => {
          return {
            ...m,
            parent: data,
            nodeType: this.TypeEnums.workgroup,
            leaf: false,
          }
        })
      }
    },
    async loadOrgSubPositions(data) {
      let resp = await this.dispatch(OrganizationController.querySubPositions, {
        id: data.id,
      })
      if (!resp.error) {
        return resp.data.content.map(m => {
          return {
            ...m,
            parent: data,
            nodeType: this.TypeEnums.position,
            leaf: true,
          }
        })
      }
    },
    async loadRootOrganizations(dimension) {
      if (!dimension) {
        return
      }
      let resp = await this.dispatch(OrganizationController.pagingByCriteria, {
        ...this.query,
        dimensionId: dimension.id,
        mainDimension: dimension.main,
        listRoot: true,
      })
      if (!resp.error) {
        return resp.data.content.map(c => {
          return {
            ...c,
            parent: dimension,
            nodeType: this.TypeEnums.organization,
            leaf: false,
          }
        })
      }
    },

    async remove(data, parentObj) {
      return this.$confirm(this.isDisrelateEmployee(data), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let resp = null
        if (this.isOrganization(data)) {
          resp = await this.dispatch(OrganizationController.deleteByIds, {
            ids: data.id,
          })
        } else if (this.isPosition(data)) {
          resp = await this.dispatch(PositionController.deleteByIds, {
            ids: data.id,
          })
        } else if (this.isWorkgroup(data)) {
          resp = await this.dispatch(WorkgroupController.deleteByIds, {
            ids: data.id,
          })
        } else if (this.isEmployee(data)) {
          let form = { employeeIds: data.id, id: parentObj.id }
             if (this.isOrganization(parentObj)) {
               resp = await this.dispatch(OrganizationController.removeOrgEmployees, form)
             } else if (this.isWorkgroup(parentObj)) {
               resp = await this.dispatch(WorkgroupController.removeWorkgroupEmployees, form)
             } else if (this.isPosition(parentObj)) {
               resp = await this.dispatch(PositionController.removePositionEmployees, form)
             }
        }
        return resp
      })
    },

    isDisrelateEmployee(data){
      return this.isEmployee(data.nodeType)?'此操作将解除关联该数据, 是否继续?':'此操作将永久删除该数据, 是否继续?'
    }

  },
}
