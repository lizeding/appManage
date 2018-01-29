<template>
  <div>
    <el-dialog title="渠道" :visible="channelDialogState" width="90%" :before-close="close">
      <!--add android channel-->
      <el-dialog
                 width="90%"
                 title="渠道"
                :visible.sync="addAndroidChannel"
                append-to-body
                :before-close="resetData">

        <el-form :model="form">
          <el-form-item label="渠道名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入渠道名称"></el-input>
          </el-form-item>

          <template v-if="!btnState">
            <el-form-item label="URL" :label-width="formLabelWidth">
              <el-input v-model="form.amendURL" auto-complete="off"></el-input>
            </el-form-item>
          </template>

          <el-form-item label="渠道描述" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>

          <el-form-item label="是否下发" :label-width="formLabelWidth" style="text-align: left;">
            <el-switch
              v-model="form.issue"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

        <template v-if="btnState">
          <el-form-item label="文件上传" :label-width="formLabelWidth">
            <el-switch
              v-model="form.uploadSwitch"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>

          <template v-if="form.uploadSwitch">
            <el-form-item label="" :label-width="formLabelWidth">
              <input type="file"   id="upload"  @change='onUpload'>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="" :label-width="formLabelWidth">
              <el-input v-model="form.writeUrl" auto-complete="off" placeholder="请输入url"></el-input>
            </el-form-item>
          </template>
        </template>
        </el-form>

        <template slot="footer" class="dialog-footer">
          <el-button @click="channelClose">取消</el-button>
          <el-button type="primary" @click="uploadChannel">确认</el-button>
        </template>
      </el-dialog>

      <!--android-->
      <div class="dialog-body">
        <el-row>
          <el-col :span="12">
            <el-button size="small" @click="showAddDialog">添加</el-button>
          </el-col>
          <el-col :span="12">
            <div class="channel-button">
              <el-button size="small" :disabled="btnState" @click="amendChannelInfo">修改</el-button>
              <el-button size="small" :disabled="btnState" @click="deleteChannel">删除</el-button>
              <el-button size="small" :disabled="btnState" @click="showPatchList">补丁</el-button>
              <el-button size="small" :disabled="btnState" @click="channelQRcodeInfo.state = true">生成二维码</el-button>
            </div>
          </el-col>
        </el-row>
        <!--渠道列表-->
        <el-table :data="channelListTable"
                  border
                  highlight-current-row
                  @row-click="selectTableRow">
          <el-table-column prop="CHANNEL_NAME" label="渠道名称"></el-table-column>
          <el-table-column prop="URL" label="渠道链接" class="text-overflow"></el-table-column>
          <el-table-column prop="IS_ISSUE" label="是否下发"></el-table-column>
          <el-table-column prop="CREATE_TIME" label="创建时间" column-key=""></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!--android patch-->
    <channel-patch
      :channelPatchState = "channelPatchState"
      :patchTableData="patchTableData"
      @addPatchForm = "showPatchListDialog">
    </channel-patch>

    <!--android QRcode-->
    <channel-QRcode
      @closeQRDialog="closeQRDialog"
      :channelQRcodeInfo="channelQRcodeInfo">
    </channel-QRcode>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'
import channelPatch from '@/components/page/channel-patch'
import channelQRcode from '@/components/page/channel-QRcode'

