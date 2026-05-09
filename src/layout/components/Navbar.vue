<template>
  <div class="navbar-container">
    <div class="navbar">
      <div class="left-menu">
        <div class="left-box">
          <img src="@/assets/jiahua/head/baricon.png" alt="">
          <a href="/">
            <div>{{ title }}</div>
          </a>
        </div>
        <div class="right-box">
          <div class="input-box">
            <input type="text" placeholder="传感器/应用/位置......">
          </div>
          <div class="btn">
            <img src="@/assets/jiahua/head/arrow.png" alt="">
          </div>
        </div>
      </div>
      <div class="right-menu">
        <div v-if="alertSum>0" class="first alerting" @click="$router.push('/alerting/index')">
          <i class="el-icon-warning" style="color:#ff4747;font-size: 24px;margin-right:10px" />警告
        </div>
        <div class="avatar">
          <img :src="avatar ? avatar : '@/assets/jiahua/head/avatar.png'" alt="">
          <div>{{ name }}，你好！</div>
        </div>
        <div class="oper">
          <div class="exit" @click="logout">
            <img src="@/assets/jiahua/head/exit.png" alt="">
            <div>安全退出</div>
          </div>
        </div>
      </div>
    </div>
    <ChangePass :show.sync="showPass" :close="close" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChangePass from '@/components/ChangePass'
import { title } from '@/settings'
export default {
  name: 'NavbarJiahua',
  components: {
    ChangePass
  },
  data() {
    return {
      showPass: false,
      title,
      roomIds: [],
      alertSum: 0
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'name'])
  },
  async mounted() {
    this.roomIds = await this.$http.getParam('/adminDevice/page', { size: 100, deviceType: 'ROOM' }).then(json => json.records.map(a => a.id))
    this.loadAlert()
  },
  methods: {
    async logout() {
      this.$confirm('退出当前账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    },
    show() {
      this.showPass = true
    },
    close() {
      this.showPass = false
    },
    async loadAlert() {
      console.log('roomIdsroomIdsroomIds', this.roomIds)
      const roomsFilter = `treePath=~".+",roomId=~"${this.roomIds.join('|')}"`
      const query = `count(ALERTS{alertstate="firing", ${roomsFilter}})`
      this.alertSum = 0
      const { result: [{ value: [, value] }] } = await this.$http.post('adminDevice/prom/query', { query })
      this.alertSum = value * 1

      console.log('valuevaluevaluevalue', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-container {
  height: 254px;
  // background-color: #ea5504;
  background-color: #546bf0;
  padding: 20px 27px;
  .navbar {
    height: 50px;
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 15px;
    align-items: center;
    .left-menu {
      display: flex;
      align-items: center;
      .left-box {
        display: flex;
        align-items: center;
        img {
          width: 33px;
          height: 33px;
          margin-right: 13px;
        }
        div {
          font-size: 20px;
          font-weight: bold;
        }
      }
      .right-box {
        display: flex;
        align-items: center;
        margin-left: 37px;
        width: 200px;
        .input-box {
          border-radius: 6px;
          overflow: hidden;
          height: 30px;
          input {
            height: 100%;
            width: 156px;
            padding: 6px;
            font-size: 13px;
            outline: none;
          }
        }
        .btn {
          width: 43px;
          height: 28px;
          background-color: #ffb142;
          margin-left: -3px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          img {
            width: 13px;
            height: 13px;
          }
        }
      }
    }
    .right-menu {
      display: flex;
      align-items: center;
      .first {
        margin-right: 65px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .avatar {
        margin-right: 22px;
        display: flex;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          margin-right: 12px;
        }
      }
      .oper {
        .exit {
          display: flex;
          align-items: center;
          cursor: pointer;
          img {
            width: 18px;
            height: 18px;
            margin-right: 6px;
          }
        }
      }
    }

    .alerting{
      animation: blinking 1s infinite
    }
    @keyframes blinking {
      0% { opacity: 1; }
      100% {opacity: 0;  }
    }
  }
}
</style>
