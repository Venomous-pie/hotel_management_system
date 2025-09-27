<template>
  <div class="flex w-full h-screen gap-1">
    <SideBar />
    <div class="flex flex-col w-[85%] p-0 m-0 overflow-auto">
      <Content />
    </div>
  </div>
</template>

<script setup>
import SideBar from '../components/Sidebar.vue'
import Content from '../components/Maincontent.vue'
</script>
