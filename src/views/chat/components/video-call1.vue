<template>
  <el-dialog
    title="视频通话"
    :visible="dialogVisible"
    :before-close="handleClose"
    width="65%"
  >
    <!-- 获取本地媒体 -->
    <video id="video-local" autoplay controls style="width: 90%;"></video>

    <div id="videos" autoplay controls style="width: 50%;"></div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: true,
      localStream: null,
      iceServer: {
        iceServers: [
          {
            urls: ["stun:hk-turn1.xirsys.com"]
          },
          {
            username:
              "YS8X1jeKFhtN0q6Egh5FLukCVUgelk5bFWaT9BvGzgV6AqxsCob5SV5whnY0MUOgAAAAAGJj5np4aWFvY2hlbg==",
            credential: "a74740fc-c2fa-11ec-8ce1-0242ac120004",
            urls: [
              "turn:hk-turn1.xirsys.com:80?transport=udp",
              "turn:hk-turn1.xirsys.com:3478?transport=udp",
              "turn:hk-turn1.xirsys.com:80?transport=tcp",
              "turn:hk-turn1.xirsys.com:3478?transport=tcp",
              "turns:hk-turn1.xirsys.com:443?transport=tcp",
              "turns:hk-turn1.xirsys.com:5349?transport=tcp"
            ]
          }
        ]
      },
      pc: []
    };
  },
  created() {
    this.StartCall(null, true);
    this.InitCamera();
  },
  mounted() {
    this.$socket.emit("connection");
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },

    StartCall(parterName, createOffer) {
      this.pc[parterName] = new RTCPeerConnection(this.iceServer);
      console.log(this.pc[parterName], "partername");

      // 本地流
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          this.pc[parterName].addTrack(track, this.localStream);
        });
      } else {
        // 否则 需要重新启动摄像头并获取
        if (this.canGetUserMediaUse()) {
          this.getUserMedia(
            {
              video: true,
              audio: false
            },
            stream => {
              this.localStream = stream;
              document.getElementById("video-local").srcObject = stream;
            },
            err => {
              console.log("访问用户媒体设备失败：", err.name, err.message);
            }
          );
        } else {
          alert("您的浏览器不兼容，建议安装最新版Chrome");
        }
      }

      // 如果是呼叫方，那么需要createOffer请求
      if (createOffer) {
        console.log(createOffer, "-------");
        // 每当webRTC基础结构需要重新启动会话协商过程时，都会调用此函数。
        // 它的工作是：创建和发送一个请求给被叫方，要求与我们联系
        this.pc[parterName].onnegotiationneeded = () => {
          // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
          this.pc[parterName]
            .createOffer()
            .then(offer => {
              return this.pc[parterName].setLocalDescription(offer);
            })
            .then(() => {
              // 把发起者的描述信息通过signal Server发送到接受者
              socket.emit("sdp", {
                type: "video-offer",
                description: this.pc[parterName].localDescription,
                to: parterName,
                sender: socket.id
              });
            });
        };
      }
      // 当需要你通过信令服务器将一个ICE候选发送给另一个对等端时，本地ICE层将会调用你的icecandidate事件
      this.pc[parterName].onicecandidate = ({ candidate }) => {
        socket.emit("iceCandidates", {
          candidate: candidate,
          to: parterName,
          sender: socket.id
        });
      };
      // 当向连接中添加磁道时，track事件的此处理程序由本地webRTC层调用。例如，
      // 可以将传入媒体连接到元素以显示它
      this.pc[parterName].ontrack = ev => {
        let str = ev.streams[0];
        // if (document.getElementById(`${parterName}-video`)) {
        //   document.getElementById(`${parterName}-video`).srcObject = str;
        // } else {
        let newVideo = document.createElement("video");
        newVideo.id = `${parterName}-video`;
        newVideo.autoplay = true;
        newVideo.controls = true;
        newVideo.srcObject = str;

        document.getElementById("videos").appendChild(newVideo);
        // }
      };
    },

    //封装一部分函数
    getUserMedia(constrains, success, error) {
      let promise;
      if (navigator.mediaDevices.getUserMedia) {
        //最新标准API
        promise = navigator.mediaDevices
          .getUserMedia(constrains)
          .then(success)
          .catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit内核浏览器
        promise = navigator
          .webkitGetUserMedia(constrains)
          .then(success)
          .catch(error);
      } else if (navigator.mozGetUserMedia) {
        //Firefox浏览器
        promise = navagator
          .mozGetUserMedia(constrains)
          .then(success)
          .catch(error);
      } else if (navigator.getUserMedia) {
        //旧版API
        promise = navigator
          .getUserMedia(constrains)
          .then(success)
          .catch(error);
      }
      return promise;
    },
    canGetUserMediaUse() {
      return !!(
        navigator.mediaDevices.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      );
    },
    InitCamera() {
      if (this.canGetUserMediaUse()) {
        this.getUserMedia(
          {
            video: true, //是否打开视频图像
            audio: true //是否需要音频
          },
          stream => {
            this.localStream = stream;
            document.getElementById("video-local").srcObject = stream;
          },
          err => {
            console.log("访问用户媒体设备失败：", err.name, err.message);
          }
        );
      } else {
        alert("您的浏览器不兼容，建议安装最新版Chrome");
      }
    }
  },
  sockets: {
    connect(data) {
      console.log(data, "data");
    },
    sdp: function(data) {
      // 如果是offer类型的sdp
      if (data.description.type === "offer") {
        // 那么被呼叫者需要开启RTC的一套流程，同时不需要createOffer，所以第二个参数为false
        StartCall(data.sender, false);
        // 把发送者（offer）的描述，存储在接受者的remoteDesc中
        let desc = new RTCSessionDescription(data.description);
        // 按上面流程走
        pc[data.sender].setRemoteDescription(desc).then(() => {
          pc[data.sender]
            .createAnswer()
            .then(answer => {
              return pc[data.sender].setLocalDescription(answer);
            })
            .then(() => {
              socket.emit("sdp", {
                type: "video-answer",
                description: pc[data.sender].localDescription,
                to: data.sender,
                sender: socket.id
              });
            })
            .catch();
        });
      } else if (data.description.type === "answer") {
        // 如果是应答类消息（接收到这个事件的是呼叫者）
        let desc = new RTCSessionDescription(data.description);
        pc[data.sender].setRemoteDescription(desc);
      }
    },

    iceCandidates: function(data) {
      console.log("ice candidate:" + data.candidate);
      // 判断ice candidate非空，当candidate为空时，本次协商流程到此结束
      if (data.candidate) {
        var candidate = new RTCIceCandidate(data.candidate);
        // 将对方发来的协商信息保存
        pc[data.sender].addIceCandidate(candidate).catch();
      }
    }
  }
};
</script>

<style></style>
