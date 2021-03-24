<template>
  <el-dialog
    class="m-dialog"
    title="新增滴灌任务"
    :visible.sync="dialogVisible"
    width="50%"
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
            label="滴灌任务名称"
            prop="name"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.userName" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="滴灌时长"
            prop="time"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.userName" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="time" class="m-dialog__time">
            <el-date-picker
              v-model="form.value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务类型" prop="time">
            <el-select
              v-model="form.taskType"
              placeholder="请选择活动区域"
              size="mini"
              class="m-txt__text"
            >
              <el-option label="分区" value="0"></el-option>
              <el-option label="管网" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="滴灌类型" prop="time">
            <el-select
              v-model="form.irrType"
              placeholder="请选择活动区域"
              size="mini"
              class="m-txt__text"
            >
              <el-option label="论灌" value="1"></el-option>
              <el-option label="直灌" value="2"></el-option>
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
      form: {
        name: "",
        time: "",
        value1: "",
        taskType: "",
        irrType: "",
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
        this.$refs.formData.clearValidate();
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
    // &-txt {
    //   /deep/ .el-select {
    //     width: 100%;
    //   }
    // }

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

    &-dialog__time {
      /deep/ {
        & .el-date-editor {
          width: 365px;
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
