<template>
  <div class="gray-member-list">
    <template v-if="tableData.length">
      <div class="search-box">
        <el-input type="input" v-model="searchWord" placeholder="请输入会员号"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchGrayMember">点击搜索</el-button>
      </div>
    </template>

    <el-table  :data="tableData"  style="box-sizing: border-box" v-loading="loading">
      <el-table-column prop="CON_NAME" label="会员名" align="center"></el-table-column>
      <el-table-column prop="CON_NO" label="会员号" align="center"></el-table-column>
      <el-table-column prop="CON_ID" label="会员ID" align="center"></el-table-column>
      <el-table-column prop="IS_DEV" label="是否开启开发者模式" align="center">
        <template slot-scope="scope">
           <el-switch v-model="scope.row.IS_DEV" @change="devMode(scope.row.CON_ID, scope.row.IS_DEV)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="delGrayMember(scope.row.CON_ID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="gray-list-page">
      <template v-if="tableData.length">
        <el-button type="primary" size="small" @click="clearGrayList">清除灰度列表</el-button>
        <el-pagination
          layout="prev, pager, next"
          :page-count="pageCount"
          @current-change="pageTurning"
          :current-page="pageNumber">
        </el-pagination>
      </template>
    </div>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  data: function () {
    return {
      url: devConfig.dev.server,
      loading: false,
      searchWord: '',
      pageCount: null,
      tableData: [],
      pageNumber: 1,
      pageSize: 8
    }
  },
  methods: {
    clearGrayList: function () {
      this.$confirm('此操作将清空灰度列表, 是否继续?', '提示', {//清除灰度列表
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let param = new URLSearchParams()
        let that = this
        this.axios.post(this.url + 'manage/delAllGray', param)
          .then(function (response) {
            if (response.data.data.length === 0) {
              that.$message({message: '清除成功', duration: 1000})
              that.tableData = []
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      })
    },
    searchGrayMember: function () {//搜索灰度会员
      let CONNO = this.searchWord.trim()
      let param
      let that = this
      if (CONNO === '') {
        this.$message({message: '请输入会员号', duration: 1000})
      } else {
        param = {
          CONNO: CONNO
        }
        this.axios.post(this.url + 'manage/searchByConNO', JSON.stringify(param))
          .then(function (response) {
            let data = response.data.data
            if (data.length !== 0) {
              for (let i = 0; i < data.length; i++) {
                data[i].IS_DEV === '1' ? data[i].IS_DEV = true : data[i].IS_DEV = false
              }
              that.tableData = data
            } else if (response.data.data === null) {
              that.$message({message: '无资料, 请确认会员号', duration: 1000})
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    devMode: function (id, STATUE) {//开发者模式
      let that = this
      let param = {
        CONID: id,
        STATUE: STATUE ? '1' : '0'
      }
      this.axios.post(this.url + 'manage/updateDev', JSON.stringify(param))
        .then(function (response) {
          if (response.data.result === 0) {
            that.$message({message: '操作成功', duration: 1000})
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    delGrayMember: function (id) {//删除灰度会员
      let that = this
      let param = {
        con_id: id + ''
      }
      this.axios.post(this.url + 'app/deleteGrayByConId', JSON.stringify(param))
        .then(function (response) {
          if (response.data.result === 0) {
            that.$message({message: '操作成功', duration: 1000})
            that.initGrayMemberList(that.pageNumber)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    pageTurning: function (currentPage) {
      this.pageNumber = currentPage
      this.initGrayMemberList(currentPage)
    },
    initGrayMemberList: function (number) {//灰度列表
      let that = this
      let param = {
        pageNumber: number + '',
        pageSize: this.pageSize + ''
      }
      this.loading = true
      this.axios.post(this.url + 'app/grayList', JSON.stringify(param))
        .then(function (response) {
          that.loading = false
          if (response.data.result === 0) {
            let list = response.data.data.list
            for (let i = 0; i < list.length; i++) {
              list[i].IS_DEV === '1' ? list[i].IS_DEV = true : list[i].IS_DEV = false
            }
            that.tableData = list
            that.pageCount = Number(response.data.data.totalPage)
          }
        })
        .catch(function (error) {
          that.loading = false
          console.log(error)
        })
    }
  },
  mounted: function () {
    this.initGrayMemberList(this.pageNumber)
  }
}
</script>

<style>
  .gray-member-list{
    padding: 10px;
  }
  .search-box{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
  }
  .search-box .el-input{
    width: 30%;
    margin-right: 10px;
  }
  .gray-list-page{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .gray-list-page .el-pagination{
    padding-right: 0;
    padding-left: 0;
  }
</style>
