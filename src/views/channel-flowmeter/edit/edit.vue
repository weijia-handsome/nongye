<template>
  <el-dialog
    class="m-dialog"
    :title="id ? '编辑' : '新增'"
    :visible.sync="dialogVisible"
    width="40%"
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
            label="设备名称"
            prop="deviceName"
            :rules="[{ required: true, message: '请输入设备名称' }]"
          >
            <el-input
              v-model="form.deviceName"
              placeholder="请输入设备名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备编号"
            prop="deviceNum"
            :rules="[{ required: true, message: '请输入设备编号' }]"
          >
            <el-input
              v-model="form.deviceNum"
              placeholder="请输入设备编号"
              :disabled="id ? true : false"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="安装地址"
            prop="adress"
            :rules="[{ required: true, message: '请输入安装地址' }]"
          >
            <el-input
              v-model="form.adress"
              id="tipinput"
              placeholder="请输入安装地址"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            label="创建时间"
            prop="createTime"
            class="m-txt__text"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-date-picker
              v-model="form.createTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              clearable
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="m-map" id="map2"></el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancal">取 消</el-button>
      <el-button type="primary" @click="handleComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editDevice, adDevice } from "@/api/api.js";

export default {
  name: "Edit",
  data() {
    return {
      map: null, //地图实例
      dialogVisible: false,
      id: "",
      form: {
        deviceName: "",
        deviceNum: "",
        adress: "",
        createTime: "",
        lnt: "",
        tid: "",
      },
    };
  },
  watch: {
    "form.lnt"(val) {
      let newVal = val.split(",");
      // 经度
      const longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
      //纬度
      var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
      if (longreg.test(newVal[0]) && latreg.test(newVal[1])) {
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
          map = new AMap.Map("map2", {
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
          this.form.lnt = e.data.location.lng + "," + e.data.location.lat;
          // this.mapInfo.lnglat = this.lanlat;
          this.form.address = `${e.data.cityname}${e.data.adname}${e.data.address}`;
          console.log(this.form.address, "/////////////");
        });
        let _that = this;
        clickListener = AMap.event.addListener(map, "click", function (e) {
          _that.form.address = e.lnglat.toString();
          // console.log(e.count);
          _that.form.lnt = e.lnglat.toString();
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
      this.form.address = e.poi.district + "" + e.poi.address + "" + e.poi.name;
      this.form.lnt = e.poi.location.lng + "," + e.poi.location.lat;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleCancal() {
      this.dialogVisible = false;
    },
    handleOpen(info) {
      this.dialogVisible = true;
      this.setMap();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });
      if (info) {
        this.id = info.id;
        this.form.deviceName = info.device_name;
        this.form.deviceNum = info.imei;
        this.form.adress = info.adss;
        this.form.createTime = info.reg_time;
      } else {
        this.id = "";
        this.form.deviceName = "";
        this.form.deviceNum = "";
        this.form.adress = "";
        this.form.createTime = "";
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.id) {
            this.editDevice();
          } else {
            this.adDevice();
          }
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    //编辑
    async editDevice() {
      const response = await editDevice({
        username: window.sessionStorage.getItem("username"),
        device_name: this.form.deviceName,
        adss: this.form.adress,
        id: this.id,
      });
      if (response.data.code === 200) {
        this.$message.success(response.data.msg);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.msg || "服务错误!");
      }
    },
    // 新增
    async adDevice() {
      const response = await adDevice({
        username: window.sessionStorage.getItem("username"),
        nid: "",
        netid: "",
        device_name: this.form.deviceName,
        imei: this.form.deviceNum,
        tid: "8",
        lant_lat: this.form.lnt,
        adss: this.form.adress,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
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
    &-map {
      position: relative;
      width: 600px;
      height: 215px;
      margin: 20px 0 0 10px;
    }

    &-txt {
      & .el-select {
        width: 100%;
      }
    }

    &-dialog__form {
      /deep/ {
        & .el-form-item__label {
          padding: 0;
        }
        & .el-form-item__content {
          line-height: 0;
        }

        & .el-select--mini {
          width: 290px;
        }

        & .el-date-editor {
          width: 290px;
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