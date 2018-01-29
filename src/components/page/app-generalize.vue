<template>
      <div class="app-manage-dialog-body">
        <img :src="url + server + jumpAddress">
        <p>扫描二维码，<span class="download-app">下载天然工坊APP</span></p>
        <h2>天然工坊--只做天然好产品</h2>
      </div>
</template>

<script>
import devConfig from '@/../config/devconfig'

export default {
  data: function () {
    return {
      server: devConfig.dev.server,
      jumpAddress: devConfig.dev.jumpAddress,
      url: devConfig.dev.createQRcode
    }
  }
}
</script>

<style>
  .app-manage-dialog-body{
    text-align: center;
    padding-top: 10%;
  }
  .download-app{
    color: red;
  }
  .app-manage-dialog-body p{
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>
