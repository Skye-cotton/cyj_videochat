<template>
  <div class="container">
    <div class="photo">
      <el-image :src="userPhote" fit="fill"> </el-image>
    </div>
    <div class="chat" @click="handleChat" :class="{ active: activeChat }">
      <i class="el-icon-chat-round"></i>
    </div>
    <div class="edit" @click="handleEdit" :class="{ active: activeEdit }">
      <i class="el-icon-edit-outline"></i>
    </div>
    <!-- <div
      class="videochat"
      @click="handleVideoChat"
      :class="{ active: activeVideoChat }"
    >
      <i class="el-icon-video-camera"></i>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "asideHandle",
  data() {
    return {
      activeChat: false,
      activeEdit: false,
      activeVideoChat: false
    };
  },
  computed: {
    userPhote: function() {
      return this.$store.state.headImg;
    }
  },
  methods: {
    handleChat() {
      this.activeChat = !this.activeChat;
      this.activeEdit = false;
      this.$router.push("/chat");
    },
    handleEdit() {
      this.activeEdit = !this.activeEdit;
      this.activeChat = false;
      this.$router.push("/editInfo");
    }
    // handleVideoChat() {
    //   this.activeVideoChat = !this.activeVideoChat;
    //   this.activeChat = false;
    //   this.$router.push("/videochat");
    // }
  }
};
</script>

<style scoped lang="scss">
//TODO 使用绝对路径来引入scss文件
@import "../../style/index.scss";
.container {
  padding: 20px 10px;
  .photo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
  }
  .chat,
  .edit,
  .videochat {
    padding: 20px 10px;
    font-size: 46px;
    text-align: center;
    color: white;
    cursor: pointer;
    &.active {
      color: $active-color;
    }
  }
}
</style>
