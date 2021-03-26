<template>
  <el-dialog
    class="m-dialog"
    title="新增井房设备"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-row :gutter="24" class="m-box">
      <el-form ref="formData" :model="form" label-position="top">
        <el-col :span="12">
          <el-form-item
            label="设备名称"
            prop="name"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备imei号"
            prop="imei"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.imei"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            class="m-box__text"
            label="设备类型"
            prop="deviceType"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select
              placeholder="请选择"
              v-model="form.deviceType"
              size="mini"
            >
              <el-option label="重合闸断路器" value="6"></el-option>
              <el-option label="重合闸漏电保护器" value="7"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            label="设备部件"
            prop="other"
            class="m-txt__text"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select placeholder="请选择" v-model="form.other">
              <el-option label="总电源" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveReclosing } from "@/api/api.js";
export default {
  name: "Edit",
  data() {
    return {
      dialogVisible: false,
      value: "0",
      fid: "",
      form: {
        name: "",
        imei: "",
        deviceType: "",
        other: "",
      },
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen(fid) {
      this.dialogVisible = true;
      this.fid = fid;
      this.$nextTick(() => {
        this.$refs.formData.resetFields();
      });
    },
    //新增
    async saveReclosing() {
      const response = await saveReclosing({
        username: window.sessionStorage.getItem("username"),
        tid: this.form.deviceType,
        position: this.form.other,
        imei: this.form.imei,
        name: this.form.name,
        fid: this.fid,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.saveReclosing();
          this.dialogVisible = false;
        } else {
          console.log("失败");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  .m {
    &-txt {
      /deep/ {
        & .el-select {
          width: 100%;
        }
      }
    }

    &-box {
      /deep/ {
        & .el-form-item__label {
          padding: 0;
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
