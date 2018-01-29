<template>
  <div>
    <el-button type="text" @click="dialogFormVisible = true">{{appName}}</el-button>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="90%">

      <el-form :model="form">
        <el-form-item label="版本名" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入版本名"></el-input>
        </el-form-item>

        <el-form-item label="版本号" :label-width="formLabelWidth">
          <el-input v-model="form.version" auto-complete="off" placeholder="请输入版本号"></el-input>
        </el-form-item>

        <el-form-item label="是否强制升级" :label-width="formLabelWidth" style="text-align: left;">
          <el-switch
            v-model="form.hasUpgrade"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item label="来源" :label-width="formLabelWidth">
          <el-input v-model="appName" auto-complete="off" placeholder="Android"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addChannelVersion()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  props: ['appName', 'title'],
  data () {
    return {
      dialogFormVisible: false,
      form: {
        name: '',
        version: '',
        hasUpgrade: ''
      },
      formLabelWidth: '120px',
      url: devConfig.dev.server
    }
  },
  computed: {
    appUploadType: function () {
      return this.appName === 'Android'?  'Android' : 'IOS'
    }
  },
  methods: {
    addChannelVersion: function () {
      let that = this
      if (this.form.name === '' || this.form.version === '') {
        this.$message.error('请输入关键字段')
      } else {
        let param = new URLSearchParams()
        param.append('version_code', this.form.version)
        param.append('name', this.form.name)
        param.append('is_force_upgrade', this.form.hasUpgrade ? '是' : '否')
        param.append('type', this.appUploadType)
        this.axios.post(this.url + 'app/addApp', param).then(function (response) {
          if (response.data.result === 0) {
            that.dialogFormVisible = false
            that.$message({message: '上传成功', duration: 1000})
            that.form.version = ''
            that.form.name = ''
            that.form.hasUpgrade = ''
            that.$emit('initData')
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style>
</style>
