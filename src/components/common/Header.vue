<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>

    <div class="logo">第四师36团自动化节水灌溉系统</div>
    <div class="background-image"></div>
    <div class="light"></div>

    <div class="m-nav__time">
      <div class="m-nav__time--number">{{ currentTime }}</div>
      <div class="m-nav__time--date">
        <p class="title">{{ currentWeek }}</p>
        <p>{{ currentDate }}</p>
      </div>
      <el-image :src="backIcon" @click="handleBack"></el-image>
    </div>
  </div>
</template>
<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      currentTime: "",
      currentDate: "",
      currentWeek: "",
      backIcon: require("../../assets/img/icon-back.png"),
    };
  },
  computed: {},
  methods: {
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    handleBack() {
      this.$router.go(-1);
    },
    getTime() {
      this.currentTime = this.$moment().format("hh:mm:ss");
      this.currentDate = this.$moment().format("YYYY.MM.DD");
      // this.currentWeek = this.$moment().format("dddd");
    },
    getWeek(date) {
      // 参数时间戳
      this.currentWeek = this.$moment(date).day();
      switch (this.currentWeek) {
        case 1:
          return (this.currentWeek = "星期一");
        case 2:
          return (this.currentWeek = "星期二");
        case 3:
          return (this.currentWeek = "星期三");
        case 4:
          return (this.currentWeek = "星期四");
        case 5:
          return (this.currentWeek = "星期五");
        case 6:
          return (this.currentWeek = "星期六");
        case 0:
          return (this.currentWeek = "星期日");
      }
    },
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
  created() {
    this.getTime();
    this.getWeek();
  },
};
</script>
<style scoped>
.header {
  display: flex;
  position: absolute;
  box-sizing: border-box;
  top: 0;
  width: 100%;
  height: 40px;
  font-size: 20px;
  color: #fff;
  background-color: #0844a4;
  justify-content: space-between;
  /* border-bottom: 1px solid #1E4789; */
}
.collapse-btn {
  float: left;
  padding: 0 180px 0 14px;
  cursor: pointer;
  font-size: 18px;
  line-height: 40px;
}
.collapse-btn:hover {
  background-color: #0844a4;
}
.header .logo {
  float: left;
  width: 33%;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  line-height: 40px;
  z-index: 333;
}
.header-right {
  float: right;
  padding-right: 210px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.header .background-image {
  position: absolute;
  width: 620px;
  height: 60px;
  top: -3px;
  left: 51%;
  transform: translate(-50%);
  background-repeat: no-repeat;
  z-index: 111;
  background-image: url(../../assets/img/header-title.png);
  background-size: 620px 50px;
}
.header .light {
  position: absolute;
  width: 500px;
  height: 10px;
  top: 30px;
  left: 35%;
  /* z-index: 555; */
  background-repeat: no-repeat;
  background-image: url(../../assets/img/light.png);
  background-size: 620px 50px;
}
.m-nav__time {
  width: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;
}
.m-nav__time .m-nav__time--number {
  font-size: 16px;
}
.m-nav__time .m-nav__time--date {
  font-size: 8px;
}
.m-nav__time .el-image {
  line-height: 16px;
  cursor: pointer;
}
</style>
