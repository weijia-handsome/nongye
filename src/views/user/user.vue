<template>
  <div class="m-user modules">
    <div class="m-header">
      <span>用户管理</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24" class="m-box__content">
          <el-col :span="6">
            <el-form-item label="姓名">
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
            <el-form-item label="联系方式">
              <el-input
                v-model="form.phone"
                size="mini"
                clearable
                @clear="handleSearch"
                @keyup.enter.native="handleSearch"
              ></el-input>
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
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center">
        </el-table-column>
        <el-table-column prop="registerDate" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="role" label="角色" align="center">
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
          :current-page="param.pno"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
      <edit ref="editRef" @refresh="getUserList"></edit>
    </el-card>
  </div>
</template>
<script>
import Edit from "./edit/edit.vue";
import { reqUserList, reqDelUser } from "@/api/api.js";

export default {
  components: { Edit },
  name: "User",
  data() {
    return {
      total: 0,
      loading: false,
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
    handleSizeChange(pageSize) {
      this.param.pno = 1;
      this.param.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(currentPage) {
      this.param.pno = currentPage;
      this.getUserList();
    },
    handleEdit(userInfo) {
      this.$refs.editRef.handleOpen(userInfo);
    },
    handleCreate() {
      this.$refs.editRef.handleOpen();
    },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      this.getUserList();
    },
    handleDelete(id) {
      this.$confirm("确定删除用户？", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const response = await reqDelUser({
            username: window.sessionStorage.getItem("username"),
            id: id,
          });
          if (response.data.code === "200") {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getUserList();
          } else {
            this.$message({ type: "warning", message: response.data.mess });
          }
        })
        .catch(() => {
          this.$message("取消删除！");
        });
    },
    async getUserList() {
      const response = await reqUserList({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        phone: this.form.phone || '',
        name: this.form.name || ''
      });
      if (response.status === 200) {
        this.loading = true;
        this.tableData = response.data.data;
        console.log(this.tableData);
        this.total = response.data.recordCount;
      } else {
        this.$message(response.statusText);
      }
      this.loading = false;
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="scss" scoped>
.m-user {
  .m {
    &-box {
      position: relative;
      width: 100%;
      max-width: calc(100vw - 90px);
      min-height: calc(100vh - 140px);
      background: #fff;
      box-sizing: border-box;
      padding: 10px 10px;
      border-radius: 0;
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
      text-align: right;
    }
  }
}
</style>
