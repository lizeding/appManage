import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/common/app-home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {path: '/android', component: resolve => require(['@/components/page/app-android'], resolve)},
        {path: '/ios', component: resolve => require(['@/components/page/app-ios'], resolve)},
        {path: '/advManage', component: resolve => require(['@/components/page/adv-manage'], resolve)},
        {path: '/appGeneralize', component: resolve => require(['@/components/page/app-generalize'], resolve)},
        {path: '/addGrayList', component: resolve => require(['@/components/page/graylist-add'], resolve)},
        {path: '/delGrayMember', component: resolve => require(['@/components/page/graylist-delete'], resolve)},
        {path: '/loggerList', component: resolve => require(['@/components/page/logger-list'], resolve)},
        {path: '/channelCount', component: resolve => require(['@/components/page/logger-channel-count'], resolve)},
        {path: '/randomChannel', component: resolve => require(['@/components/page/logger-random-channel'], resolve)}
      ]
    }
  ]
})
