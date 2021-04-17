<template>
  <div class="m-nav">
    <el-image :src="image"></el-image>
    <div class="m-header">
      <el-image :src="imagePp" class="m-header__image"></el-image>
      <div class="m-header__content">
        <div class="m-header__text1">新疆建设兵团第四师36团智慧团场综合管理平台</div>
        <div class="m-header__text2">
          ntelligent regimental farm integrated management platform of the 36th
          Regiment of the fourth Division
        </div>
      </div>
    </div>
    <div class="m-plate">
      <div class="m-plate__top">
        <div class="m-plate__nav1" @click="handleGo">
          <el-image :src="imageOne"></el-image>
          <span class="m-plate__text1">自动化节水灌溉系统</span>
        </div>
        <div class="m-plate__nav2">
          <el-image :src="imageTwo"></el-image>
          <span class="m-plate__text2">水务供排管理系统</span>
        </div>
        <div class="m-plate__nav3">
          <el-image :src="imageThree"></el-image>
          <span class="m-plate__text3">供暖管网信息化系统</span>
        </div>
        <div class="m-plate__nav4">
          <el-image :src="imagefour"></el-image>
          <span class="m-plate__text4">地下水在线监测系统</span>
        </div>
      </div>
      <div class="m-plate__bottom">
        <div class="m-plate__nav5">
          <el-image :src="imageFine"></el-image>
          <span class="m-plate__text1">智慧灌溉营收系统</span>
        </div>
        <div class="m-plate__nav6">
          <el-image :src="imageSix"></el-image>
          <span class="m-plate__text2">沉沙池在线监测系统</span>
        </div>
        <div class="m-plate__nav7">
          <el-image :src="imageSeven"></el-image>
          <span class="m-plate__text3">主干管网在线监测系统</span>
        </div>
        <div class="m-plate__nav8">
          <el-image :src="imagefour"></el-image>
          <span class="m-plate__text4">农业信息高光谱遥感系统</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nav",
  data() {
    return {
      image: require("../../assets/img/nav.jpg"),
      imagePp: require("../../assets/img/pp.png"),
      imageOne: require("../../assets/img/11.png"),
      imageTwo: require("../../assets/img/22.png"),
      imageThree: require("../../assets/img/33.png"),
      imagefour: require("../../assets/img/44.png"),
      imageFine: require("../../assets/img/55.png"),
      imageSix: require("../../assets/img/66.png"),
      imageSeven: require("../../assets/img/77.png"),
    };
  },
  methods: {
    handleGo() {
      this.$router.push({
        path: "/dashboard",
      });
    },
  },
};
</script>

<style lang="scss" scope>
.m-nav {
  position: relative;

  /deep/ .el-image {
    width: 100%;
  }

  .m {
    &-header {
      position: absolute;
      display: flex;
      width: 100%;
      height: 70px;
      background-color: #005fcb;
      z-index: 333;
      top: 0;
      padding: 10px 0 0 50px;

      /deep/ .el-image {
        width: 50px;
        height: 50px;
      }

      &__text1 {
        font-size: 30px;
        color: #fff;
      }

      &__text2 {
        font-size: 14px;
        color: #fff;
        opacity: 0.4;
      }

      &__content {
        margin-left: 10px;
      }
    }

    &-plate {
      position: absolute;
      width: 1180px;
      height: 320px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -80%);

      &__top {
        display: flex;
        width: 100%;
        justify-content: space-between;
      }

      &__bottom {
        display: flex;
        width: 100%;
        margin-top: 20px;
        justify-content: space-between;
      }

      /deep/ .el-image {
        width: 42px;
        height: 42px;
      }

      &__nav1,
      &__nav4,
      &__nav5,
      &__nav8 {
        position: relative;
        width: 380px;
        height: 145px;
        line-height: 145px;
        text-align: center;
        background-color: #0070c3;
        cursor: pointer;
      }

      &__nav2,
      &__nav3,
      &__nav6,
      &__nav7 {
        position: relative;
        width: 182px;
        height: 145px;
        line-height: 145px;
        text-align: center;
        background-color: #b15401;
        cursor: pointer;
      }

      &__text1 {
        position: absolute;
        height: 90%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -42%);
        font-size: 14px;
        color: #fff;
      }

      &__text2 {
        position: absolute;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -40%);
        font-size: 14px;
        color: #fff;
      }

      &__text3 {
        position: absolute;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -40%);
        font-size: 14px;
        color: #fff;
      }

      &__text4 {
        position: absolute;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -40%);
        font-size: 14px;
        color: #fff;
      }
    }
  }
}
</style>