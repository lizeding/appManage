<template>
  <div>
    <slot text="lizeding"></slot>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      items: [
        {text: 'a'},
        {text: 'b'},
        {text: 'c'}
      ]
    }
  }
}
</script>
