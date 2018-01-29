<template>
  <div class="app-ios">
    <!--灰度总开关-->
    <gray-switch :app-name="appName"></gray-switch>
    <!--app版本列表-->
    <el-table :data="tableData" border>
      <el-table-column prop="VERSION_ID" label="版本号" align="center"></el-table-column>
      <el-table-column prop="CREATE_TIME" label="时间" align="center"></el-table-column>
      <el-table-column label="强制升级" align="center">
        <template slot-scope="scope" >
          <el-switch  @change="hasUpGrade(scope.row.IS_FORCE_UPGRADE, scope.row.ID)"  v-model="scope.row.IS_FORCE_UPGRADE"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作方式" align="center">
        <template  slot-scope="scope">
          <el-button type="success" size="small" @click="showChannelList(scope.row.ID)">渠道</el-button>
          <el-button type="danger" size="small" @click="deleteApp(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--channel-list-->
    <channel-list
      @closeChannelList="closeChannelList"
      :channelInfo="channelListInfo"></channel-list>

    <!--上传组件-->
    <app-upload
      class="app-write-version"
      @initData="initIosList"
      :appName="appName"
      title="上传IPD">
    </app-upload>
  </div>
</template>

<script>
import appUpload from '@/components/common/app-upload'
import channelList from '@/components/page/channel-list-ios'
import graySwitch from '@/components/fun/gray-switch'
import devConfig from '@/../config/devconfig'

export default {
  data: function () {
    return {
      url: devConfig.dev.server,
      tableData: [],
      upgrade: true,
      appName: 'ios',
      channelListInfo: {
        state: false,
        channelID: null
      }
    }
  },
  components: {
    'app-upload': appUpload,
    'gray-switch': graySwitch,
    'channel-list': channelList
  },
  methods: {
    showChannelList: function (id) {//显示渠道列表
      this.channelListInfo.state = true
      this.channelListInfo.channelID = id
    },
    closeChannelList: function () {//关闭列表
      this.channelListInfo.state = false
    },
    deleteApp: function (id) {//删除app
      let that = this
      let param = {
        id: id
      }
      that.axios.post(this.url + 'app/deleteApp', JSON.stringify(param)
      ).then(function (response) {
        if (response.data.result === 0) {
          that.$message({message: '删除成功', duration: 1000})
          that.initIosList()
        }
      }).catch(function (err) {
        that.$message.error('服务器异常')
      })
    },
    hasUpGrade: function (state, id) {  //强制升级
      let param = new URLSearchParams()
      let that = this
      state ? state = '是' : state = '否'
      param.append('id', id)
      param.append('is_force_upgrade', state)
      this.axios.post(this.url + 'app/updateApp', param)
        .then(response => {
          if (response.data.result === 0) {
            that.$message({message: '修改成功', duration: 1000})
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    initIosList: function () {//初始化ios版本列表
      let that = this
      let param = new URLSearchParams()
      this.axios.post(this.url + 'app/iosList', param)
        .then(function (response) {
          let data = response.data
          if (data.result === 0) {
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].IS_FORCE_UPGRADE === '是') {
                data.data[i].IS_FORCE_UPGRADE = true
              } else {
                data.data[i].IS_FORCE_UPGRADE = false
              }
            }
            that.tableData = data.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  mounted: function () {
    this.initIosList()
  }
}
</script>

<style>
  .app-ios{
    padding:0 10px 0;
  }
  .grid-content{
    min-height: 50px;
    line-height: 50px;
    text-align: center;
  }
</style>
