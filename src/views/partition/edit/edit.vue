<template>
  <el-dialog
    class="m-dialog"
    title="新增分区"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-row :gutter="24" class="m-box">
      <el-form label-position="top" ref="formData" :model="form">
        <el-col :span="12"
          ><el-form-item
            label="管网名称"
            prop="projectName"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.projectName"
              size="mini"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-content-btn"
          ><el-form-item
            label="管网地址"
            prop="projectAddress"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-col :span="22"
              ><el-input
                v-model="form.projectAddress"
                size="mini"
                id="tipinput"
                placeholder="请输入"
              ></el-input
            ></el-col>
            <el-col :span="2"></el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="护理人"
            prop="nurse"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.nurse"
              size="mini"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="护理人手机号码"
            prop="nursePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.nursePhone"
              size="mini"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="责任人"
            prop="nursePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.nursePhone"
              size="mini"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="责任人手机号码"
            prop="nursePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.nursePhone"
              size="mini"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="项目"
            prop="nursePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-select v-model="form.nursePhone" placeholder="请输入">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述">
            <el-input type="textarea" v-model="desc"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div class="m-map" id="map2"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MapLoader from "../../../components/common/AMap.js";

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
      desc: "",
      form: {
        projectName: "",
        projectAddress: "",
        nurse: "",
        nursePhone: "",
        liable: "",
        liablePhone: "",
      },
      formData: {
        area: "",
        type: [],
      },
    };
  },
  mounted() {},
  watch: {
    "form.projectAddress"(val) {
      console.log(val);
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
          this.lnt = e.data.location.lng + "," + e.data.location.lat;
          // this.mapInfo.lnglat = this.lanlat;
          this.form.projectAddress = `${e.data.cityname}${e.data.adname}${e.data.address}`;
        });
        let _that = this;
        clickListener = AMap.event.addListener(map, "click", function (e) {
          _that.form.projectAddress = e.lnglat.toString();
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
    handleOpen() {
      this.dialogVisible = true;
      this.setMap();
      this.$nextTick(() => {
        this.$refs.formData.resetFields();
      });
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          alert("成功");
          this.dialogVisible = false;
        } else {
          console.log("失败");
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
    &-content-btn {
      display: flex;
    }

    &-map {
      width: 700px;
      height: 215px;
      margin: 0 auto;
    }

    &-box {
      /deep/ {
        & .el-form-item__label {
          padding: 0;
        }
      }
    }

    &-wrap {
      padding: 10px;

      /deep/ {
        & .el-form-item__label {
          padding: 0;
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
