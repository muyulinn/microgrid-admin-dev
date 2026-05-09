<template>
  <div id="app">
    <!-- <Header /> -->
    <router-view />
  </div>
</template>

<script>
// import Header from '@/components/header/header'
export default {
  name: 'App'
  // components: { Header }
}
</script>
<style>
  .common-container {
    position: relative;
    height: calc(100vh - 150px);
    font-family: 'SourceHanSansCN-Medium', Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    font-weight: Medium;
    font-size: 30px;
    color: #909399;
    width: 98%;
    margin-left: 0.3%;
  }
  .common-shadow {
    border-radius: 8px;
    box-shadow: 0px 0px 6px 1px rgba(187, 185, 185, 0.4);
    background-color: white;
    font-size: 14px;
  }
  .common-btn {
    color: white;
    font-size: 12px;
    padding: 1px 7px;
    background-color: #546BF0;
    display: inline-block;
    cursor: pointer;
    margin-right: 15px;
  }
  .common-list {
    padding:15px 10px;
    min-height:calc(100% - 4px);
    margin: 0 3px
  }
  .content-box {
    overflow-y: auto;
    height: calc(100vh - 196px);
    padding: 1px 2px;
  }
  .color1 {
    background-color: #546BF0;
  }
  .color2 {
    background-color: #F85D47;
  }
  .color3 {
    background-color: #FF9800;
  }
  ::-webkit-scrollbar{
    width:0;
    border-radius: 10px;
    /* box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #C1C1C1; */
  }
  .index-flex {
    display: flex;
  }
  .download-pic {
  width:16px;
  height:16px;
  margin: 0 5px 0 0;
}
</style>
