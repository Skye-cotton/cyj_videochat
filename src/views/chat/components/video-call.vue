<template>
    <el-dialog
        title="视频通话"
        :visible="dialogVisible"
        :before-close="handleClose"
        width= "65%"
    >
    <!-- 获取本地媒体 -->
    <video id="video-local" autoplay controls style="width: 90%;"></video> 
    </el-dialog>
</template>
<script>
    export default {
      data() {
        return {
          dialogVisible: true,
          localStream: null
        };
      },
      created() {
        this.InitCamera()
      },
      methods: {
        handleClose() {
          this.dialogVisible = false
      },
      //封装一部分函数
      getUserMedia(constrains, success, error) {
        let promise;
        if (navigator.mediaDevices.getUserMedia) {
            //最新标准API
            promise = navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
        } else if (navigator.webkitGetUserMedia) {
            //webkit内核浏览器
            promise = navigator.webkitGetUserMedia(constrains).then(success).catch(error);
        } else if (navigator.mozGetUserMedia) {
            //Firefox浏览器
            promise = navagator.mozGetUserMedia(constrains).then(success).catch(error);
        } else if (navigator.getUserMedia) {
            //旧版API
            promise = navigator.getUserMedia(constrains).then(success).catch(error);
        }
        return promise;
        },
        canGetUserMediaUse() {
            return !!(navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        },
        InitCamera() {
            if(this.canGetUserMediaUse()){
                this.getUserMedia({
                    video : true,//是否打开视频图像
                    audio: true//是否需要音频
                },(stream) => {
                    this.localStream = stream
                    document.getElementById('video-local').srcObject = stream;
                    
                },(err) => {
                    console.log("访问用户媒体设备失败：", err.name, err.message);
                })
            } else {
                alert('您的浏览器不兼容，建议安装最新版Chrome');
            }
        }
        }
    }
</script>

<style>

</style>