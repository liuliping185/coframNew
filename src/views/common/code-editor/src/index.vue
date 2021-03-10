<template>
  <div :style="`min-height:${height}px;position:relative;`">
    <template v-if="!disabled">
      <MonacoEditor
        v-if="!dialogVisible"
        ref="monaco"
        class="monaco-border"
        :language="language"
        :height="height"
        :code="value"
        :theme="theme"
        @codeChange="onCodeChang"
        :options="editorOptions"
      ></MonacoEditor>

      <el-button v-if="maxable" @click="max" class="max-btn" type="text">
        <svg-icon :class="maxableBtnClass" iconClass="my-max"></svg-icon>
      </el-button>
      <el-dialog
        :close-on-click-modal="false"
        :title="label"
        fullscreen="true"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :width="maxWidth"
        class="body-no-padding"
      >
        <MonacoEditor
          v-if="dialogVisible"
          ref="monaco-max"
          class="monaco-border"
          :language="language"
          :height="workspaceRealHeightNum - 125"
          :code="value"
          :theme="theme"
          @codeChange="onCodeChang"
          :options="editorOptions"
        ></MonacoEditor>
        <span slot="footer" class="dialog-footer"> <el-button @click="cancel">关闭</el-button> </span>
      </el-dialog>
    </template>
    <div v-else>
      <pre style="max-height:400px;overflow: auto;">{{ value }}</pre>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { BaseVue } from '@lib'
import MonacoEditor from '@lib/monaco/Monaco.vue'
export default {
  name: 'code-editor',
  mixins: [BaseVue],
  components: { MonacoEditor },
  computed: {
    maxableBtnClass() {
      if (this.theme === 'vs') {
        return 'maxable-btn-dark'
      } else {
        return 'maxable-btn-light'
      }
    },
    editorOptions() {
      return {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        glyphMargin: true,
        wordWrap: 'off',
        ...this.options,
      }
    },
  },
  props: {
    maxable: {
      type: Boolean,
      default: true,
    },
    maxWidth: {
      default: '860px',
    },
    label: {
      type: String,
      default: '脚本',
    },
    defaultValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'javascript',
    },
    theme: {
      type: String,
      default: 'vs',
    },
    height: {
      type: String | Number,
      default: 180,
    },
    options: {
      type: Object,
    },
    value: {},
  },

  data() {
    return {
      dialogVisible: false,
    }
  },
  methods: {
    onCodeChang(editor) {
      this.$emit('input', editor.getValue())
    },
    setValue(value) {
      try {
        if (this.$refs['monaco']) {
          this.$refs['monaco']
            .getEditor()
            .getModel()
            .setValue(value)
        }

        if (this.$refs['monaco-max']) {
          this.$refs['monaco-max']
            .getEditor()
            .getModel()
            .setValue(value)
        }
      } catch (e) {
        console.log(e)
      }
    },
    getModel() {
      try {
        return this.$refs['monaco'].getEditor().getModel()
      } catch (e) {
        return {}
      }
    },
    getPosition() {
      return this.$refs['monaco'].getEditor().getPosition()
    },

    cancel() {
      this.dialogVisible = false
    },
    max() {
      this.dialogVisible = true
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.max-btn {
  z-index: 100;
  position: absolute;
  left: 10px;
  top: 0px;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.4);
  }
}

.maxable-btn-dark {
  color: #0a76a4;
}

.maxable-btn-light {
  color: #ffffff;
}

.monaco-border {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
