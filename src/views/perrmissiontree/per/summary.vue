<template>
  <div>
    <el-form class="view-form" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="机构名称">{{ formData.name }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构代码">{{ formData.code }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级机构">{{ formData.parent ? formData.parent.name : formData.parentId }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构类型">
            <el-select :disabled="true" filterable v-model="formData.type">
              <el-option v-for="item in Dict.orgTypes" :label="item.label" :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构等级">{{ formData.degree }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构状态">{{ getStaticDictName('EnableStatus',formData.status )}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序">{{ formData.sortNo }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属地域" style="word-break: break-all;">{{ formData.area }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构地址" style="word-break: break-all;">{{ formData.address }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮编">{{ formData.zipcode }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" style="word-break: break-all;">{{ formData.linkMan }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">{{ formData.linkTel }}</el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="描述" style="word-break: break-all;">{{ formData.description }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import {BaseVue} from '@lib'
  import {OrganizationController} from '@controller'
  import Dict from './dict'
  export default {
    name: 'org-summary',
    mixins: [BaseVue],
    props: {
      formData: {},
    },
    data() {
      return {
        Dict: Dict,
      }
    },
    watch: {},
    methods: {
      //      async loadData(){
      //          if(this.formData && this.formData.id){
      //            let resp = await  this.dispatch(OrganizationController.findById, {
      //              id: this.formData.id,
      //            })
      //            if(!resp.error){
      //                this.formData = resp.data
      //            }
      //          }
      //
      //      }
    },
  }
</script>
