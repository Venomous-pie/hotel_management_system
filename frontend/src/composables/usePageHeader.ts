import { ref, onMounted, onUnmounted } from 'vue'

interface PageHeaderOptions {
  onSearch?: (query: string) => void
  onNotification?: () => void
  onRefresh?: () => void
  onProfile?: () => void
  onSettings?: () => void
  onLogout?: () => void
}

export function usePageHeader(options: PageHeaderOptions = {}) {
  const searchQuery = ref<string>('')
  const showUserDropdown = ref<boolean>(false)
  
  const toggleUserDropdown = () => {
    showUserDropdown.value = !showUserDropdown.value
  }
  
  const closeUserDropdown = () => {
    showUserDropdown.value = false
  }
  
  const handleSearch = (query: string) => {
    searchQuery.value = query
    if (options.onSearch) {
      options.onSearch(query)
    } else {
      console.log('Searching for:', query)
    }
  }
  
  // Handle notification click
  const handleNotificationClick = () => {
    if (options.onNotification) {
      options.onNotification()
    } else {
      console.log('Notification clicked')
    }
  }
  
  const handleRefreshClick = () => {
    if (options.onRefresh) {
      options.onRefresh()
    } else {
      console.log('Refresh clicked - reloading page data')
      window.location.reload()
    }
  }
  
  const handleProfileClick = () => {
    closeUserDropdown()
    if (options.onProfile) {
      options.onProfile()
    } else {
      console.log('Profile clicked')
    }
  }
  
  const handleSettingsClick = () => {
    closeUserDropdown()
    if (options.onSettings) {
      options.onSettings()
    } else {
      console.log('Settings clicked')
    }
  }
  
  const handleLogoutClick = () => {
    closeUserDropdown()
    if (options.onLogout) {
      options.onLogout()
    } else {
      console.log('Logout clicked')
    }
  }

  
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (showUserDropdown.value && !target.closest('.user-dropdown-container')) {
      closeUserDropdown()
    }
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  return {
    searchQuery,
    showUserDropdown,
    toggleUserDropdown,
    closeUserDropdown,
    handleSearch,
    handleNotificationClick,
    handleRefreshClick,
    handleProfileClick,
    handleSettingsClick,
    handleLogoutClick
  }
}
