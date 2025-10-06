<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Housekeeping Dashboard</h1>
      <p class="text-gray-600 mt-2">Manage room cleaning and maintenance tasks - Linis na mga kwarto!</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <i class="pi pi-list text-blue-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Tasks</p>
            <p class="text-2xl font-bold text-gray-900">{{ taskStats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <i class="pi pi-clock text-yellow-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-bold text-gray-900">{{ taskStats.pending }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 rounded-lg">
            <i class="pi pi-spin pi-cog text-orange-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">In Progress</p>
            <p class="text-2xl font-bold text-gray-900">{{ taskStats.inProgress }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <i class="pi pi-check text-green-600 text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-gray-900">{{ taskStats.completed }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 mb-6">
      <button
        @click="showCreateTaskModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <i class="pi pi-plus"></i>
        Create Task
      </button>
      <button
        @click="createSampleTasks"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <i class="pi pi-refresh"></i>
        Generate Sample Tasks
      </button>
    </div>

    <!-- Tasks List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Active Tasks</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">Room {{ task.roomNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 capitalize">{{ task.taskType.replace('_', ' ') }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(task.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ task.status.replace('_', ' ').toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPriorityBadgeClass(task.priority)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ task.priority.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ task.assignedTo || 'Unassigned' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div :class="getProgressBarClass(task.status)" :style="{ width: getProgressPercentage(task) + '%' }" class="h-2 rounded-full"></div>
                  </div>
                  <span class="text-xs text-gray-600">{{ getProgressPercentage(task) }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  v-if="task.status === 'pending'"
                  @click="startTask(task.id)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Start
                </button>
                <button
                  v-if="task.status === 'in_progress'"
                  @click="selectedTask = task; showTaskDetails = true"
                  class="text-green-600 hover:text-green-900"
                >
                  Complete
                </button>
                <button
                  @click="selectedTask = task; showTaskDetails = true"
                  class="text-gray-600 hover:text-gray-900"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="tasks.length === 0" class="text-center py-12">
          <i class="pi pi-inbox text-gray-400 text-4xl mb-4"></i>
          <p class="text-gray-500">No tasks found. Create some tasks to get started!</p>
        </div>
      </div>
    </div>

    <!-- Task Details Modal -->
    <div v-if="showTaskDetails && selectedTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">Task Details - Room {{ selectedTask.roomNumber }}</h3>
          <button @click="showTaskDetails = false" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Checklist Progress</label>
              <div class="space-y-2">
                <div v-for="item in selectedTask.checklistItems" :key="item.id" class="flex items-center">
                  <input
                    :id="item.id"
                    v-model="item.completed"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @change="updateChecklistItem(selectedTask.id, item.id)"
                  />
                  <label :for="item.id" class="ml-2 text-sm text-gray-700" :class="{ 'line-through text-gray-500': item.completed }">
                    {{ item.description }}
                  </label>
                </div>
              </div>
            </div>
            
            <div v-if="allItemsCompleted(selectedTask)" class="mt-6">
              <button
                @click="completeTask(selectedTask.id)"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Mark Task as Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="showCreateTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">Create New Task</h3>
          <button @click="showCreateTaskModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input
                v-model="newTask.roomNumber"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 101"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
              <select
                v-model="newTask.taskType"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="checkout_cleaning">Checkout Cleaning</option>
                <option value="maintenance">Maintenance</option>
                <option value="deep_clean">Deep Clean</option>
                <option value="inspection">Inspection</option>
                <option value="restock">Restock</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                v-model="newTask.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showCreateTaskModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="createNewTask"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHousekeeping } from '@/composables/useHousekeeping'
import type { HousekeepingTask } from '@/composables/useHousekeeping'

// Composables
const {
  tasks,
  taskStats,
  createTask,
  startTask: startTaskAction,
  completeTask: completeTaskAction,
  completeChecklistItem,
} = useHousekeeping()

// Local state
const showTaskDetails = ref(false)
const showCreateTaskModal = ref(false)
const selectedTask = ref<HousekeepingTask | null>(null)

const newTask = ref({
  roomNumber: '',
  taskType: 'checkout_cleaning' as HousekeepingTask['taskType'],
  priority: 'medium' as HousekeepingTask['priority'],
})

// Methods
const createNewTask = () => {
  if (!newTask.value.roomNumber) return
  
  createTask(
    newTask.value.roomNumber,
    newTask.value.taskType,
    newTask.value.priority
  )
  
  // Reset form
  newTask.value = {
    roomNumber: '',
    taskType: 'checkout_cleaning',
    priority: 'medium',
  }
  
  showCreateTaskModal.value = false
}

const createSampleTasks = () => {
  // Create some sample tasks for demonstration
  const sampleRooms = ['101', '102', '103', '201', '202']
  const taskTypes: HousekeepingTask['taskType'][] = ['checkout_cleaning', 'maintenance', 'deep_clean', 'inspection']
  const priorities: HousekeepingTask['priority'][] = ['low', 'medium', 'high']
  
  sampleRooms.forEach((room, index) => {
    createTask(
      room,
      taskTypes[index % taskTypes.length],
      priorities[index % priorities.length]
    )
  })
}

const startTask = (taskId: string) => {
  startTaskAction(taskId)
}

const completeTask = (taskId: string) => {
  completeTaskAction(taskId, 'Task completed successfully!')
  showTaskDetails.value = false
}

const updateChecklistItem = (taskId: string, itemId: string) => {
  completeChecklistItem(taskId, itemId)
}

const allItemsCompleted = (task: HousekeepingTask) => {
  return task.checklistItems.every(item => item.completed)
}

const getProgressPercentage = (task: HousekeepingTask) => {
  const completed = task.checklistItems.filter(item => item.completed).length
  const total = task.checklistItems.length
  return total > 0 ? Math.round((completed / total) * 100) : 0
}

// Utility functions for styling
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getProgressBarClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500'
    case 'in_progress':
      return 'bg-blue-500'
    case 'completed':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}
</script>
