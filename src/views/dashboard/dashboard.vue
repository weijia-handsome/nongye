<template>
  <div
    class="m-dashboard"
    v-loading="pageLoading"
    element-loading-text="初始化中..."
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <div class="m-map" id="map"></div>
    <iframe
      ref="myIframe"
      src="http://www.thingjs.com/pp/12b7cc044faa9639451d4132"
      style="
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 999;
        display: none;
      "
    ></iframe>
    <!-- 按钮 -->
    <div class="m-button" @click="handleSelect">
      <span>全部项目</span>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </div>
    <div class="m-menu" v-if="menuVisible">
      <p
        class="m-menu__title"
        @click="handleSelectMenu(index)"
        v-for="(item, index) in projectButton"
        :key="index"
      >
        {{ item }}
      </p>
    </div>
    <!-- 左边图表 -->
    <div class="m-left">
      <!-- <div class="m-left__background"></div> -->
      <div class="m-left__first">
        <p class="m-left__title">流量数据</p>
        <div
          class="m-left__round"
          id="roundChart"
          style="width: 100%; height: 88.5%"
        ></div>
      </div>
      <div class="m-left__second">
        <!-- <div class="m-left__background"></div> -->
        <p class="m-left__title1">温湿度传感器</p>
        <div
          class="m-left__round1"
          id="lineChart"
          style="width: 100%; height: 81.5%"
          v-loading="pageLoading"
        ></div>
      </div>
      <div class="m-left__third">
        <!-- <div class="m-left__background"></div> -->
        <p class="m-left__title">物联设备</p>
        <div
          class="m-left__round2"
          id="thingsChart"
          style="width: 100%; height: 88.5%"
        ></div>
      </div>
    </div>

    <!-- 中间图表 -->
    <div class="m-min">
      <p class="m-min__title">滴灌任务</p>
      <div class="m-min__tit">
        <div
          class="m-min__txt"
          @click="handleLunGuan"
          :class="{ 'm-min__txt--select': color === '0' }"
        >
          轮灌
        </div>
        <div
          class="m-min__txt"
          @click="handleZhiGuan"
          :class="{ 'm-min__txt--select': color === '1' }"
        >
          直灌
        </div>
        <div
          class="m-min__txt"
          @click="handleTask"
          :class="{ 'm-min__txt--select': color === '2' }"
        >
          新建任务
        </div>
        <div
          class="m-min__txt"
          @click="handleManger"
          :class="{ 'm-min__txt--select': color === '3' }"
        >
          管理任务
        </div>
      </div>

      <div class="m-min__content">
        <el-scrollbar class="m-min__line">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              size="normal"
            >
              <div
                class="m-min__mask"
                @click="handleiIll(activity)"
                :style="randomRgb(index)"
              >
                <span class="m-min__task">任务名称：{{ activity.name }}</span>
                <span v-if="activity.state === '0'"
                  >任务在{{ activity.start_time }}未执行 时长为：{{
                    activity.time
                  }}
                </span>
                <span v-if="activity.state === '1'"
                  >任务在{{ activity.start_time }}执行中 时长为：{{
                    activity.time
                  }}
                </span>
                <span v-if="activity.state === '2'"
                  >任务在{{ activity.start_time }}完成 时长为：{{
                    activity.time
                  }}
                </span>
                <span v-if="activity.state === '3'"
                  >任务在{{ activity.start_time }}待执行 时长为：{{
                    activity.time
                  }}
                </span>
                <span v-if="activity.state === '1'">执行中</span>
                <span v-if="activity.state === '2'">完成</span>
                <el-button
                  size="mini"
                  type="text"
                  @click.stop="handleCheck(activity)"
                  :style="randomRgb(index)"
                  >查看现场</el-button
                >
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </div>
    </div>

    <!-- 右边图表 -->
    <div class="m-right">
      <div class="m-right__round">
        <p class="m-right__text">通知信息</p>
        <!-- el-scrollbar -->
        <el-scrollbar class="m-right__first">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in pushAlarmArr"
              :key="index"
              icon="el-icon-time"
              size="primary"
            >
              <div class="m-right__alarm" @click="hanleAlarm(item)">
                <p class="m-right__time">{{ item.alarmtime }}</p>
                <p class="m-right__txt">设备id:{{ item.imei }}</p>
                <p class="m-right__txt">设备名称:{{ item.dname }}</p>
                <p class="m-right__txt">设备类型:{{ item.deviceType }}</p>
                <p class="m-right__txt">报警类型:{{ item.alarmType }}</p>
                <p class="m-right__txt">报警值:{{ item.value }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </div>
      <div class="m-right__roun">
        <p class="m-right__title">设备状态对比</p>
        <div
          class="m-right__first"
          id="roundTwo"
          style="width: 99.5%; height: 80%"
        ></div>
      </div>
      <div class="m-right__rou">
        <p class="m-right__title">农作物占比</p>
        <div
          class="m-right__box"
          id="cropsCharts"
          style="width: 100%; height: 90%"
        ></div>
      </div>
    </div>
    <task ref="taskRef" @refresh="handleLunGuan"></task>
    <alarm ref="alarmRef"></alarm>
    <check-video ref="videoRef"></check-video>
  </div>
</template>

<script>
import echarts from "echarts/lib/echarts";
import {
  getAverage,
  getPidAndPname,
  deviceTypeData,
  deviceOnlineData,
  pushAlarmData,
  pushGrid,
  reqGetNetspot,
  getFlowDevice,
  get3dSoilDate,
} from "@/api/api.js";
import Task from "./task/task.vue";
import Alarm from "./alarm/alarm.vue";
import CheckVideo from "./checkVideo/checkVideo.vue";

export default {
  name: "bigData",
  components: {
    Task,
    Alarm,
    CheckVideo,
  },
  data() {
    return {
      map: null, //地图实例
      pageLoading: false,
      menuVisible: false,
      //经纬度
      lnt: [],
      color: "",
      pid: "",
      param: {
        pno: 1,
        pageSize: 10,
      },
      projectButton: [],
      deviceType: [],
      deviceData: "",
      deviceOnline: "",
      deviceOnlineOnline: "",
      deviceOnlineOffline: "",
      pushAlarm: "",
      pushAlarmArr: "",
      activities: [],
      getAverageResponse: "",
      getAverageArrT: [],
      getAverageArrH: [],
      getAverageTime: [],
      flowResponse: "",
      flowTotal: [],
    };
  },
  methods: {
    // // 初始化
    setMap() {
      this.$nextTick(() => {
        this.map = new AMap.Map("map", {
          resizeEnable: true,
          center: [110.397428, 25.90923],
          // keyboardEnable: false,
          zoom: 4,
          mapStyle: "amap://styles/blue",
        });

        const username = sessionStorage.getItem("username");
        reqGetNetspot({ username, pno: "", pageSize: "" }).then((res) => {
          var cluster,
            markers = [];
          let data = res.data.data;

          const points2 = [];
          for (var i = 0; i < data.length; i++) {
            var pp = data[i].lnt;
            var name = data[i].name;
            // var nid = data[i].nid;
            if (lat > 54) {
              var lng = pp.split(",")[1];
              var lat = pp.split(",")[0];
              points2.push({
                lnglat: [lng, lat],
                name: name,
                nid: data[i].spid,
              });
            } else {
              var lng = pp.split(",")[0];
              var lat = pp.split(",")[1];
              points2.push({
                lnglat: [lng, lat],
                name: name,
                nid: data[i].spid,
              });
            }
          }
          var style = [
            {
              url: "https://a.amap.com/jsapi_demos/static/images/mass0.png",
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(20, 20),
            },
            // {
            //   url: "https://a.amap.com/jsapi_demos/static/images/mass1.png",
            //   anchor: new AMap.Pixel(4, 4),
            //   size: new AMap.Size(7, 7),
            // },
            // {
            //   url: "https://a.amap.com/jsapi_demos/static/images/mass2.png",
            //   anchor: new AMap.Pixel(3, 3),
            //   size: new AMap.Size(5, 5),
            // },
          ];
          var mass = new AMap.MassMarks(points2, {
            opacity: 0.8,
            zIndex: 111,
            cursor: "pointer",
            style: style[0],
          });
          mass.on("mouseover", function (e) {
            marker.setPosition(e.data.lnglat);
            marker.setLabel({ content: e.data.name });
          });

          var marker = new AMap.Marker({ content: " ", map: this.map });
          mass.setMap(this.map);

          const _that = this;
          const username = sessionStorage.getItem("username");
          mass.on("click", (e) => {
            console.log(e);
            // _that.$refs.myIframe.style.display = "block";
            // _that.callFuncInThingJS("changeLevel", 1);
            get3dSoilDate({ username, nid: e.data.nid }).then((res) => {
              if (res.data.code == 200) {
                console.log(username);
                _that.$refs.myIframe.style.display = "block";
                _that.callFuncInThingJS("changeLevel", e.data.nid, username);
                this.$nextTick(() => {
                  const item = document.getElementById("widget_root"); //动态删除多出的子元素
                  console.log(item, 9999); // while (item.firstChild) { //   item.removeChild(item.firstChild); // }
                });
              }
            });
          });
        });
      });
    },
    callFuncInThingJS(funcName, data, username) {
      // var iframe = $("#myIframe")[0];

      var message = {
        funcName: funcName, // 所要调用ThingJS页面里的函数名
        nid: data,
        username: username,
      };
      this.$refs.myIframe.contentWindow.postMessage(message, "*");
    },
    upDataInfo(e) {
      console.log(e);
    },
    //流量柱状图
    setRoundChart() {
      let roundChart = echarts.init(document.getElementById("roundChart"));
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
        dataset: {
          dimensions: ["product", "实时流量"],
          source: this.flowTotal,
        },
        xAxis: {
          type: "category",
          // data: this.flowTime,
          axisLabel: {
            textStyle: {
              color: "#04E0F9", //坐标值得具体的颜色
            },
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
          // min: 8000,
          // max: 15000 ,
          // interval: 2000,
          axisLabel: {
            formatter: "{value} m³",
            textStyle: {
              color: "#04E0F9", //坐标值得具体的颜色
            },
          },
        },
        grid: {
          top: 40,
          x: 60,
          x2: 60,
          y2: 40,
        },
        series: [
          {
            // data: this.flowTime,
            type: "bar",
            barWidth: 15,
            itemStyle: {
              normal: {
                color: "#04E0F9",
                lineStyle: {
                  color: "#04E0F9",
                },
              },
            },
          },
        ],
      };
      roundChart.setOption(option);
    },
    //温湿度折线图
    setlineChart() {
      let lineChart = echarts.init(document.getElementById("lineChart"));
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        legend: {
          data: ["温度", "湿度", "平均温度"],
          textStyle: {
            fontSize: 12,
            color: "#04E0F9",
          },
        },
        grid: {
          top: 40,
          x: 60,
          x2: 60,
          y2: 40,
        },
        xAxis: [
          {
            type: "category",
            data: this.getAverageTime,
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              textStyle: {
                color: "#04E0F9", //坐标值得具体的颜色
              },
              interval: 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "温度",
            nameTextStyle: {
              color: "#C8742D",
            },
            axisLabel: {
              formatter: "{value} ℃",
              textStyle: {
                color: "#04E0F9", //坐标值得具体的颜色
              },
            },
          },
          {
            type: "value",
            name: "湿度",
            nameTextStyle: {
              color: "#C8742D",
            },
            axisLabel: {
              formatter: "{value} %",
              textStyle: {
                color: "#04E0F9", //坐标值得具体的颜色
              },
              itemStyle: {
                color: "#C8742D",
              },
            },
          },
        ],
        series: [
          {
            name: "温度",
            type: "bar",
            data: this.getAverageArrT,
            itemStyle: {
              normal: {
                color: "#04E0F9",
                lineStyle: {
                  color: "#04E0F9",
                },
              },
            },
          },
          {
            name: "湿度",
            type: "bar",
            data: this.getAverageArrH,
            itemStyle: {
              normal: {
                color: "#C8742D",
                lineStyle: {
                  color: "#C8742D",
                },
              },
            },
          },
          {
            name: "平均温度",
            type: "line",
            yAxisIndex: 1,
            data: this.getAverageArrT,
            itemStyle: {
              normal: {
                color: "#04E0F9",
                lineStyle: {
                  color: "#04E0F9",
                },
              },
            },
          },
        ],
      };
      lineChart.setOption(option);
    },
    //物联设备
    setThingsChart() {
      let thingsChart = echarts.init(document.getElementById("thingsChart"));
      let option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "right",
          orient: "vertical",
          textStyle: {
            fontSize: 12,
            color: "#04E0F9",
          },
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            data: this.deviceType,
          },
        ],
      };
      thingsChart.setOption(option);
    },
    //设备状态占比
    setRoundTwo() {
      let roundTwo = echarts.init(document.getElementById("roundTwo"));
      let option = {
        //提示框组件
        tooltip: {
          trigger: "item",
        },
        //图例
        legend: {
          orient: "vertical",
          top: "5%",
          left: "right",
          textStyle: {
            fontSize: 12,
            color: "#04E0F9",
          },
        },
        //系列列表
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: this.deviceOnlineOnline,
                name: "在线",
                itemStyle: { color: "#047DF9" },
              },
              {
                value: this.deviceOnlineOffline,
                name: "离线",
                itemStyle: { color: "#DB7E2F" },
              },
            ],
          },
        ],
      };
      roundTwo.setOption(option);
    },
    //农作物占比
    setCrops() {
      let crops = echarts.init(document.getElementById("cropsCharts"));
      let option = {
        tooltip: {
          trigger: "item",
        },
        //图例
        legend: {
          orient: "vertical",
          top: "5%",
          left: "right",
          textStyle: {
            fontSize: 12,
            color: "#04E0F9",
          },
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "枣树", itemStyle: { color: "#64B7EC" } },
              { value: 300, name: "黑枸杞", itemStyle: { color: "#DEE565" } },
              { value: 274, name: "棉花", itemStyle: { color: "#E68639" } },
              { value: 200, name: "打瓜", itemStyle: { color: "#27BA81" } },
              { value: 400, name: "桃", itemStyle: { color: "#27B8BA" } },
              { value: 210, name: "甜瓜", itemStyle: { color: "#04E0F9" } },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            labelLine: {
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              color: "#c23531",
              shadowBlur: 200,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      };
      crops.setOption(option);
    },
    handleSelect() {
      this.menuVisible = !this.menuVisible;
    },
    handleSelectMenu(index) {
      this.deviceType = [];
      this.getPidAndPname(index);
      this.getAverage();
      this.getPidAndPname();
      this.deviceTypeData();
      this.deviceOnlineData();
      this.pushAlarmData();
      this.menuVisible = false;
    },
    handleTask() {
      this.color = "2";
      this.$refs.taskRef.handleOpen();
    },
    handleManger() {
      this.color = "3";
      this.$router.push({
        path: "/irrigation-task",
      });
    },
    hanleAlarm(alarmInfo) {
      this.$refs.alarmRef.handleOpen(alarmInfo);
    },
    handleiIll(irrInfo) {
      this.$refs.taskRef.handleOpen(irrInfo);
    },
    //流量计
    async getFlowDevice() {
      this.flowResponse = await getFlowDevice({
        username: window.sessionStorage.getItem("username"),
      });
      console.log(this.flowResponse, "流量计");
      if (this.flowResponse.status === 200) {
        this.flowResponse.data.data.forEach((i) => {
          this.flowTotal.push({
            product: i.device_name,
            实时流量: Number(i.secondFlow).toFixed(2),
          });
        });
      } else {
        this.$message.error(this.flowResponse.data.mess || "服务错误!");
      }
    },
    //温湿度传感器
    async getAverage() {
      this.getAverageResponse = await getAverage({
        username: window.sessionStorage.getItem("username"),
        pid: this.pid,
      });
      console.log(this.getAverageResponse, "温湿度传感器");
      if (this.getAverageResponse.status === 200) {
        this.pageLoading = true;
        const arrT = this.getAverageResponse.data.mess.map((item) => {
          return Number(item.soilT).toFixed(1);
        });
        this.getAverageArrT = arrT.slice(0, 4);
        const arrH = this.getAverageResponse.data.mess.map((item) => {
          return Number(item.soilH).toFixed(1);
        });

        this.getAverageArrH = arrH.slice(0, 4);
        const arrTime = this.getAverageResponse.data.mess.map((item) => {
          return item.time;
        });
        this.getAverageTime = arrTime.slice(0, 4);
      } else {
        this.$message.error(this.getAverageResponse.statusText || "服务错误!");
      }
      this.pageLoading = false;
    },
    //大数据页获取项目
    async getPidAndPname(index) {
      const response = await getPidAndPname({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
      });
      if (response.status === 200) {
        this.projectButton = response.data.data.map((item) => {
          return item.name;
        });
        const pidArr = response.data.data.map((item) => {
          return item.id;
        });
        switch (index) {
          case 0:
            return (this.pid = pidArr[0]);
          case 1:
            return (this.pid = pidArr[1]);
          case 2:
            return (this.pid = pidArr[2]);
          case 3:
            return (this.pid = pidArr[3]);
          case 4:
            return (this.pid = pidArr[4]);
          case 5:
            return (this.pid = pidArr[5]);
        }
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    //物联设备
    async deviceTypeData() {
      this.deviceData = await deviceTypeData({
        username: window.sessionStorage.getItem("username"),
        pid: this.pid,
      });
      if (this.deviceData.status === 200) {
        for (let i of this.deviceData.data.mess) {
          this.deviceType.push({ value: i.num, name: i.name, index: [] });
        }
      } else {
        this.$message.error(this.deviceData.statusText || "服务错误！");
      }
    },
    //设备状态对比
    async deviceOnlineData() {
      this.deviceOnline = await deviceOnlineData({
        username: window.sessionStorage.getItem("username"),
        pid: this.pid,
      });
      if (this.deviceOnline.status === 200) {
        this.deviceOnlineOnline = this.deviceOnline.data.mess.Online;
        this.deviceOnlineOffline = this.deviceOnline.data.mess.Offline;
      }
    },
    //报警信息
    async pushAlarmData() {
      const response = await pushAlarmData({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        pid: this.pid,
      });
      if (response.status === 200) {
        this.pushAlarmArr = response.data.data;
        console.log(response, "报警信息");
      } else {
        this.$message.error(response.statusText || "服务错误");
      }
    },
    //轮灌任务
    async handleLunGuan() {
      this.color = "0";
      const response = await pushGrid({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        pid: this.pid,
        type: 1,
      });
      if (response.status === 200) {
        this.activities = response.data.data;
        console.log(response, "轮灌");
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    //直灌
    async handleZhiGuan() {
      this.color = "1";
      const response = await pushGrid({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        pid: this.pid,
        type: 2,
      });
      if (response.status === 200) {
        this.activities = response.data.data;
        console.log(this.activities, "直灌");
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    handleCheck(irrInfo) {
      this.$refs.videoRef.handleOpen(irrInfo);
    },
    //随机颜色
    randomRgb(index) {
      return {
        color: index % 2 ? "#C8742D" : "#04E0F9",
      };
    },
  },
  watch: {
    deviceData() {
      this.setThingsChart();
    },
    deviceOnline() {
      this.setRoundTwo();
    },
    getAverageResponse() {
      this.setlineChart();
    },
    flowResponse() {
      this.setRoundChart();
    },
  },
  mounted() {
    this.setMap();
    this.getPidAndPname();
    this.getAverage();
    this.deviceTypeData();
    this.deviceOnlineData();
    this.pushAlarmData();
    this.handleLunGuan();
    this.getFlowDevice();

    // 接收ThingJS页面传送的数据
    let _that = this;
    window.addEventListener("message", function (e) {
      // console.log(e, 999);
      // this.$nextTick(() => {
      _that.$refs.myIframe.style.display = "none";
      // });
      // var data = e.data;
      // var funcName = data.funcName;
      // var param = data.param;
      // if (window[funcName]) window[funcName](param);
    });
  },

  created() {
    this.$nextTick(() => {
      setTimeout(() => {
        // this.setRoundChart();
        this.setCrops();
      });
    });
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
