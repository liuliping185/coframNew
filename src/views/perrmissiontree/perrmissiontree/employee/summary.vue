<template>
  <div>
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="员工名称">{{ formData.name }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="员工代码">{{ formData.code }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司邮箱">{{ formData.pEmail }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期">{{ formData.inDate }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="离职日期">{{ formData.outDate }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">{{ formData.state }}</el-form-item>
        </el-col>
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
