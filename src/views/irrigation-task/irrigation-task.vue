<template>
  <div class="m-irrigation">
    <div class="m-header">
      <span>滴灌任务</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="120px" :model="form">
        <el-row :gutter="24">
          <el-col :span="5">
            <el-form-item label="滴灌任务名称">
              <el-input
                placeholder="请输入"
                v-model="form.taskName"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="滴灌类型">
              <el-input
                placeholder="请输入"
                v-model="form.irrType"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="任务状态">
              <el-select
                v-model="form.taskType"
                placeholder="请选择"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              >
                <el-option label="执行中" value="1"></el-option>
                <el-option label="完成" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="启用状态">
              <el-select
                v-model="form.userType"
                placeholder="请选择"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              >
                <el-option label="未启用" value="1"></el-option>
                <el-option label="已启用" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
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
          prop="name"
          label="滴灌任务名称"
          width="200"
          fixed
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="time"
          label="滴灌时长(时)"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="start_time"
          label="任务执行时间"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="滴灌类型"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type === '2'">直灌</span>
            <span v-else>轮灌</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="o_name"
          label="滴灌范围名称"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="state"
          label="任务状态"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.state === '0'">未执行</span>
            <span v-if="scope.row.state === '1'">执行中</span>
            <span v-if="scope.row.state === '2'">完成</span>
            <span v-if="scope.row.state === '3'">待执行</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="regtime"
          label="任务创建时间"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="启用状态"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          align="center"
          width="300"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleBegin(scope.row.id)"
              >启动</el-button
            >
            <el-button type="text" size="mini" @click="handleStop(scope.row.id)" v-if="scope.row.state === '1'"
              >停止</el-button
            >
            <el-button type="text" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="mini" @click="handleDelete"
              >删除</el-button
            >
            <el-button type="text" size="mini" @click="handleCheckVideo(scope.row.imei)"
              >查看现场</el-button
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
    <edit ref="editRef" @refresh="getList"></edit>
    <check-video ref="videoRef"></check-video>
  </div>
</template>

<script>
import Edit from "./edit/edit.vue";
import CheckVideo from "./check/check.vue";
import { getGridTask, stopGrid, delGridTask,upState } from "@/api/api.js";

export default {
  components: { Edit,CheckVideo },
  name: "WellRoom",
  data() {
    return {
      total: 0,
      loading: false,
      form: {
        taskName: "",
        irrType: "",
        taskType: "",
        userType: "",
      },
      loading: true,
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
      this.getList();
    },
    handleCheckVideo(imei) {
      console.log(imei, '=============');
      this.$refs.videoRef.handleOpen();
    },
    handleEdit(irrInfo) {
      this.$refs.editRef.handleOpen(irrInfo);
    },
    handleCreate() {
      this.$refs.editRef.handleOpen();
    },
    //获取列表
    async getList() {
      const response = await getGridTask({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object:
          this.form.taskName ||
          this.form.irrType ||
          this.form.taskType ||
          this.form.userType ||
          "",
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        console.log(this.tableData, '///////////');
        this.total = response.data.recordCount;
      } else {
        this.$message.error(response.statusText);
      }
      this.loading = false;
    },
    async handleStop(id) {
      const response = await stopGrid({
        username: window.sessionStorage.getItem("username"),
        id: id,
      });
      if (response.status === 200) {
        this.$message.success(response.data.mess);
      } else {
        this.$message.error(response.data.mess);
      }
    },
    //开启滴灌任务
    async handleBegin(id) {
      const response = await upState({
        username: window.sessionStorage.getItem('username'),
        id: id
      })
      console.log(response, '========');
      if (response.data.code === '200') {
        this.$message.success(response.data.mess);
      } else {
        this.$message.error(response.data.mess || '请重试');
      }
    },
    //删除滴灌任务
    async delGridTask(id) {
      const response = await delGridTask({
        username: window.sessionStorage.getItem('username'),
        id: id
      })
      if (response.status === 200) {
        this.$message.success('删除成功');
      } else {
        this.$message.error(response.data.mess);
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delGridTask(id);
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
.m-irrigation {
  /deep/ {
    & .el-page-header {
      padding: 5px;
    }
  }

  .m {
    &-box {
      position: relative;
      width: 100%;
      min-height: calc(100vh - 145px);
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
      text-align: right;
    }
  }
}
</style>
