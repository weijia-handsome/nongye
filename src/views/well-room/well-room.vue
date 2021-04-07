<template>
  <div class="m-well-room">
    <div class="m-header">
      <span>分区管理-井房分区设备</span>
    </div>
    <el-page-header @back="goBack"> </el-page-header>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="5">
            <el-form-item label="设备类型">
              <el-select v-model="form.name" placeholder="请选择" size="mini">
                <el-option label="重合闸断路器" value="6"></el-option>
                <el-option label="重合闸漏电保护器" value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备部件">
              <el-select v-model="form.name" placeholder="请选择" size="mini">
                <el-option label="总电源" value="0"></el-option>
                <el-option label="除沙电磁阀" value="1"></el-option>
                <el-option label="灌溉电磁阀" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备名称">
              <el-input
                placeholder="请输入"
                v-model="form.name"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备imei">
              <el-input
                placeholder="请输入"
                v-model="form.name"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="mini">查询</el-button>
            <el-button type="primary" size="mini" @click="handleCreate"
              >新增</el-button
            >
          </el-col>
        </el-row>
      </el-form>

      <el-table
        :data="tableData"
        style="width: 100%"
        align="center"
        v-loading="loading"
      >
        <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span>{{
              (param.pno - 1) * param.pageSize + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="imei" label="设备imei" align="center">
        </el-table-column>
        <el-table-column prop="tid" label="设备类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.tid === '0'">视频设备</span>
            <span v-if="scope.row.tid === '2'">四路智能控制器</span>
            <span v-if="scope.row.tid === '4'">土壤温湿度传感器</span>
            <span v-if="scope.row.tid === '5'">流量计</span>
            <span v-if="scope.row.tid === '6'">重合闸断路器</span>
            <span v-if="scope.row.tid === '7'">重合闸漏电保护器</span>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="设备部件" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.position === '0'">总电源</span>
            <span v-if="scope.row.position === '1'">除沙电磁阀</span>
            <span v-if="scope.row.position === '2'">灌溉电磁阀</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.row.id)"
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
          :current-page="param.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="param.pno"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </el-card>
    <edit ref="editRef" @refresh="getList" :fid="fid"></edit>
  </div>
</template>

<script>
import Edit from "./edit/edit.vue";
import { getReclosing, delReclosing } from "@/api/api.js";

export default {
  components: { Edit },
  name: "WellRoom",
  data() {
    return {
      total: 0,
      loading: false,
      fid: "",
      form: {
        name: "",
        phone: "",
      },
      param: {
        pno: 1,
        pageSize: 10,
      },
      tableData: [],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
      // this.$route.query
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
    handleEdit(info) {
      this.$refs.editRef.handleOpen(info);
    },
    handleCreate() {
      this.$refs.editRef.handleOpen();
    },
    //获取列表
    async getList() {
      this.fid = window.sessionStorage.getItem("fid");
      const response = await getReclosing({
        username: window.sessionStorage.getItem("username"),
        fid: this.fid,
      });
      if (response.data.code === "200") {
        this.loading = true;
        this.tableData = response.data.data || [];
        console.log(this.tableData, "井房分区设备");
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
      this.loading = false;
    },
    //删除井房设备
    async delReclosing(id) {
      const response = await delReclosing({
        username: window.sessionStorage.getItem("username"),
        id: id,
      });
      if (response.data.code === "200") {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.getList();
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delReclosing(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  activated() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.m-well-room {
  /deep/ {
    & .el-page-header {
      padding: 5px;
    }

    & .el-page-header__left {
      color: #333;
    }
  }

  .m {
    &-box {
      position: relative;
      width: 100%;
      min-height: calc(100vh - 165px);
      background: #fff;
      box-sizing: border-box;
      padding: 10px 10px;
      border-radius: 0;
      max-width: calc(100vw - 200px);
      margin-left: 20px;

      /deep/ {
        & .el-card__body {
          padding: 0;
        }

        & .el-form-item__content {
          margin-left: 0;
          line-height: 0;
        }

        & .el-form-item__label {
          font-size: 12px;
        }
      }
    }

    &-header {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      background-color: #fff;
      padding: 10px;
    }

    &-pagination {
      position: absolute;
      bottom: 20px;
      right: 10px;
      margin-top: 10px;
      text-align: right;
    }
  }
}
</style>
