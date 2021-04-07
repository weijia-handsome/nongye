<template>
  <el-dialog
    class="m-dialog"
    :title="id ? '编辑管网' : '新增管网'"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-row :gutter="24" class="m-box">
      <el-form label-position="top" ref="formData" :model="form">
        <el-col :span="12"
          ><el-form-item
            label="分区名称"
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
        <el-col :span="12" class="m-dialog__address"
          ><el-form-item
            label="分区地址"
            prop="projectAddress"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.projectAddress"
              size="mini"
              id="tipinput"
              placeholder="请输入"
            ></el-input>
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
            prop="liable"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.liable"
              size="mini"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="责任人手机号码"
            prop="liablePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              v-model="form.liablePhone"
              size="mini"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="管网"
            prop="guanwang"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select v-model="form.guanwang" placeholder="请选择" size="mini">
              <el-option
                v-for="(guanwang, guanwangIndex) of guanwangArr"
                :key="guanwangIndex"
                :label="guanwang.name"
                :value="guanwang.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="项目"
            prop="project"
            :rules="[{ required: true, message: '请选择' }]"
          >
            <el-select v-model="form.project" placeholder="请选择" size="mini">
              <el-option
                v-for="(project, projectIndex) of projectArr"
                :key="projectIndex"
                :label="project.name"
                :value="project.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" v-model="form.desc"></el-input>
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
import {
  usNetwork,
  getPidAndPname,
  addPartition,
  editPartition,
} from "@/api/api.js";

export default {
  name: "Edit",
  components: {
    MapLoader,
  },
  data() {
    return {
      map: null, //地图实例
      dialogVisible: false,
      guanwangArr: [],
      projectArr: [],
      id: "",
      form: {
        projectName: "",
        projectAddress: "",
        nurse: "",
        nursePhone: "",
        liable: "",
        liablePhone: "",
        guanwang: "",
        project: "",
        desc: "",
        lnt: "",
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
      this.form.deviceAddress =
        e.poi.district + "" + e.poi.address + "" + e.poi.name;
      this.lnt = e.poi.location.lng + "," + e.poi.location.lat;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen(listInfo) {
      this.dialogVisible = true;
      this.setMap();
      this.usNetwork();
      this.getPidAndPname();
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });

      if (listInfo) {
        this.id = listInfo.id;
        this.form.projectName = listInfo.name;
        this.form.projectAddress = listInfo.adss;
        this.form.nurse = listInfo.firemanname;
        this.form.nursePhone = listInfo.fireman;
        this.form.liable = listInfo.personname;
        this.form.liablePhone = listInfo.person;
        this.form.guanwang = listInfo.neid;
        this.form.project = listInfo.pid;
        this.form.lnt = listInfo.lnt;
      } else {
        this.id = "";
        this.form.projectName = "";
        this.form.projectAddress = "";
        this.form.nurse = "";
        this.form.nursePhone = "";
        this.form.liable = "";
        this.form.liablePhone = "";
        this.form.guanwang = "";
        this.form.project = "";
        // this.form.lnt = "";
      }
    },
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.id) {
            this.editPartition();
          } else {
            this.addPartition();
          }

          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    async usNetwork() {
      const response = await usNetwork({
        username: window.sessionStorage.getItem("username"),
      });
      if (response.data.code === "200") {
        this.guanwangArr = response.data.mess;
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    async getPidAndPname() {
      const response = await getPidAndPname({
        username: window.sessionStorage.getItem("username"),
        pageSize: 1000,
        pno: 1,
      });
      if (response.status === 200) {
        this.projectArr = response.data.data;
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    //新增
    async addPartition() {
      const response = await addPartition({
        username: window.sessionStorage.getItem("username"),
        name: this.form.projectName,
        adss: this.form.projectAddress,
        lnt: this.form.lnt,
        fireman: this.form.nursePhone,
        firemanname: this.form.nurse,
        person: this.form.liablePhone,
        personname: this.form.liable,
        neid: this.form.guanwang,
        pid: this.form.project,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.$emit("refresh");
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    //编辑
    async editPartition() {
      const response = await editPartition({
        username: window.sessionStorage.getItem("username"),
        name: this.form.projectName,
        adss: this.form.projectAddress,
        id: this.id,
        fireman: this.form.nursePhone,
        firemanname: this.form.nurse,
        person: this.form.liablePhone,
        personname: this.form.liable,
        neid: this.form.guanwang,
        pid: this.form.project,
      });
      if (response.data.code === 200) {
        this.$message.success("编辑成功!");
        this.$emit("refresh");
      } else {
        this.$message.error("请重试!");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  .m {
    &-dialog__address {
      & .el-form-item__content {
        width: 350px;
      }
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

    & .el-select {
      width: 368px;
    }
  }
}
</style>
