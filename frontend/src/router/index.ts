import { createRouter, createWebHistory } from 'vue-router'
import ReceptionistPage from "../page/Receptionist.vue"
import Frontdesk from "../receptionist/pages/Frontdesk.vue"
import Reservations from "../receptionist/pages/Reservations.vue"
import Guests from "../receptionist/pages/Guests.vue"
import Housekeeping from "../receptionist/pages/Housekeeping.vue"
import Tasks from "../receptionist/pages/Tasks.vue"
import Accounting from "../receptionist/pages/Accounting.vue"
import Cashbooks from "../receptionist/pages/Cashbooks.vue"
import Reports from "../receptionist/pages/Reports.vue"
import Orders from "../receptionist/pages/Orders.vue"
import Services from "../receptionist/pages/Services.vue"
import Settings from "../receptionist/pages/Settings.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ReceptionistPage,
      children: [
        { path: '', redirect: '/frontdesk' },
        { path: 'frontdesk', component: Frontdesk },
        { path: 'reservations', component: Reservations },
        { path: 'guests', component: Guests },
        { path: 'housekeeping', component: Housekeeping },
        { path: 'tasks', component: Tasks },
        { path: 'accounting', component: Accounting },
        { path: 'cashbooks', component: Cashbooks },
        { path: 'reports', component: Reports },
        { path: 'orders', component: Orders },
        { path: 'services', component: Services },
        { path: 'settings', component: Settings },
      ]
    },
  ],
})

export default router
