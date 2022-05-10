<template>
  <el-dialog title="视频通话" :visible="dialogVisible" width="65%">
    <video src="" id="rtcA" controls autoplay></video>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: true,
      friends: this.$store.state.friends,
      nowchat: 0,
      localstream: null,
      meId: null
    };
  },
  methods: {
    // 1.发起请求
    apply(account) {
      // socket.emit("apply", {});
    },
    async createMedia() {
      try {
        this.localstream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        let video = document.querySelector("#rtcA");
        console.log(this.localstream, "localstream");
        video.srcObject = this.localstream; // 渲染本地流
      } catch (e) {
        console.log("本地流获取失败", e);
      }
    }
  },
  sockets: {
    me: function(id) {
      this.meId = id;
      console.log(this.meId, "用户socketID");
    }
  },
  mounted() {
    this.createMedia();
    console.log(this.friends[this.nowchat], "当前好友");
  }
};
</script>

<style></style>
