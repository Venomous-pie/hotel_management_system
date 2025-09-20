import { ref } from 'vue'

// Global state for the active component
const activeComponent = ref<string>('frontdesk')

export function useActiveComponent() {
  const setActiveComponent = (componentName: string) => {
    activeComponent.value = componentName
  }

  return {
    activeComponent,
    setActiveComponent
  }
}
