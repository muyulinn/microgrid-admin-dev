<template>
  <el-row class="companyDetail-container" :gutter="12">
    <switchBar :left-menu="menu1" @leftPress="getIndex1" />
    <div class="detail-content common-shadow">
      <div v-show="outerIndex1 === '0'" class="content-box">
        <div class="title">
          企业信息
        </div>
        <div v-if="companyInfo" class="content">
          <div class="content-top">
            <div class="left">
              <div class="line">
                <div class="half">
                  <div>组织名称：</div>
                  <div>{{ companyInfo.orgName | filterNull }}</div>
                </div>
                <div class="half">
                  <div>统一社会信用代码：</div>
                  <div>{{ companyInfo.orgCode | filterNull }}</div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>法人名称：</div>
                  <div>{{ companyInfo.orgDirector | filterNull }}</div>
                </div>
                <div class="half">
                  <div>法人联系方式：</div>
                  <div>{{ companyInfo.orgDirectorPhone | filterNull }}</div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>供配电联系人：</div>
                  <div>{{ companyInfo.orgCharge | filterNull }}</div>
                </div>
                <div class="half">
                  <div>供配电联系方式：</div>
                  <div>{{ companyInfo.orgChargePhone | filterNull }}</div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>企业员工数：</div>
                  <div>{{ companyInfo.orgNum | filterNull }}</div>
                </div>
                <div class="half">
                  <div>上级单位：</div>
                  <div>{{ companyInfo.parentId | filterNull }}</div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>组织类型：</div>
                  <div>{{ companyInfo.orgType | filterNull }}</div>
                </div>
                <div class="half">
                  <div>合作类型：</div>
                  <div>暂无</div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>登记时间：</div>
                  <div>{{ companyInfo.orgCreateTime | filterNull }}</div>
                </div>
                <div class="half">
                  <div>GPS定位：</div>
                  <div>{{ companyInfo.gps | filterNull }}</div>
                </div>
              </div>
              <div class="line">
                <div class="half">
                  <div>所属区域：</div>
                  <div>{{ companyInfo.orgArea | filterNull }}</div>
                </div>
                <div class="half">
                  <div>企业地址</div>
                  <div>{{ companyInfo.orgAddress | filterNull }}</div>
                </div>
              </div>
            </div>
            <div class="right">
              <fs-img :code="companyInfo.orgLicenseImg" alt="" />
            </div>
          </div>
          <div class="line">
            <div class="half" style="width:100%">
              <div style="height: 200px;line-height: 200px">审批备注：</div>
              <div style="height: 200px;line-height: 200px">{{ companyInfo.remark | filterNull }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="outerIndex1 === '1'" class="content-box">
        <div class="bottom-table">
          <div class="title">电房信息</div>
          <page-table
            ref="pageTableRoom"
            :query="queryRoom"
            :selection.sync="selectionRoom"
            @reset="queryFormRoom={}"
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
              <el-table-column label="负责人名称" prop="chargeName" />
              <el-table-column label="负责人电话" prop="chargePhone" />
              <el-table-column label="组织编码" prop="orgCode" width="200" />
              <el-table-column label="组织id" prop="orgId" />
              <el-table-column label="供电系统图" prop="powerPicture">
                <template slot-scope="scope">
                  <img :src="scope.row.powerPicture ? imgHost + scope.row.powerPicture : ''" alt="" style="width: 40px;height:40px">
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark" />
              <el-table-column label="配电房名称" prop="roomName" />
              <el-table-column label="配电房编号" prop="roomNo" />
              <el-table-column label="配电房位置" prop="roomPosition" />
              <el-table-column :label="'操作'" width="300">
                <template #default="{row}">
                  <!-- <div class="common-btn color2" @click="openDialogRoom(row)">编辑</div> -->
                  <el-button type="primary" @click="openDialogRoom(row)">编辑</el-button>
                </template>
              </el-table-column>
            </template>
          </page-table>
        </div>
      </div>
      <div v-show="outerIndex1 === '2'" class="content-box">
        <div class="bottom-table">
          <div class="title">机柜信息</div>
          <page-table
            ref="pageTableCabinet"
            :query="queryCabinet"
            :selection.sync="selectionCabinet"
            @reset="queryFormCabinet={}"
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
              <el-table-column label="负责人名称" prop="chargeName" />
              <el-table-column label="负责人电话" prop="chargePhone" />
              <el-table-column label="设备初始化uuid" prop="deviceUuid" />
              <el-table-column label="配电网输入电压" prop="inputVoltage" />
              <el-table-column label="上级设备uuid" prop="parentUuid" />
              <el-table-column label="高" prop="powerHeight" />
              <el-table-column label="深度" prop="powerLength" />
              <el-table-column label="名称" prop="powerName" />
              <el-table-column label="宽" prop="powerWidth" />
              <el-table-column label="配电房ID" prop="switchRoomId" />
              <el-table-column label="配电柜类型" prop="type" />
              <el-table-column :label="'操作'" width="300">
                <template #default="{row}">
                  <!-- <div class="common-btn color2" @click="openDialogCabinet(row)">编辑</div> -->
                  <el-button type="primary" @click="openDialogCabinet(row)">编辑</el-button>
                </template>
              </el-table-column>
            </template>
          </page-table>
        </div>
      </div>
    </div>
    <el-dialog :title="isEditRoom?'编辑配电房':'新增配电房'" :visible.sync="dialogVisibleRoom" :modal-append-to-body="false">
      <el-form label-width="110px">
        <el-form-item label="负责人名称">
          <el-input v-model="roomForm.chargeName" placeholder="请输入负责人名称" />
        </el-form-item>
        <el-form-item label="负责人电话">
          <el-input v-model="roomForm.chargePhone" placeholder="请输入负责人电话" />
        </el-form-item>
        <el-form-item label="组织编码">
          <el-input v-model="roomForm.orgCode" placeholder="请输入组织编码" disabled />
        </el-form-item>
        <el-form-item label="组织id">
          <el-input v-model="roomForm.orgId" placeholder="请输入组织id" disabled />
        </el-form-item>
        <el-form-item label="供电系统图">
          <UploadImgs
            v-if="dialogVisibleRoom"
            ref="uploadImgs"
            :max-length="1"
            :show-edit-data="roomForm.powerPicture"
            @dataChange="updateImgRoom"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="roomForm.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="配电房名称">
          <el-input v-model="roomForm.roomName" placeholder="请输入配电房名称" />
        </el-form-item>
        <el-form-item label="配电房编号">
          <el-input v-model="roomForm.roomNo" placeholder="请输入配电房编号" />
        </el-form-item>
        <el-form-item label="配电房位置">
          <el-input v-model="roomForm.roomPosition" placeholder="请输入配电房位置" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRoom = false">取消</el-button>
        <el-button type="primary" @click="submitRoom">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="isEditCabinet?'编辑机柜':'新增机柜'" :visible.sync="dialogVisibleCabinet" :modal-append-to-body="false">
      <el-form label-width="110px">
        <el-form-item label="负责人名称">
          <el-input v-model="cabinetForm.chargeName" placeholder="请输入负责人名称" />
        </el-form-item>
        <el-form-item label="负责人电话">
          <el-input v-model="cabinetForm.chargePhone" placeholder="请输入负责人电话" />
        </el-form-item>
        <el-form-item label="设备初始化">
          <!-- <el-input v-model="cabinetForm.deviceUuid" placeholder="请输入设备初始化uuid" /> -->
          <el-select v-model="cabinetForm.deviceUuid" placeholder="请选择设备初始化">
            <el-option
              v-for="item in [{value: 1,label: 'zsyc1'},{value: 2,label: 'zsyc2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配电网输入电压">
          <el-input v-model="cabinetForm.inputVoltage" placeholder="请输入配电网输入电压" />
        </el-form-item>
        <el-form-item label="上级设备">
          <!-- <el-input v-model="cabinetForm.parentUuid" placeholder="请输入上级设备uuid" /> -->
          <el-select v-model="cabinetForm.parentUuid" placeholder="请选择上级设备">
            <el-option
              v-for="item in [{value: 1,label: 'zsyc1'},{value: 2,label: 'zsyc2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="高">
          <el-input v-model="cabinetForm.powerHeight" placeholder="请输入高" />
        </el-form-item>
        <el-form-item label="深度">
          <el-input v-model="cabinetForm.powerLength" placeholder="请输入深度" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="cabinetForm.powerName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="宽">
          <el-input v-model="cabinetForm.powerWidth" placeholder="请输入宽" />
        </el-form-item>
        <el-form-item label="配电房ID">
          <!-- <el-input v-model="cabinetForm.switchRoomId" placeholder="请输入配电房ID" /> -->
          <el-select v-model="cabinetForm.switchRoomId" placeholder="请选择配电房">
            <el-option
              v-for="item in [{value: 1,label: 'zsyc1'},{value: 2,label: 'zsyc2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配电柜类型">
          <el-select v-model="cabinetForm.type" placeholder="请选择配电柜类型">
            <el-option
              v-for="item in [{value: 1,label: 'zsyc1'},{value: 2,label: 'zsyc2'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleCabinet = false">取消</el-button>
        <el-button type="primary" @click="submitCabinet">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import switchBar from '@/components/switchBar/index.vue'
import UploadImgs from '@/components/UploadImgs'

export default {
  components: {
    switchBar,
    UploadImgs
  },
  filters: {
    filterNull(content) {
      return content || '暂无'
    }
  },
  data() {
    return {
      outerIndex1: '0',
      menu1: [
        { value: '0', label: '企业信息' },
        { value: '1', label: '电房信息' },
        { value: '2', label: '机柜信息' }
      ],
      activeNames: ['1'],
      companyInfo: null,

      queryFormRoom: {},
      selectionRoom: [],
      isEditRoom: false,
      dialogVisibleRoom: false,
      roomForm: {},

      queryFormCabinet: {},
      selectionCabinet: [],
      isEditCabinet: false,
      dialogVisibleCabinet: false,
      cabinetForm: {}
    }
  },
  mounted() {
    this.getLineDetail()
  },
  methods: {
    getIndex1(e) {
      this.outerIndex1 = e
      this.$emit('getDetailIndex', e)
    },
    handleChange(val) {
      console.log(val)
    },
    getLineDetail() {
      this.$http.getParam('/user/getOrganizationVoById', { id: this.$route.query.id }).then(res => {
        this.companyInfo = res
      })
    },
    queryRoom(param = {}) {
      param.orgId = this.$route.query.id
      return this.$http.getParam('/electricroom/getSwitchingRoomVoList', { ...param, ...this.queryFormRoom })
    },
    openDialogRoom(row) {
      this.roomForm = {
        orgId: this.companyInfo.id,
        orgCode: this.companyInfo.orgCode
      }
      this.isEditRoom = false
      if (row && row.id) {
        this.isEditRoom = true
        this.roomForm = {
          chargeName: row.chargeName,
          chargePhone: row.chargePhone,
          id: row.id,
          orgCode: row.orgCode,
          orgId: row.orgId,
          powerPicture: row.powerPicture,
          remark: row.remark,
          roomName: row.roomName,
          roomNo: row.roomNo,
          roomPosition: row.roomPosition
        }
      }
      this.dialogVisibleRoom = true
    },
    updateImgRoom(val) {
      this.roomForm.powerPicture = val
    },
    submitRoom() {
      if (this.isEditRoom) {
        this.$http.post('/electricroom/editSwitchingRoomVo', this.roomForm).then(res => {
          this.$message.success('编辑成功')
          this.dialogVisibleRoom = false
          this.$refs.pageTableRoom.reload()
        })
      } else {
        this.$http.post('/electricroom/addSwitchingRoomVo', this.roomForm).then(res => {
          this.$message.success('添加成功')
          this.dialogVisibleRoom = false
          this.$refs.pageTableRoom.reload()
        })
      }
    },
    batchDeleteRoom() {
      if (this.selectionRoom.length > 0) {
        this.$confirm('确定删除该配电房？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/electricroom/batchDelSwitchingRoomVo', { switchingRoomVoList: this.selectionRoom.map(item => { return { id: item.id } }) }).then(res => {
            this.$message.success('删除成功')
            this.$refs.pageTableRoom.reload()
          })
        })
      } else {
        this.$message.info('请选择至少一条数据')
      }
    },

    queryCabinet(param = {}) {
      param.orgId = this.$route.query.id
      return this.$http.getParam('/electricroom/getPowerCabinetVoList', { ...param, ...this.queryFormCabinet })
    },
    openDialogCabinet(row) {
      this.cabinetForm = {}
      this.isEditCabinet = false
      if (row && row.id) {
        this.isEditCabinet = true
        // 这里可能有误，swagger显示编辑机柜配电房需要的参数都是这些
        this.cabinetForm = {
          chargeName: row.chargeName,
          chargePhone: row.chargePhone,
          id: row.id,
          orgCode: row.orgCode,
          orgId: row.orgId,
          powerPicture: row.powerPicture,
          remark: row.remark,
          roomName: row.roomName,
          roomNo: row.roomNo,
          roomPosition: row.roomPosition
        }
      }
      this.dialogVisibleCabinet = true
    },

    submitCabinet() {
      if (this.isEditCabinet) {
        this.$http.post('/electricroom/editPowerCabinetVo', this.cabinetForm).then(res => {
          this.$message.success('编辑成功')
          this.dialogVisibleCabinet = false
          this.$refs.pageTableCabinet.reload()
        })
      } else {
        this.$http.post('/electricroom/addPowerCabinetVo', this.cabinetForm).then(res => {
          this.$message.success('添加成功')
          this.dialogVisibleCabinet = false
          this.$refs.pageTableCabinet.reload()
        })
      }
    },
    batchDeleteCabinet() {
      if (this.selectionCabinet.length > 0) {
        this.$confirm('确定删除该机柜？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/electricroom/batchDelPowerCabinetVo', { powerCabinetVoList: this.selectionCabinet.map(item => { return { id: item.id } }) }).then(res => {
            this.$message.success('删除成功')
            this.$refs.pageTableCabinet.reload()
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
.companyDetail-container {
  margin-top: 12px;
  font-size: 14px;
  margin-left: 0!important;
  margin-right: 0!important;
  .detail-content{
    margin-top: 12px;
    .content-box {
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
            width: 322px;
            background-color: rgb(219, 219, 219);
            img {
              width: 100%;
              height: 100%;
            }
          }
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
    div {
      display: inline-block;
      border: 1px solid rgb(240, 240, 240);
      height: 45px;
      line-height: 45px;
      padding-left: 10px;
    }
    div:nth-child(1) {
      background-color: #f5f7fe;
      width: 220px;
    }
    div:nth-child(2) {
      width: calc( 100% - 220px );
    }
  }
}
</style>
