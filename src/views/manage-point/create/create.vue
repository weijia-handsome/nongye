<template>
  <el-dialog
    class="m-dialog"
    :title="id ? '编辑管点' : '新增管点'"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-row :gutter="24">
      <el-form label-position="top" ref="formData" :model="form">
        <el-col :span="12"
          ><el-form-item
            label="项目名称"
            prop="projectName"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.projectName" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="m-content-btn"
          ><el-form-item
            label="项目地址"
            prop="projectAddress"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              id="tipinput"
              v-model="form.projectAddress"
              size="mini"
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
            prop="liable"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.liable" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="责任人手机号码"
            prop="liablePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.liablePhone" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="管径"
            prop="tube"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.tube" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="管网"
            prop="nid"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select placeholder="请选择" v-model="form.nid" size="mini" clearable>
              <el-option
                v-for="(item, index) in guanwangArr"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <p style="margin-bottom: 10px">项目描述</p>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="textarea"
          >
          </el-input>
        </el-col>
        <el-col :span="24" class="m-map" id="map2"></el-col>
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
import { editNetspot, adNetspot, usNetwork } from "@/api/api.js";

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
      id: "",
      guanwangArr: [],
      form: {
        projectName: "",
        projectAddress: "",
        nurse: "",
        nursePhone: "",
        liable: "",
        liablePhone: "",
        tube: "",
        marker: "",
        nid: "",
        spid: "",
        lnt: "",
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
          this.form.lnt = e.data.location.lng + "," + e.data.location.lat;

          // this.mapInfo.lnglat = this.lanlat;
          this.form.projectAddress = `${e.data.cityname}${e.data.adname}${e.data.address}`;
        });
        let _that = this;
        clickListener = AMap.event.addListener(map, "click", function (e) {
          console.log(e, '/////////////');
          _that.form.projectAddress = e.lnglat.toString();
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
      this.form.projectAddress =
        e.poi.district + "" + e.poi.address + "" + e.poi.name;
      this.lnt = e.poi.location.lng + "," + e.poi.location.lat;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen(pointInfo) {
      this.dialogVisible = true;
      this.usNetwork();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
        this.setMap();
      });

      if (pointInfo) {
        this.id = pointInfo.spid;
        this.form.projectName = pointInfo.name;
        this.form.projectAddress = pointInfo.adss;
        this.form.nurse = pointInfo.personname;
        this.form.nursePhone = pointInfo.person;
        this.form.liable = pointInfo.firemanname;
        this.form.liablePhone = pointInfo.fireman;
        this.form.tube = pointInfo.tube;
        this.form.marker = pointInfo.marker;
        this.form.nid = pointInfo.nid;
        this.form.spid = pointInfo.spid;
        this.form.lnt = pointInfo.lnt;
      } else {
        this.id = "";
        this.form.projectName = "";
        this.form.projectAddress = "";
        this.form.nurse = "";
        this.form.nursePhone = "";
        this.form.liable = "";
        this.form.liablePhone = "";
        this.form.tube = "";
        this.form.marker = "";
        this.form.nid = "";
        this.form.spid = "";
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.id) {
            this.editPoint();
          } else {
            this.creatPoint();
          }
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    //编辑
    async editPoint() {
      if (this.lnt === "undefined,undefined") {
        return this.$message.error("请选择准确的位置");
      }
      const response = await editNetspot({
        username: window.sessionStorage.getItem("username"),
        name: this.form.projectName,
        adss: this.form.projectAddress,
        fireman: this.form.liablePhone,
        person: this.form.nursePhone,
        firemanname: this.form.liable,
        personname: this.form.nurse,
        tube: this.form.tube,
        marker: this.form.marker,
        nid: this.form.nid,
        spid: this.form.spid,
        lnt: this.lnt === undefined ? this.form.lnt : this.lnt,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    //新增
    async creatPoint() {
      if (this.lnt === "undefined,undefined") {
        return this.$message.error("请选择准确的位置");
      }
      const response = await adNetspot({
        username: window.sessionStorage.getItem("username"),
        name: this.form.projectName,
        adss: this.form.projectAddress,
        fireman: this.form.liablePhone,
        person: this.form.nursePhone,
        firemanname: this.form.liable,
        personname: this.form.nurse,
        tube: this.form.tube,
        marker: this.form.marker,
        nid: this.form.nid,
        spid: this.form.spid,
        lnt: this.lnt,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    //获取管网
    async usNetwork() {
      const response = await usNetwork({
        username: window.sessionStorage.getItem("username"),
      });
      if (response.data.code === "200") {
        this.guanwangArr = response.data.mess;
      } else {
        this.$message.error(response.data.mess || '服务错误!');
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
      padding-bottom: 0;
    }

    & .el-form-item__content {
      width: 350px;
    }
  }
}
</style>
