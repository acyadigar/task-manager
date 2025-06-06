import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/Tasks.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected and guest routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // If route requires guest and user is logged in
  if (to.meta.requiresGuest && token) {
    return next('/tasks')
  }

  next()
})

export default router 