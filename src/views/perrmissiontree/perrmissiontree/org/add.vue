<template>
  <el-dialog :visible.sync="dialogVisible" width="860px" :title="title">
    <div v-if="dialogVisible">
      <el-form :ref="formRef" :rules="rules" :model="form" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="机构代码" prop="code">
              <el-input :disabled="form.id" :maxlength="50" v-model="form.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构名称" prop="name">
              <el-input :maxlength="20" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级机构">
              <el-input v-if="formType === 'add'" :maxlength="32" disabled v-model="parentObj.name"></el-input>
              <SelectTree v-else :id.sync="form.parentId" v-model="form.parentId" :currentId="form.id"
                          :rootData="dimension"></SelectTree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <Dict dictTypeCode="cof-orgtype" v-model="form.type"></Dict>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等级" prop="level">
              <el-input-number :min="0" :precision="0" v-model="form.degree"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <SelectStaticDict :dicts="Dict.EnableStatus" v-model="form.status"></SelectStaticDict>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortNo">
              <el-input-number :min="0" :precision="0" v-model="form.sortNo"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域" prop="area">
              <el-input :maxlength="100" v-model="form.area"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input :maxlength="100" v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮编" prop="zipcode">
              <el-input maxlength="10" v-model="form.zipcode"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系人" prop="linkMan">
              <el-input maxlength="20" v-model="form.linkMan"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkTel">
              <el-input :maxlength="20" v-model="form.linkTel"></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" :maxlength="200" v-model="form.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-tabs v-if="!dimension.main">
          <el-tab-pane label="关联主机构">
              <el-row :gutter="20">
                <el-col :span="12">

                  <el-form-item label="关联主机构" prop="mainDimensionOrg.id">
                    <SelectTree :allowClick="node => !node.main" :id.sync="form.mainDimensionOrg.id" v-model="form.mainDimensionOrg.id"
                                :rootData="mainDimension"></SelectTree>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <!-- NONE, CURRENT, ALL -->
                  <!--<el-form-item label="关联策略" prop="strategy">-->
                    <!--<el-input :maxlength="20" v-model="form.strategy"></el-input>-->
                  <!--</el-form-item>-->

                </el-col>
              </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button
        type="primary"
        v-if="formType === 'add'"
        @click="submit(true)"
        v-loading="OrganizationController.create.loading || OrganizationController.update.loading"
      >保存并继续


      </el-button
      >
      <el-button type="primary" @click="submit(false)"
                 :loading="OrganizationController.create.loading || OrganizationController.loading"
      >保存


      </el-button
      >
    </div>
  </el-dialog>
</template>
<script>
  import _ from 'lodash'
  import {BaseVue, Form, Validator, ValidatorCode} from '@lib'
  import model from './model'
  import Dict from './dict'
  import Base from '../base'
  import SelectTree from './select-tree'
  import {OrganizationController, DimensionController} from '@controller'
  export default {
    name: 'org-add',
    mixins: [BaseVue, Form, Base],
    components: {
      SelectTree
    },
    props: {
      parentObj: {},
      dimension: {},
    },
    computed: {
      title() {
        return `${this.formType === 'add' ? '新增' : '编辑'}组织机构`
      },
      formType() {
        return this.form && this.form.id ? 'edit' : 'add'
      },
      mainDimension(){
        return this.DimensionController.queryByCriteria.data.find(m => m.main)
      }
    },

    data() {
      return {
        Dict: Dict,
        formRef: 'OrganizationForm',
        rules: {
          name: [
            {required: true, message: '机构名称不能为空!'},
            {validator: Validator.name},
          ],
          code: [
            {required: true, message: '机构代码不能为空!'},
            {validator: Validator.code},
          ],
          type: {required: true, message: '类型不能为空!'},
//          level: {required: true, message: '等级不能为空!'},
          status: {required: true, message: '状态不能为空!'},
          area: [
            {validator: Validator.name},
          ],
          address: [
            {validator: Validator.name},
          ],
          zipcode: {validator: Validator.zipcode},
          linkMan: [
            {validator: Validator.name},
          ],
          linkTel: {
//            validator: Validator.telNumber
          }
        },
        model: model,
        form: _.cloneDeep(model),
      }
    },
    methods: {
      afterFormChanged() {
        this.form.parentId = this.form.parent.id
      },
      async validateResolve(param) {
        let resp = {}
        let form = _.cloneDeep( this.form)
        if (this.formType === 'add') {
          form.dimension = {id: this.dimension.id}
          if (this.isOrganization(this.parentObj)) {
            form.parentId = this.parentObj.id
          }
          if(!form.mainDimensionOrg.id){
            delete form.mainDimensionOrg
          }
          resp = await this.dispatch(OrganizationController.create, form)
        } else if (this.formType === 'edit') {
          //未知的bug： JSON.stringfy 无法解析this.form // 无法解析是因为内部有循环调用
          // OrganizationController.update请求参数不需要parent 和 children ,会引起自循环
          if (form.parentId === form.dimension.id) {
            form.parentId = null
          }
          if (form.parent) {
            delete form.parent
          }
          if (form.children) {
            delete form.children
          }
          if(!form.mainDimensionOrg.id){
            delete form.mainDimensionOrg
          }
          resp = await this.dispatch(OrganizationController.update, form)
        }
        if (!resp.error) {
          this.$message({
            message: '保存成功!',
            type: 'success',
          })
          if (param) {
            let sortNo = this.form.sortNo
            this.resetFields()
            this.form.sortNo = sortNo
          } else {
            this.cancel()
          }
          this.$emit('success', this.form)
        }
      },
    },
  }
</script>