export default {
  props: ['channelDialogState', 'channelListTable', 'versionId'],
  components: {
    channelPatch,
    channelQRcode
  },
  data: function () {
    return {
      formLabelWidth: '120px',
      url: devConfig.dev.server,
      addAndroidChannel: false,
      channelPatchState: false,
      btnState: true, //按钮状态
      currentRow: '', //当前row
      channelId: '',
      tableData: [],
      patchTableData: [],
      form: { //form data
        name: '',
        desc: '',
        issue: false,
        uploadSwitch: true,
        file: '',
        writeUrl: '',
        amendURL: ''
      },
      channelQRcodeInfo: {
        state: false,
        platform: 'android',
        url: null
      }
    }
  },
  methods: {
    createQRcode: function () {//生成二维码

    },
    uploadChannel: function () {
      if (this.btnState) {//add channel
        this.uploadChannelInfo()
      } else {
        this.uploadFile()
      }
    },
    deleteChannel: function () {//delete channel
      let that = this
      let param = {
        id: this.channelId
      }
      this.axios.post(this.url + 'app/deleteChannel',
        JSON.stringify(param))
        .then(function (response) {
          if (response.data.result === 0) {
            that.$message({message: '操作成功', duration: 1000})
            that.$emit('initChanneList', that.versionId)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    channelClose: function () {//close dialog
      if (this.btnState) {
        this.addAndroidChannel = false
      } else {
        this.resetData()
      }
    },
    resetData: function () {
      this.addAndroidChannel = false
      this.form.uploadSwitch = true
      this.form.issue = false
      this.btnState = true
      this.form.name = ''
      this.form.desc = ''
      this.form.amendURL = ''
      this.form.file = ''
      this.form.writeUrl = ''
    },
    amendChannelInfo: function () { //amend channel info
      this.addAndroidChannel = true
      this.form.name = this.currentRow.CHANNEL_NAME
      this.form.desc = this.currentRow.UPGRADE_POINT
      this.form.amendURL = this.currentRow.URL
      this.form.issue = (this.currentRow.IS_ISSUE === '是'? true : false)
    },
    selectTableRow (row) { //table row select
      if (row) {
        this.btnState = false
        this.currentRow = row
        this.channelId = this.currentRow.ID
        this.channelQRcodeInfo.url = devConfig.dev.createQRcode + this.currentRow.URL
      }
    },
    showAddDialog: function () { //add event
      this.btnState = true
      this.addAndroidChannel = true
    },
    close: function () {//关闭渠道对话框
      this.$emit('amendDialogState')
    },
    onUpload: function (event) { //input file change事件
      let file = event.target.files[0]
      this.form.file = file
    },
    uploadChannelInfo: function () { //上传文件
      if (this.form.name === '' || this.form.desc === '') {
        this.$message({message: '请输入关键字段', duration: 1000})
        return
      }
      if (this.form.uploadSwitch) {
        if (this.form.file === '') {
          this.$message({message: '请选择上传文件', duration: 1000})
        } else {
          let formData = new FormData()
          let that = this
          formData.append('file', this.form.file)
          this.axios.post(this.url + 'app/file/upload', formData)
            .then(function (reponse) {
              if (reponse.data.result === 0) {
                that.uploadFile(reponse.data.data)
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }
      } else {
        if (this.form.writeUrl === '') {
          this.$message({message: '请手动输入url', duration: 1000})
        } else {
          this.uploadFile(this.form.writeUrl)
        }
      }
    },
    uploadFile: function (url) {//上传渠道
      let param = new URLSearchParams()
      let that = this
      let queryAddress = 'app/addAndroidChannel'
      let id = this.versionId
      if (!this.btnState) {
        url = this.form.amendURL
        queryAddress = 'app/updateChannel'
        id = this.channelId
      }
      param.append('channel_name', this.form.name)
      param.append('upgrade_point', this.form.desc)
      param.append('is_issue', this.form.issue ? '是' : '否')
      param.append('url', url)
      param.append('id', id)
      this.axios.post(this.url + queryAddress, param)
        .then(function (response) {
          if (response.data.result === 0) {
            that.$message({message: '操作成功', duration: 2000})
            that.channelClose()
            that.$emit('initChanneList', that.versionId)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    showPatchListDialog: function () {
      this.channelPatchState = false
    },
    showPatchList: function () {//补丁list
      this.channelPatchState = true
      let that = this
      let params = {
        CHANNELID: this.channelId
      }
      this.axios.post(this.url + 'manage/patchList', JSON.stringify(params))
        .then(function (response) {
          console.log(response)
          if (response.data.result === 0) {
            that.patchTableData = response.data.data
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    closeQRDialog: function () {
      this.channelQRcodeInfo.state = false
    }
  }
}
</script>

<style>
  .el-row{
    /*margin-bottom: 30px;*/
  }
  .channel-button{
    text-align: right;
    margin-bottom: 30px
  }
  .el-dialog__header{
    text-align: center;
  }
  .el-table .cell{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
