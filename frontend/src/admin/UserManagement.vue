<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <i class="pi pi-users text-white text-sm"></i>
            </div>
            <h1 class="ml-3 text-xl font-semibold text-gray-900">User Management</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="showCreateModal = true"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i class="pi pi-plus"></i>
              Add User
            </button>
            <button
              @click="refreshUsers"
              :disabled="loading"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i class="pi pi-refresh" :class="{ 'pi-spin': loading }"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        
        <!-- Error Alert -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center gap-2">
            <i class="pi pi-exclamation-triangle text-red-500"></i>
            <p class="text-red-700 text-sm font-medium">{{ error }}</p>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Staff Accounts</h2>
            <p class="text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading && users.length === 0" class="p-6 text-center">
            <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">Loading users...</p>
          </div>

          <!-- Users List -->
          <div v-else-if="users.length > 0" class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <i class="pi pi-user text-gray-600 text-sm"></i>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                        <div class="text-xs text-gray-400">@{{ user.username }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getRoleBadgeClass(user.role)">
                      {{ capitalizeRole(user.role) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.department || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatLastLogin(user.lastLogin) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="editUser(user)"
                        class="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button
                        @click="resetPassword(user)"
                        class="text-orange-600 hover:text-orange-900 text-sm"
                        title="Reset Password"
                      >
                        <i class="pi pi-key"></i>
                      </button>
                      <button
                        @click="toggleUserStatus(user)"
                        :class="user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        class="text-sm"
                        :title="user.isActive ? 'Deactivate' : 'Activate'"
                      >
                        <i :class="user.isActive ? 'pi pi-ban' : 'pi pi-check-circle'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-else class="p-6 text-center">
            <i class="pi pi-users text-4xl text-gray-300"></i>
            <p class="text-gray-500 mt-2">No users found</p>
            <button
              @click="showCreateModal = true"
              class="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Create your first user
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Create New User</h3>
        </div>
        
        <form @submit.prevent="createUser" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input v-model="newUser.firstName" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input v-model="newUser.lastName" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input v-model="newUser.username" type="text" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="newUser.email" type="email" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input v-model="newUser.password" type="password" required
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select v-model="newUser.role" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="receptionist">Receptionist</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="accounting">Accounting</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input v-model="newUser.department" type="text"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input v-model="newUser.phone" type="tel"
                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
          </div>
          
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="cancelCreate"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <span v-if="creating">Creating...</span>
              <span v-else>Create User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../utils/api'

const users = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showCreateModal = ref(false)
const creating = ref(false)

const newUser = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  role: '',
  department: '',
  phone: ''
})

const refreshUsers = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.users.getAll()
    users.value = response.data || []
  } catch (err: any) {
    error.value = err.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const createUser = async () => {
  creating.value = true
  error.value = null
  
  try {
    await api.users.create(newUser.value)
    showCreateModal.value = false
    resetNewUser()
    await refreshUsers()
  } catch (err: any) {
    error.value = err.message || 'Failed to create user'
  } finally {
    creating.value = false
  }
}

const cancelCreate = () => {
  showCreateModal.value = false
  resetNewUser()
}

const resetNewUser = () => {
  newUser.value = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: '',
    department: '',
    phone: ''
  }
}

const editUser = (user: any) => {
  // TODO: Implement edit functionality
  console.log('Edit user:', user)
}

const resetPassword = async (user: any) => {
  if (confirm(`Reset password for ${user.firstName} ${user.lastName}?`)) {
    try {
      const newPassword = 'TempPassword123!' // In real app, generate or prompt
      await api.users.resetPassword(user.id, newPassword)
      alert(`Password reset to: ${newPassword}`)
    } catch (err: any) {
      error.value = err.message || 'Failed to reset password'
    }
  }
}

const toggleUserStatus = async (user: any) => {
  const action = user.isActive ? 'deactivate' : 'activate'
  if (confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`)) {
    try {
      await api.users.update(user.id, { isActive: !user.isActive })
      await refreshUsers()
    } catch (err: any) {
      error.value = err.message || `Failed to ${action} user`
    }
  }
}

const getRoleBadgeClass = (role: string) => {
  const classes = {
    admin: 'bg-purple-100 text-purple-800',
    manager: 'bg-blue-100 text-blue-800',
    receptionist: 'bg-green-100 text-green-800',
    housekeeping: 'bg-yellow-100 text-yellow-800',
    accounting: 'bg-orange-100 text-orange-800'
  }
  return classes[role as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const capitalizeRole = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const formatLastLogin = (lastLogin: string | null) => {
  if (!lastLogin) return 'Never'
  return new Date(lastLogin).toLocaleString()
}

onMounted(() => {
  refreshUsers()
})
</script>