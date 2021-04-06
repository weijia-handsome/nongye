<template>
  <div class="m-temperture">
    <div class="m-header">
      <span>流量计</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="80px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input
                v-model="form.name"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input
                v-model="form.number"
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
            <el-button type="primary" size="mini" @click="handleSearch"
              >导出</el-button
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
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
          fixed
        >
          <template slot-scope="scope">
            <span>{{
              (param.pno - 1) * param.pageSize + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="device_name"
          label="设备名称"
          width="250"
          fixed
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="imei"
          label="设备编号"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="adss"
          label="安装地址"
          align="center"
          width="500"
        >
        </el-table-column>
        <el-table-column
          prop="soilT"
          label="实时温度(℃)"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="soilH"
          label="实时湿度(%)"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="reg_time"
          label="创建时间"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="lastTime"
          label="最后上传时间"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="180">
          <!-- <template slot-scope="scope"
            ><el-button type="text" size="mini" 
              >导出</el-button
            ></template
          > -->
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
      <!-- <check ref="checkRef"></check> -->
    </el-card>
  </div>
</template>

<script>
import { reqGetTuRangDevice } from "@/api/api.js";

export default {
  name: "Temperture",
  // components: {
  //   Check,
  // },
  data() {
    return {
      total: 0,
      loading: false,
      form: {
        name: "",
        number: "",
      },
      param: {
        pno: 1,
        pageSize: 10,
        tid: 4,
      },
      tableData: [],
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.param.pno = 1;
      this.param.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.param.pno = currentPage;
      this.getList();
    },
    // handleCheck(info) {
    //   this.$refs.checkRef.handleOpen(info);
    // },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      let object;
      if (this.form.name !== "" && this.form.number !== "") {
        object = this.form.name;
      } else if (this.form.name == "" && this.form.number !== "") {
        object = this.form.number;
      } else if (this.form.number == "" && this.form.name !== "") {
        object = this.form.name;
      } else if (this.form.name == "" && this.form.number == "") {
        return this.getList(object);
      }
      this.getList(object);
    },
    //获取列表
    async getList(object) {
      const response = await reqGetTuRangDevice({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        tid: this.param.tid,
        pageSize: this.param.pageSize,
        object: object,
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        this.total = response.data.recordCount;
      } else {
        this.$message.error(response.data.mess || "服务错误！");
      }
      this.loading = false;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.m-temperture {
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
    }
  }
}
</style>
