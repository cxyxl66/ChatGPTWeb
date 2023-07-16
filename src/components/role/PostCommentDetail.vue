<template>
  <div>
    <span class="expand-key">ID: </span>
    <span class="expand-value">{{ row.id }}</span>
    <br>
    <br>
    <span class="expand-key">IP: </span>
    <span class="expand-value">{{ row.ip }}</span>
    <br>
    <br>
    <span class="expand-key">User-Agent: </span>
    <span class="expand-value">{{ row.ua }}</span>
    <br>
    <br>
    <span class="expand-key">评论: </span>
    <span class="expand-value">{{ row.content }}</span>

  </div>
</template>

<script>
  export default {
    name: "post-comment",
    props: {
      row: Object
    }
  }
</script>

<style scoped>

</style>
