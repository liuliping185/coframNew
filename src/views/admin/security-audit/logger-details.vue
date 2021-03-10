<template>
  <el-dialog top="20px" title="日志详情" :visible.sync="dialogVisible" :width="'90%'">
    <el-form class="view-form" label="120px" v-if="formData">
      <el-row>
        <el-col :span="12">
          <el-form-item label="目标对象">{{ formData.targetModelName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目标对象ID">{{ formData.targetModelId }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作类型">{{ formData.operateType }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作人">{{ formData.operatorName }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <p><label>{{label}}</label></p>
          <diff-editor v-if="formData.operateType === 'UPDATE'" class="mt-10" height="400" :original="oldDataJson"
                       :modified="newDataJson"></diff-editor>
          <code-editor v-else class="mt-10" height="400" v-model="oldDataJson"></code-editor>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer"> <el-button type="text" @click="cancel">取 消</el-button> </span>
  </el-dialog>
</template>

<script>
  import _ from 'lodash'
  import {BaseVue, Form} from '@lib'
  import {OperationLogController} from '@controller'
  import diffEditor from '@/views/common/code-editor/src/diff.vue'
  const operateTypes = {
    UPDATE: '对象值变化',
    CREATE: '新增对象',
    DELETE: '删除对象',
  }
  export default {
    name: 'logger-details',
    mixins: [BaseVue, Form],
    components: {diffEditor},
    computed: {
      label(){
        return operateTypes[this.formData.operateType]
      },
      oldDataJson() {
        if (this.details && this.details.oldDataJson) {
          return this.parseJSON(this.details.oldDataJson)
        } else {
          return ''
        }
      },
      newDataJson() {
        if (this.details && this.details.newDataJson) {
          return this.parseJSON(this.details.newDataJson)
        } else {
          return ''
        }
      },
    },
    props: {},

    data() {
      return {
        details: {},
      }
    },
    watch: {
      formData(val) {
        this.loadData()
      },
    },
    methods: {
      parseJSON(json) {
        try {
          return JSON.stringify(JSON.parse(json), null, 2)
        } catch (e) {
          return ''
        }
      },
      async loadData() {
        if (this.formData && this.formData.id) {
          let resp = await this.dispatch(OperationLogController.getOperationLogDetail, {logId: this.formData.id})
          if (!resp.error) {
            this.details = resp.data
          }
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
