<template>
  <div class="m-device">
    <div class="m-header">
      <span>管点</span>
    </div>

    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="管点名称">
              <el-input
                v-model="form.doiName"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="管网名称">
              <el-input
                v-model="form.intName"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="管点地址">
              <el-input
                v-model="form.address"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="mini" @click="handleSearch"
              >查询</el-button
            >
            <el-button type="primary" size="mini" @click="handleCreate"
              >新增</el-button
            >
            <el-button
              type="primary"
              size="mini"
              v-if="mapVisible"
              @click="handleList"
              >列表模式</el-button
            >
            <el-button type="primary" size="mini" @click="handleMap" v-else
              >地图模式</el-button
            >
          </el-col>
        </el-row>
      </el-form>

      <!-- 地图模式 -->
      <div class="m-map" id="map" v-if="mapVisible"></div>
      <div class="m-content" v-if="mapVisible" ref="massRefs">
        <div class="m-content__c">管点名称:</div>
        <el-col>
          <el-input
            size="mini"
            v-model="mapParams.name"
            class="m-content__inp"
          ></el-input>
        </el-col>

        <div class="m-content__c">经纬度:</div>
        <!-- <div id="lnglat" class="m-content__text"></div> -->
        <el-col>
          <el-input
            size="mini"
            v-model="mapParams.lnglat"
            class="m-content__inp"
          ></el-input>
        </el-col>

        <div class="m-content__c">地址:</div>
        <el-col>
          <el-input
            size="mini"
            v-model="mapParams.address"
            class="m-content__inp"
            id="tipinput"
          ></el-input>
        </el-col>
        <div class="m-content__button">
          <el-button type="primary" size="mini" @click="handleSumit"
            >确定</el-button
          >
        </div>
      </div>
      <div v-else>
        <el-table :data="tableData" border style="width: 100%" height="600">
          <el-table-column
            fixed
            label="序号"
            type="index"
            width="80"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{
                (param.pno - 1) * param.pageSize + scope.$index + 1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed prop="name" label="管点名称" width="200">
          </el-table-column>
          <el-table-column prop="adss" label="管点地址" width="300">
          </el-table-column>
          <el-table-column prop="w_name" label="管网名称" width="200">
          </el-table-column>
          <el-table-column prop="firemanname" label="护理人" width="120">
          </el-table-column>
          <el-table-column prop="fireman" label="护理人手机号码" width="150">
          </el-table-column>
          <el-table-column prop="personname" label="责任人" width="120">
          </el-table-column>
          <el-table-column prop="person" label="责任人手机号码" width="150">
          </el-table-column>
          <el-table-column prop="tube" label="管径" width="120">
          </el-table-column>
          <el-table-column prop="marker" label="描述" width="200">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row.spid, scope.row.lnt)"
                type="text"
                size="small"
                >新增设备</el-button
              >
              <el-button type="text" size="small" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="handleDelete(scope.row.spid)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="m-pagination">
          <el-pagination
            class="m-pagination__bottom"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="param.pno"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="param.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          />
        </div>
      </div>

      <create-device ref="deviceRef"></create-device>
      <create ref="createRef" @refresh="getList"></create>
    </el-card>
  </div>
</template>

<script>
import CreateDevice from "./create-device/create-device.vue";
import Create from "./create/create.vue";
import { reqGetNetspot, delNetspot, editNetspot } from "@/api/api.js";

