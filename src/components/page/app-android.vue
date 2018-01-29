<template>
  <div class="app-android">
    <!--灰度总开关-->
    <gray-switch :app-name="appName"></gray-switch>
    <!--版本列表-->
    <el-table :data="tableData" border class="android-version-table">
      <el-table-column prop="VERSION_ID" label="版本号" align="center"></el-table-column>
      <el-table-column prop="CREATE_TIME" label="时间" align="center"></el-table-column>
      <el-table-column label="强制升级" align="center">
        <template slot-scope="scope">
          <el-switch  @change="hasUpGrade(scope.row.IS_FORCE_UPGRADE, scope.row.ID)"  v-model="scope.row.IS_FORCE_UPGRADE"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作方式" align="center">
        <template  slot-scope="scope">
          <el-button type="success" size="small" @click="showChannelDialog(scope.row.ID)">渠道</el-button>
          <el-button type="danger" size="small" @click="deleteApp(scope.row.ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--渠道弹框-->
    <channel-list class="channel-dialog"
                  @amendDialogState="closeChannelDialog"
                  @initChanneList = "initChannelList"
                  :versionId="versionId"
                  :channelListTable="channelListTable"
                  :channel-dialog-state="channelDialogState">
    </channel-list>
    <!--上传文件-->
    <app-upload
      class="app-write-version"
      @initData="initAndroidList"
      :app-name="appName"
      :title="title">
    </app-upload>
  </div>
</template>

<script>
import appUpload from '@/components/common/app-upload'
import channelList from '@/components/page/channel-list-android'
import graySwitch from '@/components/fun/gray-switch'
import devConfig from '@/../config/devconfig'

export default {
  data () {
    return {
      url: devConfig.dev.server,
      tableData: [],
      channelListTable: [],
      appName: 'Android',
      title: '上传APK',
      versionId: '',
      channelDialogState: false
    }
  },
  components: {
    'app-upload': appUpload,
    'channel-list': channelList,
    'gray-switch': graySwitch
  },
  methods: {
    closeChannelDialog: function () {
      this.channelDialogState = false
    },
    showChannelDialog: function (id) {
      this.channelListTable = []
      this.initChannelList(id)
      this.channelDialogState = true
      this.versionId = id
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
          that.initAndroidList()
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
        }).catch(error => {
        that.$message({message: '服务器异常', duration: 1000})
      })
    },
    initAndroidList: function () {//初始化安卓版本列表
      let that = this
      let param = new URLSearchParams()
      this.axios.post(this.url + 'app/androidList', param)
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
          that.$message({message: '服务器异常', duration: 1000})
        })
    },
    initChannelList: function (id) {
      let that = this
      let param = {
        id: id
      }
      this.axios.post(this.url + 'app/channelList', JSON.stringify(param))
        .then(function (response) {
          if (response.data.result === 0) {
            that.channelListTable = response.data.data
          }
        })
        .catch(function (error) {
          that.$message({message: '服务器异常', duration: 1000})
        })
    }
  },
  mounted: function () {
    this.initAndroidList()
  }
}
</script>

<style>
  .app-android{
    padding: 0 10px 0;
  }
  .grid-content{
    min-height: 50px;
    line-height: 50px;
    text-align: center;
  }
</style>
