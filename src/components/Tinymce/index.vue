<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <Editor
      tinymce-script-src="https://cdn.jsdelivr.net/npm/tinymce@5.10.1/tinymce.min.js"
      :init="initTinymce()"
    />
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from './plugins'
import toolbar from './toolbar'
import Editor from '@tinymce/tinymce-vue'
import { imgHost } from '@/config.js'
import { upload } from '@/utils'

export default {
  name: 'Tinymce',
  components: { Editor },
  props: {
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      fullscreen: false,
      editor: null
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          this.editor.setContent(val || ''))
      }
    }
  },
  mounted() {
  },
  methods: {

    initTinymce() {
      return {
        language_url: 'https://cdn.jsdelivr.net/npm/tinymce-i18n@20.12.25/langs5/zh_CN.js',
        language: 'zh_CN',
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        resize: false,
        init_instance_callback: editor => {
          this.editor = editor
          if (this.value) {
            editor.setContent(this.value)
          }
          this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            this.fullscreen = e.state
          })
        },
        convert_urls: false,
        images_upload_handler(blobInfo, success, failure, progress) {
          upload(blobInfo.blob()).then(data => {
            success(`${imgHost}${data.code}`)
          }).catch(e => {
            failure('出现未知问题，刷新页面，或者联系开发者')
            console.error(e)
          }).finally(() => {
          })
        },
        file_picker_types: 'file image media',
        file_picker_callback: (cb, value, meta) => {
          const $input = this.editor.$(`<input type="file" accept="${meta.filetype}/*">`)
          $input.on('change', e => {
            if (!e.target.files || !e.target.files[0]) return
            const $loading = this.editor.$('<div class="tox-throbber__busy-spinner"><div class="tox-spinner"><div></div><div></div><div></div></div></div>')
            $loading.appendTo('.tox-dialog')
            upload(e.target.files[0]).then(data => {
              cb(`${imgHost}${data.code}`)
            }).catch(e => {
              console.log(e)
            }).finally(() => {
              $loading.remove()
            })
          })
          $input[0].click()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
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
