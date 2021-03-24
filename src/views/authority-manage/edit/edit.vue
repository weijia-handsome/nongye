<template>
  <el-dialog
    class="m-dialog"
    :title="id ? '编辑用户' : '新增用户'"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-row :gutter="24">
      <el-form ref="formData" :model="form" label-position="top">
        <el-col :span="6">
          <el-form-item
            label="角色名称"
            prop="userName"
            :rules="[{ required: true, message: '角色名称不能为空' }]"
          >
            <el-input size="mini" v-model="form.userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="权限模块选择"
            :rules="[{ required: true, message: '请选择' }]"
            prop="powerList"
          >
            <el-tree
              :data="form.powerList"
              show-checkbox
              node-key="id"
              :props="props"
              :default-expand-all="true"
            >
            </el-tree>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reqCreateRole, reqGetPower } from "@/api/api.js";
export default {
  name: "Edit",
  data() {
    return {
      dialogVisible: false,
      value: "0",
      id: "",
      //默认展开树
      defaultShowTree: [],
      roleInfo: {},
      form: {
        userName: "",
        powerList: [],
      },
      props: {
        label: "name",
        children: "children",
      },
      count: 1,
    };
  },
  methods: {
    handleComfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          alert("成功");
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    //获取权限
    async getRolePower() {
      const response = await reqGetPower({
        username: window.sessionStorage.getItem("username"),
      });
      if (response.status === 200) {
        this.form.powerList = response.data.data.allMenus;
        this.$nextTick(() => {
          this.defaultShowTree = [];
        });
      }
    },
    //新增权限
    // async createPower() {
    //   const response = await reqCreateRole({
    //     username: window.sessionStorage.getItem('username'),
    //     p_id:this.id,
    //   })
    // },
    handleOpen(roleInfo) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });
      if (roleInfo) {
        this.roleInfo = roleInfo;
        this.form.userName = roleInfo.name;
      } else {
        this.form.userName = "";
        this.roleInfo = null;
      }
      this.getRolePower();
    },
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  /deep/ {
    & .el-dialog__header {
      padding: 10px;
      line-height: 10px;
      border-bottom: 1px solid #f0f1ef;
    }

    & .el-dialog__headerbtn {
      top: 15px;
    }

    & .el-dialog__body {
      padding: 10px 20px;
    }

    & .el-form-item__label {
      padding-bottom: 0;
    }

    & .el-tree-node__children {
      display: flex;
    }

    & .el-tree-node__label {
      font-size: 12px;
    }

    & .el-col-24 {
      border-top: 1px solid #f0f1ef;
    }
  }
}
</style>
