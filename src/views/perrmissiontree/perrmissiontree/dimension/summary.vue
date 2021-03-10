<template>
  <div>
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="组织机构树名称">{{ formData.name }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织机构树代码">{{ formData.code }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否主机构树">{{ formData.main ? '是' : '否' }}</el-form-item>
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
