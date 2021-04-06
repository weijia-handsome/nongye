import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import 'babel-polyfill';
import echarts from 'echarts';
import AMap from 'vue-amap';
import moment from 'moment';
import VideoPlayer from 'vue-video-player';
import 'video.js/dist/video-js.css';
import 'lib-flexible';
import axios from 'axios';
import './assets/iconfont/iconfont.css';
import './utils/rem';

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(VideoPlayer);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.use(AMap);
 // 初始化vue-amap
// AMap.initAMapApiLoader({
//   // 高德key
//   // key: '24367191b36f016dc568dd9f6a8ea3d3',
//   // 插件集合 （插件按需引入）
//   // plugin: ['AMap.Geolocation']
//   plugin: ['AMap.Geocoder','AMap.Geolocation','AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
// });
Vue.prototype.$echarts = echarts;
Vue.prototype.$moment = moment;
// //使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | vue-manage-system`;
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// });

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
