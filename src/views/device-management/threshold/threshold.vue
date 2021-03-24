<template>
  <el-dialog
    class="m-dialog"
    title="阈值设置"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose"
  >
    <el-row :gutter="24">
      <el-form ref="formData" :model="form" label-position="top">
        <el-col :span="12">
          <el-form-item
            label="最小温度"
            prop="minTem"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.minTem"
              suffix-icon="el-icon-date"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="最大温度"
            prop="maxTem"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.maxTem"
              suffix-icon="el-icon-date"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="最小湿度"
            prop="minHum"
            :rules="[{ required: true, message: '请输入' }]"
            size="mini"
          >
            <el-input
              v-model="form.minHum"
              suffix-icon="el-icon-date"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            label="最大湿度"
            prop="maxHum"
            class="m-txt__text"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.maxHum"
              suffix-icon="el-icon-date"
              size="mini"
            ></el-input>
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
import { reqSetDeThres } from "@/api/api.js";

export default {
  name: "Threshold",
  data() {
    return {
      dialogVisible: false,
      imei: "",
      form: {
        minTem: "",
        maxTem: "",
        minHum: "",
        maxHum: "",
      },
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen(imei) {
      this.dialogVisible = true;
      this.imei = imei;
      this.$nextTick(() => {
        this.$refs.formData.resetFields();
      });
    },
    handleComfirm() {
      this.$refs.formData.validate(async (valid) => {
        if (valid) {
          const response = await reqSetDeThres({
            username: window.sessionStorage.getItem("username"),
            imei: this.imei,
            soilH_min: this.form.minHum,
            soilT_min: this.form.minTem,
            soilH_max: this.form.maxHum,
            soilT_max: this.form.maxTem,
          });
          if (response.status === 200) {
            this.$message.success(response.data.mess);
            this.dialogVisible = false;
          } else {
            this.$message.error(response.data.mess || "服务错误!");
          }
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
      & .el-select {
        width: 100%;
      }
    }
  }
  /deep/ {
    & .el-dialog__header {
      border-bottom: 1px solid #f0f1ef;
    }

    & .el-form-item__label {
      padding: 0;
    }
  }
}
</style>
