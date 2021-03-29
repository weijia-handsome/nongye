<template>
  <el-dialog
    class="m-dialog"
    :title="form.projectName ? '编辑管网' : '新增管网'"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-row :gutter="24" class="m-box">
      <el-form label-position="top" ref="formData" :model="form">
        <el-col :span="12"
          ><el-form-item
            label="管网名称"
            prop="projectName"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.projectName" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-content-btn"
          ><el-form-item label="管网地址">
            <el-input
              id="tipinput"
              v-model="form.projectAddress"
              size="mini"
              :rules="[{ required: true, message: '请输入' }]"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="护理人"
            prop="nurse"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.nurse" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="护理人手机号码"
            prop="nursePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.nursePhone" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="责任人"
            prop="nursePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.liable" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="责任人手机号码"
            prop="nursePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.liablePhone" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="分区">
            <el-select
              v-model="form.area"
              placeholder="请选择活动区域"
              size="mini"
              clearable
              :rules="[{ required: true, message: '请选择' }]"
            >
              <el-option
                v-for="(fenqv, fenqvIndex) in form.fenqv"
                :key="fenqvIndex"
                :label="fenqv.name"
                :value="fenqv.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="管点">
            <el-checkbox-group
              v-model="form.type"
              :rules="[{ required: true, message: '请选择' }]"
            >
              <el-checkbox
                v-for="(type, typeIndex) in form.type"
                :key="typeIndex"
                :label="type.name"
                name="type"
                :value="type.id"
                @change="handleCheckbox(type.id)"
              ></el-checkbox>
            </el-checkbox-group>
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
import { adNetspot, usNetspot, usFeiqu, upNetwork } from "@/api/api.js";
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
      lnt: "",
      spid: "",
      pid: "",
      nid: "",
      form: {
        projectName: "",
        projectAddress: "",
        nurse: "",
        nursePhone: "",
        liable: "",
        liablePhone: "",
        area: "",
        type: [],
        fenqv: [],
      },
    };
  },
  watch: {
    "form.projectAddress"(val) {
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
        });
      });
    },
    select(e) {
      this.placeSearch.setCity(e.poi.adcode);
      this.placeSearch.search(e.poi.name); //关键字查询查询
      this.form.projectAddress =
        e.poi.district + "" + e.poi.address + "" + e.poi.name;
      this.lnt = e.poi.location.lng + "," + e.poi.location.lat;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleCheckbox(id) {
      this.spid = id;
    },
    async usNetspot() {
      const response = await usNetspot({
        username: window.sessionStorage.getItem("username"),
      });
      if (response.status === 200) {
        this.form.type = response.data.mess;
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    async usFeiqu() {
      const response = await usFeiqu({
        username: window.sessionStorage.getItem("username"),
      });
      if (response.status === 200) {
        this.form.fenqv = response.data.mess;
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    handleOpen(pipeInfo) {
      this.dialogVisible = true;
      this.setMap();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });
      this.usNetspot();
      this.usFeiqu();

      if (pipeInfo) {
        this.form.projectName = pipeInfo.name;
        this.form.projectAddress = pipeInfo.adss;
        this.form.nurse = pipeInfo.firemanname;
        this.form.nursePhone = pipeInfo.fireman;
        this.form.liable = pipeInfo.personname;
        this.form.liablePhone = pipeInfo.person;
        this.lnt = pipeInfo.lant_lat;
        this.pid = pipeInfo.pid;
        this.nid = pipeInfo.nid;
      } else {
        this.form.projectName = "";
        this.form.projectAddress = "";
        this.form.nurse = "";
        this.form.nursePhone = "";
        this.form.liable = "";
        this.form.liablePhone = "";
      }
    },
    //编辑
    async upNetwork() {
      const response = await upNetwork({
        username: window.sessionStorage.getItem("username"),
        name: this.form.projectName,
        adss: this.form.projectAddress,
        lant_lat: this.lnt,
        fireman: this.form.nursePhone,
        person: this.form.liablePhone,
        firemanname: this.form.nurse,
        personname: this.form.liable,
        marker: "",
        pid: this.pid,
        spid: this.spid,
        nid: this.nid,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess || "服务错误！");
      }
    },
    //新增
    async adNetspot() {
      const response = await adNetspot({
        username: window.sessionStorage.getItem("username"),
        name: this.form.projectName,
        adss: this.form.projectAddress,
        fireman: this.form.nursePhone,
        person: this.form.liablePhone,
        firemanname: this.form.nurse,
        personname: this.form.liable,
        marker: "",
        pid: this.pid,
        spid: this.spid,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess || "服务错误！");
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.nid) {
            this.upNetwork();
          } else {
            this.adNetspot();
          }

          this.dialogVisible = false;
        } else {
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
      margin: 20px 0 0 30px;
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
