<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <div class="popup-header">
        <h2>{{ task.title }}</h2>
        <button class="close-button" @click="closePopup">&times;</button>
      </div>
      
      <div class="popup-body">
        <div class="task-info">
          <p>{{ task.description }}</p>
        </div>

        <div class="users-list">
          <h3>Assign to</h3>
          <div v-if="loading" class="loading">Loading users...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="users-table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Tasks</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in users"
                  :key="user.id"
                  :class="{ 
                    selected: selectedUserId === user.id,
                    'current-assignee-row': task.assignedTo === user.id 
                  }"
                  @click="selectUser(user.id)"
                >
                  <td>{{ user.fullName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.tasks ? user.tasks.length : 0 }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="popup-footer">
        <button class="cancel-button" @click="closePopup">Cancel</button>
        <button 
          class="assign-button" 
          :disabled="!selectedUserId || selectedUserId === task.assignedTo"
          @click="assignTask"
        >
          Assign
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
    if (selectedUserId.value === props.task.assignedTo) {
      return;
    }
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
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
}

.users-list h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.users-table-container {
  width: 100%;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.users-table th,
.users-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.users-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table tr {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.users-table tr:hover {
  background-color: #f8f9fa;
}

.users-table tr.selected {
  background-color: #ebf5ff;
}

.users-table tr.selected td {
  color: #2563eb;
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

.current-assignee {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.current-assignee .label {
  font-weight: 500;
  color: #666;
  margin-right: 0.5rem;
}

.current-assignee .value {
  color: #2c3e50;
}

.current-assignee .value.unassigned {
  color: #dc3545;
  font-style: italic;
}

.current-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.current-assignee-row {
  background-color: #f0fdf4;
}

.current-assignee-row:hover {
  background-color: #dcfce7 !important;
}

.current-assignee-row td {
  color: #16a34a;
}
</style> 