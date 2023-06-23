<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Hello World"/>
    <CreateBlogEntry></CreateBlogEntry>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import CreateBlogEntry from '@/components/CreateBlogEntry'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    CreateBlogEntry
  }
}
</script>
