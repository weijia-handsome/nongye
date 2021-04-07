<template>
  <el-dialog
    class="m-dialog"
    title="任务详情"
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
            <el-input v-model="form.name" size="mini" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="滴灌时长"
            prop="time"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.time" size="mini" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="time" class="m-dialog__time">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="选择日期时间"
              size="mini"
              :rules="[{ required: true, message: '请选择' }]"
              disabled
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务类型" prop="time">
            <el-select
              v-model="form.taskType"
              placeholder="请选择"
              size="mini"
              class="m-txt__text"
              disabled
            >
              <el-option label="直灌" value="2"></el-option>
              <el-option label="轮灌" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="滴灌类型" prop="time">
            <el-select
              v-model="form.irrType"
              placeholder="请选择"
              size="mini"
              class="m-txt__text"
              @change="handleSelect"
              disabled
            >
              <el-option label="管网" value="2"></el-option>
              <el-option label="分区" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="form.irrType == '分区' ? '分区' : '管网'"
            prop="time"
          >
            <el-select
              v-model="form.netType"
              placeholder="请选择"
              size="mini"
              class="m-txt__text"
              disabled
            >
              <el-option
                v-for="item in netArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.taskType === '1'">
          <el-form-item label="轮灌结束时间" prop="time" class="m-dialog__time">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择日期时间"
              size="mini"
              disabled
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.taskType === '1'">
          <el-form-item label="轮灌周期(天数)" prop="num">
            <el-input-number
              v-model="form.num"
              controls-position="right"
              :min="1"
              :max="10"
              size="mini"
              disabled
            ></el-input-number>
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
import { getTypeByGrid } from "@/api/api.js";

export default {
  name: "Edit",
  data() {
    return {
      dialogVisible: false,
      netId: "",
      id: "",
      form: {
        name: "",
        time: "",
        startTime: "",
        endTime: "",
        taskType: "",
        irrType: "",
        netType: "",
        num: "",
      },
      netArr: [],
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen(irrInfo) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });

      if (irrInfo) {
        this.form.name = irrInfo.name;
        this.form.time = irrInfo.time;
        this.form.startTime = irrInfo.start_time;
        this.form.endTime = irrInfo.end_time;
        this.form.irrType = irrInfo.type === "1" ? "分区" : "管网";
        this.form.netType = irrInfo.o_name;
        this.form.taskType = irrInfo.type === "1" ? "轮灌" : "直灌";
        this.id = irrInfo.id;
      } else {
        this.form.name = "";
        this.form.time = "";
        this.form.startTime = "";
        this.form.endTime = "";
        this.form.irrType = "";
        this.form.netType = "";
        this.form.taskType = "";
        this.id = "";
      }
    },
    async handleSelect() {
      const response = await getTypeByGrid({
        username: window.sessionStorage.getItem("username"),
        type: this.form.irrType,
      });
      if (response.status === 200) {
        this.netArr = response.data.data;
        this.netArr.forEach((i) => {
          this.netId = i.id;
        });
      } else {
        this.$message.error(response.statusText || "服务异常!");
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
        } else {
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
    &-dialog__form {
      /deep/ {
        & .el-form-item__label {
          padding: 0;
        }
        & .el-form-item__content {
          line-height: 0;
        }

        & .el-input__inner {
          width: 350px;
          color: #333;
        }

        & .el-input-number {
          width: 350px;
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
