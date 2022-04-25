<template>
  <div class="home-container">
    <el-row>
      <el-button type="primary" @click="handleClick(1)">编辑资料</el-button>
      <el-button type="success" @click="handleClick(2)">进入聊天</el-button>
      <el-button type="info" @click="handleClick(3)">添加好友</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    handleClick(flag) {
      switch (flag) {
        case 1:
          this.$router.push("/editInfo");
          break;
        case 2:
          this.$router.push("/mychat");
          break;
        case 3:
          this.$router.push("/addFriends");
          break;
      }
    }
  }
};
</script>

<style scoped></style>
