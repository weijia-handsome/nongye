<template>
  <div class="m-flow">
    <div class="m-header">
      <span>明渠流量计</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
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
            <el-button type="primary" size="mini" @click="handleCreate"
              >新增</el-button
            >
          </el-col>
        </el-row>
      </el-form>

      <el-table
        :data="tableData"
        style="width: 100%, height: 600px"
        align="center"
      >
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center"
          fixed="left"
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
          width="180"
          align="center"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          prop="imei"
          label="设备编号"
          align="center"
          width="160px"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          prop="adss"
          label="安装地址"
          align="center"
          width="300px"
        >
        </el-table-column>
        <el-table-column
          label="流速(m³/s)"
          prop="speedFlow"
          align="center"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ (scope.row.speedFlow / 100) | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="液位(m)"
          prop="flowLevel"
          align="center"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ (scope.row.flowLevel / 100) | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="每秒流量(m³/s)"
          prop="secondFlow"
          align="center"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ (scope.row.secondFlow / 100) | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="每小时流量(m³/h)"
          prop="hourFlow"
          align="center"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.hourFlow | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="正累计流量(m³)"
          prop="lowPositiveFlow"
          align="center"
          width="200px"
        >
        </el-table-column>
        <el-table-column
          prop="reg_time"
          label="创建时间"
          align="center"
          width="300px"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="200px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="handleCheck(scope.row.imei)"
              >查看</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.row.imei)"
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
    </el-card>
    <edit ref="editRef" :info="tableData" @refresh="getList"></edit>
    <check ref="checkRef"></check>
  </div>
</template>

<script>
import Edit from "./edit/edit.vue";
import Check from "./check/check.vue";
import { reqcontorlDeviceInfo, reqDelDevice } from "@/api/api.js";

export default {
  name: "FlowEquipment",
  components: {
    Edit,
    Check,
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
        tid: 8,
      },
      tableData: [],
    };
  },
  filters: {
    rounding(value) {
      return Number(value).toFixed(2);
    },
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
    handleEdit(listInfo) {
      this.$refs.editRef.handleOpen(listInfo);
    },
    handleCreate() {
      this.$refs.editRef.handleOpen();
    },
    handleCheck(imei) {
      this.$refs.checkRef.handleOpen(imei);
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
    async getList(object) {
      const response = await reqcontorlDeviceInfo({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        tid: this.param.tid,
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
    // 删除
    async reqDelDevice(imei) {
      const response = await reqDelDevice({
        username: window.sessionStorage.getItem("username"),
        imei: imei,
      });
      if (response.data.code === "200") {
        this.$message.success(response.data.mess);
        this.getList();
      } else {
        this.$message.error(response.data.mess || "服务错误!");
      }
    },
    handleDelete(imei) {
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.reqDelDevice(imei);
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
.m-flow {
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
