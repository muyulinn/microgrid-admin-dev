<!--
by lcs
2020-09-14

event : reset 重置查询
props : query 查询方法
slot  : query-form 查询表单
        action-in-line 表格操作方法，混合在查询表单后面
        action-new-line 表格操作方法，查询表单下面，单独一行
        table-body  表格内容
-->
<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-form ref="queryForm" class="query-form" :inline="true" label-suffix=":" label-width="auto" @submit.native.prevent="innerQuery">
        <slot name="query-form" />
        <el-button type="primary" class="query-btn" :disabled="loading" @click="innerQuery()"> 查询</el-button>
        <el-button type="info" class="query-btn" :disabled="loading" @click.prevent="$refs.queryForm.resetFields(),$emit('reset')"> 重置</el-button>
        <slot name="action-in-line" />
      </el-form>
    </el-row>
    <el-row>
      <el-row class="action-new-line">
        <slot name="action-new-line" />
      </el-row>
      <el-table
        ref="table"
        v-loading="loading"
        class="page-table"
        :data="tableData"
        stripe
        width="100%"
        highlight-current-row
        :show-summary="showSummary"
        :summary-method="getSummaries"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :header-cell-style="{ background: '#f5f7fe', color: '#000' }"
        @selection-change="handleSelectionChange"
        @current-change="val=>handleSelectionChange([val])"
      >
        <slot name="table-body" />
      </el-table>
    </el-row>
    <pagination v-if="showPage" :total="total" style="padding:0" :page.sync="pageNum" :limit.sync="pageSize" @pagination="paginationQuery" />
  </div>
</template>

<script>
import pagination from '@/components/Pagination'
import Sortable from 'sortablejs'

