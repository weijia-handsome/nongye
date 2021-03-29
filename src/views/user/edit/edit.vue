<template>
  <el-dialog
    class="m-dialog"
    :title="id ? '编辑' : '新增'"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose"
  >
    <el-row :gutter="24">
      <el-form
        ref="formData"
        :model="form"
        label-position="top"
        class="m-dialog__form"
      >
        <el-col :span="12">
          <el-form-item
            label="账号"
            prop="userName"
            :rules="[{ required: true, message: '账号不能为空' }]"
          >
            <el-input v-model="form.userName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="密码"
            prop="passward"
            :rules="[{ required: true, message: '密码不能为空' }]"
          >
            <el-input v-model="form.passward" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="联系方式"
            prop="phone"
            :rules="[{ required: true, message: '联系方式不能为空' }]"
          >
            <el-input v-model="form.phone" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            label="角色"
            prop="region"
            class="m-txt__text"
            :rules="[{ required: true, message: '角色不能为空' }]"
          >
            <el-select placeholder="请选择" v-model="form.region" clearable>
              <el-option
                v-for="(item, index) in role"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancal">取 消</el-button>
      <el-button type="primary" @click="handleComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reqEditUser, reqSaveUser, reqGetRole } from "@/api/api.js";

export default {
  name: "Edit",
  data() {
    return {
      dialogVisible: false,
      value: "0",
      id: "",
      form: {
        region: "",
        userName: "",
        passward: "",
        phone: "",
      },
      role: [],
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleCancal() {
      this.dialogVisible = false;
    },
    async getrole() {
      const response = await reqGetRole({
        username: window.sessionStorage.getItem("username"),
        pno: 1,
        pageSize: 10,
        object: "",
      });
      if (response.status === 200) {
        this.role = response.data.data;
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    handleOpen(userInfo) {
      this.dialogVisible = true;
      this.getrole();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });
      if (userInfo) {
        this.id = userInfo.id;
        this.form.userName = userInfo.name;
        this.form.phone = userInfo.phone;
        this.form.region = userInfo.role;
        this.form.passward = "";
      } else {
        this.id = "";
        this.form.userName = "";
        this.form.phone = "";
        this.form.region = "";
        this.form.passward = "";
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.id) {
            this.editUserInfo();
          } else {
            this.createUserInfo();
          }
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    async editUserInfo() {
      const response = await reqEditUser({
        username: window.sessionStorage.getItem("username"),
        password: this.form.passward,
        phone: this.form.phone,
        role: this.form.region,
        id: this.id,
        name: this.form.userName
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess);
      }
    },
    async createUserInfo() {
      const response = await reqSaveUser({
        username: window.sessionStorage.getItem("username"),
        name: this.form.userName,
        pass: this.form.passward,
        phone: this.form.phone,
        role: this.form.region,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  .m {
    &-txt {
      & .el-select {
        width: 100%;
      }
    }

    &-dialog__form {
      /deep/ {
        & .el-form-item__label {
          padding: 0;
        }
        & .el-form-item__content {
          line-height: 0;
        }
      }
    }
  }

  /deep/ {
    & .el-dialog__header {
      border-bottom: 1px solid #f0f1ef;
    }
  }
}
</style>
