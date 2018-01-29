<template>
  <div>
    <el-row align="middle">
      <el-col :span="6"><div class="grid-content"></div></el-col>
      <el-col :span="6"><div class="grid-content"></div></el-col>
      <el-col :span="6">
        <div class="grid-content">
          <el-switch v-model="graySwitch.state" @change="amendSwitchState"></el-switch>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content"><el-button>{{graySwitch.txt}}</el-button></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  props: ['app-name'],
  data: function () {
    return {
      url: devConfig.dev.server,
      graySwitch: {
        state: null,
        txt: '灰度已关闭'
      }
    }
  },
  methods: {
    amendSwitchState: function () {//修改状态
      let that = this
      let param = new URLSearchParams()
      param.append('gray', this.graySwitch.state)
      param.append('type', this.appName)
      this.graySwitch.state ? this.graySwitch.txt = '灰度已打开' : this.graySwitch.txt = '灰度已关闭'
      this.axios.post(this.url + 'app/switchGray', param).then(
        function (response) {
          if (response.data.result === 0 && response.data.data) {
            that.$message({message: '操作成功', duration: 1000})
          } else {
            that.$message({message: '操作失败', duration: 1000})
          }
        }
      ).catch(function (error) {
        console.log(error)
      })
    },
    getSwitchState: function () {//获取状态
      let that = this
      let param = new URLSearchParams()
      this.axios.post(this.url + 'app/getSwitch', param).then(
        function (response) {
          if (response.data.result === 0) {
            let data = response.data.data
            for (let i = 0; i < data.length; i++) {
              if (data[i].PARAMCODE === (that.appName.toLowerCase())) {
                that.graySwitch.state = data[i].CAPTIONCHN === 'true' ? true : false
                data[i].CAPTIONCHN === 'true' ? that.graySwitch.txt = '灰度已打开' : that.graySwitch.txt = '灰度已关闭'
              }
            }
          }
        }
      ).catch(function (error) {
        console.log(error)
      })
    }
  },
  created: function () {
    this.getSwitchState()
  }
}
</script>
