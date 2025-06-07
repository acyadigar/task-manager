import { defineStore } from 'pinia';
import api from '../services/api'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response =  await api.get('/user');
        console.log(response);
        
        this.users = response.data?.result || [];
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
        console.error('Error fetching users:', error);
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id) {
      try {
        await api.delete(`/user/${id}`);
        this.fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }
}); 