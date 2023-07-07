<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Health Blog App</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-link" to="/">Home</router-link>
          <router-link class="nav-link" to="/health">Health</router-link>
          <router-link class="nav-link" to="/statistic">Statistiken</router-link>
          <router-link class="nav-link" to="/about">About</router-link>
        </div>
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
