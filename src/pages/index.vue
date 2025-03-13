<template>
  <v-container class="py-4">
    <FilterPanel />
    <TransactionTable />
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTransactionsStore } from "@/stores/transactions.js";
import FilterPanel from '../components/FilterPanel.vue'
import TransactionTable from '../components/TransactionTable.vue'

const store = useTransactionsStore()

onMounted(() => {
  store.fetchTransactions()
})
</script>
