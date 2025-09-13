import { ref } from 'vue'

// Global state for the active component
const activeComponent = ref('frontdesk')

export function useActiveComponent() {
  const setActiveComponent = (componentName) => {
    activeComponent.value = componentName
  }

  return {
    activeComponent,
    setActiveComponent
  }
}
