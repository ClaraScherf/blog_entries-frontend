<template>
  <br>
  <div class="home">
    <HelloWorld msg="Tracke täglich deine Gesundheitsdaten"/>
    <img alt="HealthBlog logo" src="../assets/logo.png" width="400" height="280">
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
