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
      curUsername: this.$store.state.username, // 当前登录用户
      friends: this.$store.state.friends, // 用户好友
      nowchat: 0,
      localstream: null,
      meId: null,
      isCall: false, // 正在通话的对象
      isToPeer: false, // 是否建立了 P2P 连接
      peer: null,
      offerOption: {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      }
    };
  },
  methods: {
    reply(account, type) {
      socket.emit("reply", {
        account: account,
        self: this.account,
        type: type
      });
    },
    // 1.发起请求
    apply(account) {
      socket.emit("apply", { account: account, self: this.curUsername });
    },
    reply(account, type) {
      socket.emit("reply", {
        account: account,
        self: this.curUsername,
        type: type
      });
    },
    async onAnswer(data) {
      // 接收answer
      try {
        await this.peer.setRemoteDescription(data.sdp); // 呼叫端设置远程 answer 描述
      } catch (e) {
        console.log("onAnswer: ", e);
      }
    },
    async createP2P(data) {
      await this.createMedia(data);
    },
    async createMedia(data) {
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
      // 获取到媒体流后，调用函数初始化 RTCPeerConnection
      this.initPeer(data);
    },
    initPeer(data) {
      // 创建输出端 PeerConnection
      let PeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      this.peer = new PeerConnection();
      this.peer.addStream(this.localstream); // 添加本地流
      // 监听ICE候选信息 如果收集到，就发送给对方
      this.peer.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("ICE", {
            account: data.self,
            self: this.account,
            sdp: event.candidate
          });
        }
      };
      this.peer.onaddstream = event => {
        // 监听是否有媒体流接入，如果有就赋值给 rtcB 的 src
        this.isToPeer = true;
        this.loading = false;
        let video = document.querySelector("#rtcB");
        video.srcObject = event.stream;
      };
    }
  },
  sockets: {
    me: function(id) {
      this.meId = id;
      console.log(this.meId, "用户socketID");
    },
    reply: async function(data) {
      // 收到回复
      console.log(data);
      switch (data.type) {
        case "1": // 同意
          this.isCall = data.self;
          // 对方同意之后创建自己的 peer
          await this.createP2P(data);
          // 并给对方发送 offer
          this.createOffer(data);
          break;
        case "2": //拒绝
          this.$message({
            message: "对方拒绝了你的请求！",
            type: "warning"
          });
          break;
        case "3": // 正在通话中
          this.$message({
            message: "对方正在通话中！",
            type: "warning"
          });
          break;
      }
    },
    apply: function(data) {
      // 收到请求
      if (this.isCall) {
        this.reply(data.self, "3");
      }
      this.$confirm(data.self + " 向你请求视频通话, 是否同意?", "提示", {
        confirmButtonText: "同意",
        cancelButtonText: "拒绝",
        type: "warning"
      })
        .then(async () => {
          await this.createP2P(data); // 同意之后创建自己的 peer 等待对方的 offer
          this.isCall = data.self;
          this.reply(data.self, "1");
        })
        .catch(() => {
          this.reply(data.self, "2");
        });
    },
    answer: function(data) {
      // 接收到 answer
      this.onAnswer(data);
    },
    ICE: function(data) {
      // 接收到 answer
      this.onIce(data);
    },
    offer: function(data) {
      // 接收到 answer
      this.onOffer(data);
    }
  },
  mounted() {
    console.log(this.friends[this.nowchat], "当前好友");
    console.log(this.curUsername, "本人");
  }
};
</script>

<style></style>
