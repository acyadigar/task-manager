<template>
  <div class="tasks-container">
    <div class="board">
      <div v-for="status in statuses" :key="status" class="column">
        <div class="column-header">
          {{ status }}
          <span class="task-count">{{ tasksByStatus(status).length }}</span>
        </div>
        <div 
          class="task-list"
          :class="{ 'dragging-active': isDragging }"
          @dragover.prevent
          @drop="onDrop($event, status)"
          @dragenter.prevent="onDragEnter($event)"
          @dragleave.prevent="onDragLeave($event)"
        >
          <div 
            v-for="task in tasksByStatus(status)" 
            :key="task.id" 
            class="task-card"
            draggable="true"
            @dragstart="onDragStart($event, task)"
            @click="openAssignPopup(task)"
          >
            <div class="task-header">
              <div class="task-title">{{ task.title }}</div>
              <button @click.stop="deleteTask(task.id)" class="delete-btn">×</button>
            </div>
            <div class="task-description">{{ task.description }}</div>
            <div class="task-footer">
              <span
                v-if="task.priority !== 'Medium'"
                :class="['priority-badge', `priority-${task.priority.toLowerCase()}`]"
              >
                {{ task.priority }}
              </span>
            </div>
            <div v-if="assignee(task)" class="assignee">
              Assignee: <b>{{ assignee(task) }}</b>
            </div>
            <div v-else class="assignee-placeholder">
              Click to assign
            </div>
          </div>
        </div>
      </div>
    </div>

    <AssignTaskPopup
      v-if="selectedTask"
      :show="showAssignPopup"
      :task="selectedTask"
      @close="closeAssignPopup"
      @assigned="onTaskAssigned"
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { storeToRefs } from 'pinia'
import AssignTaskPopup from '../components/AssignTaskPopup.vue'

export default {
  name: 'Tasks',
  components: {
    AssignTaskPopup
  },
  setup() {
    const taskStore = useTaskStore()
    const { tasks, loading } = storeToRefs(taskStore)
    const statuses = ['Pending', 'On Hold', 'In Progress', 'Completed']
    const isDragging = ref(false)
    const showAssignPopup = ref(false)
    const selectedTask = ref(null)

    const tasksByStatus = (status) => {
      return tasks.value.filter(task => task.status === status)
    }

    const onDragStart = (e, task) => {
      e.dataTransfer.setData('taskId', task.id)
      isDragging.value = true
    }

    const onDragEnter = (e) => {
      e.currentTarget.classList.add('drag-over')
    }

    const onDragLeave = (e) => {
      e.currentTarget.classList.remove('drag-over')
    }

    const onDrop = async (e, status) => {
      e.currentTarget.classList.remove('drag-over')
      const taskId = e.dataTransfer.getData('taskId')
      isDragging.value = false
      await taskStore.updateTaskStatus(taskId, status)
    }

    const deleteTask = async (taskId) => {
      if (!confirm('Are you sure you want to delete this task?')) return
      await taskStore.deleteTask(taskId)
    }

    const onDragEnd = () => {
      isDragging.value = false
    }

    const assignee = ((task) => {
      return task.assignedUser && task.assignedUser.fullName
    })

    const openAssignPopup = (task) => {
      selectedTask.value = task
      showAssignPopup.value = true
    }

    const closeAssignPopup = () => {
      showAssignPopup.value = false
      selectedTask.value = null
    }

    const onTaskAssigned = async () => {
      await taskStore.fetchTasks()
    }

    onMounted(() => {
      taskStore.fetchTasks()
    })

    return {
      tasks,
      loading,
      assignee,
      statuses,
      tasksByStatus,
      deleteTask,
      onDragStart,
      onDrop,
      onDragEnter,
      onDragLeave,
      isDragging,
      onDragEnd,
      showAssignPopup,
      selectedTask,
      openAssignPopup,
      closeAssignPopup,
      onTaskAssigned
    }
  }
}
</script>

<style scoped>
.tasks-container {
  height: 100%;
  padding: 24px;
}

.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.column {
  background-color: #f4f5f7;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.column-header {
  font-weight: 600;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #42526E;
  font-size: 1.1em;
}

.task-count {
  background-color: #E9EBEE;
  border-radius: 12px;
  padding: 3px 10px;
  font-size: 0.85em;
  font-weight: 500;
}

.task-list {
  min-height: 100px;
  transition: all 0.3s ease;
  border-radius: 6px;
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.task-list.dragging-active {
  min-height: 300px;
  background-color: rgba(9, 30, 66, 0.03);
  border: 2px dashed rgba(9, 30, 66, 0.1);
  margin: 10px 0;
  flex: 1;
}

.task-list.dragging-active.drag-over {
  background-color: rgba(9, 30, 66, 0.08);
  border: 2px dashed #2563eb;
  transform: scale(1.02);
}

.drag-over {
  background-color: rgba(9, 30, 66, 0.08);
  border: 2px dashed #2563eb;
}

.task-card {
  background-color: white;
  border-radius: 6px;
  padding: 12px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(9,30,66,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(9,30,66,0.12);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.delete-btn {
  background: none;
  border: none;
  color: #6b778c;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0 4px;
}

.delete-btn:hover {
  color: #de350b;
}

.assignee {
  font-size: 0.5rem;
  color: #4e4e4e;
  font-style: italic;
}

.task-title {
  color: #172B4D;
  font-size: 0.95em;
  line-height: 1.4;
  font-weight: 500;
  flex: 1;
}

.task-description {
  color: #5E6C84;
  font-size: 0.85em;
  line-height: 1.4;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.priority-badge {
  font-size: 0.6em;
  padding: 1px 3px;
  border-radius: 6px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.1px;
}

.priority-high {
  background-color: #FFEBE6;
  color: #DE350B;
  border: 1px solid rgba(222, 53, 11, 0.4);
}

.priority-medium {
  background-color: #FFF7E6;
  color: #974F0C;
  border: 1px solid rgba(151, 79, 12, 0.4);
}

.priority-low {
  background-color: #E3FCEF;
  color: #006644;
  border: 1px solid rgba(0, 102, 68, 0.4);
}

.loading {
  text-align: center;
  color: #666;
  margin: 20px 0;
}

.no-tasks {
  text-align: center;
  color: #666;
  margin: 20px 0;
}

.task-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.assignee-placeholder {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-style: italic;
}
</style> 