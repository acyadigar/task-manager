<template>
  <nav class="navigation">
    <div class="nav-left">
      <div class="nav-links">
        <router-link 
          to="/tasks" 
          class="nav-link"
          :class="{ active: $route.path === '/tasks' }"
        >
          Tasks
        </router-link>
        <router-link 
          to="/tasks/create"
          class="nav-link"
          :class="{ active: $route.path === '/tasks/create' }"
        >
          Create
        </router-link>
      </div>
    </div>
    
    <div class="nav-right">
      <template v-if="!token">
        <router-link to="/login" class="nav-button login">
          Log in
        </router-link>
        <router-link to="/register" class="nav-button register">
          Sign up
        </router-link>
      </template>

      <button v-else @click="handleLogout" class="nav-button logout">
        Log out
      </button>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export default {
  name: 'Navigation',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { token } = storeToRefs(authStore)

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    return {
      token,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-logo {
  font-weight: 600;
  font-size: 20px;
  color: #172B4D;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #42526E;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link.active {
  color: #2563eb;
  font-weight: 500;
  background-color: rgba(37, 99, 235, 0.1);
  position: relative;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #2563eb;
}

.nav-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.login {
  color: #0052CC;
}

.register {
  background-color: #0052CC;
  color: white;
  margin-left: 8px;
}

.register:hover {
  background-color: #0747A6;
}

.user-menu {
  position: relative;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
}

.user-menu-button:hover {
  background-color: #F4F5F7;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.user-name {
  color: #42526E;
  font-size: 14px;
}

.chevron-down {
  border: solid #42526E;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  margin-top: -3px;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #42526E;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #F4F5F7;
}

.logout {
  background: none;
  border: none;
  color: #f87171;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: color 0.2s ease;
}

.logout:hover {
  color: #ef4444;
}
</style> 