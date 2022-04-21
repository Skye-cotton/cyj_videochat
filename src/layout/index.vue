<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-main>内容展示区域  <router-view /></el-main>
  </el-container>
</template>

<script>
export default {
  name: "index",

}
</script>

<style scoped>
.el-container {
  width:100vw;
  height:100vh;
}
.el-aside {
  background-color: bisque;
  padding:10px;
}
.el-main{
  background-color: #c2b6a7;
  padding:10px;
}

</style>
