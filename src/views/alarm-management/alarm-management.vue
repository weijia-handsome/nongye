<template>
  <div class="m-alarm">
    <div class="m-header">
      <span>报警管理</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-input
                v-model="form.projectName"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input
                v-model="form.deviceName"
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
                v-model="form.deviceNum"
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
        <el-table-column prop="gname" label="项目名称" width="180">
        </el-table-column>
        <el-table-column
          prop="dname"
          label="设备名称"
          align="center"
          width="250"
        >
        </el-table-column>
        <el-table-column prop="imei" label="设备编号" align="center">
        </el-table-column>
        <el-table-column prop="alarmType" label="报警名称" align="center">
        </el-table-column>
        <el-table-column
          prop="d_adss"
          label="设备安装地址"
          align="center"
          width="500"
        >
        </el-table-column>
        <el-table-column prop="alarmtime" label="报警时间" align="center">
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
      <alarm ref="alarmRef"></alarm>
    </el-card>
  </div>
</template>

<script>
import Alarm from "./alarm/alarm.vue";
import { reqAlarmList } from "@/api/api.js";

export default {
  name: "AlarmManagement",
  components: {
    Alarm,
  },
  data() {
    return {
      total: 0,
      loading: false,
      form: {
        projectName: "",
        deviceName: "",
        deviceNum: "",
      },
      param: {
        pno: 1,
        pageSize: 10,
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
    handleCheck(alarmInfo) {
      this.$refs.alarmRef.handleOpen(alarmInfo);
    },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      this.getList();
    },
    async getList() {
      const response = await reqAlarmList({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object:
          this.form.projectName || this.form.deviceName || this.form.deviceNum,
      });
      console.log(response);
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
.m-alarm {
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
