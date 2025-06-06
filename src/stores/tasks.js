import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)

  const fetchTasks = async () => {
    loading.value = true
    try {
      const response = await api.get('/task')
      
      tasks.value = response.data.result
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      loading.value = false
    }
  }

  const addTask = async (task) => {
    try {
      const response = await api.post('/task', task)
      tasks.value.push(response.data)
      return true
    } catch (error) {
      console.error('Failed to add task:', error)
      return false
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/task/${taskId}`)
      tasks.value = tasks.value.filter(task => task.id !== taskId)
      return true
    } catch (error) {
      console.error('Failed to delete task:', error)
      return false
    }
  }

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/task/${taskId}`, { status: newStatus })
      await fetchTasks()
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    deleteTask,
    updateTaskStatus
  }
}) 