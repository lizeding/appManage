<template>
  <div>
    <el-dialog title="渠道" :visible="channelInfo.state" width="90%" :before-close="closeDialog">
      <div class="ios-channel-list">
        <el-row>
          <el-col :span="12">
            <el-button  type="small">添加</el-button>
          </el-col>
          <el-col :span="12">
           <div class="ios-list-button">
             <el-button type="small">修改</el-button>
             <el-button type="small">删除</el-button>
             <el-button type="small">二维码</el-button>
           </div>
          </el-col>
        </el-row>
      </div>
      <!--ios-channel-list-->
      <el-table>
        <el-table-column prop="CHANNEL_NAME" label="渠道名称"></el-table-column>
        <el-table-column prop="URL" label="渠道连接"></el-table-column>
        <el-table-column prop="IS_ISSUE" label="是否下发"></el-table-column>
        <el-table-column prop="CREATE_TIME" label="创建时间"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  props: ['channelInfo'],
  data: function () {
    return {
      url: devConfig.dev.server,
      tableData: []
    }
  },
  methods: {
    closeDialog: function () {
      this.$emit('closeChannelList')
    },
    initChannelList: function () {
      let that = this
      let content = {
        id: this.channelInfo.channelID + ''
      }
      this.axios.post(this.url + 'app/channelList', JSON.stringify(content)).then(
        function (response) {
          console.log(response)
          if (response.data.result === 0 && (response.data.data).length !== 0) {
            that.tableData = response.data.data
          }
        }
      ).catch(function (error) {
        console.log(error)
      })
    }
  },
  mounted: function () {//初始化列表
    this.initChannelList()
  }
}
</script>

<style>
  .ios-list-button{
    text-align: right;
    margin-bottom: 20px;
  }
</style>
