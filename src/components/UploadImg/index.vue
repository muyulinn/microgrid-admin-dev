<!--  -->
<template>
  <el-upload
    class="avatar-uploader"
    action
    :show-file-list="false"
    style="margin: 20px;float: left;"
    :on-success="handleBgImageSuccess"
    :http-request="uploadImage"
    :before-upload="beforeAvatarUpload"
  >
    <!-- <img v-if="bgImages" :src="from.backgroundImage" class="avatar"> -->
    <FsImg v-if="image" :src="image" class="avatar" />
    <i
      v-else
      class="el-icon-plus avatar-uploader-icon"
      style="border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;"
    />
    <!-- 限制10M/ 500/500 -->
  </el-upload>
</template>

<script>
import { upload } from '@/utils'
const FsImg = () => import('@/components/FsImg')
export default {
  components: {
    FsImg
  },
  props: {
    image: {
      type: String,
      default: ''
    },
    isBeforeUpload: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      images: ''
    }
  },
  methods: {
    // 限制图片上传大小
    beforeAvatarUpload(file) {
      if (this.isBeforeUpload) return
      const width = this.width
      const height = this.height
      const isLt5M = file.size / 1024 / 1024 < 5
      const isSize = new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.onload = function() {
          console.log(img.width, width, img.height, height)
          const valid = img.width <= width && img.height <= height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file)
      }).then(() => {
        return file
      }, () => {
        this.$message.error(`上传的图片宽高不能超过${width}*${height}!`)
        return Promise.reject()
      })
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return Promise.reject()
      }
      return isSize
    },
    /**
     * 图片上传
     */
    uploadImage(e) {
      return upload(e.file).then(data => {
        this.$message.success('上传成功')
        this.$emit('uploadImage', data)
        this.$forceUpdate()
      })
    },
    handleBgImageSuccess(res, file) {
      this.images = URL.createObjectURL(file.raw)
    }
  }
}

</script>

<style lang='less' scoped>
// 图片上传
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
}
.avatar {
  width: 150px;
  height: 150px;
}
</style>
