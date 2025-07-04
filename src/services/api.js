import axios from 'axios'

axios.defaults.baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api'

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axios 