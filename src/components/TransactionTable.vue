<template>
  <v-data-table-server
    :headers="headers"
    :items="sortedTransactions"
    :items-length="transactionsAllCounter"
    :loading="loading"
    class="elevation-1"
    @update:options="loadItems"
  >
    <template #item.date="{ item }">
      {{ formatDate(item.date) }}
    </template>
    <template #item.amount="{ item }">
      {{ item.amount.toLocaleString() }} ₽
    </template>
  </v-data-table-server>
  <v-divider class="my-4"></v-divider>
  <div class="text-right">
    <h3>Итого: {{ totalAmount.toLocaleString() }} ₽</h3>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTransactionsStore } from "@/stores/transactions.js";

const store = useTransactionsStore()
const headers = [
  { title: 'Дата', key: 'date' },
  { title: 'Тип', key: 'type' },
  { title: 'Сумма', key: 'amount' },
  { title: 'Описание', key: 'description' }
]

const loading = computed(() => store.loading)
const sortedTransactions = computed(() => store.filteredTransactions)
const transactionsAllCounter = computed(() => store.transactionsAllCounter)
const totalAmount = computed(() => {
  return store.filteredTransactions.reduce((sum, item) => sum + Number(item.amount), 0)
})

const loadItems = ({ page, itemsPerPage, sortBy }) => {
  store.fetchTransactions(page, itemsPerPage, sortBy)
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString()
}
</script>
