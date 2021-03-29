<template>
  <el-dialog
    class="m-dialog"
    title="新增设备"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-row :gutter="24">
      <el-form label-position="top" ref="formData" :model="form">
        <el-col :span="12"
          ><el-form-item
            label="设备名称"
            prop="deviceName"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.deviceName" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-content-btn"
          ><el-form-item
            label="设备地址"
            prop="deviceAddress"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-col :span="24">
              <el-input
                id="tipinput"
                v-model="form.deviceAddress"
                size="mini"
              ></el-input
            ></el-col>
            <el-col :span="2"></el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="设备编号"
            prop="deviceNumber"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.deviceNumber" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="设备类型"
            prop="deviceType"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-select
              v-model="form.deviceType"
              placeholder="请选择设备类型"
              size="mini"
            >
              <el-option label="视频设备" value="0"></el-option>
              <el-option label="四路智能控制器" value="2"></el-option>
              <el-option label="土壤温湿度传感器" value="4"></el-option>
              <el-option label="流量计" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="m-map" id="map"> </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MapLoader from "../../../components/common/AMap.js";
import { reqadDevice } from "@/api/api.js";

export default {
  name: "Edit",
  components: {
    MapLoader,
  },
  data() {
    return {
      map: null, //地图实例
      textarea: "",
      dialogVisible: false,
      form: {
        deviceName: "",
        deviceAddress: "",
        deviceNumber: "",
        deviceType: "",
        nid: "",
        lant_lat: "",
      },
    };
  },
  mounted() {},
  watch: {
    "form.deviceAddress"(val) {
      console.log(val);
      let newVal = val.split(",");
      // 经度
      const longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
      //纬度
      var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
      if (longreg.test(newVal[0]) && latreg.test(newVal[1])) {
        console.log(111);
        let marker = new AMap.Marker({
          position: [newVal[0], newVal[1]],
          offset: new AMap.Pixel(-13, -30),
        });
        this.map.clearMap();
        marker.setMap(this.map);
      }
    },
  },
  methods: {
    // // 初始化
    setMap() {
      this.$nextTick(() => {
        var clickListener,
          map = new AMap.Map("map", {
            resizeEnable: true,
            keyboardEnable: false,
            zoom: 15,
            mapStyle: "amap://styles/normal",
          });

        this.map = map;

        // this.map2 = this.map;
        var autoOptions = {
          input: "tipinput",
        };
        var auto = new AMap.Autocomplete(autoOptions);
        this.placeSearch = new AMap.PlaceSearch({
          map: map,
        }); //构造地点查询类
        AMap.event.addListener(auto, "select", this.select); //注册监听，当选中某条记录时会触发
        AMap.event.addListener(this.placeSearch, "markerClick", (e) => {
          // console.log(e.data.location.lng, e.data.location.lat); // 经纬度
          // // console.log(e, 654);
          this.lnt = e.data.location.lng + "," + e.data.location.lat;
          // this.mapInfo.lnglat = this.lanlat;
          this.form.deviceAddress = `${e.data.cityname}${e.data.adname}${e.data.address}`;
        });
        let _that = this;
        clickListener = AMap.event.addListener(map, "click", function (e) {
          _that.form.deviceAddress = e.lnglat.toString();
          // console.log(e.count);
          _that.lnt = e.lnglat.toString();
          // markers
          map.clearMap();
          var markers = new AMap.Marker({
            position: e.lnglat,
            map: map,
          });
          // if()
          console.log(markers);
        });
      });
    },
    select(e) {
      this.placeSearch.setCity(e.poi.adcode);
      this.placeSearch.search(e.poi.name); //关键字查询查询
      this.form.deviceAddress =
        e.poi.district + "" + e.poi.address + "" + e.poi.name;
      this.lnt = e.poi.location.lng + "," + e.poi.location.lat;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen(nid, lnt) {
      this.dialogVisible = true;
      this.form.nid = nid;
      this.form.lant_lat = lnt;
      this.$nextTick(() => {
        this.$refs.formData.resetFields();
        this.setMap();
      });
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.creatDevice();
          this.dialogVisible = false;
        } else {
          console.log("失败");
          return false;
        }
      });
    },
    //新增设备
    async creatDevice() {
      const response = await reqadDevice({
        username: window.sessionStorage.getItem("username"),
        device_name: this.form.deviceName,
        imei: this.form.deviceNumber,
        tid: this.form.deviceType,
        adss: this.form.deviceAddress,
        nid: this.form.nid,
        lant_lat: this.form.lant_lat,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  .m {
    &-content-btn {
      display: flex;
    }

    &-map {
      width: 700px;
      height: 215px;
      margin: 20px 0 0 30px;
    }
  }

  /deep/ {
    & .el-dialog__header {
      border-bottom: 1px solid #f0f1ef;
    }
    & .el-form-item__label {
      padding: 0;
    }
    & .el-form-item__content {
      width: 350px;
    }
    & .el-select--mini {
      width: 340px;
    }
  }
}
</style>
