<template>
  <div :style="`min-height:${height}px;position:relative;`">
    <Monaco
      v-if="!dialogVisible"
      ref="monaco"
      mode="diff"
      class="monaco-border"
      :language="language"
      :height="height"
      :originalCode="original"
      :modifiedCode="modified"
      :theme="theme"
      @codeChange="onCodeChang"
      :options="editorOptions"
    ></Monaco>
  </div>
</template>

<script>
import _ from 'lodash'
import { BaseVue } from '@lib'
import Monaco from '@lib/monaco/Monaco.vue'
export default {
  name: 'code-diff-editor',
  mixins: [BaseVue],
  components: { Monaco },
  computed: {
    editorOptions() {
      return {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: true,
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
    original: {
      type: String,
    },
    modified: {
      type: String,
    },
  },

  data() {
    return {
      dialogVisible: false,
    }
  },
  mounted() {},
  watch: {},
  methods: {
    onCodeChang(editor) {
      this.$emit('update:modified', editor.modifiedEditor.getValue())
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

.monaco-border {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
