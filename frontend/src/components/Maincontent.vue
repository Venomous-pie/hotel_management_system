<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between px-6 pt-2 pb-1 bg-white border-b border-gray-200">
      <Searchbar placeholder="Search..." icon="pi pi-search" :outline="false" width="40rem"/>
      <div class="flex items-center gap-4">
        <div class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-default">
          <i class="pi pi-refresh text-gray-600 w-5 h-5 inline-block"></i>
        </div>

        <div class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-default">
          <i class="pi pi-bell text-gray-600 w-5 h-5 inline-block"></i>
        </div>

        <div class="relative user-dropdown-container">
          <div class="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors cursor-default">
            <img src="/receptionist.png" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
            <span class="text-xs font-medium text-gray-700">Grace Hoppers</span>
            <i class="pi pi-chevron-down text-gray-300 w-4 h-4 inline-block"></i>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pt-4">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Searchbar from '@/components/Searchbar.vue'
</script>