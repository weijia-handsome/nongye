<template>
  <el-dialog
    class="m-dialog"
    title="流量详情"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose"
  >
    <el-row>
      <el-col :span="8">
        <el-form :model="form">
          <el-form-item label="时间查询" label-width="80px">
            <el-date-picker
              v-model="form.value1"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleSelect"
              size="mini"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
      <div class="m-btn">
        <el-button type="primary" size="mini" @click="handleExport"
          >导出</el-button
        >
      </div>
    </el-row>
    <div
      class="m-wrap"
      id="lineOne"
      style="width: 1200px; height: 290px"
      v-if="speedVisible"
    ></div>
    <div
      class="m-wrap"
      id="lineTwo"
      style="width: 1200px; height: 290px"
      v-if="flowLevelVisible"
    ></div>
    <div
      class="m-wrap"
      id="lineThree"
      style="width: 1200px; height: 290px"
      v-if="secondFlowVisible"
    ></div>
    <div
      class="m-wrap"
      id="lineFour"
      style="width: 1200px; height: 290px"
      v-if="hourFlowVisible"
    ></div>
    <div
      class="m-wrap"
      id="lineFine"
      style="width: 1200px; height: 290px"
      v-if="lowPositiveFlowVisible"
    ></div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogVisible=false">取 消</el-button> -->
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import echarts from "echarts/lib/echarts";
import { getDeviceInfoAll2 } from "@/api/api.js";
import qs from "qs";

