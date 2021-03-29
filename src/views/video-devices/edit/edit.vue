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
            label="管网名称"
            prop="name"
            clearadle
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select
              v-model="form.name"
              placeholder="请选择管网"
              @change="handleSelectId(value)"
              size="mini"
            >
              <el-option
                v-for="(item, index) in guanwang"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备编号"
            prop="imei"
            :rules="[{ required: true, message: '设备编号不能为空' }]"
          >
            <el-input v-model="form.imei" size="mini" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="安装地址"
            prop="address"
            :rules="[{ required: true, message: '安装地址不能为空' }]"
          >
            <el-input v-model="form.address" size="mini" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            label="创建时间"
            prop="createTime"
            class="m-txt__text"
            :rules="[{ required: true, message: '创建时间不能为空' }]"
          >
            <el-date-picker
              v-model="form.createTime"
              type="datetime"
              placeholder="选择日期时间"
              size="mini"
            >
            </el-date-picker>
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
import { adDevice, getGW, editVideo } from "@/api/api.js";

export default {
  name: "Edit",
  props: ["videoInfo"],
  data() {
    return {
      dialogVisible: false,
      value: "0",
      id: "",
      nid: "",
      form: {
        name: "",
        imei: "",
        address: "",
        createTime: "",
      },
      guanwang: [],
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleCancal() {
      this.dialogVisible = false;
    },
    handleOpen(info) {
      this.dialogVisible = true;
      this.handleSelect();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });

      if (info) {
        this.id = info.id;
        this.form.name = info.network_name;
        this.form.imei = info.imei;
        this.form.address = info.adss;
        this.form.createTime = info.reg_time;
      } else {
        this.id = "";
        this.form.name = "";
        this.form.imei = "";
        this.form.address = "";
        this.form.createTime = "";
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.id) {
            this.editVideo();
          } else {
            this.adDevice();
          }
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    //编辑
    async editVideo() {
      const response = await editVideo({
        username: window.sessionStorage.getItem("username"),
        id: this.id,
        netid: this.form.name,
        addr: this.form.address,
      });
      if (response.data.code === 200) {
        this.$message.success(response.data.msg);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.msg || "服务错误!");
      }
    },
    //获取分区
    async handleSelect() {
      const response = await getGW({
        username: window.sessionStorage.getItem("username"),
      });
      if (response.status === 200) {
        this.guanwang = response.data;
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    handleSelectId(val) {
      console.log(val);
    },
    async adDevice() {
      const params = {
        username: window.sessionStorage.getItem("username"),
        nid: "",
        device_name: this.videoInfo[0].device_name,
        imei: this.form.imei,
        tid: "0",
        lant_lat: this.videoInfo[0].lant_lat,
        netid: this.form.name,
        adss: this.form.address,
      };
      const response = await adDevice(params);
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess || "服务错误!");
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

        & .el-select--mini {
          width: 290px;
        }

        & .el-date-editor {
          width: 290px;
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
