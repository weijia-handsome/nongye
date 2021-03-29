<template>
  <el-dialog
    class="m-dialog"
    title="设备详情"
    :visible.sync="dialogVisible"
    width="50%"
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
            <p class="m-left__text">设备类型：流量设备</p>
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
                <span class="m-left__text2">实时流量</span>
                <span class="m-left__text1">120</span>
              </div>
              <div class="m-left__time">{{ deviceInfo.heartTime }}</div>
            </li>
            <!-- <li>
              <div class="m-left__box1">
                <div class="m-left__dot"></div>
                <span class="m-left__text2">实时温度</span>
                <span class="m-left__text1">{{ deviceInfo.soilT }}℃</span>
              </div>
              <div class="m-left__time">{{ deviceInfo.heartTime }}</div>
            </li> -->
          </ul>
        </div>
      </div>
      <div class="m-right">
        <div class="m-top">
          <p class="m-top__text">流量统计图</p>
          <div
            class="m-top__item"
            id="lineOne"
            style="width: 450px; height: 290px"
          ></div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import echarts from "echarts/lib/echarts";
import { checkFlowDevice } from "@/api/api.js";

export default {
  name: "Flow",
  data() {
    return {
      dialogVisible: false,
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
      },
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    createParam(deviceInfo) {
      this.deviceInfo.imei = deviceInfo.imei;
      this.deviceInfo.name = deviceInfo.device_name;
      this.deviceInfo.address = deviceInfo.adss;
      this.deviceInfo.status = deviceInfo.state;
      this.deviceInfo.type = deviceInfo.state;
      this.deviceInfo.createTime = deviceInfo.reg_time;
      this.deviceInfo.heartTime = deviceInfo.lastTime;
    },
    handleOpen(deviceInfo) {
      this.dialogVisible = true;
      this.createParam(deviceInfo);
      this.checkFlowDevice();
      this.$nextTick(() => {
        setTimeout(() => {
          this.setlineOne();
        });
      });
    },
    async checkFlowDevice() {
      this.response = await checkFlowDevice({
        username: window.sessionStorage.getItem('username'),
        imei:this.deviceInfo.imei
      })
      console.log(this.response);
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
          data: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
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
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  /deep/ {
    & .el-dialog__header {
      border-bottom: 1px solid #f0f1ef;
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

      &__time {
        font-size: 12px;
        margin-top: 5px;
      }

      &__box1 {
        position: relative;
        width: 200px;
        display: flex;
        justify-content: space-between;
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
      width: 500px;
      height: 400px;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
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
  }
}
</style>
