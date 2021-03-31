<template>
  <el-dialog
    class="m-dialog"
    title="设备详情"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
  >
    <div class="m-box">
      <div class="m-left">
        <div class="m-left__top">
          <p class="m-left__title">终端信息</p>
          <div class="m-left__content">
            <p class="m-left__text">设备id：{{ deviceInfo.imei }}</p>
            <p class="m-left__text">设备名称：{{ deviceInfo.name }}</p>
            <p class="m-left__text">安装位置：{{ deviceInfo.address }}</p>
            <p
              class="m-left__text"
              :class="{ 'm-left__text--select': deviceInfo.status === '1' }"
              v-text="deviceInfo.status === '1' ? '状态：报警' : '状态：未报警'"
            ></p>
            <p class="m-left__text">设备类型：土壤温湿度传感器</p>
            <p class="m-left__text">心跳时间：{{ deviceInfo.heartTime }}</p>
            <p class="m-left__text">创建时间：{{ deviceInfo.createTime }}</p>
          </div>
        </div>
        <div class="m-left__bottom">
          <p class="m-left__title">传感器数据</p>
          <ul class="m-left__list">
            <li class="m-left__item">
              <div class="m-left__box1">
                <div class="m-left__dot"></div>
                <span class="m-left__text2">实时湿度</span>
                <span class="m-left__text1">{{ deviceInfo.soilH }}%</span>
              </div>
              <div class="m-left__time">{{ deviceInfo.h_ime }}</div>
            </li>
            <li>
              <div class="m-left__box1">
                <div class="m-left__dot"></div>
                <span class="m-left__text2">实时温度</span>
                <span class="m-left__text1">{{ deviceInfo.soilT }}℃</span>
              </div>
              <div class="m-left__time">{{ deviceInfo.h_ime }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="m-right">
        <el-scrollbar>
          <div class="m-top">
            <p class="m-top__text">温度统计图</p>
            <div
              class="m-top__item"
              id="lineOne"
              style="width: 1000px; height: 290px"
            ></div>
          </div>
          <div class="m-top">
            <p class="m-top__text">湿度统计图</p>
            <div
              class="m-top__item"
              id="lineTwo"
              style="width: 1000px; height: 290px"
            ></div>
          </div>
          <div class="m-top">
            <p class="m-top__text">历史报警统计图</p>
            <div
              class="m-top__item"
              id="lineThree"
              style="width: 1000px; height: 290px"
            ></div>
          </div>
        </el-scrollbar>
      </div>
      <div class="m-alarm">
        <p class="m-alarm__title">通知处理情况</p>
        <div class="m-alarm__wrap">
          <el-form label-position="top" ref="ruleForm" :model="ruleForm">
            <el-form-item
              prop="content"
              label="通知处理情况说明"
              :rules="[{ required: true, message: '请输入' }]"
            >
              <el-input
                type="textarea"
                placeholder="请输入"
                v-model="ruleForm.content"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="m-image">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img  :src="dialogImageUrl" alt="" />
          </el-dialog> -->
        </div>
        <div class="m-button">
          <el-button type="danger" size="mini" @click="handleCancel"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="handleConfirm"
            >确定</el-button
          >
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import echarts from "echarts/lib/echarts";
import { reqHisAlarm, reqGetTuRangDeviceInfo, reqDelAlarm } from "@/api/api.js";

export default {
  name: "Alarm",
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      ruleForm: {
        content: "",
      },
      // dataTime: [],
      soilTArr: [],
      soilHArr: [],
      alarms: [],
      alarmsValue: "",
      alarmsId: "",
      response: "",
      deviceInfo: {
        imei: "",
        name: "",
        address: "",
        status: "",
        type: "",
        heartTime: "",
        createTime: "",
        soilT: "",
        soilH: "",
        s_time: "",
        h_ime: "",
      },
    };
  },
  watch: {
    response(val) {
      this.setlineOne();
      this.setlineTwo();
      this.setlineThree();
    },
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    createParam(alarmInfo) {
      this.deviceInfo.imei = alarmInfo.imei;
      this.deviceInfo.name = alarmInfo.dname;
      this.deviceInfo.address = alarmInfo.d_adss;
      this.deviceInfo.status = alarmInfo.state;
      this.deviceInfo.type = alarmInfo.state;
      this.deviceInfo.createTime = alarmInfo.alarmtime;
    },
    handleOpen(alarmInfo) {
      this.dialogVisible = true;
      this.createParam(alarmInfo);
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.ruleForm.clearValidate();
          this.getDeviceInfo();
        });
      });
    },
    async getDeviceInfo() {
      this.response = await reqGetTuRangDeviceInfo({
        username: window.sessionStorage.getItem("username"),
        imei: this.deviceInfo.imei,
      });
      console.log(this.response, "//////////");
      if (this.response.status === 200) {
        this.loading = true;
        this.deviceInfo.heartTime = this.response.data.device.h_ime;
        this.deviceInfo.soilT = this.response.data.device.soilT;
        this.deviceInfo.soilH = this.response.data.device.soilH;
        this.deviceInfo.h_ime = this.response.data.device.h_ime;
        for (let i of this.response.data.data) {
          this.deviceInfo.heartTime = i.s_time;
          this.soilTArr.push(i.soilT);
          this.soilHArr.push(i.soilH);
        }
        // const dataTimeArr = this.response.data.data.map((item) => {
        //   return item.s_time;
        // });
        // this.dataTime = dataTimeArr.slice(0, 6);

        for (let j of this.response.data.alarms) {
          this.alarmsValue = j.value;
          this.alarmsId = j.id;
        }
        this.alarms = this.response.data.alarms.map((item) => {
          return item.alarmtime;
        });
      } else {
        this.$message.error(this.response.statusText || "获取设备信息失败!");
      }
      this.loading = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //解除设备报警
    async delDelAlarm() {
      const response = await reqDelAlarm({
        username: window.sessionStorage.getItem("username"),
        imei: this.deviceInfo.imei,
        aid: this.alarmsId,
      });
      if (response.status === 200) {
        this.$message.success(response.data.mess);
      } else {
        this.$message.error(response.data.mess || "服务错误！");
      }
    },
    setlineOne() {
      let lineFirst = echarts.init(document.getElementById("lineOne"));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        xAxis: {
          type: "category",
          // data: this.dataTime,
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.soilTArr,
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#86BAFF",
              },
            },
            lineStyle: {
              normal: {
                color: "#86BAFF",
              },
            },
          },
        ],
      };
      lineFirst.setOption(option);
    },
    setlineTwo() {
      let lineSecond = echarts.init(document.getElementById("lineTwo"));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        xAxis: {
          type: "category",
          // data: this.dataTime,
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.soilHArr,
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#D853DA",
              },
            },
            lineStyle: {
              normal: {
                color: "#D853DA",
              },
            },
          },
        ],
      };
      lineSecond.setOption(option);
    },
    setlineThree() {
      let lineThird = echarts.init(document.getElementById("lineThree"));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        xAxis: {
          type: "category",
          data: this.alarms,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.alarmsTime,
            type: "line",
            smooth: true,
            itemStyle: {
              normal: {
                color: "#00FFF6",
              },
            },
            lineStyle: {
              normal: {
                color: "#00FFF6",
              },
            },
          },
        ],
      };
      lineThird.setOption(option);
    },
    handleConfirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.delDelAlarm();
          this.dialogVisible = false;
        } else {
          console.log("失败");
          return false;
        }
      });
    },
    handleCancel() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  /deep/ {
    & .el-dialog__header {
      border-bottom: 1px solid #f0f1ef;
    }

    & .el-dialog__body {
      padding-top: 10px;
    }

    & .el-dialog {
      overflow: hidden;
    }
  }
  .m {
    &-box {
      display: flex;
    }

    &-left {
      display: flex;
      flex-direction: column;
      margin-right: 10px;
      overflow: hidden;

      &__title {
        width: 200px;
        font-size: 12px;
        line-height: 30px;
        padding-left: 5px;
        background: #f7f7f7;
      }

      &__top {
        border: 1px solid #f0f1ef;
      }

      &__text {
        width: 200px;
        font-size: 12px;
        line-height: 20px;
        padding-left: 5px;

        &--select {
          color: red;
        }
      }

      &__text1 {
        font-size: 12px;
        color: #0c81f7;
        line-height: 20px;
        padding-left: 5px;
      }

      &__text2 {
        font-size: 12px;
        line-height: 20px;
        padding-left: 15px;
      }

      &__box1 {
        position: relative;
        width: 200px;
        display: flex;
        justify-content: space-between;
      }

      &__time {
        font-size: 12px;
        margin-bottom: 5px;
        padding-left: 14px;
      }

      &__dot {
        position: absolute;
        width: 3px;
        height: 3px;
        top: 8px;
        left: 2px;
        border: 1px solid #047cf7;
        border-radius: 100px;
        background-color: #047cf7;
      }

      &__list {
        list-style: none;
      }

      &__content {
        margin-top: 10px;
      }

      &__bottom {
        margin-top: 10px;
        border: 1px solid #f0f1ef;

        /deep/ {
          .el-timeline-item__content {
            font-size: 12px;
          }

          .el-timeline {
            padding: 5px 0 0 5px;
          }
        }
      }
    }

    &-right {
      display: flex;
      width: 800px;
      height: 600px;
      flex-direction: column;
      justify-content: space-between;
      padding: 5px;

      /deep/ {
        & .el-scrollbar__wrap {
          height: 600px;
        }
      }
    }

    &-top {
      margin-bottom: 10px;
      border: 1px solid #f0f1ef;

      &__text {
        height: 30px;
        line-height: 30px;
        font-weight: bold;
        padding-left: 10px;
        border-bottom: 1px solid #f0f1ef;
      }
    }

    &-alarm {
      display: flex;
      flex-direction: column;
      border: 1px solid #f7f7f7;

      &__wrap {
        width: 100%;

        /deep/ {
          & .el-form-item__label {
            font-size: 14px;
            padding: 0;
          }

          & .el-form-item {
            padding: 5px;
          }
        }
      }

      &__title {
        width: 200px;
        font-size: 12px;
        line-height: 30px;
        padding-left: 5px;
        background: #f7f7f7;
      }
    }

    &-image {
      padding-left: 10px;
      margin-bottom: 20px;
      /deep/ {
        & .el-upload--picture-card {
          width: 60px;
          height: 60px;
          line-height: 60px;
        }

        & .el-icon-plus {
          font-size: 14px;
        }
      }
    }

    &-button {
      height: 30px;
      line-height: 30px;
      text-align: right;
      padding: 10px;
      background-color: #f7f7f7;
    }
  }
}
</style>
