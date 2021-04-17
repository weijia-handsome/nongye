<template>
  <el-dialog
    class="m-dialog"
    title="阀门控制"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <div class="m-button">
      <el-input
        size="mini"
        placeholder="请输入灌溉时间(分钟)"
        v-model="param.time"
      ></el-input>
      <el-button type="primary" size="mini" @click="handleAllOpen"
        >全开</el-button
      >
      <el-button type="primary" size="mini" @click="handleAllClose"
        >全关</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%" align="center">
      <el-table-column label="序号" type="index" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ (param.current - 1) * param.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.name === 'L1'">阀门1</span>
          <span v-if="scope.row.name === 'L2'">阀门2</span>
          <span v-if="scope.row.name === 'L3'">阀门3</span>
          <span v-if="scope.row.name === 'L4'">阀门4</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state === '0'">关</span>
          <span v-if="scope.row.state === '1'">开</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.time"
            placeholder="请输入灌溉时间(分钟)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope"
          ><el-switch
            :value="scope.row.state === 1"
            @change="handleSwitch(scope.row, scope.$index)"
            active-color="#13ce66"
            inactive-color="#C0CCDA"
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
import { reqCheckDevice, getFourState } from "@/api/api.js";

export default {
  components: { temperture },
  name: "Control",
  data() {
    return {
      value: true,
      dialogVisible: false,
      imei: "",
      param: {
        current: 1,
        size: 10,
        time: "",
        singleTime: "",
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
      this.tableData = [];
      this.getFourState();
      for (let i of this.tableData) {
        i.time = "";
      }
      this.imei = info.imei;
    },
    handleComfirm() {
      this.dialogVisible = false;
    },
    async getFourState() {
      const response = await getFourState({
        username: window.sessionStorage.getItem("username"),
        imei: this.imei,
      });
      if (response.data.code === 200) {
        const str = response.data.data.toString();
        const famen = JSON.parse(str);
        for (let i in famen) {
          const port = i;
          const state = famen[i];

          this.tableData.push({
            name: port,
            time: "",
            port: port,
            state: state,
          });
        }
      } else {
        this.$message.error("服务错误!");
      }
    },
    //全开
    async handleAllOpen() {
      if (this.param.time !== "") {
        this.tableData.forEach((i) => {
          i.state = '1';
        });
        const response = await reqCheckDevice({
          username: window.sessionStorage.getItem("username"),
          type: 3,
          port: this.param.port,
          imei: this.imei,
          time: this.param.time,
        });

        if (response.data.code == 200) {
          this.$message.success(response.data.mess);
          return;
        }
        this.tableData.forEach((i) => {
          i.state = '0';
        });
        this.$message.error(response.data.mess || "请重试");
      } else {
        this.$message.error("请输入灌溉时间");
      }
    },
    //全关
    async handleAllClose() {
      this.tableData.forEach((i) => {
        i.state = '0';
      });
      const response = await reqCheckDevice({
        username: window.sessionStorage.getItem("username"),
        type: 2,
        port: this.param.port,
        imei: this.imei,
        time: this.param.time,
      });

      if (response.data.code == 200) {
        this.$message.success(response.data.mess);
        return;
      }
      this.tableData.forEach((i) => {
        if (i.state === '1') {
          i.state = '1';
        }
      });
      this.$message.error(response.data.mess || "请重试");
    },
    async handleSwitch(data, index) {
      if (data.time == "") {
        return this.$message.error("请输入灌溉时间");
      } else {
        this.tableData[index].state = this.tableData[index].state === '1' ? '0' : '1';
        const response = await reqCheckDevice({
          username: window.sessionStorage.getItem("username"),
          type: data.state,
          port: data.port,
          imei: this.imei,
          time: data.time,
        });
        if (response.data.code == 200) {
          this.$message.success(response.data.mess);
          return;
        }

        this.tableData[index].state = this.tableData[index].state === '1' ? '0' : '1';
        this.$message.error(response.data.mess || "请重试");
      }
    },
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
      display: flex;
      position: absolute;
      right: 50px;
      top: -40px;
    }
  }
}
</style>
