<template>
  <div class="m-video">
    <div class="m-header">
      <span>视频设备</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form"
        ><el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="管网名称">
              <el-input v-model="form.name" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input v-model="form.phone" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="mini" @click="handleSearch"
              >查询</el-button
            >
          </el-col>
        </el-row></el-form
      >

      <el-table :data="tableData" style="width: 100%" align="center">
        <el-table-column label="序号" type="index" width="80" align="center">
          <template slot-scope="scope">
            <span>{{
              (param.pno - 1) * param.pageSize + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="管网名称" width="180">
        </el-table-column>
        <el-table-column prop="imei" label="设备编号" align="center">
        </el-table-column>
        <el-table-column prop="adss" label="安装地址" align="center">
        </el-table-column>
        <el-table-column prop="reg_time" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleCheck(scope.row.imei)"
              >查看</el-button
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
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        />
      </div>
      <check-video ref="videoRef" :imei="imei"></check-video>
    </el-card>
  </div>
</template>

<script>
import CheckVideo from "./check/check.vue";
import { reqGetVideoDevice } from "@/api/api.js";

export default {
  name: "VideoDevices",
  components: {
    CheckVideo,
  },
  data() {
    return {
      imei: "",
      total: 0,
      loading: false,
      form: {
        name: "",
        phone: "",
      },
      loading: true,
      param: {
        pno: 1,
        pageSize: 10,
        tid: 0,
      },
      tableData: [],
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.param.pno = 1;
      this.param.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(currentPage) {
      this.param.pno = currentPage;
      this.getUserList();
    },
    handleCheck(imei) {
      this.imei = imei;
      this.$refs.videoRef.handleOpen();
    },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      this.getList();
    },
    //获取视频列表
    async getList() {
      const response = await reqGetVideoDevice({
        username: window.sessionStorage.getItem("username"),
        tid: this.param.tid,
        pno: this.param.pno,
        pageSize: this.param.pageSize,
      });
      //   ).src = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://${yan}@open.ys7.com/${num}/1.live&autoplay=0&accessToken=${accessToken}&templete=2`;
      // this.modal9 = true;
      if (response.status === 200) {
        this.tableData = response.data.data;
        this.total = response.recordCount;
      } else {
        this.$message.error(response.statusText || "服务错误！");
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.m-video {
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
