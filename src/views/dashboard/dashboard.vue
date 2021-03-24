<template>
  <div
    class="m-dashboard"
    v-loading="pageLoading"
    element-loading-text="初始化中..."
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <div class="m-map" id="map"></div>
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
        <p class="m-left__title">灌溉占比</p>
        <div
          class="m-left__round"
          id="roundChart"
          style="width: 100%; height: 87%"
        ></div>
      </div>
      <div class="m-left__second">
        <!-- <div class="m-left__background"></div> -->
        <p class="m-left__title1">温湿度传感器</p>
        <div
          class="m-left__round1"
          id="lineChart"
          style="width: 100%; height: 81%"
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

      <div class="m-min__content" @click="handleiIll">
        <el-scrollbar class="m-min__line">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              size="normal"
              color="#04E0F9"
            >
              <span class="m-min__task">任务名称：{{ activity.name }}</span>
              <span
                >任务在{{ activity.start_time }}开始执行滴灌 时长为：{{
                  activity.time
                }}
              </span>
              <span v-if="activity.state === '1'">已完成</span>
              <span v-if="activity.state === '2'">未完成</span>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </div>
    </div>

    <!-- 右边图表 -->
    <div class="m-right">
      <div class="m-right__round" @click="hanleAlarm">
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
              <p class="m-right__time">{{ item.alarmtime }}</p>
              <p class="m-right__txt">设备id:{{ item.imei }}</p>
              <p class="m-right__txt">设备名称:{{ item.dname }}</p>
              <p class="m-right__txt">设备类型:{{ item.deviceType }}</p>
              <p class="m-right__txt">报警类型:{{ item.alarmType }}</p>
              <p class="m-right__txt">报警值:{{ item.value }}</p>
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
    <task ref="taskRef"></task>
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
} from "@/api/api.js";
import Task from "./task/task.vue";

export default {
  name: "bigData",
  components: {
    Task,
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
        reqGetNetspot({ username, pno: 1, pageSize: 100 }).then((res) => {
          console.log(res);
          var cluster,
            markers = [];
          let data = res.data.data;

          const points2 = [];
          for (var i = 0; i < data.length; i++) {
            var pp = data[i].lnt;
            if (lat > 54) {
              var lng = pp.split(",")[1];
              var lat = pp.split(",")[0];
              points2.push({ lnglat: [lng, lat] });
            } else {
              var lng = pp.split(",")[0];
              var lat = pp.split(",")[1];
              points2.push({ lnglat: [lng, lat] });
            }
          }
          var style = [
            {
              url: "https://a.amap.com/jsapi_demos/static/images/mass0.png",
              anchor: new AMap.Pixel(6, 6),
              size: new AMap.Size(30, 30),
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

          var marker = new AMap.Marker({ content: " ", map: this.map });
          mass.setMap(this.map);
          // for (var i = 0; i < points2.length; i += 1) {
          //   markers.push(
          //     new AMap.Marker({
          //       position: points2[i]["lnglat"],
          //       content:
          //         '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
          //       offset: new AMap.Pixel(-15, -15),
          //     })
          //   );
          // }
          // var count = markers.length;

          // if (cluster) {
          //   cluster.setMap(null);
          // }
          // cluster = new AMap.MarkerClusterer(this.map, markers, {
          //   gridSize: 80,
          // });
        });
      });
    },

    //灌溉占比环形图
    setRoundChart() {
      let roundChart = echarts.init(document.getElementById("roundChart"));
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
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "已灌溉" },
              { value: 735, name: "未灌溉", itemStyle: { color: "#04E0F9" } },
            ],
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
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: "{value} ml",
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
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: "{value} °C",
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
            avoidLabelOverlap: false,
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
            avoidLabelOverlap: false,
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
    hanleAlarm() {
      this.$router.push({
        path: "/alarm-management",
      });
    },
    handleiIll() {
      this.$router.push({
        path: "/irrigation-task",
      });
    },
    //温湿度传感器
    async getAverage() {
      this.getAverageResponse = await getAverage({
        username: window.sessionStorage.getItem("username"),
        pid: this.pid,
      });
      if (this.getAverageResponse.status === 200) {
        this.pageLoading = true;
        const arrT = this.getAverageResponse.data.mess.map((item) => {
          return item.soilT;
        });
        this.getAverageArrT = arrT.slice(0, 4);
        const arrH = this.getAverageResponse.data.mess.map((item) => {
          return item.soilH;
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
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
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
  },
  mounted() {
    this.setMap();
    this.getPidAndPname();
    this.getAverage();
    this.deviceTypeData();
    this.deviceOnlineData();
    this.pushAlarmData();
    this.handleLunGuan();
  },

  created() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.setRoundChart();
        this.setCrops();
      });
    });
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
