<template>
  <div class="aside-menu">
    <el-menu default-active="ios" class="el-menu-vertical-demo"  unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index">
            <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index">
            <i :class="item.icon"></i>{{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      items: [
        {
          icon: 'el-icon-menu',
          index: '1',
          title: 'APP版本管理',
          subs: [{index: 'android', title: 'Android'}, {index: 'ios', title: 'Ios'}]
        },
        {
          icon: 'el-icon-setting',
          index: '2',
          title: '灰度控制',
          subs: [{index: 'addGrayList', title: '灰度添加'}, {index: 'delGrayMember', title: '灰度删除'}]
        },
        {icon: 'el-icon-picture', index: 'advManage', title: '广告管理'},
        {
          icon: 'el-icon-menu',
          index: 'a',
          title: '日志列表',
          subs: [{index: 'loggerList', title: '日志'}, {index: 'channelCount', title: '渠道统计'}, {index: 'randomChannel', title: '随机渠道'}]
        },
        {icon: 'el-icon-document', index: 'appGeneralize', title: 'APP-推广页面'}
      ]
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  }
}
</script>

<style>
  .aside-menu {
    position: absolute;
    width: 170px;
    left: 0;
    top: 60px;
    bottom: 0;
  }

  .aside-menu > ul {
    height: 100%;
  }
</style>
