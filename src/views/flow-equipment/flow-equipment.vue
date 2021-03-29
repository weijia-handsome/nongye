<template>
  <div class="m-flow">
    <div class="m-header">
      <span>流量设备</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input v-model="form.name" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input v-model="form.number" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="mini">查询</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table :data="tableData" style="width: 100%" align="center">
        <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span>{{
              (param.pno - 1) * param.pageSize + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="device_name" label="设备名称" width="180">
        </el-table-column>
        <el-table-column prop="imei" label="设备编号" align="center">
        </el-table-column>
        <el-table-column prop="adss" label="安装地址" align="center">
        </el-table-column>
        <el-table-column prop="instantFlow" label="实时流量" align="center">
        </el-table-column>
        <el-table-column prop="reg_time" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope"
            ><el-button type="text" size="mini" @click="handleCheck(scope.row)"
              >查看</el-button
            ></template
          >
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
    <flow ref="flowRef"></flow>
  </div>
</template>

<script>
import Flow from "./flow/flow.vue";
import { reqcontorlDeviceInfo } from "@/api/api.js";

export default {
  name: "FlowEquipment",
  components: {
    Flow,
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
        tid: 5,
      },
      tableData: [],
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleCheck(listInfo) {
      this.$refs.flowRef.handleOpen(listInfo);
    },
    async getList() {
      const response = await reqcontorlDeviceInfo({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        tid: this.param.tid,
        object: this.form.name || this.form.number,
      });
      if (response.status === 200) {
        this.tableData = response.data.data;
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
