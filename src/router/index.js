import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  base: '/nongye1',
  routes: [
    {
      path: '/',
      redirect: '/login',
      meta: { title: '登录' },
    },
    {
      path: '/nav',
      component: () => import(/* webpackChunkName: "home" */ '../views/nav/nav.vue'),
      meta: { title: '导航' },
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '首页' },
      children: [
        {
          path: '/dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/dashboard.vue'),
          meta: { title: '主页面' }
        },
        {
          path: '/user',
          component: () => import(/* webpackChunkName: "table" */ '../views/user/user.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: '/authority-manage',
          component: () => import(/* webpackChunkName: "tabs" */ '../views/authority-manage/authority-manage.vue'),
          meta: { title: '权限管理' }
        },
        {
          path: '/project',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/project/project.vue'),
          meta: { title: '项目模块' }
        },
        {
          path: '/video-devices',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/video-devices/video-devices.vue'),
          meta: { title: '视频设备' }
        },
        {
          path: '/temperture',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/temperature/temperture.vue'),
          meta: { title: '土壤温湿度' }
        },
        {
          path: '/control-equipment',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/control-equipment/control-equipment.vue'),
          meta: { title: '控制设备' }
        },
        {
          path: '/flow-equipment',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/flow-equipment/flow-equipment.vue'),
          meta: { title: '流量设备' }
        },
        {
          path: '/alarm-management',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/alarm-management/alarm-management.vue'),
          meta: { title: '通知管理' }
        },
        {
          path: '/device-management',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/device-management/device-management.vue'),
          meta: { title: '设备管理' }
        },
        {
          path: '/video-manage',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/video-manage/video-manage.vue'),
          meta: { title: '视频管理' }
        },
        {
          path: '/manage-point',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/manage-point/manage-point.vue'),
          meta: { title: '管点' }
        },
        {
          path: '/pipe-network',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/pipe-network/pipe-network.vue'),
          meta: { title: '管网' }
        },
        {
          path: '/partition',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/partition/partition.vue'),
          meta: { title: '分区管理' }
        },
        {
          path: '/irrigation-task',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/irrigation-task/irrigation-task.vue'),
          meta: { title: '滴灌任务' }
        },
        {
          path: '/flowmeter',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/flowmeter/flowmeter.vue'),
          meta: { title: '流量计' }
        },
        {
          path: '/channel-flowmeter',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/channel-flowmeter/channel-flowmeter.vue'),
          meta: { title: '流量计' }
        },
        {
          path: '/well-room',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/well-room/well-room.vue'),
          meta: { title: '井房分区管理' }
        },
        {
          path: '/total-temperture',
          component: () => import(/* webpackChunkName: "dashboard" */ '../views/total-temperture/total-temperture.vue'),
          meta: { title: '土壤温湿度' }
        },
        {
          path: '/404',
          component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
          meta: { title: '403' }
        },
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../views/login/login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
