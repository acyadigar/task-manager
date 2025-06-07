<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <div class="popup-header">
        <h2>Assign Task</h2>
        <button class="close-button" @click="closePopup">&times;</button>
      </div>
      
      <div class="popup-body">
        <div class="task-info">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
        </div>

        <div class="users-list">
          <h3>Select User</h3>
          <div v-if="loading" class="loading">Loading users...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="users-grid">
            <div
              v-for="user in users"
              :key="user.id"
              :class="['user-card', { selected: selectedUserId === user.id }]"
              @click="selectUser(user.id)"
            >
              <h4>{{ user.fullName }}</h4>
              <p class="email">{{ user.email }}</p>
              <p class="task-count">{{ user.tasks ? user.tasks.length : 0 }} tasks</p>
            </div>
          </div>
        </div>
      </div>

      <div class="popup-footer">
        <button class="cancel-button" @click="closePopup">Cancel</button>
        <button 
          class="assign-button" 
          :disabled="!selectedUserId"
          @click="assignTask"
        >
          Assign Task
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUsersStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import api from '../services/api';

const props = defineProps({
  show: Boolean,
  task: Object
});

const emit = defineEmits(['close', 'assigned']);

const usersStore = useUsersStore();
const { users, loading, error } = storeToRefs(usersStore);
const selectedUserId = ref(null);

onMounted(async () => {
  await usersStore.fetchUsers();
});

const selectUser = (userId) => {
  selectedUserId.value = userId;
};

const closePopup = () => {
  selectedUserId.value = null;
  emit('close');
};

const assignTask = async () => {
  try {
    await api.post(`/task/${props.task.id}/assign`, {
      userId: selectedUserId.value
    });
    emit('assigned');
    closePopup();
  } catch (error) {
    console.error('Error assigning task:', error);
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.popup-header {
  padding: 1rem;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.popup-body {
  padding: 1rem;
}

.task-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e8e8e8;
}

.task-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.users-list h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.user-card {
  padding: 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-card:hover {
  border-color: #2563eb;
  background-color: #f8f9fa;
}

.user-card.selected {
  border-color: #2563eb;
  background-color: #ebf5ff;
}

.user-card h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.email {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.task-count {
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 500;
}

.popup-footer {
  padding: 1rem;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button, .assign-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-button {
  background: none;
  border: 1px solid #e8e8e8;
  color: #666;
}

.assign-button {
  background-color: #2563eb;
  border: none;
  color: white;
}

.assign-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.error {
  color: #dc3545;
}
</style> 