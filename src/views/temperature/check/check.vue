<template>
  <el-dialog
    class="m-dialog"
    title="设备详情"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose"
    v-loading="loading"
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
              <div class="m-left__time">{{ deviceInfo.heartTime }}</div>
            </li>
            <li>
              <div class="m-left__box1">
                <div class="m-left__dot"></div>
                <span class="m-left__text2">实时温度</span>
                <span class="m-left__text1">{{ deviceInfo.soilT }}℃</span>
              </div>
              <div class="m-left__time">{{ deviceInfo.heartTime }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="m-right" v-loading="loading">
        <el-scrollbar>
          <div class="m-top">
            <p class="m-top__text">温度统计图</p>
            <div
              class="m-top__item"
              id="lineOne"
              style="width: 700px; height: 290px"
            ></div>
          </div>
          <div class="m-top">
            <p class="m-top__text">湿度统计图</p>
            <div
              class="m-top__item"
              id="lineTwo"
              style="width: 700px; height: 290px"
            ></div>
          </div>
          <div class="m-top">
            <p class="m-top__text">历史报警统计图</p>
            <div
              class="m-top__item"
              id="lineThree"
              style="width: 700px; height: 290px"
            ></div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import echarts from "echarts/lib/echarts";
import { reqGetTuRangDeviceInfo } from "@/api/api.js";

export default {
  name: "Check",
  data() {
    return {
      dialogVisible: false,
      loading: false,
      dataTime: [],
      soilTArr: [],
      soilHArr: [],
      alarms: [],
      alarmsValue: '',
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
  watch: {
    response(val) {
      console.log(val);
      this.setlineOne();
      this.setlineTwo();
      this.setlineThree();    
    },
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
    },
    handleOpen(deviceInfo) {
      this.dialogVisible = true;
      this.createParam(deviceInfo);
      this.$nextTick(() => {
        setTimeout(() => {
          this.getDeviceInfo();
        });
      });
    },
    //获取设备信息
    async getDeviceInfo() {
      this.response = await reqGetTuRangDeviceInfo({
        username: window.sessionStorage.getItem("username"),
        imei: this.deviceInfo.imei,
      });
      if (this.response.status === 200) {
        this.loading = true;
        for (let i of this.response.data.data) {
          this.deviceInfo.heartTime = i.s_time;
          this.deviceInfo.soilT = i.soilT;
          this.soilTArr.push(i.soilT);
          this.deviceInfo.soilH = i.soilH;
          this.soilHArr.push(i.soilH);
        }
        const dataTimeArr = this.response.data.data.map((item) => {
          return item.s_time;
        });
        this.dataTime = dataTimeArr.slice(0, 4);

        for(let j of this.response.data.alarms) {
          this.alarmsValue = j.value;
        }
       this.alarms = this.response.data.alarms.map(item => {
          return item.alarmtime;
        })     
      } else {
        this.$message.error(this.response.statusText || "获取设备信息失败!");
      }
      this.loading = false;
    },
    //温度统计图
    setlineOne() {
      let lineFirst = echarts.init(document.getElementById("lineOne"));
      let option = {
        xAxis: {
          type: "category",
          data: this.dataTime,
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
    //湿度统计图
    setlineTwo() {
      let lineSecond = echarts.init(document.getElementById("lineTwo"));
      let option = {
        xAxis: {
          type: "category",
          data: this.dataTime,
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
    //历史报警统计图
    setlineThree() {
      let lineThird = echarts.init(document.getElementById("lineThree"));
      let option = {
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
      align-items: center;
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
  }
}
</style>
