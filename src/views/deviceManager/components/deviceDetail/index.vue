<template>
  <el-row class="deviceDetail-container" :gutter="12">
    <el-col :span="10">
      <switchBar :left-menu="menu1" @leftPress="getIndex1" />
      <div class="content-box">
        <div class="top-camera common-shadow">
          <div class="oper-line">
            <div>
              <el-button type="primary">编辑</el-button>
              <el-button type="danger">停用</el-button>
            </div>
            <div>海康威视 DS-2 4号摄像头</div>
          </div>
          <div class="video-box">
            <video src="test.mp4" poster="@/assets/jiahua/videoDefault.png" />
          </div>
        </div>
        <div class="bottom-info common-shadow">
          <div class="one-part">
            <div class="one-line">
              <div class="half">
                <span>产品状态</span>
                <span>运行中</span>
              </div>
              <div class="half">
                <span>创建时间</span>
                <span>2023-03-02  12：00</span>
              </div>
            </div>
            <div class="one-line">
              <div class="half">
                <span>详细地址</span>
                <span>详细地址用例</span>
              </div>
            </div>
            <div class="one-line">
              <div class="half">
                <span>产品ID</span>
                <span>yc-FrpCamera</span>
              </div>
              <div class="half">
                <span>所属品类</span>
                <span>摄像头</span>
              </div>
            </div>
            <div class="one-line">
              <div class="half">
                <span>消息协议</span>
                <span>云窗摄像头</span>
              </div>
              <div class="half">
                <span>链接协议</span>
                <span>RTSP</span>
              </div>
            </div>
            <div class="one-line">
              <div class="half">
                <span>所属机构</span>
                <span>org-1-1</span>
              </div>
              <div class="half">
                <span>设备类型</span>
                <span>直连设备</span>
              </div>
            </div>
          </div>
          <div class="one-part">
            <div class="one-line">
              <div class="half">
                <span>username</span>
                <span>admin</span>
              </div>
              <div class="half">
                <span>password</span>
                <span>admin</span>
              </div>
            </div>
            <div class="one-line">
              <div class="half">
                <span>frpbserver</span>
                <span>frp.adaxiang.com:1000</span>
              </div>
            </div>
          </div>
          <div class="one-part">
            <div class="one-line">
              <div class="half">
                <span>设备厂商</span>
                <span>海康威视</span>
              </div>
              <div class="half">
                <span>设备型号</span>
                <span>DS-2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="14">
      <switchBar :left-menu="menu2" @leftPress="getIndex2" />
      <div class="content-box">
        <div v-if="outerIndex2 === '0'" class="map-container common-shadow" />
        <div v-if="outerIndex2 === '1'" class="table-container common-shadow">
          <page-table
            ref="pageTable"
            :query="query"
            :selection.sync="selection"
            @reset="queryForm={}"
          >
            <template #query-form>
              <!-- <el-form-item label="设备名称">
                <el-input v-model="queryForm.roleName" />
              </el-form-item> -->
            </template>
            <template #action-new-line />
            <template slot="table-body">
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="NO" prop="id" />
              <el-table-column label="创建时间" prop="createTime" />
              <el-table-column :label="'操作'" width="300">
                <template>
                  <el-link type="primary" plain v-text="'查看详情'" />
                </template>
              </el-table-column>
            </template>
          </page-table>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
export default {
  components: {
    switchBar
  },
  data() {
    return {
      outerIndex1: '0',
      menu1: [
        { value: '0', label: '产品信息' },
        { value: '1', label: '告警设置' }
      ],
      outerIndex2: '0',
      menu2: [
        { value: '0', label: '位置信息' },
        { value: '1', label: '告警记录' },
        { value: '2', label: '设备动态' },
        { value: '3', label: '物理型' },
        { value: '4', label: '反向控制' }
      ],
      queryForm: {},
      selection: []
    }
  },
  methods: {
    getIndex1(e) {
      this.outerIndex1 = e
    },
    getIndex2(e) {
      this.outerIndex2 = e
    },
    query(param = {}) {
      return this.$http.getParam('/user/getRoleList', { ...param, ...this.queryForm })
    }
  }
}
</script>
<style lang="less" scoped>
.deviceDetail-container {
  margin-top: 12px;
  font-size: 14px;
  .el-col{
    .content-box {
      color: #101010;
      margin-top: 12px;
      .top-camera  {
        padding: 11px 0;
        .oper-line {
          padding: 0 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .video-box {
          width: 100%;
          // height: 276px;
          video {
            width: 100%;
            // height: 276px;
            object-fit: cover;
          }
        }
      }
      .bottom-info {
        padding: 0 17px 40px 17px;
        margin-top: 12px;
        margin-bottom: 3px;
        .one-part {
          padding: 19px 0;
          border-bottom: 1px solid #ECE4E4;
          .one-line {
            display: flex;
            margin-bottom: 15px;
            .half {
              width: 50%;
              display: flex;
              span:nth-child(1) {
                width: 30%;
              }
              span:nth-child(2) {
                width: 70%;
              }
            }
          }
          .one-line:nth-last-child(1) {
            margin-bottom: 0;
          }
        }
        .one-part:nth-last-child(1) {
          border-bottom: none;
        }
      }
      .map-container {
        height:  800px;
      }
      .table-container {
        padding: 10px;
      }
    }
  }
}
</style>
