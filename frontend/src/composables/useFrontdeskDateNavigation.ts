import { ref, computed } from 'vue'
import { getTodayAtMidnight } from '@/utils/date'
import { generateYearRange } from '@/utils/frontdesk'

export const useFrontdeskDateNavigation = () => {
  const currentDate = getTodayAtMidnight()
  const selectedYear = ref<number>(currentDate.getFullYear())
  const selectedMonth = ref<number>(currentDate.getMonth())
  const targetDate = ref<Date | null>(null)

  const years = computed<number[]>(() => generateYearRange(getTodayAtMidnight().getFullYear()))

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const emitDateChangeToChart = () => {
    targetDate.value = new Date(selectedYear.value, selectedMonth.value, 1)
  }

  const navigateYear = (direction: number) => {
    const currentIndex = years.value.indexOf(selectedYear.value)
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < years.value.length) {
      selectedYear.value = years.value[newIndex]
      emitDateChangeToChart()
    }
  }

  const navigateMonth = (direction: number) => {
    let newMonth = selectedMonth.value + direction
    let newYear = selectedYear.value

    if (newMonth > 11) {
      newMonth = 0
      newYear += 1
    } else if (newMonth < 0) {
      newMonth = 11
      newYear -= 1
    }

    if (years.value.includes(newYear)) {
      selectedYear.value = newYear
      selectedMonth.value = newMonth
      emitDateChangeToChart()
    }
  }

  const selectYear = (year: number) => {
    selectedYear.value = year
    emitDateChangeToChart()
  }

  const selectMonth = (monthIndex: number) => {
    selectedMonth.value = monthIndex
    emitDateChangeToChart()
  }

  const handleDateUpdate = ({ year, month }: { year: number; month: number }) => {
    selectedYear.value = year
    selectedMonth.value = month
    emitDateChangeToChart()
  }

  return {
    selectedYear,
    selectedMonth,
    targetDate,
    years,
    months,
    emitDateChangeToChart,
    navigateYear,
    navigateMonth,
    selectYear,
    selectMonth,
    handleDateUpdate,
  }
}
