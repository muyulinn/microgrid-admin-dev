<template>
  <el-row class="deviceList-container">
    <el-col :span="3" class="left-nav common-shadow">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
    </el-col>
    <el-col :span="21" class="right-content">
      <el-row class="top-content">
        <el-col :span="14" class="left common-shadow">
          <el-row>
            <el-col :span="8">
              <div style="color: #546BF0">200</div>
              <div>字段数量</div>
            </el-col>
            <el-col :span="8">
              <div style="color: #28BF94">150000000</div>
              <div>数据数量</div>
            </el-col>
            <el-col :span="8">
              <div style="color: #FF9800">23</div>
              <div>关联表数据量</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10" class="right common-shadow">
          <div class="content">
            <div class="text">
              <div>所属系统：系统名称用例</div>
              <div>所属单位：单位名称用例</div>
              <div>开发单位：开发单位名称用例</div>
              <div>所属库名：库名称用例</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="bottom-content common-shadow">
        <div class="title">表名用例</div>
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
      data: [{
        label: '表名用例',
        children: [{
          label: '表名用例',
          children: [{
            label: '表名用例'
          }, {
            label: '表名用例'
          }]
        }]
      }, {
        label: '表名用例',
        children: [{
          label: '表名用例',
          children: [{
            label: '表名用例'
          }]
        }, {
          label: '表名用例',
          children: [{
            label: '表名用例'
          }]
        }]
      }, {
        label: '表名用例',
        children: [{
          label: '表名用例',
          children: [{
            label: '表名用例'
          }]
        }, {
          label: '表名用例',
          children: [{
            label: '表名用例/'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/user/getRoleList', { ...param, ...this.queryForm })
    },
    handleNodeClick(e) {

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
    padding: 10px;
  }
  .right-content {
    flex: 1;
    .top-content {
      height: 151px;
      display: flex;
      margin-bottom: 12px;
      .left {
        margin-right: 12px;
        text-align: center;
        .el-row {
          height: 100%;
          display: flex;
          align-items: center;
          .el-col {
            border-right: 1px solid #E8E7E7;
            padding: 20px 0;
            div:nth-child(1) {
              margin-bottom: 5px;
            }
          }
        }
      }
      .right {
        padding: 11px 33px;
        display: flex;
        justify-content: center;
        align-items: center;
        .content{
          .text {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            div {
              margin-bottom: 15px;
            }
            div:nth-last-child(1) {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    .bottom-content  {
      padding: 11px;
      height: 537px;
      margin-bottom: 3px;
      .title {
        font-weight: bold;
        color: #101010;
        margin: 10px 0;
      }
    }
  }
}
</style>
