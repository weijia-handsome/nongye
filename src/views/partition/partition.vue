<template>
  <div class="m-device">
    <div class="m-header">
      <span>分区管理</span>
    </div>

    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="分区名称">
              <el-input v-model="form.name" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-input v-model="form.phone" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分区地址">
              <el-input v-model="form.phone" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="mini">查询</el-button>
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
          <el-table-column fixed prop="name" label="分区名称" width="200">
          </el-table-column>
          <el-table-column prop="adss" label="分区地址" width="450">
          </el-table-column>
          <el-table-column prop="pname" label="项目名称" width="200">
          </el-table-column>
          <el-table-column prop="firemanname" label="护理人" width="120">
          </el-table-column>
          <el-table-column prop="fireman" label="护理人手机号码" width="200">
          </el-table-column>
          <el-table-column prop="personname" label="责任人" width="120">
          </el-table-column>
          <el-table-column prop="person" label="责任人手机号码" width="200">
          </el-table-column>
          <el-table-column prop="marker" label="描述" width="450">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="250">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row.id)"
                type="text"
                size="small"
                >井房分区设备</el-button
              >
              <el-button type="text" size="small" @click="handleEdit"
                >编辑</el-button
              >
              <el-button type="text" size="small" @click="handleDelete"
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
      <edit ref="editRef"></edit>
    </el-card>
  </div>
</template>

<script>
import Edit from "./edit/edit.vue";
import MapLoader from "../../components/common/AMap.js";
import { getPartitionList } from "@/api/api.js";

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
        name: "",
        phone: "",
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
      let that = this;
      MapLoader().then(
        (AMap) => {
          console.log("地图加载成功");
          that.map = new AMap.Map("map", {
            resizeEnable: true,
            center: [117.000923, 36.675807],
            keyboardEnable: false,
            zoom: 11,
            // mapStyle: "amap://styles/darkblue",
          });
        },
        (e) => {
          console.log("地图加载失败", e);
        }
      );
    },
    handleMap() {
      this.mapVisible = true;
      this.setMap();
    },
    handleList() {
      this.mapVisible = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClick(id) {
      this.$router.push({
        path: "/well-room",
        query: {
          id: id,
        },
      });
    },
    handleCreate() {
      this.$refs.editRef.handleOpen();
    },
    handleEdit() {
      this.$refs.editRef.handleOpen();
    },
    //获取列表
    async getList() {
      const response = await getPartitionList({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object: this.form.phone || this.form.name || this.form.region || "",
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        this.total = response.data.recordCount;
      } else {
        this.$message.error(response.statusText);
      }
      this.loading = false;
    },

    handleDelete() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
