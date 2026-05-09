<template>
  <el-row class="deviceList-container">
    <el-col :span="3" class="left-nav common-shadow">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
    </el-col>
    <el-col :span="21" class="right-content common-shadow">
      <div class="bottom-content">
        <div class="title">
          <div class="left">
            <span>GET</span>接口描述用例
          </div>
          <div class="right">
            <div class="btn">限制</div>
          </div>
        </div>
        <div class="content">
          <div class="top-desc">
            <div class="box">
              <div class="common-title">
                <span>接口地址：</span>/news/api/test2/getInfo
              </div>
              <div class="common-title">
                <span>请求方式：</span>GET
              </div>
              <div class="common-title">
                <span>consumes：</span>
              </div>
              <div class="common-title">
                <span>produces： </span>["*/*"]
              </div>
              <div class="common-title">
                <span>接口描述 </span>
              </div>
              <div class="desc">
                接口描述用例信息
              </div>
            </div>
          </div>
          <div class="table-box">
            <div class="one-box">
              <div class="common-title">
                <span>请求参数 </span>
              </div>
              <div class="table">
                <el-table
                  :data="tableDataRequset"
                  style="width: 100%"
                  :header-cell-style="{ background: '#f5f7fe', color: '#000' }"
                  :row-style="{ background: '#fbfbfb', color: '#000' }"
                >
                  <el-table-column
                    prop="a"
                    label="参数名称"
                  />
                  <el-table-column
                    prop="b"
                    label="说明"
                  />
                  <el-table-column
                    prop="c"
                    label="请求类型"
                  />
                  <el-table-column
                    prop="d"
                    label="必填"
                  />
                  <el-table-column
                    prop="e"
                    label="类型"
                  />
                  <el-table-column
                    prop="f"
                    label="schema"
                  />
                </el-table>
              </div>
            </div>
            <div class="one-box">
              <div class="common-title">
                <span>请求状态 </span>
              </div>
              <div class="table">
                <el-table
                  :data="tableDataState"
                  style="width: 100%"
                  :header-cell-style="{ background: '#f5f7fe', color: '#000' }"
                  :row-style="{ background: '#fbfbfb', color: '#000' }"
                >
                  <el-table-column
                    prop="a"
                    label="状态码"
                  />
                  <el-table-column
                    prop="b"
                    label="说明"
                  />
                  <el-table-column
                    prop="c"
                    label="schema"
                  />
                </el-table>
              </div>
            </div>
            <div class="one-box">
              <div class="common-title">
                <span>响应参数 </span>
              </div>
              <div class="table">
                <el-table
                  :data="tableDataResponse"
                  style="width: 100%"
                  :header-cell-style="{ background: '#f5f7fe', color: '#000' }"
                  :row-style="{ background: '#fbfbfb', color: '#000' }"
                >
                  <el-table-column
                    prop="a"
                    label="参数名称"
                  />
                  <el-table-column
                    prop="b"
                    label="说明"
                  />
                  <el-table-column
                    prop="c"
                    label="类型"
                  />
                  <el-table-column
                    prop="d"
                    label="schema"
                  />
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      tableDataRequset: [
        { a: 'orgId', b: 'orgId', c: 'query', d: 'true', e: 'string' },
        { a: 'orgId', b: 'orgId', c: 'query', d: 'true', e: 'string' }
      ],
      tableDataState: [
        { a: '200', b: 'ok', c: 'ObjectRestResponse' }
      ],
      tableDataResponse: [
        { a: 'data', c: 'Object' },
        { a: 'data', c: 'Object' }

      ],
      data: [{
        label: '接口标题用例',
        children: [{
          label: '接口标题用例',
          children: [{
            label: '接口标题用例'
          }, {
            label: '接口标题用例'
          }]
        }]
      }, {
        label: '接口标题用例',
        children: [{
          label: '接口标题用例',
          children: [{
            label: '接口标题用例'
          }]
        }, {
          label: '接口标题用例',
          children: [{
            label: '接口标题用例'
          }]
        }]
      }, {
        label: '接口标题用例',
        children: [{
          label: '接口标题用例',
          children: [{
            label: '接口标题用例'
          }]
        }, {
          label: '接口标题用例',
          children: [{
            label: '接口标题用例'
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
.common-title {
  margin-bottom: 14px;
  span {
    font-weight: bold;
  }
}
.deviceList-container {
  margin-top: 12px;
  display: flex;
  color: #101010;
  .left-nav {
    margin-right: 12px;
    overflow-y: scroll;
    height: 721px;
    padding: 10px;
  }
  .right-content {
    margin-bottom: 10px;
    .bottom-content  {
      min-height: 530px;
      margin-bottom: 3px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 0;
        border-bottom: 1px solid rgb(236, 236, 236);
        .left {
          padding-left: 16px;
          span {
            margin-right: 23px;
            font-weight: bold;
            color: #0D5AA7;
          }
        }
        .right {
          padding-right: 16px;
          .btn {
            width: 70px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            color: white;
            border-radius: 4px;
            background-color: #FCA130;
            cursor: pointer;
          }
        }
      }
      .content {
        .top-desc {
          border-bottom: 1px solid rgb(236, 236, 236);
          .box {
            padding: 16px;
            .desc {
              background-color: #eef0fd;
              padding: 9px 11px 24px 11px;
            }
          }
        }
        .table-box {
          padding: 16px;
          .one-box {
            margin-bottom: 13px;
            .el-table {
              width: 100%;
            }
          }
          .one-box:nth-last-child(1) {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f7fe!important;
}
::v-deep .el-table::before {
  height: 0px!important;
}
::v-deep .el-table th.is-leaf, ::v-deep .el-table td {
  border-bottom: none!important;
}
</style>
