<template>
  <div class="m-project">
    <div class="m-header">
      <span>项目模块</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="100px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-input v-model="form.name" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目地址">
              <el-input v-model="form.address" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" @click="handleSearch"
                >查询</el-button
              >
              <el-button type="primary" size="mini" @click="handleCreate"
                >新增</el-button
              >
            </el-form-item>
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
        <el-table-column prop="name" label="项目名称" width="180">
        </el-table-column>
        <el-table-column prop="adss" label="项目地址" align="center" width="450">
        </el-table-column>
        <el-table-column prop="firemanname" label="护理人" align="center">
        </el-table-column>
        <el-table-column prop="fireman" label="护理人手机号码" align="center">
        </el-table-column>
        <el-table-column prop="personname" label="责任人" align="center">
        </el-table-column>
        <el-table-column prop="person" label="责任人手机号码" align="center">
        </el-table-column>
        <el-table-column prop="marker" label="项目描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.row.pid, scope.row.name)"
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
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
      <edit ref="editRef" @refresh="getList"></edit>
    </el-card>
  </div>
</template>

<script>
import Edit from "./edit/edit.vue";
import { reqGetProject, reqDelProject } from "@/api/api.js";

export default {
  name: "Project",
  components: {
    Edit,
  },
  data() {
    return {
      total: 0,
      form: {
        name: "",
        address: "",
      },
      loading: false,
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
    handleEdit(projectInfo) {
      this.$refs.editRef.handleOpen(projectInfo);
    },
    handleCreate() {
      this.$refs.editRef.handleOpen();
    },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      this.getList();
    },
    handleDelete(id, name) {
      this.$confirm(
        `确定删除 <span style="color:red">${name}</span>项目？`,
        "删除项目",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(async () => {
          const response = await reqDelProject({
            username: window.sessionStorage.getItem("username"),
            pid: id,
          });
          if (response.data.code === "200") {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          } else {
            this.$message.error(response.data.mess || "服务错误!");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //获取项目列表
    async getList() {
      const response = await reqGetProject({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        this.total = response.data.recordCount || 0;
      } else {
        this.$message.error(response.data.mess || "服务错误!");
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
.m-project {
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
      right: 10px;
      margin-top: 20px;
    }
  }
}
</style>
