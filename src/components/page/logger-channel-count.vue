<template>
  <div class="list-channel-count">
    <el-button @click="toggleShowStyle = !toggleShowStyle" class="change-show-style">点击切换显示风格</el-button>
    <template v-if="toggleShowStyle">
      <div class="schart" style="width: 100%">
        <schart canvasId="bar" width="500" height="400" :data="chatData" type="bar" :options="options"></schart>
      </div>
    </template>
    <template v-if="!toggleShowStyle">
      <el-table :data="tableData" border>
        <el-table-column prop="CHANNEL_NAME" label="CHANNEL_NAME" align="center"></el-table-column>
        <el-table-column prop="SUM" label="SUM" align="center"></el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'
import Schart from 'vue-schart'

export default {
  data: function () {
    return {
      url: devConfig.dev.server,
      toggleShowStyle: true,
      tableData: [],
      chatData: [],
      options: {
        title: 'APP渠道统计'
      }
    }
  },
  components: {
    Schart
  },
  methods: {
    initChannelCount: function () {
      let param = new URLSearchParams()
      let that = this
      this.axios.post(that.url + 'app/countByChannel', param).then(
        function (response) {
          let data = response.data
          if (data.result === 0) {
            for (let i = 0; i < data.data.length; i++) {
              let obj = {}
              data.data[i].CHANNEL_NAME === null ? data.data[i].CHANNEL_NAME = '其它' : ''
              obj.name = data.data[i].CHANNEL_NAME
              obj.value = data.data[i].SUM
              that.chatData.push(obj)
            }
            that.tableData = data.data
          }
        }
      ).catch(function (error) {
        console.log(error)
      })
    }
  },
  mounted: function () {
    this.initChannelCount()
  }
}
</script>

<style>
.list-channel-count{
  padding: 10px;
}
.change-show-style{
  margin-bottom: 20px;
}
</style>
