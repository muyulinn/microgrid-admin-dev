<template>
  <div class="interface-container">
    <div class="table-title common-shadow">
      <div class="column">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" />
      </div>
      <div class="column">接口标题</div>
      <div class="column">请求方式</div>
      <div class="column">接口地址</div>
      <div class="column">链接数量</div>
      <div class="column">调用情况</div>
      <div class="column">操作</div>
    </div>
    <div class="table-content">
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :key="city" :label="city" class="common-shadow line">
          <div class="column">标题内容用例</div>
          <div class="column get">GET</div>
          <div class="column"> /news/api/test2/getInfo</div>
          <div class="column">1</div>
          <div class="column">暂无</div>
          <div class="column">
            <div class="oper-box">
              <div class="btn">
                查看详情
              </div>
            </div>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkAll: false,
      checkedCities: ['广州', '深圳'],
      cities: ['上海', '北京', '广州', '深圳'],
      isIndeterminate: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>
<style lang="less" scoped>
  .interface-container {
    color: #101010;
    font-size: 14px;
    .table-title {
      display: flex;
      padding: 26px 27px;
      align-items: center;
      margin: 12px 0;
      .column {
        width: 20%;
        font-weight: bold;
        margin: 0 10px;
        .el-checkbox {
          width: 55px;
        }
      }
      .column:nth-child(1) {
        width: 55px;
        margin-right: 50px;
        margin-left: 0;
        flex: none;
      }
    }
    .table-content {
      .line {
        display: block;
        padding: 43px 27px;
        margin-bottom: 12px;
        width: 100%;
      }
      ::v-deep .el-checkbox {
        display: flex;
        align-items: center;
        .el-checkbox__input  {
          width: 55px;
          margin-right: 50px;
        }
        .el-checkbox__label {
          display: block;
          flex: 1;
          display: flex;
          align-items: center;
          padding-left: 0;
          .column {
            // flex: 1;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            overflow: hidden;
            width: 20%;
            white-space: pre-wrap;
            margin: 0 10px;
            .btn {
              width: 70px;
              text-align: center;
              background-color: #546bf0;
              color: white;
              height: 28px;
              line-height: 28px;
              border-radius: 2px;
            }
          }
          .get {
            color: #0D5AA7;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
