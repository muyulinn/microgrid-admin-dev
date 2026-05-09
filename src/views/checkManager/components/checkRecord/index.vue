<template>
  <el-row :gutter="30" class="warning-container">
    <el-col :span="13" class="scroll-class">
      <div v-for="(item,index) in dataList" :key="index" class="warning common-shadow" :class="item.id === currentItem.id ? 'active' : ''" @click="clickWork(item)">
        <div class="top">
          <div>工单编号：#{{ item.id }}</div>
          <div>下发时间：{{ item.createTime }}</div>
        </div>
        <div class="bottom">
          <div class="bottom-left">
            <div v-if="item.woType">工单类型：{{ $getEnumDesc($store.getters.enumData,'workOrder.woType',item.woType) }}</div>
            <div>工单标题：{{ item.woContent }}</div>
          </div>
          <div class="bottom-right">
            <div class="more">
              查看详情 >
            </div>
          </div>
        </div>
      </div>
      <div class="block" style="display: flex;flex-direction: row-reverse;margin-top:15px;">
        <el-pagination
          background
          :current-page="queryForm.current"
          :page-sizes="[10, 20, 30]"
          :page-size="queryForm.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-col>
    <el-col v-if="workListDetail" :span="11" class="common-shadow scroll-class">
      <div class="chat-part">
        <div class="user-talk">
          <div class="user-bar">
            <div class="left">
              <img src="@/assets/jiahua/head/avatar.png" alt="">
              <span>{{ workListDetail.contantName }}</span>
            </div>
            <div class="time">
              下发时间：{{ workListDetail.createTime }}
            </div>
          </div>
          <div class="problem">
            <div class="type">
              <span v-if="workListDetail.woType">工单类型：{{ $getEnumDesc($store.getters.enumData,'workOrder.woType',workListDetail.woType) }}</span>
              <span>工单编号：#{{ workListDetail.id }}</span>
            </div>
            <div class="desc" style="padding: 13px 15px 85px 15px">
              <div>工单内容描述</div>
              <div class="content">{{ workListDetail.woContent }}</div>
            </div>
          </div>
          <div v-if="workListDetail.woFiles" class="file-box">
            <div v-for="(item,index) in workListDetail.woFiles.split(',')" :key="index" class="file" @click="download(item)">
              <div class="left">
                <img src="@/assets/jiahua/word.png" alt="">
                <span>{{ item }}.jpg</span>
              </div>
              <div class="right">1.5MB</div>
            </div>
          </div>
        </div>
        <div v-for="(item,index) in workListDetail.workOrderReplyVoList" :key="index" class="user-talk">
          <div class="user-bar">
            <div class="left">
              <img src="@/assets/jiahua/head/avatar.png" alt="">
              <span>{{ item.contantName || '匿名用户' }}</span>
            </div>
            <div class="time">
              下发时间：{{ item.createTime }}
            </div>
          </div>
          <div class="problem" style="border-bottom: 0">
            <div class="desc">
              <div>{{ item.replyContent }}</div>
            </div>
          </div>
        </div>
        <div class="send-box">
          <textarea v-model="replyText" rows="3" />
          <div class="btn-box">
            <el-button type="primary" @click="submitReply">提交</el-button>
            <el-button type="primary" plain>关闭工单</el-button>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { downloadFile } from '@/utils'
export default {
  data() {
    return {
      queryForm: {
        current: 1,
        size: 10
      },
      total: 0,
      dataList: [],
      currentItem: null,
      workListDetail: null,
      replyText: ''
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query(param = {}) {
      this.$http.getParam('/patrol/getAdminWorkOrderVoIPage', { ...param, ...this.queryForm }).then(res => {
        this.total = res.total
        this.dataList = res.records
        if (this.dataList.length > 0) {
          this.clickWork(this.dataList[0])
        }
      })
    },
    clickWork(item) {
      this.currentItem = item
      this.replyText = ''
      this.getWorkListDetail(item)
    },
    getWorkListDetail(item) {
      this.$http.getParam('/patrol/getWorkOrderVoById', { id: item.id }).then(res => {
        this.workListDetail = res
      })
    },
    submitReply() {
      if (!this.replyText) {
        this.$message.info('请输入内容')
        return
      }
      if (this.workListDetail.id) {
        this.$http.getParam('/patrol/replyWorkOrderVo', { woId: this.workListDetail.id, replyContent: this.replyText }).then(res => {
          this.$message.success('提交成功')
          this.clickWork(this.currentItem)
        })
      }
    },
    handleSizeChange(val) {
      this.queryForm.size = val
      this.queryForm.current = 1
      this.query()
    },
    handleCurrentChange(val) {
      this.queryForm.current = val
      this.query()
    },
    download(item) {
      downloadFile(item)
    }
  }
}
</script>
<style lang="less" scoped>
.warning-container {
  margin-top: 21px;
  font-size: 14px;
  color: #101010;
  margin-right: 0!important;
  .warning {
    margin-bottom: 17px;
    padding: 16px 16px;
    cursor: pointer;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #757575;
      margin-bottom: 12px;
    }
    .bottom {
      color: #101010;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .bottom-left {
        flex: 1;
        margin-right: 12px;
        line-height: 1.5;
      }
      .bottom-right {
        text-align: right;
        width: 150px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .more {
          color: #757575;
          cursor: pointer;
          margin-top: 20px;
        }
      }
    }
  }
  .chat-part {
    min-height: 300px;
    padding: 20px 0;
    .user-talk {
      padding-bottom: 16px;
      .user-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        .left {
          display: flex;
          align-items: center;
          font-weight: bold;
          img {
            width: 35px;
            height: 35px;
            margin-right: 14px;
            border-radius: 50%;
            border: 1px solid #D5CCCC;
          }
        }
      }
      .problem {
        padding-bottom: 15px;
        border-bottom: 1px solid #D5CCCC;
        .type {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .desc {
          padding: 13px 15px;
          background-color: #f0f2fc;
          .content {
            margin-top: 17px;
            text-indent: 20px;
          }
        }
      }
      .file-box {
        padding: 15px 0;
        border-bottom: 1px solid #D5CCCC;
        .file {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 13px 22px;
          border: 1px solid #D5CCCC;
          cursor: pointer;
          .left {
            display: flex;
            align-items: center;
            img {
              width: 37px;
              height: 37px;
              margin-right: 10px;
            }
          }
        }
        .file:nth-last-child(1) {
          margin-bottom: 0;

        }
      }
    }
    .send-box {
      textarea {
        width: 100%;
        margin-bottom: 10px;
      }
      .btn-box {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .active {
    border: 2px solid #546bf0;
  }
}
.scroll-class {
  overflow-y: scroll;
  height: calc(100vh - 230px);
}
</style>
