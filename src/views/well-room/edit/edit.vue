<template>
  <el-dialog
    class="m-dialog"
    title="编辑"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-row :gutter="24" class="m-box">
      <el-form ref="formData" :model="form" label-position="top">
        <el-col :span="12">
          <el-form-item
            label="设备名称"
            prop="userName"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备imei号"
            prop="passward"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.passward"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            class="m-box__text"
            label="设备类型"
            prop="phone"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select placeholder="请选择" v-model="form.region" size="mini">
              <el-option label="管理员" value="0"></el-option>
              <el-option label="超级管理员" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            label="设备部件"
            prop="region"
            class="m-txt__text"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select placeholder="请选择" v-model="form.region">
              <el-option label="管理员" value="0"></el-option>
              <el-option label="超级管理员" value="1"></el-option>
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
export default {
  name: "Edit",
  data() {
    return {
      dialogVisible: false,
      value: "0",
      form: {
        region: "",
        userName: "",
        passward: "",
        phone: "",
      },
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.formData.resetFields();
      });
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          alert("成功");
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
