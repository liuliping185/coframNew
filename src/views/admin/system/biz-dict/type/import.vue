<template>
  <el-dialog :visible.sync="dialogVisible" width="640px" title="导入字典">
    <div>
      <el-form :rules="rules" :model="uploadData"  label-width="120px"  ref="importForm">
        <el-form-item label="导入文件">
          <el-upload
            ref="upload"
            name="file"
            :headers="headers"
            :action="uploadUrl"
            :data="uploadData"
            :on-change="fileChange"
            :before-upload="beforeUpload"
            :on-success="localUploadSuccess"
            :on-error="uploadError"
            :on-remove="handleRemove"
            :limit="1"
            accept="xls"
            :auto-upload="false"
          >
            <el-button type="primary" icon="el-icon-upload">点击上传导入文件 (.xls格式)</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否覆盖">
          <el-checkbox v-model="uploadData.overideExists"></el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {BaseVue, Form} from '@lib'
  import {DictTypeController} from '@controller'
  import * as auth from '@/utils/auth.js'
  export default {
    name: 'dict-import',
    mixins: [BaseVue, Form],
    data(){
      return {
        headers: {},
        uploadUrl: '/api/dict-types/import',
        rules: {

        },
        uploadData:{
          overideExists: false,
        }
      }
    },
    mounted(){
      const token = auth.getToken()
      this.headers.Authorization = token
    },
    methods: {
      async submit(){
        this.$refs['upload'].submit()
      },
      afterCancel() {
        this.importMode = 'file'
      },
      beforeUpload(file) {
        var errorMessage = null
        if (!/\.xls$/.test(file.name)) {
          errorMessage = '请导入 .xls 文件!'
        } else if (file.size / 1024 / 1024 > 200) {
          errorMessage = '上传文件大小不能超过 200MB'
        }
        if (errorMessage) {
          this.$message({
            message: errorMessage,
            type: 'warning',
          })
          this.loading = false
          return false
        }
        this.loading = true
        return true
      },

      uploadSuccess() {
        this.dialogVisible = false
        this.$message({
          message: '导入字典成功!',
          type: 'success',
        })
        this.$emit('success')
      },
      uploadError(data) {
        this.$message({
          message: data.message || data.error || '导入字典失败!',
          type: 'error',
        })
      },
      localUploadSuccess(data) {
        this.loading = false
        if (data.status === 500) {
          this.uploadError(data)
        } else {
          this.uploadSuccess()
        }
      },
    }
  }
</script>
