<template>
  <div class="users-container">
    <h1>Users</h1>
    
    <div v-if="loading" class="loading">
      Loading users...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Tasks</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.tasks ? user.tasks.length : 0 }}</td>
            <td @click="deleteUser(user.id)">
              <span :class="['status-badge', user.isActive ? 'active' : 'inactive']">
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUsersStore } from '../stores/users';
import { storeToRefs } from 'pinia';

const usersStore = useUsersStore();
const { users, loading, error } = storeToRefs(usersStore);

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  await usersStore.deleteUser(id);
};

onMounted(async () => {
  await usersStore.fetchUsers();
});
</script>

<style scoped>
.users-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.users-table-container {
  margin-top: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e8e8e8;
}

.users-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.users-table tr:last-child td {
  border-bottom: none;
}

.users-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

.status-badge:hover {
  background: #dc3545;
  color: white;
  text-decoration: line-through;
}
</style> 