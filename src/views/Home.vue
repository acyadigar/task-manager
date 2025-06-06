<template>
  <div class="home">
    <h1>Welcome to Task Manager</h1>
    <div v-if="user" class="welcome-message">
      <p>Welcome back, {{ user.name }}!</p>
      <router-link to="/tasks" class="tasks-link">
        View Your Tasks
      </router-link>
    </div>
    <div v-else class="auth-links">
      Please login to view your tasks.
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    const { user } = storeToRefs(authStore)

    return {
      user
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}

.welcome-message {
  margin: 20px 0;
}

.auth-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.auth-button, .tasks-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.auth-button:hover, .tasks-link:hover {
  background-color: #3aa876;
}
</style> 