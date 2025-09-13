import { createRouter, createWebHistory } from 'vue-router'
import ReceptionistPage from "../page/Receptionist.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: ReceptionistPage },
  ],
})

export default router
