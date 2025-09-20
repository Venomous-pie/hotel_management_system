<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between px-6 pt-2 pb-1 bg-white border-b border-gray-200">
      <div class="flex items-center bg-gray-50 rounded-full px-4 py-2 w-80">
        <i class="i-lucide-search text-gray-400 text-xs mr-3"></i>
        <input type="text" placeholder="Search"
          class="bg-transparent border-none outline-none focus:outline-none text-xs text-gray-700 placeholder-gray-400 flex-1 caret-blue-500"
          v-model="searchQuery" @input="handleSearch(($event.target as HTMLInputElement).value)" />
      </div>

      <div class="flex items-center gap-4">
        <div class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" 
          @click="handleRefreshClick">
          <i class="i-lucide-refresh-cw text-gray-600 w-5 h-5 inline-block"></i>
        </div>

        <div class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          @click="handleNotificationClick">
          <i class="i-lucide-bell text-gray-600 w-5 h-5 inline-block"></i>
        </div>

        <div class="relative user-dropdown-container">
          <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            @click="toggleUserDropdown">
            <img src="/receptionist.png" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
            <span class="text-xs font-medium text-gray-700">Grace Hoppers</span>
            <i class="i-lucide-chevron-down text-gray-400 w-4 h-4 inline-block" 
              :class="{ 'rotate-180': showUserDropdown }"></i>
          </div>

          <div v-if="showUserDropdown"
            class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline"
              @click="handleProfileClick">Profile</a>
            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline"
              @click="handleSettingsClick">Settings</a>
            <div class="border-t border-gray-100 my-1"></div>
            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline"
              @click="handleLogoutClick">Sign out</a>
          </div>
        </div>
      </div>
    </div>
    
    <hr class="border-t border-gray-50"/>

    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useActiveComponent } from '../composables/useActiveComponent'
import { usePageHeader } from '../composables/usePageHeader'
import Frontdesk from './Frontdesk.vue'
import Reservations from './Reservations.vue'
import Guests from './Guests.vue'
import Housekeeping from './Housekeeping.vue'
import Tasks from './Tasks.vue'
import Accounting from './Accounting.vue'
import Cashbooks from './Cashbooks.vue'
import Reports from './Reports.vue'
import Orders from './Orders.vue'
import Services from './Services.vue'
import Settings from './Settings.vue'

// Use composables
const { activeComponent } = useActiveComponent()
const { 
  searchQuery, 
  showUserDropdown, 
  toggleUserDropdown, 
  handleSearch,
  handleNotificationClick,
  handleRefreshClick,
  handleProfileClick,
  handleSettingsClick,
  handleLogoutClick
} = usePageHeader()

const componentMap: Record<string, any> = {
  frontdesk: Frontdesk,
  reservations: Reservations,
  guests: Guests,
  housekeeping: Housekeeping,
  tasks: Tasks,
  accounting: Accounting,
  cashbooks: Cashbooks,
  reports: Reports,
  orders: Orders,
  services: Services,
  settings: Settings
}

const currentComponent = computed(() => {
  return componentMap[activeComponent.value] || Frontdesk
})
</script>
