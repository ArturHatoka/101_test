<template>
  <v-card class="pa-4 mb-4">
    <v-row>
      <v-col cols="12" sm="4">
        <v-select
          label="Тип транзакции"
          :items="['all', 'income', 'expense']"
          v-model="selectedType"
          dense
          variant="outlined"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-menu
          v-model="fromMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="formattedFromDate"
              label="От"
              readonly
              dense
              v-bind="props"
              variant="outlined"
            />
          </template>
          <v-date-picker
            v-model="fromDateIso"
            show-adjacent-months
            @update:modelValue="fromMenu = false"
          />
        </v-menu>
      </v-col>
      <v-col cols="12" sm="4">
        <v-menu
          v-model="toMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template #activator="{ props }">
            <v-text-field
              v-model="formattedToDate"
              label="До"
              readonly
              dense
              v-bind="props"
              variant="outlined"
            />
          </template>
          <v-date-picker
            v-model="toDateIso"
            show-adjacent-months
            @update:modelValue="toMenu = false"
          />
        </v-menu>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTransactionsStore } from "@/stores/transactions.js";

const store = useTransactionsStore()

const selectedType = ref('all')
const fromMenu = ref(false)
const toMenu = ref(false)
const fromDateIso = ref(null)
const toDateIso = ref(null)

const formattedFromDate = computed(() => {
  return fromDateIso.value ? new Date(fromDateIso.value).toLocaleDateString() : ''
})
const formattedToDate = computed(() => {
  return toDateIso.value ? new Date(toDateIso.value).toLocaleDateString() : ''
})

const applyFilters = () => {
  store.setFilters({
    type: selectedType.value,
    fromDate: fromDateIso.value,
    toDate: toDateIso.value
  })
}

watch([selectedType, fromDateIso, toDateIso], applyFilters)
</script>
