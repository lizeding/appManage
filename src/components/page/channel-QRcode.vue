<template>
  <div>
    <el-dialog :title="channelQRcodeInfo.platform" :visible="channelQRcodeInfo.state" width="90%" :before-close="closeDialog">
      <div class="channelQRcode-dialog-body">
        <img   :src="channelQRcodeInfo.url" alt="二维码图片">
        <h2></h2>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['channelQRcodeInfo'],
  methods: {
    closeDialog: function () {
      this.$emit('closeQRDialog')
    }
  }
}
</script>

<style>
  .channelQRcode-dialog-body{
    text-align: center;
  }
</style>
