<template>
  <div class="m-login modules">
    <div class="m-background">
      <div class="m-block">
        <el-carousel height="1000px" autoplay-speed="5000" dots="none">
          <el-carousel-item v-for="(item, index) in imageList" :key="index">
            <el-image :src="item.image"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="m-content">
      <p class="m-content__header">第四师36团智慧团场综合管理平台</p>
      <div class="m-content__login">
        <el-form ref="ruleForm" :model="ruleForm" class="demo-ruleForm">
          <el-form-item
            prop="userName"
            :rules="[
              {
                required: true,
                message: '请输入您的用户名',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              placeholder="请输入您的用户名"
              v-model="ruleForm.userName"
              size="mini"
            >
              <i slot="suffix" class="el-icon-user-solid"></i>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="[
              { required: true, message: '请输入您的密码', trigger: 'blur' },
            ]"
          >
            <el-input
              placeholder="请输入您的密码"
              v-model="ruleForm.password"
              size="mini"
              type="password"
            >
              <i slot="suffix" class="el-icon-s-goods"></i>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="m-content__bottom--button">
          <el-button size="mini" type="primary" @click="handleCommit"
            >登录</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqLogin } from "@/api/api.js";

export default {
  name: "Login",
  data() {
    return {
      imageList: [
        {
          image: require("../../assets/img/1.ffaae62.jpg"),
        },
        {
          image: require("../../assets/img/2.597fbd0.jpg"),
        },
        {
          image: require("../../assets/img/3.a173108.jpg"),
        },
        {
          image: require("../../assets/img/5.da22e40.jpg"),
        },
        {
          image: require("../../assets/img/6.17ae7c4.jpg"),
        },
      ],
      ruleForm: {
        userName: "15679193873",
        password: "admin",
      },
    };
  },
  methods: {
    handleCommit() {
      const formRefs = this.$refs.ruleForm;
      formRefs.validate(async (valid) => {
        if (valid) {
          const response = await reqLogin({
            username: this.ruleForm.userName,
            password: this.ruleForm.password,
          });
          console.log(response)
          if (response.data.list[0].status) {
            this.$router.push({ path: "/dashboard" });
            window.sessionStorage.setItem("username", this.ruleForm.userName);
          } else {
            this.$message(response.data.list[0].mess);
          }
        }
      });
    },
  },
  mounted() {
    this.$refs.ruleForm.resetFields();
  },
};
</script>

<style lang="scss" scoped>
.m-login {
  position: relative;
  width: 100%;
  height: 100%;

  .m {
    &-background {
      position: absolute;
      width: 100%;
      height: 100%;

      ::v-deep {
        &.el-carousel__item .el-image {
          width: 100%;
        }
      }
    }

    &-block {
      /deep/ {
        & .el-image {
          width: 100%;
          height: 100%;
        }
      }
    }

    &-content {
      position: absolute;
      width: 280px;
      height: 230px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border: 1px solid #fff;
      z-index: 999;

      &__header {
        padding: 10px;
        font-size: 16px;
        line-height: 20px;
        color: #17233d;
        font-weight: 500;
        text-align: center;
      }

      &__login {
        text-align: center;
        padding: 20px;
        border-top: 1px solid #e8eaec;

        ::v-deep {
          & .el-input--suffix {
            width: 100%;
          }

          & .el-input__inner {
            height: 25px;
            border-radius: 0;
          }
        }
      }

      &__bottom--button {
        /deep/ {
          & .el-button {
            width: 100%;
            border-radius: 0;
          }
        }
      }
    }

    &-content:hover {
      box-shadow: 1px 1px 1px #a3a3a3;
    }
  }
}
</style>
