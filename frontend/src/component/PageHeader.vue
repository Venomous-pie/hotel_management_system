<template>
  <div>
    <!-- Main Header -->
    <div class="flex items-center justify-between px-6 pt-2 pb-1 bg-white border-b border-gray-200">
      <div class="flex items-center bg-gray-50 rounded-full px-4 py-2 w-80">
        <i class="i-lucide-search text-gray-400 text-xs mr-3"></i>
        <input type="text" 
          :placeholder="searchPlaceholder"
          class="bg-transparent border-none outline-none focus:outline-none text-xs text-gray-700 placeholder-gray-400 flex-1 caret-blue-500"
          :value="modelValue" 
          @input="$emit('update:modelValue', $event.target.value)"
          @keyup.enter="$emit('search', $event.target.value)" />
      </div>

      <div class="flex items-center gap-4">
        <div class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" 
          @click="$emit('refresh')">
          <i class="i-lucide-refresh-cw text-gray-600 w-5 h-5 inline-block"></i>
        </div>

        <div class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          @click="$emit('notification')">
          <i class="i-lucide-bell text-gray-600 w-5 h-5 inline-block"></i>
        </div>

        <div class="relative">
          <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            @click="toggleUserDropdown">
            <img src="/receptionist.png" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
            <span class="text-xs font-medium text-gray-700">{{ userName || 'Grace Hoppers' }}</span>
            <i class="i-lucide-chevron-down text-gray-400 w-4 h-4 inline-block" 
              :class="{ 'rotate-180': showUserDropdown }"></i>
          </div>

          <div v-if="showUserDropdown"
            class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline"
              @click.prevent="handleMenuClick('profile')">Profile</a>
            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline"
              @click.prevent="handleMenuClick('settings')">Settings</a>
            <div class="border-t border-gray-100 my-1"></div>
            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 no-underline"
              @click.prevent="handleMenuClick('logout')">Sign out</a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Separator Line -->
    <div class="border-t border-gray-100"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Search'
  },
  userName: {
    type: String,
    default: 'Grace Hoppers'
  }
})

const emit = defineEmits([
  'update:modelValue',
  'search',
  'refresh', 
  'notification',
  'profile',
  'settings',
  'logout'
])

const showUserDropdown = ref(false)

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const handleMenuClick = (action) => {
  showUserDropdown.value = false
  emit(action)
}
</script>