<template>
  <el-tree
    ref="tree"
    v-loading="loading"
    style="max-width: 160px;overflow: scroll;"
    :load="loadTreeData"
    :data="roomList"
    :expand-on-click-node="false"
    :default-expanded-keys="['0',0]"
    node-key="id"
    highlight-current
    :lazy="showChild"
    @node-click="data=>$emit('selectNode', data)"
  >
    <template #default="{ data }">
      {{ data.deviceName }}
    </template>
  </el-tree>
</template>

<script>
const ROOT_KEY = 0
export default {
  props: {
    showChild: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      roomList: [],
      loading: false
    }
  },
  async mounted() {
    if (this.showChild) {
      return
    }
    this.roomList = await this.loadRoom({ size: 1000, deviceType: 'ROOM' })
  },
  methods: {
    /**
     * 加载设备树数据
     */
    async loadTreeData({ level, data }, resolve) {
      const param = { size: 1000 }

      if (level === 0) {
        return resolve([{
          deviceName: '所有',
          id: ROOT_KEY,
          children: []
        }])
      }

      if (level === 1) {
        param.deviceType = 'ROOM'
      } else {
        // if (!this.showChild) return resolve([])
        param.parentId = data.id
      }
      const list = await this.loadRoom(param)
      resolve(list.sort((a, b) => a.sortNum - b.sortNum))
    },
    /**
     * 加载机房数据
     */
    async loadRoom(param) {
      this.loading = true
      const roomList = await this.$http.getParam('/adminDevice/page', { ...param }).then(json => json.records)
      this.loading = false
      return roomList
    },
    /**
     *重新加载树
     */
    async reloadTree() {
      const key = this.$refs.tree.getCurrentKey()
      const node = this.$refs.tree.getNode(key || ROOT_KEY)
      node.loaded = false
      node.expand()
    }

  }
}
</script>

<style>

</style>