export default {
  name: "DevieManagement",
  components: {
    Create,
    CreateDevice,
  },
  data() {
    return {
      map: null, //地图实例
      mapVisible: false,
      total: 0,
      loading: false,
      points2: [],
      lng: "",
      lat: "",
      form: {
        doiName: "",
        intName: "",
        address: "",
      },
      param: {
        pno: 1,
        pageSize: 10,
      },
      mapParams: {
        name: "",
        lnglat: "",
        address: "",
        fireman: "",
        firemanname: "",
        person: "",
        personname: "",
        tube: "",
        marker: "",
        nid: "",
        spid: "",
      },
      loading: true,
      tableData: [],
    };
  },
  methods: {
    // 初始化
    setMap() {
      this.$nextTick(() => {
        // this.map = new AMap.Map("map", {
        //   resizeEnable: true,
        //   center: [110.397428, 25.90923],
        //   // keyboardEnable: false,
        //   zoom: 4,
        //   mapStyle: "amap://styles/blue",
        // });
        var clickListener,
          map = new AMap.Map("map", {
            resizeEnable: true,
            // center: [116.397428, 39.90923],
            // keyboardEnable: false,
            zoom: 4,
            mapStyle: "amap://styles/blue",
          });

        const username = sessionStorage.getItem("username");
        reqGetNetspot({ username, pno: "", pageSize: "" }).then((res) => {
          var cluster,
            markers = [];
          let data = res.data.data;

          // const points2 = [];
          for (var i = 0; i < data.length; i++) {
            var pp = data[i].lnt; //经纬度
            var name = data[i].name;
            var adss = data[i].adss;
            var fireman = data[i].fireman;
            var firemanname = data[i].firemanname;
            var person = data[i].person;
            var personname = data[i].personname;
            var tube = data[i].tube;
            var markers = data[i].marker;
            var nid = data[i].nid;
            var spid = data[i].spid;

            if (this.lat > 54) {
              this.lng = pp.split(",")[1];
              this.lat = pp.split(",")[0];
              this.points2.push({
                lnglat: [this.lng, this.lat],
                name: name,
                address: adss,
                lnt: pp,
                fireman: fireman,
                firemanname: firemanname,
                person: person,
                personname: personname,
                tube: tube,
                marker: markers,
                nid: nid,
                spid: spid,
              });
            } else {
              this.lng = pp.split(",")[0];
              this.lat = pp.split(",")[1];
              this.points2.push({
                lnglat: [this.lng, this.lat],
                name: name,
                address: adss,
                lnt: pp,
                fireman: fireman,
                firemanname: firemanname,
                person: person,
                personname: personname,
                tube: tube,
                marker: markers,
                nid: nid,
                spid: spid,
              });
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
          var mass = new AMap.MassMarks(this.points2, {
            opacity: 0.8,
            zIndex: 111,
            cursor: "pointer",
            style: style[0],
          });

          mass.on("click", (e) => {
            this.$refs.massRefs.style.display = "block";
            this.mapParams.address = e.data.address;
            this.mapParams.name = e.data.name;
            this.mapParams.lnglat = e.data.lnt;
            this.mapParams.fireman = e.data.fireman;
            this.mapParams.firemanname = e.data.firemanname;
            this.mapParams.person = e.data.person;
            this.mapParams.personname = e.data.personname;
            this.mapParams.tube = e.data.tube;
            this.mapParams.marker = e.data.marker;
            this.mapParams.nid = e.data.nid;
            this.mapParams.spid = e.data.spid;
          });

          mass.on("mouseover", function (e) {
            marker.setPosition(e.data.lnglat);
            marker.setLabel({ content: e.data.name });
          });

          var marker = new AMap.Marker({ content: " ", map: map });
          mass.setMap(map);

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
            this.mapParams.lnglat =
              e.data.location.lng + "," + e.data.location.lat;
            // this.mapInfo.lnglat = this.lanlat;
            this.mapParams.address = `${e.data.cityname}${e.data.adname}${e.data.address}`;
          });
          let _that = this;
          clickListener = AMap.event.addListener(map, "click", function (e) {
            // _that.mapParams.address = e.lnglat.toString();
            // console.log(e.count);
            _that.lnt = e.lnglat.toString();
            // markers
            map.clearMap();
            // var markers = new AMap.Marker({
            //   position: e.lnglat,
            //   map: map,
            // });
            // // if()
            // console.log(markers);
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
    handleMap() {
      this.mapVisible = true;
      this.setMap();
    },
    handleList() {
      this.mapVisible = false;
    },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      let object;
      if (
        this.form.doiName !== "" &&
        this.form.address !== "" &&
        this.form.intName !== ""
      ) {
        object = this.form.doiName;
      } else if (
        this.form.doiName !== "" &&
        this.form.address !== "" &&
        this.form.intName == ""
      ) {
        object = this.form.doiName;
      } else if (
        this.form.doiName !== "" &&
        this.form.address == "" &&
        this.form.intName !== ""
      ) {
        object = this.form.doiName;
      } else if (
        this.form.doiName == "" &&
        this.form.address !== "" &&
        this.form.intName !== ""
      ) {
        object = this.form.intName;
      } else if (
        this.form.doiName == "" &&
        this.form.address !== "" &&
        this.form.intName !== ""
      ) {
        return this.getList(object);
      } else if (
        this.form.doiName !== "" &&
        this.form.address == "" &&
        this.form.intName == ""
      ) {
        object = this.form.doiName;
      } else if (
        this.form.doiName == "" &&
        this.form.address !== "" &&
        this.form.intName == ""
      ) {
        object = this.form.address;
      } else if (
        this.form.doiName == "" &&
        this.form.address == "" &&
        this.form.intName !== ""
      ) {
        object = this.form.intName;
      }
      this.getList(object);
    },
    handleSizeChange(pageSize) {
      this.param.pno = 1;
      this.param.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.param.pno = currentPage;
      this.getList();
    },
    handleClick(spid, lnt) {
      this.$refs.deviceRef.handleOpen(spid, lnt);
    },
    handleCreate() {
      this.$refs.createRef.handleOpen();
    },
    handleEdit(pointInfo) {
      this.$refs.createRef.handleOpen(pointInfo);
    },
    //地图确定
    async handleSumit() {
      const response = await editNetspot({
        username: window.sessionStorage.getItem("username"),
        name: this.mapParams.name,
        adss: this.mapParams.address,
        fireman: this.mapParams.fireman,
        person: this.mapParams.person,
        firemanname: this.mapParams.firemanname,
        personname: this.mapParams.personname,
        tube: this.mapParams.tube,
        marker: this.mapParams.marker,
        nid: this.mapParams.nid,
        spid: this.mapParams.spid,
        lnt: this.mapParams.lnglat,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.points2 = [];
        this.setMap();
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    async getList(object) {
      const response = await reqGetNetspot({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object: object,
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        console.log(this.tableData, '/////////////');
        this.total = response.data.recordCount;
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deletePoint(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //删除
    async deletePoint(id) {
      const response = await delNetspot({
        username: this.sessionStorage.getItem("username"),
        spid: id,
      });

      if (response.status === 200) {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.getList();
      } else {
        this.$message.error(response.statusText);
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.m-device {
  .m {
    &-box {
      position: relative;
      width: 100%;
      min-height: calc(100vh - 140px);
      background: #fff;
      box-sizing: border-box;
      padding: 10px 10px;
      border-radius: 0;
      max-width: calc(100vw - 90px);
      margin-left: 20px;

      /deep/ {
        & .el-card__body {
          padding: 0;
        }

        & .el-form-item__content {
          margin-left: 0;
        }

        & .el-form-item__label {
          font-size: 12px;
        }
      }
    }

    &-map {
      position: absolute;
      left: 10px;
      width: 98%;
      height: 98%;
    }

    &-content {
      display: none;
      position: absolute;
      right: 25px;
      width: 250px;
      height: 180px;
      margin-top: 10px;
      padding: 10px;
      background-color: #fff;

      &__c {
        font-size: 12px;
        color: #333;
        font-weight: bold;
      }

      &__inp {
        /deep/ {
          & .el-input__inner {
            width: 250px;
            height: 25px;
            margin-top: 5px;
            border-radius: 0;
          }
        }
      }

      &__button {
        text-align: right;

        /deep/ {
          & .el-button {
            margin-top: 10px;
            color: #333;
            border-radius: 0;
            background-color: #fff;
            border: none;
          }
        }
      }
    }

    &-header {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      background-color: #fff;
      padding: 10px;
      margin-bottom: 10px;
    }

    &-pagination {
      position: absolute;
      bottom: 10px;
      right: 20px;
      margin-top: 10px;
      text-align: right;
    }
  }
}
</style>
