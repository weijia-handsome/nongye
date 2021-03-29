<template>
  <el-dialog
    class="m-dialog"
    title="查看视频"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <!-- <video-player
          class="m-video"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        ></video-player> -->
        <div id="ezuikitTalkData"></div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { reqGetVideo } from "@/api/api.js";
import "../../../../public/ezuikit.js";
import EZUIKit from "ezuikit-js";
export default {
  name: "CheckVideo",
  data() {
    return {
      dialogVisible: false,
      video: "",
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "", //url地址
          },
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleOpen() {
      this.dialogVisible = true;
      this.getVideo();
    },
    //获取视频设备
    async getVideo() {
      const username = sessionStorage.getItem("username");
      reqGetVideo(username).then((res) => {
        const item = document.getElementById("ezuikitTalkData");

        //动态删除多出的子元素
        while (item.firstChild) {
          item.removeChild(item.firstChild);
        }
        this.imei = "E48829946_NQACPR";
        const deviceSerial = this.imei.split("_")[0];
        const deviceSerial2 = this.imei.split("_")[1];

        var ezuikitTalkData = {
          accessToken: global.accessToken, // 应用accessToken
          ezopen:
            "ezopen://" +
            deviceSerial2 +
            "@open.ys7.com/" +
            deviceSerial +
            "/1.hd.live", // 包含设备信息的ezopen协议
          decoderPath: "./", // 当前页面与插件主文件ezuiit-talk相对路径
        };
        new EZUIKit.EZUIKitPlayer({
          autoplay: true,
          id: "ezuikitTalkData",
          accessToken:
            "at.86lfccht53azlnghavsbdnj959n9stl1-1sdls1pyw3-0jn64re-qscxc7an6",
          url: ezuikitTalkData.ezopen, // 这里的url可以是直播地址.live  ，也可以是回放地址.rec 或 .cloud.rec
          template: "simple", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          // 视频上方头部控件
          header: ["capturePicture", "talk"], // 如果templete参数不为simple,该字段将被覆盖
          plugin: ["talk"], // 加载插件，talk-对讲
          // 视频下方底部控件
          // footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
          // audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
          // openSoundCallBack: data => console.log("开启声音回调", data),
          // closeSoundCallBack: data => console.log("关闭声音回调", data),
          // startSaveCallBack: data => console.log("开始录像回调", data),
          // stopSaveCallBack: data => console.log("录像回调", data),
          // capturePictureCallBack: data => console.log("截图成功回调", data),
          // fullScreenCallBack: data => console.log("全屏回调", data),
          // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
          // width: 100, //如果指定了width、height则以这里为准
          height: 600, //如果没指定宽高，则以容器video-container为准
        });
        // getvideo_ycy(res.data.accessToken, deviceSerial).then((red) => {
        //   // this.GetMapDataList.mess
        // });
        this.$forceUpdate();
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.m-dialog {
  /deep/ {
    & .el-dialog .el-dialog__header {
      border-bottom: 1px solid #f0f1ef;
    }

    & .el-col {
      width: 100%;
    }
  }
}
</style>
