<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#0844a4"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon" class="m-icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item
                >
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
                >{{ subItem.title }}</el-menu-item
              >
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon" class="m-icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: "el-icon-s-home",
          index: "dashboard",
          title: "主界面",
        },
        {
          icon: "el-icon-user",
          index: "user",
          title: "用户管理",
        },
        {
          icon: "el-icon-s-goods",
          index: "authority-manage",
          title: "权限管理",
        },
        {
          icon: "el-icon-s-grid",
          index: "project",
          title: "项目模块",
        },
        {
          icon: "el-icon-s-platform",
          index: "4",
          title: "智能设备",
          subs: [
            {
              index: "video-devices",
              title: "视频设备",
            },
            {
              index: "temperture",
              title: "土壤温湿度",
            },
            {
              index: "control-equipment",
              title: "控制设备",
            },
            {
              index: "flow-equipment",
              title: "流量设备",
            },
          ],
        },
        {
          icon: "el-icon-setting",
          index: "5",
          title: "设备配置",
          subs: [
            {
              index: "alarm-management",
              title: "通知管理",
            },
            {
              index: "device-management",
              title: "设备管理",
            },
            {
              index: "video-manage",
              title: "视频管理",
            },
          ],
        },
        {
          icon: "el-icon-pie-chart",
          index: "charts",
          title: "管点/分区管理",
          subs: [
            {
              index: "manage-point",
              title: "管点",
            },
            {
              index: "pipe-network",
              title: "管网",
            },
            {
              index: "partition",
              title: "分区管理",
            },
            {
              index: "irrigation-task",
              title: "滴灌任务",
            },
          ],
        },
        {
          icon: "el-icon-rank",
          index: "diary",
          title: "统计日记",
        },
      ],
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 40px;
  bottom: 0;
  overflow-y: scroll;
  background-color: #0844a4;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 160px;
}
.el-menu--collapse {
  width: 54px;
}
.sidebar > ul {
  height: 100%;
}
.sidebar-el-menu .m-icon {
  font-size: 14px;
  margin-right: 10px;
}
::v-deep .el-menu-item {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}

::v-deep .el-menu-item:hover {
  background-color: #047CF7;
}

::v-deep .el-submenu__title {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
</style>
