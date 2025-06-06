import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials)
      console.log(data, 'response');
      
      const newToken = data.data.access_token
      localStorage.setItem('token', newToken)
      token.value = newToken
      
      user.value = data.data.user

      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData)
      delete userData.fullName
      await login(userData)
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    token.value = null
    user.value = null
    delete api.defaults.headers.common['Authorization']
  }

  return {
    user,
    token,
    login,
    register,
    logout
  }
}) 