<template>
  <div>
    <ul id="user-list">
      <li>用户12</li>
      <li>用户34</li>
      <li>用户56</li>
    </ul>
    <!-- 获取本地媒体 -->
    <video id="video-local" autoplay controls style="width: 50%;"></video>

    <div id="videos" autoplay controls style="width: 50%;"></div>
  </div>
</template>
<script>
export default {
  data() {},
  sockets: {
    connect(data) {
      console.log(data, "---data---");
    }
  }
};
</script>
