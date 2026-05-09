<template>
  <div :class="'apps '+ theme">
    <div class="bg" />
    <div class="nav">
      <!--
      <el-switch v-model="isDark" active-color="#383838" class="el-icon-switch" style="margin-right: 15px;" />
       -->
      <!-- <el-link class="go-back" @click="$router.go(-1)">
        <i class="el-icon-back">返回
        </i>
      </el-link> -->
    </div>
    <!-- <el-switch v-model="isDark" active-color="#383838" class="el-icon-switch" style="margin-right: 15px;" /> -->
    <Header />

    <AppList />
  </div>
</template>

<script>
import AppList from '../components/AppList.vue'
import Header from '../components/Header.vue'

export default {
  components: { AppList, Header },
  data() {
    return {
      isDark: false,
      themeList: ['dark', 'light', 'blue']
    }
  },
  computed: {
    theme() {
      const theme = this.$route.query.theme
      return this.themeList.includes(theme) ? theme : this.themeList[2]
    }
  }
}
</script>

<style lang="less" scoped>
@z-index:0;
.bg {
  position: fixed;
  inset: 0px;
  z-index: -1;
  background: #1f2123;
}
  .apps{
    padding-top: 80px;
    .nav{
      position: fixed;
      top:5px;
      right: 5px;
    }
    // switch
    ::v-deep{
      .el-switch__core::after{
        line-height: 18px;
          content: "\e6f6";
      }
      .is-checked .el-switch__core::after{
          content: "\e6ee";
          background: black;

      }

    }
    .go-back,.nav{
      color: white;
    }
    &.light,&.blue{
      .bg{
        background-color: #ececec;
      }
      .go-back,.nav{
        color:black
      }
      ::v-deep{
        .app-item.css-应急系统 .icon{
          filter: invert(1);
        }
        .app-item .title{
          // filter: invert(1)
          color: #171717;
        }
        .more .icon{
          background-color: #ffffff;
          color: #000000;
        }
        .header{
          .title img{
            filter: invert(1)
          }
        }
      }
    }
    &.dark{
      ::v-deep{
        .header{
          filter: invert(1);
          .title img{
            filter: invert(1)
          }
        }
      }

    }
    &.blue{
      .bg{
        background-color: #9ad2fb;
      }
      ::v-deep{
        .header{
          .title img{
            filter: invert(0)
          }
        }
      }
    }
  }

</style>

