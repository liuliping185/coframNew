<template>
  <div class="tinymce-container editor-container" :class="{ fullscreen: fullscreen }">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container"><editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage></div>
  </div>
</template>

<script>
import editorImage from './components/editorImage';
import plugins from './plugins';
import toolbar from './toolbar';
import { FileController } from '@controller';
import { BaseVue, Form, Validator, _ } from '@lib';

export default {
  name: 'tinymce',
  components: { editorImage },
  mixins: [BaseVue, Form],
  props: {
    id: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    uploadImg: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    menubar: {
      default: 'file edit insert ' //菜单
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date(),
      fullscreen: false
    };
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val));
      }
    }
  },
  mounted() {
    this.initTinymce();
  },
  activated() {
    this.initTinymce();
  },
  deactivated() {
    this.destroyTinymce();
  },
  methods: {
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ', //body设置一个class或id
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins, //插件
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,

        language: 'zh_CN', //调用放在langs文件夹内的语言包
        //statusbar: false, //隐藏底部状态栏
        branding: false, //隐藏右下角技术支持
        menubar: false, //菜单关闭
        elementpath: false, //左下角的当前标签路径
        // automatic_uploads: false, //此时图像并未真正上传到服务器，而是以Data URL/Blob URL的方式插入在内容中
        // images_upload_url: 'postAcceptor.php',
        // images_upload_url: 'https://xcx.banjingkeji.com:8443/mach/file/uploadPicAjax', //接受上传文件的后端处理程序地址
        // images_upload_base_path: '/demo', //给返回的相对路径指定它所相对的基本路径。
        // images_upload_credentials: false, //对images_upload_url中指定的地址调用时是否传递cookie等跨域的凭据。
        // toolbar_mode: 'sliding',
        placeholder: '在这里输入文字',
        keep_styles: false, //样式保持
        file_picker_types: 'file image',
        // custom_undo_redo_levels: 3,//可退回步数
        // convert_urls: false,//路径自动处理成相对路径

        // images_dataimg_filter(img) {
        //   //定义一个自定义过滤器处理base64图像转blobs的逻辑。
        //   console.log('img', img);
        //   return !img.hasAttribute('internal-blob');
        // },

        init_instance_callback: editor => {
          //此配置选项允许你在编辑器初始化完成后，执行自己的回调函数。此函数支持一个参数，该参数为编辑器实例对象的引用。
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true;
            this.$emit('input', editor.getContent());
          });
        },
        setup(editor) {
          // editor.on('FullscreenStateChanged', e => {
          //   _this.fullscreen = e.state
          // })
          editor.on('undo', e => {
            // console.log(e);
            // console.log(editor);
            // console.log(editor.undoManager.data);
            // console.log(editor.dom);
            // console.log(tinymce.activeEditor.selection.bookmarkManager.getBookmark());
            // console.log(tinymce.activeEditor.selection.bookmarkManager.moveToBookmark());
          });
          editor.on('redo', e => {
            console.log(e);
          });
          editor.on('FullscreenStateChanged', e => {
            _this.fullscreen = e.state;
          });
        },
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   console.log(img);
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        // images_upload_handler(blobInfo, success, failure, progress) {
        //   progress(0);
        //   const token = _this.$store.getters.token;
        //   getToken(token).then(response => {
        //     const url = response.data.qiniu_url;
        //     const formData = new FormData();
        //     formData.append('token', response.data.qiniu_token);
        //     formData.append('key', response.data.qiniu_key);
        //     formData.append('file', blobInfo.blob(), url);
        //     upload(formData).then(() => {
        //       success(url);
        //       progress(100);
        //     })
        //   }).catch(err => {
        //     failure('出现未知问题，刷新页面，或者联系程序员')
        //     console.log(err);
        //   });
        // },
        file_browser_callback: function(field_name, url, type, win) {
          win.document.getElementById(field_name).value = 'my browser value';
        },
        images_upload_handler: function(blobInfo, succFun, failure, progress) {
          console.log(blobInfo, succFun, failure, progress);
          // return

          console.log(blobInfo);
          console.log(blobInfo.blobUri());
          console.log(blobInfo.blob());

          // window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${blobInfo.blob()}" >`);
          // succFun(blobInfo.blob());

          // window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${blobInfo.blobUri()}" >`);
          // succFun(blobInfo.blobUri());

          // succFun(blobInfo.blob());

          // succFun(blobInfo.blobUri());

          // let formData = new FormData();
          // formData.append('image', blobInfo.blob(), blobInfo.filename());
          // axios
          //   .post(`https://xcx.banjingkeji.com:8443/mach/file/uploadPicAjax`, formData)
          //   .then(res => {
          //     if (res.data.code == 0) {
          //       console.log(res);
          //       let picUrl = res.data.data.serverUrl + res.data.data.picPath.replace('/home/soft/apache-tomcat-7.0.82/webapps/patrol/images/', '');
          //       succFun(picUrl);
          //     }
          //   })
          //   .catch(() => {
          //     failure('上传失败2');
          //   });

          // succFun(blobInfo.blob());
          // succFun('data:image/jpg;base64,'+blobInfo.base64());
        },
        file_picker_callback: function(callback, value, meta) {
          console.log('file_picker_callback==============', callback, value, meta);

          // var filetype = '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4';
          //后端接收上传文件的地址
          // var upurl = 'https://xcx.banjingkeji.com:8443/mach/file/uploadPicAjax';
          // //为不同插件指定文件类型及后端地址
          // switch (meta.filetype) {
          //   case 'image':
          //     filetype = '.jpg, .jpeg, .png, .gif';
          //     break;
          //   // case 'media':
          //   //   filetype = '.mp3, .mp4';
          //   //   break;
          //   case 'file':
          //   default:
          // }
          // //模拟出一个input用于添加本地文件
          // var input = document.createElement('input');
          // input.setAttribute('type', 'file');
          // input.setAttribute('accept', filetype);
          // input.click();
          // input.onchange = function() {
          //   var file = this.files[0];

          //   var xhr, formData;
          //   console.log(file.name);
          //   xhr = new XMLHttpRequest();
          //   xhr.withCredentials = false;
          //   xhr.open('POST', upurl);
          //   xhr.onload = function() {
          //     var json;
          //     if (xhr.status != 200) {
          //       failure('HTTP Error: ' + xhr.status);
          //       return;
          //     }
          //     json = JSON.parse(xhr.responseText);
          //     if (!json || typeof json.location != 'string') {
          //       failure('Invalid JSON: ' + xhr.responseText);
          //       return;
          //     }
          //     callback(json.location);
          //   };
          //   formData = new FormData();
          //   formData.append('file', file, file.name);
          //   xhr.send(formData);
          // };
        }
      });
    },
    destroyTinymce() {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      return window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      const _this = this;
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" style="max-width: 100%" src="${v.url}" >`);
      });
    },

    async submit() {
      let textareaHtml = this.getContent(),
        data = [],
        formData,
        resp,
        httpPicArr,
        base64Index = [];

      console.log(textareaHtml);

      //取出img //base64进入数组
      textareaHtml.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function(match, capture) {
        data.push(capture); //所有的图片
      });

      var fd = new FormData(); //空formData

      data.forEach((item, index) => {
        var base64String = item;
        if (base64String.substr(0, 4) != 'http') {//过滤出base64 等待上传

          base64Index.push(index); //替换路径时需要的index

          var bytes = window.atob(base64String.split(',')[1]); //解码
          var ab = new ArrayBuffer(bytes.length); //代表原始的二进制数据
          var ia = new Uint8Array(ab);
          for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i); //返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
          }
          var blob = new Blob([ab], { type: 'image/jpeg' });
          fd.append('file', blob, Date.now() + '.jpg');
        }
      });

      //上传图片
      resp = await this.dispatch(FileController.imagesApprovalUpload, fd);

      //获取dom元素
      var iframe = document.getElementsByTagName('iframe')[0];
      var iwindow = iframe.contentWindow;
      var idoc = iwindow.document;

      //替换路径
      let servicePath = resp.data.servicePath; //图片路径前缀
      resp.data.paths.forEach((item, index) => {
        console.log(base64Index[index]);
        idoc.getElementsByClassName('wscnph')[base64Index[index]].src = servicePath + item;
      });

      //content 传回父组件add
      this.$emit('richTextData', this.getContent());
    }
  },
  destroyed() {
    this.destroyTinymce();
  }
};
</script>

<style scoped>
.tinymce-container {
  position: relative;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
