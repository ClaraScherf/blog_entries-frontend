<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">My Healthblog</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <router-link class="nav-link" to="/">Home </router-link>
        <router-link class="nav-link" to="/about">About </router-link>
        <router-link class="nav-link" to="/health">Health</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar-component'
}
</script>

<style scoped>

</style>
