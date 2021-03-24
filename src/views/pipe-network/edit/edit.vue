<template>
  <el-dialog
    class="m-dialog"
    title="新增管网"
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
            <el-col :span="22">
              <el-input
                id="tipinput"
                v-model="form.projectAddress"
                size="mini"
              ></el-input
            ></el-col>
            <el-col :span="2"
              ><el-button type="primary" size="mini">查询</el-button></el-col
            >
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
            <el-input v-model="form.nursePhone" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item
            label="责任人手机号码"
            prop="nursePhone"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input v-model="form.nursePhone" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-row :gutter="24" class="m-wrap">
          <el-col :span="24">
            <el-form label-position="top">
              <el-form-item label="分区">
                <el-select v-model="formData.area" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="管点">
                <el-checkbox-group v-model="formData.type">
                  <el-checkbox
                    label="美食/餐厅线上活动"
                    name="type"
                  ></el-checkbox>
                  <el-checkbox label="地推活动" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <div class="m-map" id="map">地图呢</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MapLoader from "../../../components/common/AMap.js";
// import { reqadDevice } from "@/api/api.js";
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
  methods: {
    // // 初始化
    setMap() {
      this.$nextTick(() => {
        this.map = new AMap.Map("map", {
          resizeEnable: true,
          keyboardEnable: false,
          zoom: 15,
          mapStyle: "amap://styles/normal",
        });

        var autoOptions = {
          input: "tipinput",
        };
        var auto = new AMap.Autocomplete(autoOptions);
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map,
        }); //构造地点查询类
        AMap.event.addListener(auto, "select", this.select); //注册监听，当选中某条记录时会触发
        AMap.event.addListener(this.placeSearch, "markerClick", (e) => {
          // console.log(e.data.location.lng, e.data.location.lat); // 经纬度
          // // console.log(e, 654);
          this.lnt = e.data.location.lng + "," + e.data.location.lat;
          // this.mapInfo.lnglat = this.lanlat;
          this.form.deviceAddress = `${e.data.cityname}${e.data.adname}${e.data.address}`;
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
