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
                v-model="form.phone"
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
      <div v-else>
        <el-table :data="tableData" border style="width: 100%" height="600px">
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
              <el-button @click="handleClick" type="text" size="small"
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
      <create ref="createRef"></create>
    </el-card>
  </div>
</template>

<script>
import CreateDevice from "./create-device/create-device.vue";
import Create from "./create/create.vue";
import MapLoader from "../../components/common/AMap.js";
import { reqGetNetspot, delNetspot } from "@/api/api.js";

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
      form: {
        doiName: "",
        intName: "",
        region: "",
      },
      param: {
        pno: 1,
        pageSize: 10,
      },
      loading: true,
      tableData: [],
    };
  },
  methods: {
    // 初始化
    setMap() {
      this.$nextTick(() => {
        this.map = new AMap.Map("map", {
          resizeEnable: true,
          center: [110.397428, 25.90923],
          // keyboardEnable: false,
          zoom: 4,
          mapStyle: "amap://styles/blue",
        });

        const username = sessionStorage.getItem("username");
        reqGetNetspot({ username, pno: 1, pageSize: 100 }).then((res) => {
          console.log(res);
          var cluster,
            markers = [];
          let data = res.data.data;

          const points2 = [];
          for (var i = 0; i < data.length; i++) {
            var pp = data[i].lnt;
            if (lat > 54) {
              var lng = pp.split(",")[1];
              var lat = pp.split(",")[0];
              points2.push({ lnglat: [lng, lat] });
            } else {
              var lng = pp.split(",")[0];
              var lat = pp.split(",")[1];
              points2.push({ lnglat: [lng, lat] });
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
          var mass = new AMap.MassMarks(points2, {
            opacity: 0.8,
            zIndex: 111,
            cursor: "pointer",
            style: style[0],
          });

          var marker = new AMap.Marker({ content: " ", map: this.map });
          mass.setMap(this.map);
        });
      });
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
      this.getList();
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
    handleClick() {
      this.$refs.deviceRef.handleOpen();
    },
    handleCreate() {
      this.$refs.createRef.handleOpen();
    },
    handleEdit(pointInfo) {
      this.$refs.createRef.handleOpen(pointInfo);
    },
    async getList() {
      const response = await reqGetNetspot({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object:
          this.form.doiName || this.form.intName || this.form.region || "",
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        this.total = response.data.recordCount;
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
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
