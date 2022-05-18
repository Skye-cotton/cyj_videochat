<template>
  <div id="loginWrapper">
    <div>
      <div id="nickWrapper" v-show="isLoginPage">
        <h1>音视频聊天室</h1>
        <h3>登录</h3>
        <div class="formItem">
          <label for="LUsername">用户名：</label>
          <input
            v-model="LUsername"
            @keyup.enter="signIn"
            type="text"
            name="LUsername"
            placeholder="username"
          />
        </div>
        <div class="formItem">
          <label for="LPassword">密码：</label>
          <input
            v-model="LPassword"
            @keyup.enter="signIn"
            type="password"
            name="LPassword"
            placeholder="password"
          />
        </div>
        <div class="formItem">
          <a
            class="toBtn"
            href="javascript:;"
            @click="isLoginPage = !isLoginPage"
            >还没有账号？注册一个吧</a
          >
          <p id="loginBtn" @click="signIn">登录</p>
        </div>
      </div>
      <div id="registWrapper" v-show="!isLoginPage">
        <h1>音视频聊天室</h1>
        <h3>注册</h3>
        <div class="formItem">
          <label for="RUsername">用户名：</label>
          <input
            v-model="RUsername"
            @keyup.enter="signUp"
            type="text"
            name="RUsername"
            placeholder="username"
          />
        </div>
        <div class="formItem">
          <label for="RPassword">密码：</label>
          <input
            v-model="RPassword"
            @keyup.enter="signUp"
            type="password"
            name="RPassword"
            placeholder="password"
          />
        </div>
        <div class="formItem">
          <a
            class="toBtn"
            href="javascript:;"
            @click="isLoginPage = !isLoginPage"
            >已有账号，快去登录吧</a
          >
          <p @click="signUp">注册</p>
        </div>
      </div>
    </div>
    <div
      class="repeatDialog"
      :style="{ display: repeatdialog ? 'block' : 'none' }"
    >
      <div>该账号在另一地点登录，确定继续登录吗？</div>
      <p @click="forceOffLine">确定</p>
      <p @click="repeatdialog = !repeatdialog">取消</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoginPage: true,
      LUsername: "",
      LPassword: "",
      RUsername: "",
      RPassword: "",
      repeatdialog: false
    };
  },
  methods: {
    signUp() {
      if (this.RUsername.trim() === "") {
        alert("用户名不能为空");
      } else if (this.RPassword.trim() === "") {
        alert("密码不能为空");
      } else {
        this.$axios
          .post("/signUp", {
            username: this.RUsername,
            password: this.RPassword
          })
          .then(res => {
            alert(res.data.msg);
            if (res.data.status === 200) {
              this.isLoginPage = !this.isLoginPage;
              this.LUsername = this.RUsername;
            }
          });
      }
    },
    signIn() {
      if (this.LUsername.trim() === "") {
        alert("用户名不能为空");
      } else if (this.LPassword.trim() === "") {
        alert("密码不能为空");
      } else {
        this.$axios
          .post("/signIn", {
            username: this.LUsername,
            password: this.LPassword,
            status: true
          })
          .then(res => {
            console.log(res);
            // alert(res.data.msg)
            if (res.data.status === 200) {
              this.$store.commit("LOGIN_IN", res.data.data);
              this.$socket.emit("signIn", this.LUsername);
              // this.$router.push('/mychat')
              this.$router.push("/");
            } else if (res.data.status === "onLine") {
              this.repeatdialog = true;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    forceOffLine() {
      this.$socket.emit("forceOffLine", this.LUsername);
      this.$axios
        .post("/signIn", {
          username: this.LUsername,
          password: this.LPassword,
          status: true
        })
        .then(res => {
          console.log(res);
          // alert(res.data.msg)
          if (res.data.status === 200) {
            this.$store.commit("LOGIN_IN", res.data.data);
            this.$socket.emit("signIn", this.LUsername);
            this.$router.push("/mychat");
          } else if (res.data.status === "onLine") {
            this.repeatdialog = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  socket: {}
};
</script>
<style scoped>
#loginWrapper {
  padding: 0 20px;
  width: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgb(233, 230, 230);
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
#nickWrapper,
#registWrapper {
  margin-top: 30px;
  margin-bottom: 30px;
}
h1,
h3 {
  text-align: center;
  color: rgb(66, 139, 202);
  letter-spacing: 10px;
}
h1 {
  letter-spacing: 14px;
}
.formItem {
  margin: 10px auto;
  overflow: hidden;
}
label {
  display: inline-block;
  width: 70px;
  text-align: right;
}
input {
  width: auto;
  border: 1px solid rgb(66, 139, 202);
  padding: 5px;
  font-size: 16px;
  border-radius: 3px;
}
.toBtn {
  display: inline-block;
  margin-top: 25px;
  font-size: 14px;
  color: rgb(66, 139, 202);
}
#nickWrapper p,
#registWrapper p {
  padding: 5px 10px;
  background: rgb(66, 139, 202);
  color: white;
  border: 5px;
  cursor: pointer;
  float: right;
}
.repeatDialog {
  width: 200px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  text-align: center;
  padding: 10px;
  border: 1px solid rgb(66, 139, 202);
  border-radius: 5px;
}
.repeatDialog p {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 3px;
  background: rgb(66, 139, 202);
  color: white;
  margin-right: 5px;
  cursor: pointer;
}
</style>