export default {
  name: "Check",
  data() {
    return {
      dialogVisible: false,
      response: "",
      imei: "",
      tableData: [],
      speedFlow: [],
      flowLevel: [],
      secondFlow: [],
      hourFlow: [],
      lowPositiveFlow: [],
      dataTime: [],
      form: {
        value1: "",
      },
      params: {
        pno: 1,
        pageSize: 10,
        tid: 8,
      },
    };
  },
  watch: {
    response(val) {
      if (
        this.speedFlow &&
        this.speedFlow.length > 0 &&
        this.speedFlow[0] !== ""
      ) {
        this.setlineOne();
      }

      if (
        this.flowLevel &&
        this.flowLevel.length > 0 &&
        this.flowLevel[0] !== ""
      ) {
        this.setlineTwo();
      }

      if (
        this.secondFlow &&
        this.secondFlow.length > 0 &&
        this.secondFlow[0] !== ""
      ) {
        this.setlineThree();
      }

      if (
        this.hourFlow &&
        this.hourFlow.length > 0 &&
        this.hourFlow[0] !== ""
      ) {
        this.setlineFour();
      }

      if (
        this.lowPositiveFlow &&
        this.lowPositiveFlow.length > 0 &&
        this.lowPositiveFlow[0] !== ""
      ) {
        this.setlineFine();
      }
    },
  },
  computed: {
    baseUrl: {
      get: function () {
        return "/Agriculture";
      },
    },
    speedVisible: {
      get: function () {
        if (
          this.speedFlow &&
          this.speedFlow.length > 0 &&
          this.speedFlow[0] !== ""
        ) {
          return true;
        }
        return false;
      },
    },
    flowLevelVisible: {
      get: function () {
        if (
          this.flowLevel &&
          this.flowLevel.length > 0 &&
          this.flowLevel[0] !== ""
        ) {
          return true;
        }
        return false;
      },
    },
    secondFlowVisible: {
      get: function () {
        if (
          this.secondFlow &&
          this.secondFlow.length > 0 &&
          this.secondFlow[0] !== ""
        ) {
          return true;
        }
        return false;
      },
    },
    hourFlowVisible: {
      get: function () {
        if (
          this.hourFlow &&
          this.hourFlow.length > 0 &&
          this.hourFlow[0] !== ""
        ) {
          return true;
        }
        return false;
      },
    },
    lowPositiveFlowVisible: {
      get: function () {
        if (
          this.lowPositiveFlow &&
          this.lowPositiveFlow.length > 0 &&
          this.lowPositiveFlow[0] !== ""
        ) {
          return true;
        }
        return false;
      },
    },
  },
  methods: {
    //流速折线图
    setlineOne() {
      this.$nextTick(() => {
        setTimeout(() => {
          let lineFirst = echarts.init(document.getElementById("lineOne"));
          let option = {
            title: {
              text: "流速",
            },
            tooltip: {
              trigger: "axis",
            },
            xAxis: {
              type: "category",
              data: this.dataTime,
              // axisLabel: {
              //   interval: 0,
              // },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                formatter: "{value} m³/s",
                // textStyle: {
                //   color: "#04E0F9", //坐标值得具体的颜色
                // },
              },
            },
            series: [
              {
                data: this.speedFlow,
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
        });
      });
    },
    //液位折线图
    setlineTwo() {
      this.$nextTick(() => {
        setTimeout(() => {
          let lineFirst = echarts.init(document.getElementById("lineTwo"));
          let option = {
            title: {
              text: "液位",
            },
            tooltip: {
              trigger: "axis",
            },
            xAxis: {
              type: "category",
              data: this.dataTime,
              // axisLabel: {
              //   interval: 0,
              // },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                formatter: "{value} m",
                // textStyle: {
                //   color: "#04E0F9", //坐标值得具体的颜色
                // },
              },
            },
            series: [
              {
                data: this.flowLevel,
                type: "line",
                smooth: true,
                itemStyle: {
                  normal: {
                    color: "#64B7EC",
                  },
                },
                lineStyle: {
                  normal: {
                    color: "#64B7EC",
                  },
                },
              },
            ],
          };
          lineFirst.setOption(option);
        });
      });
    },
    //每秒流量
    setlineThree() {
      this.$nextTick(() => {
        setTimeout(() => {
          let lineFirst = echarts.init(document.getElementById("lineThree"));
          let option = {
            title: {
              text: "每秒流量",
            },
            tooltip: {
              trigger: "axis",
            },
            xAxis: {
              type: "category",
              data: this.dataTime,
              // axisLabel: {
              //   interval: 0,
              // },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                formatter: "{value} m³/s",
                // textStyle: {
                //   color: "#04E0F9", //坐标值得具体的颜色
                // },
              },
            },
            series: [
              {
                data: this.secondFlow,
                type: "line",
                smooth: true,
                itemStyle: {
                  normal: {
                    color: "#DEE565",
                  },
                },
                lineStyle: {
                  normal: {
                    color: "#DEE565",
                  },
                },
              },
            ],
          };
          lineFirst.setOption(option);
        });
      });
    },
    //每小时流量
    setlineFour() {
      this.$nextTick(() => {
        setTimeout(() => {
          let lineFirst = echarts.init(document.getElementById("lineFour"));
          let option = {
            title: {
              text: "每小时流量",
            },
            tooltip: {
              trigger: "axis",
            },
            xAxis: {
              type: "category",
              data: this.dataTime,
              // axisLabel: {
              //   interval: 0,
              // },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                formatter: "{value} m³/h",
                // textStyle: {
                //   color: "#04E0F9", //坐标值得具体的颜色
                // },
              },
            },
            series: [
              {
                data: this.hourFlow,
                type: "line",
                smooth: true,
                itemStyle: {
                  normal: {
                    color: "#E68639",
                  },
                },
                lineStyle: {
                  normal: {
                    color: "#E68639",
                  },
                },
              },
            ],
          };
          lineFirst.setOption(option);
        });
      });
    },
    // 正累计流量低位
    setlineFine() {
      this.$nextTick(() => {
        setTimeout(() => {
          let lineFirst = echarts.init(document.getElementById("lineFine"));
          let option = {
            title: {
              text: "正累计流量",
            },
            tooltip: {
              trigger: "axis",
            },
            xAxis: {
              type: "category",
              data: this.dataTime,
              // axisLabel: {
              //   interval: 0,
              // },
            },
            yAxis: {
              type: "value",
              axisLabel: {
                formatter: "{value} m³",
                // textStyle: {
                //   color: "#04E0F9", //坐标值得具体的颜色
                // },
              },
            },
            series: [
              {
                data: this.lowPositiveFlow,
                type: "line",
                smooth: true,
                itemStyle: {
                  normal: {
                    color: "#27BA81",
                  },
                },
                lineStyle: {
                  normal: {
                    color: "#27BA81",
                  },
                },
              },
            ],
          };
          lineFirst.setOption(option);
        });
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleExport() {
      const username = window.sessionStorage.getItem("username");
      const url =
        `${this.baseUrl}/uploadDeviceData?` +
        qs.stringify({
          username: username,
          imei: this.imei,
          tid: 8,
        });
      window.open(url);
    },
    handleSelect(time) {
      if (!time) {
        this.startTime = this.endTime = null;
        return;
      }

      [this.startTime, this.endTime] = time;
      this.getDeviceInfoAll2();
    },
    handleOpen(imei) {
      this.dialogVisible = true;
      this.imei = imei;
      this.getDeviceInfoAll2();
    },
    async getDeviceInfoAll2() {
      this.response = await getDeviceInfoAll2({
        username: window.sessionStorage.getItem("username"),
        imei: this.imei,
      });
      if (this.response.status === 200) {
        this.tableData = this.response.data.data;
        for (let i of this.tableData) {
          this.speedFlow.push(Number(i.speedFlow).toFixed(2));
          this.flowLevel.push(Number(i.flowLevel).toFixed(2));
          this.secondFlow.push(Number(i.secondFlow).toFixed(2));
          this.hourFlow.push(Number(i.hourFlow).toFixed(2));
          this.lowPositiveFlow.push(Number(i.lowPositiveFlow).toFixed(2));
          this.dataTime.push(i.s_time);
        }
      } else {
        this.$message.error(this.response.statusText || "服务错误!");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  .m {
    &-btn {
      position: absolute;
      left: 500px;
    }
  }
}
</style>