<template>
  <div class="list-random-count">
    <el-table :data="tableData" border>
      <el-table-column prop="android" label="android" align="center"></el-table-column>
      <el-table-column prop="ios" label="ios" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  data: function () {
    return {
      url: devConfig.dev.server,
      tableData: []
    }
  },
  methods: {
    initChannelCount: function () {
      let param = new URLSearchParams()
      let that = this
      this.axios.post(that.url + 'app/randomChannel', param).then(
        function (response) {
          if (response.data.result === 0) {
            that.tableData.push(response.data.data)
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
  .list-random-count{
    padding: 10px;
  }
</style>
