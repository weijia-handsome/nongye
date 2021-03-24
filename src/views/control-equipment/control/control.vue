<template>
  <el-dialog
    class="m-dialog"
    title="阀门控制"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <div class="m-button">
      <el-button type="primary" size="mini">全开</el-button>
      <el-button type="primary" size="mini">全关</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" align="center">
      <el-table-column label="序号" type="index" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ (param.current - 1) * param.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="device_name" label="名称" width="180" align="center"> </el-table-column>
      <el-table-column prop="state" label="状态" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope"
          ><el-switch
            :value="scope.row.state === 0"
             @change="handleSwitch(scope.row, scope.$index)"
            active-color="#13ce66"
            inactive-color="#047CF7"
            active-text="开"
            inactive-text="关"
          >
          </el-switch
        ></template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import temperture from "../../temperature/temperture.vue";
import {reqCheckDevice} from '@/api/api.js';

export default {
  components: { temperture },
  name: "Control",
  data() {
    return {
      value: true,
      dialogVisible: false,
      param: {
        current: 1,
        size: 10,
      },
      tableData: [],
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen(info) {
      this.dialogVisible = true;
      this.tableData.push(info);
      console.log(this.tableData);
    },
    handleComfirm() {
      this.dialogVisible = false;
    },
    async handleSwitch(data, index) {
      // const response = await reqCheckDevice({
      //   username: window.sessionStorage.getItem('username'),
      //   type,
      //   port,
      //   imei,
      //   time
      // })
    }
  },
};
</script>

<style lang="scss" scoped>
.m-dialog {
  /deep/ {
    & .el-dialog__header {
      border-bottom: 1px solid #f0f1ef;
    }

    & .el-dialog__body {
      position: relative;
    }
  }
  .m {
    &-button {
      position: absolute;
      right: 50px;
      top: -40px;
    }
  }
}
</style>
