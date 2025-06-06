<template>
  <div class="app">
    <Navigation />
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'

export default {
  name: 'App',
  components: {
    Navigation
  }
}
</script>

<style>
.app {
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
