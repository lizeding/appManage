<template>
  <div class="wrapper">
    <app-head></app-head>
    <app-aside></app-aside>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import aside from './app-aside'
import head from './app-head'

export default {
  components: {
    'app-aside': aside,
    'app-head': head
  }
}
</script>

<style>
  .content{
    position: absolute;
    left: 170px;
    top: 60px;
    bottom: 0;
    right: 0;
    box-sizing: border-box;
  }
</style>
