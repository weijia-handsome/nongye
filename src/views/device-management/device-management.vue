<template>
  <div class="m-device">
    <div class="m-header">
      <span>设备管理</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="5">
            <el-form-item label="设备状态">
              <el-select
                v-model="form.type"
                placeholder="请选择活动区域"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              >
                <el-option label="离线" value="off"></el-option>
                <el-option label="在线" value="on"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="管网名称">
              <el-input
                v-model="form.name"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
          <el-col :span="5">
            <el-form-item label="设备编号">
              <el-input
                v-model="form.deviceNumber"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" size="mini" @click="handleSearch"
              >查询</el-button
            >
          </el-col>
        </el-row>
      </el-form>

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
        <el-table-column fixed prop="gname" label="管网名称" width="180">
        </el-table-column>
        <el-table-column prop="adss" label="管网地址" width="450">
        </el-table-column>
        <el-table-column prop="device_name" label="设备名称" width="250">
        </el-table-column>
        <el-table-column prop="imei" label="设备编号" width="200">
        </el-table-column>
        <el-table-column label="控制设备自动检测控制" width="200">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.state === 1"
              active-text="开"
              inactive-text="关"
              size="mini"
              @change="updateState(scope.row, scope.$index)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="adss" label="设备安装地址" width="450">
        </el-table-column>
        <el-table-column prop="line" label="设备状态" width="120">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.line === 'on'">
              在线
            </el-tag>
            <el-tag type="info" v-else> 离线 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tid" label="设备类型" width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.tid === '0'">视频设备</span>
            <span v-if="scope.row.tid === '2'">四路智能控制器</span>
            <span v-if="scope.row.tid === '4'">土壤温湿度传感器</span>
            <span v-if="scope.row.tid === '5'">流量计</span>
            <span v-if="scope.row.tid === '6'"> 重合闸断路器</span>
            <span v-if="scope.row.tid === '7'">重合闸漏电保护器</span>
          </template>
        </el-table-column>
        <el-table-column prop="reg_time" label="报警时间" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="handleThreshold(scope.row.imei)"
              >阈值设置</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="handleDelete(scope.row.imei)"
              >删除设备</el-button
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
      <threshold ref="thresholdRef"></threshold>
      <check ref="checkRef"></check>
    </el-card>
  </div>
</template>

<script>
import Threshold from "./threshold/threshold.vue";
import Check from "./check/check.vue";
import { reqDeviceManage, reqUpDetection, reqDelDevice } from "@/api/api.js";

export default {
  name: "DevieManagement",
  components: {
    Threshold,
    Check,
  },
  data() {
    return {
      total: 0,
      loading: false,
      value: true,
      form: {
        name: "",
        deviceName: "",
        deviceNumber: "",
        type: "",
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
    handleSizeChange(pageSize) {
      this.param.pno = 1;
      this.param.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(currentPage) {
      this.param.pno = currentPage;
      this.getList();
    },
    handleClick(deviceInfo) {
      this.$refs.checkRef.handleOpen(deviceInfo);
    },
    handleThreshold(imei) {
      this.$refs.thresholdRef.handleOpen(imei);
    },
    //更新状态
    async updateState(device, index) {
      this.tableData[index].state = this.tableData[index].state === 1 ? 0 : 1;
      const response = await reqUpDetection({
        username: window.sessionStorage.getItem("username"),
        detection: device.state,
        imei: device.imei,
      });
      if (response.status === 200) {
        this.$message.success("更新成功");
        return;
      }
      
      this.tableData[index].state = this.tableData[index].state === 1 ? 0 : 1;
      this.$message.error(response.statusText || "请重试");
    },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      this.getList();
    },
    //获取列表
    async getList() {
      const response = await reqDeviceManage({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object:
          this.form.name ||
          this.form.deviceName ||
          this.form.deviceNumber ||
          this.form.region ||
          "",
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        this.total = response.data.recordCount;
      } else {
        this.$message.error(response.statusText || "服务错误!");
      }
      this.loading = false;
    },
    handleDelete(imei) {
      this.$confirm("此操作将删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const response = await reqDelDevice({
            username: window.sessionStorage.getItem("username"),
            imei: imei,
          });
          if (response.status === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          } else {
            this.$message.error(response.statusText || "服务错误!");
          }
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

    &-header {
      font-size: 16px;
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
