<template>
  <div class="home">
    <span> Loading... </span>
    <div class="spinner" />
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    const { user, token } = storeToRefs(authStore)
    const router = useRouter()

    watch(token, (token) => {
      if (token) router.push('/tasks')
    }, { immediate: true })
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  padding-top: 10rem;
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
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.auth-button:hover, .tasks-link:hover {
  background-color: #2563eb;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #ccc;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 