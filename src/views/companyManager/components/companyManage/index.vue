<template>
  <div class="company-container">
    <div class="top-data common-shadow">
      <div class="left-chart">
        <barChart title="企业信息" :x-line="['全部企业', '类型A', '类型B', '类型C', '类型D']" :chart-data="[10, 22, 28, 22,55]" />
      </div>
      <div class="line" />
      <div class="right-data">
        <div class="line-box">
          <div class="one-line">
            <div class="data1">
              <div style="color:#546BF0">200</div>
              <div>全部企业</div>
            </div>
            <div class="data1">
              <div style="color:#28CE52">150</div>
              <div>类型A</div>
            </div>
            <div class="data1">
              <div style="color:#FF9800">40</div>
              <div>类型B</div>
            </div>
            <div class="data1">
              <div style="color:#F28484">10</div>
              <div>类型C</div>
            </div>
            <div class="data1">
              <div style="color:#484545">10</div>
              <div>类型D</div>
            </div>
          </div>
          <div class="one-line" style="margin-top:21px">
            <div class="data1">
              <div>100%</div>
              <div>占比</div>
            </div>
            <div class="data1">
              <div>75%</div>
              <div>占比</div>
            </div>
            <div class="data1">
              <div>20%</div>
              <div>占比</div>
            </div>
            <div class="data1">
              <div>5%</div>
              <div>占比</div>
            </div>
            <div class="data1">
              <div>5%</div>
              <div>占比</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-table common-shadow">
      <div class="title">计划列表</div>
      <page-table
        ref="pageTable"
        :query="query"
        :selection.sync="selection"
        @reset="queryForm={}"
      >
        <template #query-form>
          <!-- <el-form-item label="人员名称">
            <el-input v-model="queryForm.roleName" />
          </el-form-item> -->
        </template>
        <template #action-new-line>
          <!-- <el-button type="primary" icon="el-icon-circle-plus-outline">添加角色</el-button> -->
        </template>
        <template slot="table-body">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="NO" prop="id" />
          <el-table-column label="企业站名称" prop="orgSiteName" />
          <el-table-column label="组织名称" prop="orgName" />
          <el-table-column label="联系人信息" prop="unknown" />
          <el-table-column label="供配电负责人电话" prop="orgChargePhone" />
          <el-table-column label="法人联系电话" prop="orgDirectorPhone" />
          <el-table-column label="组织类别" prop="orgType" :formatter="$formatEnum('organization.orgType')" />
          <el-table-column label="成立时间" prop="orgCreateTime" />
          <el-table-column label="员工人数" prop="orgNum" />
          <el-table-column :label="'操作'" width="300">
            <template #default="{row}">
              <el-button type="info" @click="checkDetail(row)">查看详情</el-button>
              <el-button type="primary" @click="openDialog(row)">编辑</el-button>
            </template>
          </el-table-column>
        </template>
      </page-table>
    </div>
    <el-dialog
      :visible.sync="dialogVisibleCompany"
      :modal-append-to-body="false"
      width="1400px"
    >
      <div class="dialog-box">
        <div class="title">
          企业信息
        </div>
        <div class="content">
          <div class="content-top">
            <div class="left">
              <div class="line">
                <div class="half">
                  <div>*组织名称：</div>
                  <div><input v-model="companyInfo.orgName" placeholder="请输入组织名称"></div>
                </div>
                <div class="half">
                  <div>*统一社会信用代码：</div>
                  <div><input v-model="companyInfo.orgCode" placeholder="请输入统一社会信用代码"></div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>法人名称：</div>
                  <div><input v-model="companyInfo.orgDirector" placeholder="请输入法人名称"></div>
                </div>
                <div class="half">
                  <div>法人联系方式：</div>
                  <div><input v-model="companyInfo.orgDirectorPhone" placeholder="请输入法人联系方式"></div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>供配电联系人：</div>
                  <div><input v-model="companyInfo.orgCharge" placeholder="请输入供配电联系人"></div>
                </div>
                <div class="half">
                  <div>供配电联系方式：</div>
                  <div><input v-model="companyInfo.orgChargePhone" placeholder="请输入供配电联系方式"></div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>企业员工数：</div>
                  <div><el-input-number v-model="companyInfo.orgNum" :min="1" size="small" label="企业员工数" /></div>
                </div>
                <div class="half">
                  <div>上级单位：</div>
                  <div>
                    <el-checkbox v-model="hasNoParent" style="margin-right: 10px">无</el-checkbox>
                    <el-select v-if="!hasNoParent" v-model="companyInfo.parentId" placeholder="请选择上级单位">
                      <el-option
                        v-for="item in companySelect"
                        :key="item.id"
                        :label="item.orgName"
                        :value="item.id"
                      />
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>组织类型：</div>
                  <div>
                    <el-select v-model="companyInfo.orgType" placeholder="请选择组织类型">
                      <enum-option enum="organization.orgType" />
                    </el-select>
                  </div>
                </div>
                <div class="half">
                  <div>合作类型：</div>
                  <div>
                    <el-select v-model="companyInfo.cooperateType" placeholder="请选择合作类型">
                      <enum-option enum="organization.cooperateType" />
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>登记时间：</div>
                  <div>
                    <el-date-picker
                      v-model="companyInfo.orgCreateTime"
                      type="date"
                      align="right"
                      placeholder="请选择登记时间"
                      value-format="yyyy-MM-dd"
                      clearable
                    />
                  </div>
                </div>
                <div class="half">
                  <div>GPS定位：</div>
                  <div><input v-model="companyInfo.gps" placeholder="请输入经纬度"></div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>所属区域：</div>
                  <div>
                    <v-distpicker style="transform:scale(0.7);margin-left: -59px;" @selected="onSelectedCity" />
                  </div>
                </div>
                <div class="half">
                  <div>企业地址</div>
                  <div><input v-model="companyInfo.orgAddress" placeholder="请输入企业地址"></div>
                </div>
              </div>
            </div>
            <div class="right">
              <!-- <img :src="companyInfo.orgLicenseImg ? companyInfo.orgLicenseImg : ''" alt=""> -->
              <UploadImgs
                v-if="dialogVisibleCompany"
                ref="uploadImgs"
                :max-length="1"
                :show-edit-data="companyInfo.orgLicenseImg"
                @dataChange="updateImg"
              />
              <div class="tip">上传营业执照</div>
            </div>
          </div>
          <div class="line">
            <div class="half" style="width:100%">
              <div style="height: 200px;line-height: 200px">审批备注：</div>
              <div style="height: 200px;line-height: 200px"><input v-model="companyInfo.remark" placeholder="请输入审批备注" type="textarea" style="height: 100%;width:100%;white-space:warp"></div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisibleCompany = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="submitCompany">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import barChart from '@/components/barChart/index'
