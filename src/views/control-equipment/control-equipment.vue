<template>
  <div class="m-control">
    <div class="m-header">
      <span>控制设备</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input
                v-model="form.name"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input
                v-model="form.number"
                @clear="handleSearch"
                clearable
                @keyup.enter.native="handleSearch"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="mini" @click="handleSearch"
              >查询</el-button
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

        <el-table-column prop="device_name" label="设备名称" align="center">
        </el-table-column>
        <el-table-column prop="imei" label="设备编号" align="center">
        </el-table-column>
        <el-table-column
          prop="adss"
          label="安装地址"
          align="center"
          width="450"
        >
        </el-table-column>
        <el-table-column prop="reg_time" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleControl(scope.row)"
              >阀门控制</el-button
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
      <control ref="controlRef"></control>
    </el-card>
  </div>
</template>

<script>
import Control from "./control/control.vue";
import { reqcontorlDeviceInfo } from "@/api/api.js";

export default {
  name: "ControlEquipment",
  components: {
    Control,
  },
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
        tid: 2,
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
    handleControl(info) {
      this.$refs.controlRef.handleOpen(info);
    },
    //获取列表
    async getList(object) {
      const response = await reqcontorlDeviceInfo({
        username: window.sessionStorage.getItem("username"),
        tid: this.param.tid,
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object: object,
      });
      if (response.status === 200) {
        this.tableData = response.data.data;
        console.log(this.tableData);
        this.total = response.data.recordCount;
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.m-control {
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
