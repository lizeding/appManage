<template>
  <div class="addGrayMember">
    <el-form>
      <el-form-item label="添加方式">
        <el-select  placeholder="请选择添加方式" v-model="form.addWay" name="conAdd" @change="amendPromptText">
          <el-option label="条件添加" value="conAdd"></el-option>
          <el-option label="无级别添加" value="noLevelAdd"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="form.promptMessage">
        <el-input v-model="form.number"></el-input>
      </el-form-item>

    </el-form>
    <el-button type="primary" clas="submit-btn" @click="addGrayMember" v-loading.fullscreen="fullscreenLoading" >提交</el-button>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  data: function () {
    return {
      url: devConfig.dev.server,
      fullscreenLoading: false,
      form: {
        addWay: '',
        number: '',
        promptMessage: '请输入手机号码或会员号'
      }
    }
  },
  methods: {
    amendPromptText: function () {
      if (this.form.addWay === 'noLevelAdd') {
        this.form.promptMessage = '请输入添加总人数'
      } else {
        this.form.promptMessage = '请输入手机号码或会员号'
      }
    },
    addGrayMember: function () {
      if (this.form.number === '') {
        this.$message({message: '请输入关键字段', duration: 1000})
        return
      }
      let postAddress, param, that = this
      if (this.form.addWay === 'conAdd') {
        postAddress = 'app/addGrayByMobile'
        param = {
          mobile: this.form.number
        }
      } else {
        postAddress = 'app/addAppGray'
        param = {
          num: this.form.number
        }
      }
      this.fullscreenLoading = true
      this.axios.post(this.url + postAddress, JSON.stringify(param))
        .then(function (response) {
          that.fullscreenLoading = false
          if (response.data.data && response.data.result === 0) {
            that.$message({message: '提交成功', duration: 1000})
            that.form.number = ''
          } else {
            that.$message({message: '提交失败', duration: 1000})
          }
        })
        .catch(function (error) {
          that.fullscreenLoading = false
          console.log(error)
        })
    }
  },
  mounted: function () {
    this.form.addWay = 'conAdd'
  }
}
</script>

<style>
  .addGrayMember{
    margin: 20px 0 0 20px;
    width: 50%;
  }
</style>
