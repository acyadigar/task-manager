<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Create Account</h1>
        <p>Please fill in your information to get started</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            id="name"
            type="text" 
            v-model="name"
            class="form-input"
            placeholder="Enter your full name"
            required
          >
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            type="email" 
            v-model="email"
            class="form-input"
            placeholder="Enter your email"
            required
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            type="password" 
            v-model="password"
            class="form-input"
            placeholder="Create a password"
            required
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <p class="auth-footer">
          Already have an account? 
          <router-link to="/login">Sign in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const loading = ref(false)

    async function handleRegister() {
      loading.value = true
      try {
        await authStore.register({
          email: email.value,
          password: password.value,
          fullName: name.value
        })        
        router.push('/tasks');
      } catch (err) {
        error.value = err;
      } finally {
        loading.value = false
      }
    }

    return {
      name,
      email,
      password,
      error,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: 100%;
  max-width: 420px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.auth-header p {
  color: #666;
  font-size: 14px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-password {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.submit-btn {
  background-color: #2563eb;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background-color: #1d4ed8;
}

.submit-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.5);
}

.auth-footer {
  text-align: center;
  font-size: 14px;
  color: #4b5563;
}

.auth-footer a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style> 