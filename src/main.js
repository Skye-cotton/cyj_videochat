// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuex from "vuex";
import store from "./store";
import axios from "axios";
import VueSocketio from "vue-socket.io";
// import info from '../config/info'
// TODO 全局引入element-ui ,后面优化改成按需引入
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Element, { size: "small", zIndex: 3000 });

Vue.config.productionTip = false;

const localUrl = "https://192.168.150.8";
// 公司：192.168.150.8
// 公司宿舍：192.168.181.51

Vue.use(VueSocketio, localUrl);

Vue.use(Vuex);
Vue.prototype.$axios = axios;

// 设置http拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    config.url = localUrl + config.url;
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
