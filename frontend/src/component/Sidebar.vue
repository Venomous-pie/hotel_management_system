<template>
    <div class="flex flex-col w-[15%] bg-gray-50 h-screen overflow-auto overflow-x-hidden">
        <div class="flex items-center w-full h-16 p-2 gap-2">
            <img src="/logo.png" class="h-16 object-contain" alt="Logo">
            <p class="text-2xl font-bold text-gray-700 font-cursive">Grand Resort</p>
        </div>

        <div class="flex w-full items-center p-2 rounded-lg pl-5 mr-5">
            <img src="/receptionist.png" alt="Profile"
                class="h-10 w-10 object-cover object-top rounded-full object-cover" />

            <div class="ml-3 leading-tight">
                <p class="text-sm font-semibold text-black">Grace Hoppers</p>
                <p class="text-xs text-gray-500 mt--4">Receptionist</p>
            </div>
        </div>

        <div class="w-full p-3 space-y-2 bg-gray-50">
            <p class="text-xs pl-4 font-bold text-gray-700">Daily Operations</p>
            <nav class="flex flex-col space-y-1 mr-7">
                <div @click="switchComponent('frontdesk')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'frontdesk' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-layout-grid text-sm"></i>
                    Front Desk
                </div>
                <div @click="switchComponent('reservations')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'reservations' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-calendar-check text-sm"></i>
                    Reservations
                </div>
                <div @click="switchComponent('guests')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'guests' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-users text-sm"></i>
                    Guests
                </div>
                <div @click="switchComponent('housekeeping')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'housekeeping' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-sparkles text-sm"></i>
                    Housekeeping
                </div>
                <div @click="switchComponent('tasks')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'tasks' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-clipboard-list text-sm"></i>
                    Tasks
                </div>
            </nav>
        </div>

        <div class="w-full p-3 space-y-2 bg-gray-50">
            <p class="text-xs pl-4 font-bold text-gray-700">Documents</p>
            <nav class="flex flex-col space-y-1 mr-7">
                <a href="/booking"
                    class="flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline">
                    <i class="i-lucide-globe text-sm"></i>
                    Online Booking
                </a>
                <div @click="switchComponent('accounting')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'accounting' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-calculator text-sm"></i>
                    Accounting
                </div>
                <div @click="switchComponent('cashbooks')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'cashbooks' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-book-open text-sm"></i>
                    Cashbooks
                </div>
                <div @click="switchComponent('reports')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'reports' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-file-text text-sm"></i>
                    Reports
                </div>
            </nav>
        </div>

        <div class="w-full p-3 space-y-2 bg-gray-50">
            <p class="text-xs pl-4 font-bold text-gray-700">InHouse</p>
            <nav class="flex flex-col space-y-1 mr-7">
                <div @click="switchComponent('orders')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'orders' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-shopping-cart text-sm"></i>
                    Orders
                </div>
                <div @click="switchComponent('services')"
                    :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'services' ? 'bg-gray-100 text-green-900' : '']">
                    <i class="i-lucide-wrench text-sm"></i>
                    Services
                </div>
            </nav>
        </div>

        <div class="w-50 mt-auto p-4 bg-gray-50">
            <div @click="switchComponent('settings')" 
                :class="['flex items-center gap-2 px-4 py-1.5 rounded-full text-black hover:bg-gray-200 hover:text-gray-900 text-xs transition-colors no-underline cursor-pointer', activeComponent === 'settings' ? 'bg-gray-100 text-green-900' : '']">
                <i class="i-lucide-settings text-sm"></i>
                Settings
            </div>
        </div>
    </div>
</template>

<script setup>
import { useActiveComponent } from '../composables/useActiveComponent.js'

const { activeComponent, setActiveComponent } = useActiveComponent()

const switchComponent = (componentName) => {
    setActiveComponent(componentName)
}
</script>