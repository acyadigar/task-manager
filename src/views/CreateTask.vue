<template>
  <div class="create-task">
    <h1>Create New Task</h1>
    <form @submit.prevent="handleSubmit" class="task-form">
      <h2 class="form-title">Task Details</h2>
      <div class="form-group">
        <label for="title">Title *</label>
        <input 
          id="title"
          v-model="task.title"
          type="text"
          required
          placeholder="Enter task title"
          class="form-input"
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="task.description"
          rows="4"
          placeholder="Enter task description"
          class="form-input"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select id="status" v-model="task.status" class="form-input">
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="loading"
      >
        {{ loading ? 'Creating...' : 'Create Task' }}
      </button>
      
      <div v-if="showError" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '../stores/tasks'

const router = useRouter()
const taskStore = useTaskStore()

const task = ref({
  title: '',
  description: '',
  status: 'Pending'
})
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  loading.value = true
  showError.value = false
  
  try {
    const success = await taskStore.addTask(task.value)
    if (success) {
      router.push('/tasks')
    } else {
      showError.value = true
      errorMessage.value = 'Failed to create task. Please try again.'
    }
  } catch (error) {
    showError.value = true
    errorMessage.value = 'An error occurred while creating the task.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-task {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.task-form {
  background: white;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.02),
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 12px 24px -12px rgba(0, 0, 0, 0.08);
}

.form-title {
  color: #1a1f36;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #1a1f36;
  font-size: 0.95rem;
}

.submit-btn {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  margin-top: 1rem;
  padding: 12px 16px;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.95rem;
}

h1 {
  color: #1a1f36;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}
</style> 