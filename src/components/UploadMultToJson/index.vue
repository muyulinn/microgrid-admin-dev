
<!-- 中天后台上传图片和编辑已上传图片  dataChange事件为图片上传或删除图片返回的code数据 弹框可能出现历史图片问题，使用v-if解决 maxLength属性为最大上传图片数量，默认为9999 title为上传组件的标头 showEditData属性接收的为需要编辑的图片code数组-->
<!-- 2023.3.31 改组件生成json数据结构为[{"code":"abc121","fileName":"手册1.pdf"},{"code":"abc234","fileName":"手册2.pdf"}] 包含回显数据-->
<template>
  <div>
    <div class="uploadBox">
      <!-- <div style="width:80px;color:#262626">{{ title }}</div> -->
      <div>
        <slot name="title" />
      </div>
      <el-upload
        action=""
        list-type="picture-card"
        :file-list="fileList"
        :http-request="imgUploadRequest"
        :on-change="handleChange"
        :on-remove="removeImg"
        :on-preview="handlePreview"
        :limit="maxLength"
        :class="{hide: hideUploadBtn}"
      >
        <div v-if="fileList.length < maxLength" class="updata">
          <i class="el-icon-plus" />
          <!-- <div class="ant-upload-text">
            Upload
          </div> -->
        </div>
      </el-upload>
      <div v-if="codeArr.length > 0" style="margin-left: 10px">
        <span>已选择的文件：</span>
        <span v-for="(item,index) in codeArr" :key="index" style="margin-right: 10px;color: blue;">{{ item.name }}</span>
      </div>
      <el-dialog :visible="previewVisible" :footer="null" :modal-append-to-body="false" :close-on-click-modal="false" @close="handleCancelImg">
        <img alt="example" style="width: 100%" :src="previewImage">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { upload } from '@/utils'
import { imgHost } from '@/config.js'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  props: {
    maxLength: {
      type: Number,
      default: 9
    },
    title: {
      type: String,
      default: ''
    },
    showEditData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      codeArr: [],
      previewImage: '',
      previewVisible: false,
      codes: '',
      hideUploadBtn: false
    }
  },
  watch: {
    codes() {
      // console.log('图片数据发生变化了')
    },
    showEditData: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.$emit('dataChange', newVal)
        if (this.codeArr.length <= 0) {
          this.splicePic(newVal)
        }
      }
    }
  },
  methods: {
    /**
     * 关于图片上传，图片编辑部分
     */
    // 根据code拼接图片
    splicePic(arr) {
      if (arr !== '' && arr !== null) {
        arr = JSON.parse(arr)
        const codeArr = []
        const fileList = []
        arr.forEach((item, index) => {
          var obj = {}
          var picObj = {}
          obj.uid = -index
          obj.url = imgHost + item.code
          obj.status = 'done'
          obj.name = item.fileName
          picObj.code = item.code
          picObj.name = item.fileName
          picObj.suffix = item.suffix
          picObj.uid = -index
          codeArr.push(picObj)
          fileList.push(obj)
        })
        this.codeArr = codeArr
        this.fileList = fileList
        this.hideUploadBtn = (this.codeArr.length >= this.maxLength)
      }
    },
    // 关闭图片预览
    handleCancelImg() {
      this.previewVisible = false
    },
    // 上传组件状态发生变化时触发
    handleChange(obj, fileList) {
      let noLike = true
      this.fileList.map((item) => {
        if (item.uid === obj.uid) {
          noLike = false
        }
      })
      if (noLike) {
        this.fileList.push(obj)
      }
      this.hideUploadBtn = (fileList.length >= this.maxLength)
    },
    // 上传图片，数组对象中，根据对象的某个值删除对象
    removeByValue(arr, attr, value) {
      var index = 0
      for (var i in arr) {
        if (arr[i][attr] === value) {
          index = i
          break
        }
      }
      arr.splice(index, 1)
    },
    // code集合
    newCodeArr(codeArr) {
      return codeArr.map(item => {
        return {
          code: item.code,
          // contentType: item.contentType,
          fileName: item.name,
          suffix: item.suffix
        }
      })
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        // eslint-disable-next-line require-atomic-updates
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    // 上传图片
    imgUploadRequest(req) {
      upload(req.file).then(data => {
        req.onSuccess()
        data.uid = req.file.uid
        this.codeArr.push(data)
        this.codes = JSON.stringify(this.newCodeArr(this.codeArr))
        this.$emit('dataChange', this.codes)
      }).catch(data => {
        req.onError()
      })
    },
    removeImg(delVal, fileList) {
      this.fileList = fileList
      this.removeByValue(this.codeArr, 'uid', delVal.uid)
      this.codes = JSON.stringify(this.newCodeArr(this.codeArr))
      this.$emit('dataChange', this.codes)
      this.hideUploadBtn = (fileList.length >= this.maxLength)
    }
  }
}

</script>

<style lang='less'>
.uploadBox {
  // paddingLeft: 3.7%;
  display: flex;
  align-items: center;
  // justify-content: center;
  height: 100%;
  .updata{
    width:100px;
    height:100px;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .el-upload--picture-card{
    width: 100px;
    height: 100px;
  }
  .el-upload{
  width: 100px;
  height: 100px;
  }
  .el-upload-list--picture-card .el-upload-list__item{
  width: 100px;
  height: 100px;
  }
}

.hide {
   .el-upload--picture-card {
    display: none !important;
   }
}
</style>
