<template>
  <div class="m-authority-manage">
    <div class="m-header">
      <span>权限管理</span>
    </div>
    <el-card class="m-box">
      <el-form label-width="90px" :model="form">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="角色名称">
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
        <el-table-column
          prop="name"
          label="角色名称"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="region_name" label="区域范围" align="center">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template slot-scope="scope"
            ><el-button type="text" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
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
          :current-page="param.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
      <edit ref="editRef" @refresh="getRoleList"></edit>
    </el-card>
  </div>
</template>

<script>
import Edit from "./edit/edit.vue";
import { reqGetRole, reqDelRole } from "@/api/api.js";

export default {
  name: "AuthorityManage",
  components: {
    Edit,
  },
  data() {
    return {
      total: 0,
      loading: false,
      form: {
        name: "",
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
    handleSizeChange(pageSize) {
      this.param.pno = 1;
      this.param.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(currentPage) {
      this.param.pno = currentPage;
      this.getRoleList();
    },
    handleEdit(roleInfo) {
      this.$refs.editRef.handleOpen(roleInfo);
    },
    handleCreate() {
      this.$refs.editRef.handleOpen();
    },
    handleSearch() {
      this.total = 0;
      this.param.pno = 1;
      this.getRoleList();
    },
    //获取列表
    async getRoleList() {
      const response = await reqGetRole({
        username: window.sessionStorage.getItem("username"),
        pno: this.param.pno,
        pageSize: this.param.pageSize,
        object: this.form.name,
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
    //删除
    async deleteRole(id) {
      const response = await reqDelRole({
        username: window.sessionStorage.getItem("username"),
        id: id,
      });
      if (response.data.code === "200") {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.getRoleList();
      } else {
        this.$message.error(response.data.mess || "服务错误！");
      }
    },
    handleDelete(id) {
      this.$confirm("确定删除用户？", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteRole(id);
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
    this.getRoleList();
  },
};
</script>

<style lang="scss" scoped>
.m-authority-manage {
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
    }
  }
}
</style>
