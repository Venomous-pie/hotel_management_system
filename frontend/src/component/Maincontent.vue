<template>
    <component :is="currentComponent" />
</template>

<script setup>
    import { computed } from 'vue'
    import { useActiveComponent } from '../composables/useActiveComponent.js'
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

    const { activeComponent } = useActiveComponent()

    const componentMap = {
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