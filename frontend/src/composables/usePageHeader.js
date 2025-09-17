import { ref, onMounted, onUnmounted } from 'vue'

export function usePageHeader(options = {}) {
  const searchQuery = ref('')
  const showUserDropdown = ref(false)
  
  const toggleUserDropdown = () => {
    showUserDropdown.value = !showUserDropdown.value
  }
  
  // Close dropdown when clicking outside
  const closeUserDropdown = () => {
    showUserDropdown.value = false
  }
  
  // Handle search functionality
  const handleSearch = (query) => {
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
  
  // Handle refresh click
  const handleRefreshClick = () => {
    if (options.onRefresh) {
      options.onRefresh()
    } else {
      console.log('Refresh clicked - reloading page data')
      window.location.reload()
    }
  }
  
  // Handle profile actions
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
  
  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (showUserDropdown.value && !event.target.closest('.user-dropdown-container')) {
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
