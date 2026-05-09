<template>
  <el-row class="deviceDetail-container" :gutter="12">
    <el-col :span="10">
      <switchBar :left-menu="menu1" @leftPress="getIndex1" />
      <div class="left-content common-shadow">
        <div class="desc">
          <div>导入初始化设备属性。</div>
          <div>这将不影响实际设备</div>
        </div>
        <div class="toggle-box">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="实体" name="1">
              <div>展开内容</div>
            </el-collapse-item>
            <el-collapse-item title="状态" name="2">
              <div>展开内容</div>
            </el-collapse-item>
            <el-collapse-item title="状态属性" name="3">
              <div>展开内容</div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="btn-box">
          <div class="btn">导入设备属性</div>
        </div>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="right-content">
        <div class="box common-shadow">
          <div class="top">
            <div class="title">实体</div>
            <div class="input-box">
              <input type="text" placeholder="输入筛选实体">
            </div>
          </div>
          <div class="bottom-content">
            automation._long
          </div>
        </div>
        <div class="box common-shadow">
          <div class="top">
            <div class="title">状态</div>
            <div class="input-box">
              <input type="text" placeholder="输入筛选状态">
            </div>
          </div>
          <div class="bottom-content">
            <div>on</div>
            <div>last_changed:2023-03-05T12:53:42.548Z</div>
            <div>last_updated:2023-03-05T12:53:42.548Z</div>
          </div>
        </div>
        <div class="box common-shadow">
          <div class="top">
            <div class="title">属性</div>
            <div class="input-box">
              <input type="text" placeholder="输入筛选属性">
            </div>
          </div>
          <div class="bottom-content">
            <div>last_triggered:2023-03-03T18:13:59.001039+00:00</div>
            <div>mode:single</div>
            <div>current:0</div>
            <div>id:1606022382832</div>
            <div>friendly_name:新建自动化</div>
          </div>
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
      outerIndex1: 0,
      menu1: [
        { value: 0, label: '状态' },
        { value: 1, label: '服务' },
        { value: 2, label: '模板' }
      ],
      activeNames: ['1']
    }
  },
  methods: {
    getIndex1(e) {
      this.outerIndex1 = e
    },
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less" scoped>
.deviceDetail-container {
  margin-top: 12px;
  font-size: 14px;
  color: #101010;
  .el-col{
    .left-content{
      color: #101010;
      margin-top: 12px;
      padding: 22px 31px;
      min-height: 619px;
      .desc {
        margin-bottom: 50px;
        div {
          margin-bottom: 8px;
        }
      }
      .toggle-box {
        margin-bottom: 46px;
      }
      .btn-box {
        margin: 0 40px;
        .btn {
          padding: 12px 0;
          background-color: #546bf0;
          text-align: center;
          color: white;
          border-radius: 6px;
        }
      }
    }
    .right-content {
      .box {
        padding: 18px 26px;
        margin-bottom: 14px;
        .top {
          .title {
            font-weight: bold;
            padding-bottom: 12px;
          }
          .input-box {
            padding-bottom: 12px;
            border-bottom: 1px solid rgb(235, 234, 234);
            input {
              border: none;
              width: 100%;
              padding: 5px 0;
            }
          }
        }
        .bottom-content {
          padding-top: 30px;
        }
      }
    }
  }
}
</style>
