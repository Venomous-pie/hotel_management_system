import { onMounted, onBeforeUnmount, nextTick } from 'vue'

export const useGanttLifecycle = (
  initializeViewDate: () => void,
  navigation: any,
  recomputePositions: () => void,
  validatePositioning: () => void,
) => {
  const setupComponent = async () => {
    initializeViewDate()

    if (import.meta.env.DEV) {
      navigation.validateLayout()
    }

    await nextTick()
    await nextTick()
    recomputePositions()

    setTimeout(() => {
      recomputePositions()
      if (import.meta.env.DEV) {
        setTimeout(() => validatePositioning(), 200)
      }
    }, 100)

    window.addEventListener('resize', recomputePositions)
  }

  const cleanupComponent = () => {
    window.removeEventListener('resize', recomputePositions)
  }

  onMounted(setupComponent)
  onBeforeUnmount(cleanupComponent)

  return {
    setupComponent,
    cleanupComponent,
  }
}
