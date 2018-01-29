<template>
  <div class="logger-list">
   <el-table :data="tableData" border v-loading="loading">
     <el-table-column prop="CHANNEL_NAME" label="CHANNEL_NAME" align="center"></el-table-column>
     <el-table-column prop="CON_ID" label="CON_ID" align="center"></el-table-column>
     <el-table-column prop="CREATE_DT" label="创建时间" align="center"></el-table-column>
     <el-table-column prop="NEW_VERSION" label="NEW_VERSION" align="center"></el-table-column>
     <el-table-column prop="OLD_VERSION" label="OLD_VERSION" align="center"></el-table-column>
     <el-table-column prop="TYPE" label="平台" align="center"></el-table-column>
   </el-table>
  <template v-if="tableData.length">
    <div class="logger-list-page">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change = "pageTurning"
        :total="pageCount">
      </el-pagination>
    </div>
  </template>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  data: function () {
    return {
      url: devConfig.dev.server,
      loading: false,
      tableData: [],
      pageNumber: 1,
      pageSize: 8,
      pageCount: null
    }
  },
  methods: {
    pageTurning: function (num) {//翻页
      this.initData(num)
    },
    initData: function (pageNumber) {//日志列表
      let that = this
      let param = {
        pageNumber: pageNumber + '',
        pageSize: this.pageSize + ''
      }
      this.loading = true
      this.axios.post(this.url + 'app/loggerList', JSON.stringify(param)).then(function (response) {
        that.loading = false
        let data = response.data
        if (data.result === 0) {
          let list = data.data.list
          for (let i = 0; i < list.length; i++) {
            list[i].CHANNEL_NAME === null ? list[i].CHANNEL_NAME = '其它' : ''
          }
          that.tableData = list
          that.pageCount = data.data.totalPage
        }
      }).catch(function (error) {
        that.loading = false
        console.log(error)
      })
    }
  },
  mounted: function () {
    this.initData(this.pageNumber)
  }
}
</script>

<style>
.logger-list{
  padding: 10px;
}
.logger-list-page{
  text-align: right;
}
.logger-list-page  .el-pagination{
  padding-right: 0;
  margin-top: 10px;
}
</style>
