<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Welcome Back</h1>
        <p>Please enter your details to sign in</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
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
            placeholder="••••••••"
            required
          >
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input 
              type="checkbox"
              v-model="rememberMe"
            >
            <span>Remember me</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            Forgot password?
          </router-link>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>

        <p class="auth-footer">
          Don't have an account? 
          <router-link to="/register">Sign up</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const rememberMe = ref(false)
    const loading = ref(false)

    onMounted(() => {
      // Load saved email from localStorage if it exists
      const savedEmail = localStorage.getItem('rememberedEmail')
      if (savedEmail) {
        email.value = savedEmail
        rememberMe.value = true
      }
    })

    const handleSubmit = async (e) => {
      e.preventDefault()
      error.value = ''
      loading.value = true

      try {
        const success = await authStore.login({
          email: email.value,
          password: password.value
        })

        if (success) {
          // Save or remove email based on remember me checkbox
          if (rememberMe.value) {
            localStorage.setItem('rememberedEmail', email.value)
          } else {
            localStorage.removeItem('rememberedEmail')
          }
          await router.push({ name: 'Tasks' })
        } else {
          error.value = 'Invalid credentials'
        }
      } catch (err) {
        console.error('Login error:', err)
        error.value = 'Something went wrong'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      error,
      handleSubmit,
      rememberMe,
      loading,
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

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: #f9fafb;
}

.form-group input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background-color: white;
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