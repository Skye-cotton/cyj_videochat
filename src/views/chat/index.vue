<template>
  <el-container>
    <el-aside width="200px" class="asideList">
      <friendList/>
    </el-aside>
    <el-main>
      <chat-container/>
    </el-main>
  </el-container>
</template>

<script>
import friendList from './components/friendList'
import chatContainer from './components/chatContainer'
export default {
  name: "chat",
  components: {
    friendList,
    chatContainer
  }
}
</script>

<style scoped lang="scss">
.el-container {
  color: #546077;
  height: 100vh;
  .el-aside{
    background-color: #e0dfde;
    padding: 20px 0;
  }
  .el-main{
    background-color: #f5f5f5;
    //padding: 20px 5px;
    width: calc(100% - 300px);
  }
}

</style>
