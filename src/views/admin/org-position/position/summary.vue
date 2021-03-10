<template>
  <div>
    <!--{{formData}}-->
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="岗位名称">{{ formData.name }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="岗位代码">{{ formData.code }}</el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="岗位类型">{{ formData.type }}</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="24">
          <el-form-item label="描述">{{ formData.description }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { BaseVue } from '@lib'
export default {
  props: {
    formData: {},
  },
  data() {
    return {}
  },
  watch: {},
  methods: {},
}
</script>
