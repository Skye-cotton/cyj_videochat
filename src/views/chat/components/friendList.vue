<template>
  <div class="container">
    <el-row>
      <el-button type="primary" @click="showAddFriend">添加好友</el-button>
    </el-row>

    <div v-if="friends.length">
      <el-row
        v-for="(item, $index) in friends"
        class="friend-list"
        :key="$index"
        :class="{ active: $index === activeFlag }"
        @click.native="handleClick($index)"
      >
        <el-col :span="5" class="photo">
          <el-image :src="userPhote" fit="fill"> </el-image>
        </el-col>
        <el-col :span="18" class="username">
          {{ item.username }}
        </el-col>
      </el-row>
    </div>
    <el-empty description="暂无数据" v-else></el-empty>
    <!-- 添加好友弹窗-->
    <el-dialog
      title="添加好友"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addFriend">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "friendList",
  data() {
    return {
      activeFlag: null,
      dialogVisible: false,
      ruleForm: {
        name: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    // 好友列表
    friends: function() {
      console.log(99999, this.$store.state.friends);
      return this.$store.state.friends;
    },
    // TODO 头像逻辑优化，如果没有头像则取默认头像
    userPhote: function() {
      return this.$store.state.headImg;
    }
  },
  methods: {
    handleClick(index) {
      this.activeFlag = index;
    },
    // 添加好友
    addFriend() {
      this.$axios
        .post("/addFriend", {
          username: this.$store.state.username,
          friend: this.ruleForm.name
        })
        .then(res => {
          const { data } = res;
          if (data.status === 200) {
            this.$store.commit("updateFriends", data.data);
            // this.friends = data.data
            this.$socket.emit("updateFriends", this.curUsername, this.friend);
          } else {
            this.$message({
              showClose: true,
              message: data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showAddFriend() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
    }
  },
  mounted() {
    // 默认选中进来的第一个
    if (this.friends.length) {
      this.activeFlag = 0;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../style/index.scss";

.container {
  text-align: center;
  .el-button {
    background-color: $active-color;
    width: 160px;
    margin-bottom: 20px;
  }
  .friend-list {
    padding: 10px;
    cursor: pointer;
    &.active {
      background-color: $active-bg;
    }
    .photo {
      width: 40px;
      height: 40px;
      overflow: hidden;
    }
    .username {
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>
