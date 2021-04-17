<template>
  <el-dialog
    class="m-dialog"
    :title="id ? '编辑' : '新增'"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose"
  >
    <el-row :gutter="24" height="600px">
      <el-form
        ref="formData"
        :model="form"
        label-position="top"
        class="m-dialog__form"
      >
        <el-col :span="12">
          <el-form-item
            label="管网名称"
            prop="name"
            clearadle
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select
              v-model="form.name"
              placeholder="请选择管网"
              @change="handleSelectId(value)"
              size="mini"
            >
              <el-option
                v-for="(item, index) in guanwang"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备名称"
            prop="deviceName"
            clearadle
            :rules="[{ required: true, message: '设备名称不能为空' }]"
          >
            <el-input
              v-model="form.deviceName"
              size="mini"
              placeholder="请输入设备名称"
              :disabled="id ? true : false"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备编号"
            prop="imei"
            :rules="[{ required: true, message: '设备编号不能为空' }]"
          >
            <el-input
              v-model="form.imei"
              size="mini"
              placeholder="请输入"
              :disabled="id ? true : false"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="安装地址"
            prop="address"
            :rules="[{ required: true, message: '安装地址不能为空' }]"
          >
            <el-input
              id="tipinput"
              v-model="form.address"
              size="mini"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-txt">
          <el-form-item
            label="创建时间"
            prop="createTime"
            class="m-txt__text"
            :rules="[{ required: true, message: '创建时间不能为空' }]"
          >
            <el-date-picker
              v-model="form.createTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
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
import { adDevice, getGW, editVideo } from "@/api/api.js";

export default {
  name: "Edit",
  props: ["videoInfo"],
  data() {
    return {
      map: null, //地图实例
      dialogVisible: false,
      value: "0",
      id: "",
      nid: "",
      form: {
        name: "",
        imei: "",
        address: "",
        createTime: "",
        lnt: "",
        deviceName: "",
      },
      guanwang: [],
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
      this.handleSelect();
      this.setMap();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });

      if (info) {
        this.id = info.id;
        this.form.name = info.network_name;
        this.form.imei = info.imei;
        this.form.address = info.adss;
        this.form.createTime = info.reg_time;
        this.form.deviceName = info.device_name;
      } else {
        this.id = "";
        this.form.name = "";
        this.form.imei = "";
        this.form.address = "";
        this.form.createTime = "";
        this.form.deviceName = "";
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.id) {
            this.editVideo();
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
    async editVideo() {
      const response = await editVideo({
        username: window.sessionStorage.getItem("username"),
        id: this.id,
        netid: this.form.name,
        addr: this.form.address,
      });
      if (response.data.code === 200) {
        this.$message.success(response.data.msg);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.msg || "服务错误!");
      }
    },
    //获取分区
    async handleSelect() {
      const response = await getGW({
        username: window.sessionStorage.getItem("username"),
      });
      if (response.status === 200) {
        this.guanwang = response.data;
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    handleSelectId(val) {
      console.log(val);
    },
    async adDevice() {
      const params = {
        username: window.sessionStorage.getItem("username"),
        nid: "",
        device_name: this.form.deviceName,
        imei: this.form.imei,
        tid: "0",
        lant_lat: this.form.lnt,
        netid: this.form.name,
        adss: this.form.address,
      };
      const response = await adDevice(params);
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
