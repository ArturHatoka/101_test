// Utilities
import { defineStore } from 'pinia'
import { useDate } from 'vuetify'
import axios from 'axios'

export const useTransactionsStore = defineStore('transactions', ()=> {
  const adapter = useDate()

  const transactions = ref([])
  const transactionsAllCounter = ref(0)
  const loading = ref(true)
  const filters = ref({
    type: 'all',
    fromDate: null,
    toDate: null
  })

  const filteredTransactions = computed(() => {
    let data = transactions.value

    // Фильтрация по типу транзакции
    if (filters.value.type !== 'all') {
      data = data.filter(tr => tr.type === filters.value.type)
    }
    // Фильтрация по дате "от"
    if (filters.value.fromDate) {
      data = data.filter(
        tr => adapter.parseISO(tr.date) >= filters.value.fromDate
      )
    }
    // Фильтрация по дате "до"
    if (filters.value.toDate) {
      data = data.filter(
        tr => adapter.parseISO(tr.date) <= filters.value.toDate
      )
    }
    return data
  })

  async function fetchTransactions( page = 1, itemsPerPage = 10, sortBy = []) {
    try {
      loading.value = true
      const response = await axios.get('/transactions.json')
      transactionsAllCounter.value = response.data.length

      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage
      const items = response.data.slice()

      if (sortBy.length) {
        const { key: sortKey, order: sortOrder } = sortBy[0]
        items.sort((a, b) => {
          const aValue = a[sortKey]
          const bValue = b[sortKey]

          if (sortKey === 'date') {
            const aDate = adapter.parseISO(aValue)
            const bDate = adapter.parseISO(bValue)
            return sortOrder === 'desc'
              ? bDate - aDate
              : aDate - bDate
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'desc'
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue)
          }

          return sortOrder === 'desc'
            ? bValue - aValue
            : aValue - bValue
        })
      }

      transactions.value = items.slice(start, end)
      loading.value = false
    } catch (error) {
      console.error('Ошибка загрузки транзакций:', error)
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    loading,
    transactionsAllCounter,
    filteredTransactions,

    fetchTransactions,
    setFilters
  }
})
