<template>
  <el-row class="deviceList-container">
    <el-col :span="5" class="left-nav common-shadow">
      <div class="btn-line">
        <el-button type="primary">添加</el-button>
        <el-button type="primary">编辑</el-button>
        <el-button type="primary">删除</el-button>
      </div>
      <el-input v-model="typeForm.a" placeholder="基础字典类型列表" disabled />
      <div class="list-box">
        <div>事项状态</div>
        <div>告警状态</div>
        <div>告警级别</div>
        <div>设备类型</div>
        <div>设备状态</div>
        <div>节点类型</div>
        <div>产品状态</div>
        <div>巡检类型</div>
        <div>通知类型</div>
      </div>
    </el-col>
    <el-col :span="19" class="right-content">
      <div class="top-content common-shadow">
        <el-form class="form-box">
          <el-form-item label="*类型代码" :label-width="labelWidth">
            <el-input v-model="typeForm.a" placeholder="请输入类型代码" />
          </el-form-item>
          <el-form-item label="*类型名称" :label-width="labelWidth">
            <el-input v-model="typeForm.b" placeholder="请输入类型名称" />
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="typeForm.c" placeholder="请输入描述" />
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom-content common-shadow">
        <page-table
          ref="pageTable"
          :query="query"
          :selection.sync="selection"
          @reset="queryForm={}"
        >
          <template #query-form>
            <el-form-item>
              <el-input v-model="queryForm.name" placeholder="字典名称" />
            </el-form-item>
            <el-button type="primary" style="margin-right: 20px">添加</el-button>
          </template>
          <template #action-new-line />
          <template slot="table-body">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="NO" prop="id" />
            <el-table-column label="创建时间" prop="createTime" />
            <el-table-column :label="'操作'" width="300">
              <template>
                <div class="common-btn color1">查看详情</div>
              </template>
            </el-table-column>
          </template>
        </page-table>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      queryForm: {},
      selection: [],
      typeForm: {},
      labelWidth: '100px'
    }
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/user/getRoleList', { ...param, ...this.queryForm })
    }
  }
}
</script>
<style lang="less" scoped>
.deviceList-container {
  margin-top: 12px;
  display: flex;
  color: #101010;
  .left-nav {
    margin-right: 12px;
    overflow-y: scroll;
    height: 700px;
    padding: 18px 26px;
    .btn-line {
      margin-bottom: 10px;
    }
    .list-box {
      margin-top: 18px;
      > div {
        margin-bottom: 17px;
        color: #848388;
        cursor: pointer;
      }
    }
  }
  .right-content {
    flex: 1;
    .top-content {
      margin-bottom: 12px;
      padding: 23px 45px 39px 0;
    }
    .bottom-content  {
      padding: 11px;
      height: 537px;
      margin-bottom: 3px;
      height: calc(700px - 62px - 12px - 140px);
    }
  }
}
</style>
