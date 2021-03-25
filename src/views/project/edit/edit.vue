<template>
  <el-dialog
    class="m-dialog"
    :title="id ? '编辑项目' : '新增项目'"
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
          ><el-form-item label="项目地址">
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
        <el-col :span="24" class="m-map" id="map"></el-col>
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
import { reqEditProject } from "@/api/api.js";
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
      projectInfo: {},
      id: "",
      lnt: "",
      form: {
        projectName: "",
        projectAddress: "",
        nurse: "",
        nursePhone: "",
        liable: "",
        liablePhone: "",
      },
      autoCompleteComponent: undefined,
      placeSearchComponent: undefined,
    };
  },
  watch: {
    "form.projectAddress"(val) {
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
    //初始化
    // setMap() {
    //   let that = this;
    //   MapLoader().then(
    //     (AMap) => {
    //       that.map = new AMap.Map("map", {
    //         resizeEnable: true,
    //         center: ["88.153388", "39.03167"],
    //         keyboardEnable: false,
    //         zoom: 15,
    //         mapStyle: "amap://styles/normal",
    //       });
    //     },
    //     (e) => {
    //       console.log("地图加载失败", e);
    //     }
    //   );
    // },
    //初始化搜索
    mapSearchInt() {
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
      this.form.projectAddress =
        e.poi.district + "" + e.poi.address + "" + e.poi.name;
      this.lnt = e.poi.location.lng + "," + e.poi.location.lat;
    },
    // loadInputTipPlaceSearch() {
    //   console.log("========");
    //   let vm = this;
    //   AMap.plugin(["AMap.Autocomplete", "AMap.PlaceSearch"], function () {
    //     var autoOptions = {
    //       city: "北京", //城市，默认全国
    //       input: "search", //使用联想输入的input的id
    //     };
    //     let autocomplete = new AMap.Autocomplete(autoOptions);
    //     var placeSearch = new AMap.PlaceSearch({
    //       city: "北京",
    //       map: vm.map,
    //     });
    //     AMap.event.addListener(autocomplete, "select", function (e) {
    //       //TODO 针对选中的poi实现自己的功能
    //       placeSearch.setCity(e.poi.adcode);
    //       placeSearch.search(e.poi.name);
    //     });
    //   });
    // },
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen(projectInfo) {
      this.dialogVisible = true;
      this.mapSearchInt();
      // this.loadInputTipPlaceSearch();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });

      if (projectInfo) {
        this.projectInfo = projectInfo;
        this.id = projectInfo.pid;
        this.form.projectName = projectInfo.name;
        this.form.projectAddress = projectInfo.adss;
        this.form.nurse = projectInfo.firemanname;
        this.form.nursePhone = projectInfo.fireman;
        this.form.liable = projectInfo.personname;
        this.form.liablePhone = projectInfo.person;
        this.lnt = projectInfo.lnt;
        this.pid = projectInfo.pid;
      } else {
        this.projectInfo = null;
        this.id = "";
        this.form.projectName = "";
        this.form.projectAddress = "";
        this.form.nurse = "";
        this.form.nursePhone = "";
        this.form.liable = "";
        this.form.liablePhone = "";
        this.lnt = "";
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const username = sessionStorage.getItem("username");
          const params = {
            username: username,
            name: this.form.projectName,
            adss: this.form.projectAddress,
            fireman: this.form.nursePhone,
            person: this.form.liablePhone,
            firemanname: this.form.nurse,
            personname: this.form.liable,
            lnt: this.lnt,
            marker: this.form.textarea,
            pid: this.pid,
          };
          reqEditProject(params).then(
            (res) => {
              if (res.data.code == "200") {
                this.$message.success("编辑成功");
              } else {
                this.$message.error("编辑失败");
              }
            },
            () => {
              this.$message.error("请稍后重试或联系管理员");
            }
          );
          // alert("成功");
          this.dialogVisible = false;
        } else {
          console.log("失败");
          return false;
        }
      });
    },
    //
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
      padding: 10px 20px;
      border-bottom: 1px solid #f0f1ef;
    }

    & .el-dialog__headerbtn {
      top: 15px;
    }

    & .el-form-item__label {
      padding-bottom: 0;
    }

    & .el-tree-node__label {
      font-size: 14px;
    }
  }
}
</style>
