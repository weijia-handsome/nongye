<template>
  <div class="m-device">
    <div class="m-header">
      <span>管网</span>
    </div>

    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="管网名称">
              <el-input
                v-model="form.netName"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分区名称">
              <el-input
                v-model="form.pipeName"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="管网地址">
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
      <div v-else>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          v-loading="loading"
          height="600"
        >
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
          <el-table-column
            fixed
            prop="name"
            label="管网名称"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="adss"
            label="管网地址"
            width="450"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="pname"
            label="分区名称"
            width="250"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="firemanname"
            label="护理人"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="fireman"
            label="护理人手机号码"
            width="300"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="personname"
            label="责任人"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="person"
            label="责任人手机号码"
            width="300"
            align="center"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="handleDelete(scope.row.nid)"
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

      <edit ref="editRef" @refresh="getList"></edit>
    </el-card>
  </div>
</template>

<script>
import Edit from "./edit/edit.vue";
import { getNetwork, delNetwork, reqGetNetspot } from "@/api/api.js";

export default {
  name: "DevieManagement",
  components: {
    Edit,
  },
  data() {
    return {
      map: null, //地图实例
      mapVisible: false,
      total: 0,
      loading: false,
      form: {
        netName: "",
        pipeName: "",
        address: "",
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
        reqGetNetspot({ username, pno: "", pageSize: "" }).then((res) => {
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
    handleSizeChange(pageSize) {
      this.param.pno = 1;
      this.param.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.param.pno = currentPage;
      this.getList();
    },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      let object;
      if (
        this.form.netName !== "" &&
        this.form.pipeName !== "" &&
        this.form.address !== ""
      ) {
        object = this.form.netName;
      } else if (
        this.form.netName !== "" &&
        this.form.pipeName !== "" &&
        this.form.address == ""
      ) {
        object = this.form.netName;
      } else if (
        this.form.netName !== "" &&
        this.form.pipeName == "" &&
        this.form.address !== ""
      ) {
        object = this.form.netName;
      } else if (
        this.form.netName == "" &&
        this.form.pipeName !== "" &&
        this.form.address !== ""
      ) {
        object = this.form.pipeName;
      } else if (
        this.form.netName !== "" &&
        this.form.pipeName == "" &&
        this.form.address == ""
      ) {
        object = this.form.netName;
      } else if (
        this.form.netName == "" &&
        this.form.pipeName !== "" &&
        this.form.address == ""
      ) {
        object = this.form.pipeName;
      } else if (
        this.form.netName == "" &&
        this.form.pipeName == "" &&
        this.form.address !== ""
      ) {
        object = this.form.address;
      } else if (
        this.form.netName == "" &&
        this.form.pipeName == "" &&
        this.form.address == ""
      ) {
        return this.getList(object);
      }
      this.getList(object);
    },
    handleCreate() {
      this.$refs.editRef.handleOpen();
    },
    handleEdit(pipeInfo) {
      this.$refs.editRef.handleOpen(pipeInfo);
    },
    //获取列表
    async getList() {
      const response = await getNetwork({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object:
          this.form.netName || this.form.pipeName || this.form.address || "",
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        this.total = response.data.recordCount;
      } else {
        this.$message.success(response.statusText || "服务错误!");
      }
      this.loading = false;
    },
    handleDelete(id) {
      this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteNid(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //删除
    async deleteNid(id) {
      const response = await delNetwork({
        username: window.sessionStorage.getItem("username"),
        nid: id,
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