import VDistpicker from 'v-distpicker'
import UploadImgs from '@/components/UploadImgs'

export default {
  components: {
    barChart,
    VDistpicker,
    UploadImgs
  },
  filters: {
    filterNull(content) {
      return content || '暂无'
    }
  },
  data() {
    return {
      queryForm: {},
      selection: [],
      dialogVisibleCompany: false,
      companyInfo: {
        orgNum: 1
      },
      isEdit: false,
      companySelect: [],
      hasNoParent: true
    }
  },
  mounted() {
    this.$http.getParam('/user/getOrganizationVoList', { size: 5000 }).then(res => {
      this.companySelect = res.records
    })
  },
  methods: {
    query(param = {}) {
      return this.$http.getParam('/user/getOrganizationVoList', { ...param, ...this.queryForm })
    },
    checkDetail(row) {
      this.$router.replace({ path: this.$route.path, query: { index: 'COMPANY_MANAGER_DETAIL', id: row.id }})
      // location.reload()
    },
    onSelectedCity(e) {
      this.companyInfo.orgArea = e.province.value + e.city.value + e.area.value
      this.companyInfo.orgAreaCode = e.area.code
    },
    updateImg(val) {
      this.companyInfo.orgLicenseImg = val
    },
    openDialog(row) {
      this.companyInfo = {
        orgNum: 1
      }
      this.isEdit = false
      if (row && row.id) {
        this.companyInfo = JSON.parse(JSON.stringify(row))
        delete this.companyInfo.createTime
        delete this.companyInfo.createBy
        delete this.companyInfo.updateTime
        delete this.companyInfo.updateBy
        delete this.companyInfo.isDel
        delete this.companyInfo.deleteTime
        delete this.companyInfo.deleteBy
        this.isEdit = true
        if (this.companyInfo.parentId) {
          this.hasNoParent = false
        } else {
          this.hasNoParent = true
        }
      }
      this.dialogVisibleCompany = true
    },
    submitCompany() {
      const submitObj = JSON.parse(JSON.stringify(this.companyInfo))
      if (this.hasNoParent) {
        submitObj.parentId = ''
      }
      if (this.isEdit) {
        this.$http.post('/user/editOrganizationVo', submitObj).then(res => {
          this.$message.success('编辑成功')
          this.dialogVisibleCompany = false
          this.$refs.pageTable.reload()
        })
      } else {
        this.$http.post('/user/addOrganizationVo', submitObj).then(res => {
          this.$message.success('添加成功')
          this.dialogVisibleCompany = false
          this.$refs.pageTable.reload()
        })
      }
    },
    batchDelete() {
      if (this.selection.length > 0) {
        this.$confirm('确定删除该企业信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/user/batchDelOrganizationVo', { organizationVoList: this.selection.map(item => { return { id: item.id } }) }).then(res => {
            this.$message.success('删除成功')
            this.dialogVisibleCompany = false
            this.$refs.pageTable.reload()
          })
        })
      } else {
        this.$message.info('请选择至少一条数据')
      }
    },
    batchBan() {
      if (this.selection.length > 0) {
        this.$confirm('确定禁用该企业信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/user/batchBanOrganizationVo', { organizationVoList: this.selection.map(item => { return { id: item.id } }) }).then(res => {
            this.$message.success('禁用成功')
            this.$refs.pageTable.reload()
          })
        })
      } else {
        this.$message.info('请选择至少一条数据')
      }
    },
    batchUnban() {
      if (this.selection.length > 0) {
        this.$confirm('确定恢复该企业信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('user/batchResumeOrganizationVo', { organizationVoList: this.selection.map(item => { return { id: item.id } }) }).then(res => {
            this.$message.success('恢复成功')
            this.$refs.pageTable.reload()
          })
        })
      } else {
        this.$message.info('请选择至少一条数据')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.company-container {
  .top-data {
     height: 207px;
     margin: 12px 0;
     display: flex;
     padding: 10px 70px 10px 20px;
     .left-chart, .right-data {
       flex: 1;
      }
     .right-data {
       display: flex;
       flex-direction: column;
       justify-content: center;
       .line-box {
         .one-line {
           width: 100%;
           display: flex;
           justify-content: space-between;
           align-items: center;
           .data1 {
             width: 56px;
             text-align: center;
             color: #595959;
             div:nth-child(1) {
               margin-bottom: 4px;
               color: #101010;
             }
             }
           }
         }
      }
     .line {
       margin: 0 52px;
       width: 1px;
       background-color: #e6e6e6;
       height: 100%;
     }
   }
   .bottom-table {
     margin-bottom: 3px;
     overflow: hidden;
     min-height: 480px;
     padding: 6px;
     .title {
      font-weight: bold;
      color: #101010;
      margin: 10px 0;
     }
   }
}
.dialog-box {
  color: #101010;
  padding: 20px;
  .title {
    padding: 4px 11px;
    color: white;
    background-color: #657af2;
  }
  .content {
    .content-top {
      display: flex;
      width: 100%;
      .left {
        flex: 1;
      }
      .right {
        width: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .tip {
          font-size: 16px;
          margin-top: 20px;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.line {
  width: 100%;
  display: flex;
  align-items: center;
  .half {
    width: 50%;
    display: flex;
    align-items: center;
    > div {
      display: inline-block;
      border: 1px solid rgb(240, 240, 240);
      height: 45px;
      line-height: 45px;
      padding-left: 10px;
    }
    > div:nth-child(1) {
      background-color: #f5f7fe;
      width: 170px;
    }
    > div:nth-child(2) {
      width: calc( 100% - 170px );
      > input {
        border: none;
        outline: none;
        width: 220px;
      }
    }

  }
}
</style>
