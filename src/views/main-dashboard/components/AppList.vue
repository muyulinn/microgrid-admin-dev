<template>
  <div class="app-list">
    <div v-for="(item,index) in list" :key="index" :class="'app-item ' + 'css-'+item.name " @click="openUrl(item)">
      <span class="icon">
        <svg-icon :icon-class="item.icon" />
      </span>
      <span class="title">{{ item.name }}</span>
    </div>
    <div class="more">
      <div class="icon">
        <i class="el-icon-plus" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.initSystemList()
  },
  methods: {
    /**
     * 初始化系统列表
     */
    initSystemList() {
      this.list = [{ name: '电网系统', 'path': '/home', icon: 'app_系统状态' }]
      this.list = this.list.concat(this.$store.getters.permission_routes.filter(r => r.name === '系统管理').map(r => r.children).flat())
    },
    /**
     * 打开系统url
     * @param {*} system
     */
    openUrl(system) {
      if (system.path === '/home') {
        this.$router.push('/home')
      } else {
        window.open(system.path, '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-list{
  align-content: flex-start;
  display: grid;
  grid-row-gap: max(min(calc((100vh - (120px * 4) - (100vh * 1 / 16 + 24px) * 2)/ 4),96px),8px);
  justify-content: space-evenly;
  margin: auto;
  max-width: 1088px;
  padding-bottom: calc(100vh * 1/16 + 24px);
  padding-top: calc(100vh * 1/16 + 24px);
  grid-template-columns: repeat(5,max(100% / 5,112px));

  // background: rgba(11, 11, 11, 0.5);
  @icon-size:80px;
  .app-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .icon{
      display: flex;
      justify-content: center;
      align-items: center;
      width: @icon-size;
      height: @icon-size;
      background-color:#ececec;
      color:black;
      font-size: 40px;
      border-radius: 20%;
      transition: all .3s;
      .svg-icon{
        transition: all .3s;
      }
      &:hover{
        transform: scale(1.1);
        .svg-icon{
          transform: scale(1.1);
        }
      }
    }

    &.css-电网系统{
      .icon{ background: linear-gradient(#008DEA 30%,#00F9F9); }
      .svg-icon{  filter: invert(1) }
    }
    &.css-智慧电房{
      .icon{ background: linear-gradient(rgb(17	219	101	) 30%,rgb(17	219	101	)); }
      // .svg-icon{  filter: invert(1) }
    }
    &.css-光伏系统{
      .icon{ background: linear-gradient(rgb(243, 216, 108) 30%,rgb(252	208	63	)); }
      // .svg-icon{  filter: invert(1) }
    }
    &.css-储能系统{
      .icon{ background: linear-gradient(45deg, #0098DA, #002A6E);}
      .svg-icon{  filter: invert(1) }
    }
    &.css-充电系统{

      .icon{ background: linear-gradient(rgb(30 ,195,125 ) 30%,rgb(30 ,195,125 )); }
      .svg-icon{  filter: invert(1) }
    }
    &.css-冷热系统{
      .icon{ background: linear-gradient(rgb(201, 7, 23) 30%,rgb(201, 7, 23)); }
      .svg-icon{  filter: invert(1) }
    }
    &.css-水气系统{
      .icon{ background: linear-gradient(#00C4F9, #0076F0); }

      .svg-icon{  filter: invert(1) }
    }
    &.css-特种设备{
      .icon{  background: linear-gradient(#D46DFB, #842CC2); }
      .svg-icon{  filter: invert(1) }
    }
    // &.css-应急系统{
    //   .icon{ background: linear-gradient(#008DEA 30%,#00F9F9); }
    //   .svg-icon{  filter: invert(1) }
    // }

    .title{
      color: whitesmoke;
      margin-top: 15px ;
      font-size: 18px;
    }

    // width: 100px;
    // height: 200px;
    // background-color: rgb(153, 51, 51);
  }
  .more{
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: not-allowed;

    .icon{
      display: flex;
      justify-content: center;
      align-items: center;
      width: @icon-size;
      height: @icon-size;
      background-color:#383838;
      color:rgb(255, 255, 255);
      font-size: 40px;
      border-radius: 20%;
      border: 2px dashed #7b7b7b;
    }
  }
}

</style>
<style lang="less" scoped>
@media screen and (orientation:portrait) {
  .app-list{
  grid-template-columns: repeat(3,max(100% / 5,112px));
  }
}
</style>
