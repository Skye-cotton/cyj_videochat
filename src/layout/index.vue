<template>
  <el-container>
    <el-aside width="100px" class="asideHandle">
      <aside-handle/>
    </el-aside>
    <el-main><router-view :key="key" /></el-main>
  </el-container>
</template>

<script>
import asideHandle from  './components/asideHandle'
import asideList from './components/asideList'
export default {
  name: "index",
  components: {
    asideHandle,
    asideList
  },
  computed: {
    key() {
      return this.$route.path
    }
  }

}
</script>

<style scoped lang="scss">

.el-container {
  .el-aside.asideHandle{
    background-color: #444646;
    height: 100vh;
    }
  .el-main{
    background-color: #f5f5f5;
    //padding:10px;
    padding:0;
    color: white;
  }
}


</style>
