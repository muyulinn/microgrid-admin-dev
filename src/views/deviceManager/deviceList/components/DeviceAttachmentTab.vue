<!--
设备附件信息
by lcs
-->
<template>
  <el-row class=".atte">
    <el-col :span="9">
      <el-table :data="attachmentList" size="mini">
        <el-table-column prop="name" show-overflow-tooltip label="文件名" />
        <el-table-column prop="type" label="类型" width="60" />
        <el-table-column label="操作" width="60" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click.native.prevent="currentItem = row;onlineFile()"> 浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="15">
      <div class="img-block" style="padding-left: 3px;">
        <template v-if="src">
          <el-row>
            <el-col :span="4">
              <el-button style="margin: 5px" @click="download()">下载</el-button>
            </el-col>
            <el-col :span="4">
              <el-link :href="src" target="_blank" style="margin: 5px">
                <el-button type="primary">新窗口打开</el-button>
              </el-link>
            </el-col>
          </el-row>
          <img v-if="fileType === 'img'" :src="src" width="100%" height="100%">
          <video v-else-if="fileType === 'video'" controls :src="src" width="100%" height="100%" />
          <iframe v-else-if="fileType === 'iframe'" width="100%" height="100%" style="min-height: 400px" border="none" :src="src" />
          <span v-else>
            不支持预览
          </span>
        </template>
        <div v-else slot="error" class="error-img-text">
          <span>请选择左侧需要浏览的内容</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { downloadFile, getFileUrl } from '@/utils'
export default {
  props: {
    attachmentList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      src: null,
      currentItem: null
    }
  },
  computed: {
    fileType() {
      if (/(.jp.?g|.png|.bmp|.gif|.webp|.ico|.svg)$/i.test(this.currentItem.type)) {
        return 'img'
      }
      if (/(.mp3|.wav|.wma|.flac|.aac|.mp4|.avi|.wmv|.mov)$/i.test(this.currentItem.type)) {
        return 'video'
      }
      if (/(.pdf)$/i.test(this.currentItem.type)) {
        return 'iframe'
      }
      return ''
    }
  },
  methods: {
    /**
     * 文件预览
     * @param {*} code
     */
    async onlineFile() {
      this.src = await getFileUrl(this.currentItem.code)
    },
    /**
     * 文件下载
     */
    async download() {
      downloadFile(this.currentItem.code, this.currentItem.name)
    }

  }
}
</script>
<style lang="less" scoped>
.error-img-text{
  display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
  ::v-deep {
    .el-table{
      border-right: 1px solid rgba(0, 0, 0, 0.199);
    }
  }
</style>