export default {
  name: 'PageTable',
  components: { pagination },
  props: {
    query: {
      type: Function,
      default: () => {}
    },
    selection: {
      type: Array,
      default: () => {}
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    showPage: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageData: {},
      loading: false,
      pageSize: 20,
      pageNum: 1
    }
  },
  computed: {
    tableData() {
      return this.pageData && this.pageData.records || []
    },
    total() {
      return this.pageData && this.pageData.total || 0
    }
  },
  created() {},
  mounted() {
    this.innerQuery()
    this.fixPlaceholder(this.$refs.queryForm.$el)
    this.$nextTick(() => this.setupSort())
    console.log(location.href, this._uid, this)
    this.$refs.table.columns
      .filter((col) => col.type === 'index')
      .forEach((col) => {
        col.index = this.tableIndex
      })
  },
  methods: {
    /**
     * 自动完善查询表单里的 placeholder
     * 1. lable 有内容
     * 2. input.el-input__inner 有并且只有一个
     * 3. input.el-input__inner 的placeHolder为空
     */
    fixPlaceholder(el) {
      Array.from(el.querySelectorAll('.el-form-item'))
        .filter(item => item.__vue__.label)
        .filter(item => {
          const input = item.querySelectorAll('input.el-input__inner')
          if (input.length !== 1) return false
          return !input[0].placeholder
        }).forEach(item => {
          if (item.querySelector('.el-input input.el-input__inner')) {
            item.querySelector('.el-input input.el-input__inner').placeholder = '请输入' + item.__vue__.label
          }
          if (item.querySelector('.el-select input.el-input__inner')) {
            item.querySelector('.el-select input.el-input__inner').placeholder = '请选择' + item.__vue__.label
          }
        })
    },

    /**
     * 查询
     */
    innerQuery(param = {}) {
      this.loading = true
      console.debug('inner', { size: this.pageSize, ...param })
      return this.query({ size: this.pageSize, ...param }).then(pageData => {
        this.pageData = pageData
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 分页事件
     */
    paginationQuery(data) {
      console.log('data', data)
      const { page: current, limit: size } = data
      this.innerQuery({ current, size })
    },

    /**
     * 重新加载，保证页码不变
     *
     */
    reload() {
      return this.innerQuery({ current: this.pageNum })
    },
    /**
     * 行选中
     */
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
      this.$emit('update:selection', val)
    },
    /**
     * 校验是否选中行
     */
    checkSelection(msg, min = 1, max = 100) {
      if (this.selection.length < min) {
        const message = msg || `请至少选择${min}行`
        this.$message({ message })
        return Promise.reject(message)
      }
      if (this.selection.length > max) {
        const message = msg || `至多选择${max}行`
        this.$message({ message })
        return Promise.reject(message)
      }
      return Promise.resolve()
    },
    /**
     * 校验交并获取选中行
     * @param {*} msg
     * @param {*} min
     * @param {*} max
     */
    async getSelection(msg, min = 1, max = 100) {
      await this.checkSelection(msg, min, max)
      return this.selection
    },
    /**
     * 表尾合计行
     */
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index !== 0 || index !== 1 || index !== 2) {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        }
      })
      return sums
    },

    /**
     * 列顺序调整
     */
    setupSort() {
      const storeKey = this.genElId(this.$el)
      const el = this.$refs.table.$el.querySelector('.el-table__header-wrapper  thead > tr')
      const colgroup = this.$refs.table.$el.querySelector('.el-table__header-wrapper  colgroup')
      const list = this.$refs.table.columns
      const colsIndex = {}
      list.forEach(({ id }, index) => (colsIndex[id] = index))
      const savedIndex = (localStorage.getItem(storeKey) || '').split(',')
      const colList = Array.from(colgroup.childNodes)
      const elChildList = Array.from(el.childNodes)
      const listClone = list.map(a => a)

      Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd(evt) {
          const targetRow = list.splice(evt.oldIndex, 1)[0]
          list.splice(evt.newIndex, 0, targetRow)
          storeKey && localStorage.setItem(storeKey, list.map(({ id }) => colsIndex[id]).join(','))
        }
      })
      savedIndex.length === list.length && savedIndex.map(i => i * 1).forEach((i, index) => {
        el.appendChild(elChildList[i])
        colgroup.appendChild(colList[i])
        list[index] = listClone[i]
      })
    },
    /**
     * 序号
     */
    tableIndex(index) {
      return (this.pageNum - 1) * this.pageSize + index + 1
    },
    /**
     * 生成节点的UID
     */
    genElId($el) {
      if ($el.id) return `pagetTable_${$el.id}`
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.action-new-line{
  padding: 5px;
  background: #f3f3f3;
  border: 1px #e2e2e2 solid;
  border-bottom: none;
  &:empty {
    display:none
}

}
::v-deep{
  .query-form {
    >.query-form-item, >.query-form-item2{
      margin-bottom: 5px;;
      margin-right: 25px;
    }
    >.query-btn{
      margin-bottom: 5px;
      margin-right: 20px;
      margin-left: 8px;
    }
    .query-form-item, .query-form-item.el-input {
      width: 150px;
    }
    .query-form-item2, .query-form-item2.el-input {
      width: 325px;
    }
    .query-btn:first-child,.query-btn:first-child +*{
      display: none;
    }
    .el-form-item {
      margin-bottom:5px;
      .query-form-item2, .query-form-item2.el-input {
        width: 232px;
      }
    }
  }
  .el-table__header th.is-leaf{
    background: rgb(245, 247, 250);
  }
  .el-table .el-icon-loading{
    zoom: 2;
  }
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
  .page-table.el-table tr.current-row,

  .page-table.el-table.el-table--striped .el-table__body tr.el-table__row--striped.current-row >td.el-table__cell,

  .page-table .el-table__body tr.current-row > td.el-table__cell{
    background-color: #cfcfcf5b !important;
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
// ::v-deep .el-table__body .el-table__row.hover-row td{
//   background-color: rgb(166, 207, 255);
// }
</style>
