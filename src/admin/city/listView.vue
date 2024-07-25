<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { City as TableSchama } from '@/lib/formModel'

const schema = {
  title: 'City',
  table: 'city',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'State', value: 'state.name', sortable: true },
    { text: 'Operation', value: 'operation', sortable: true }
  ],
  filter: [{ text: 'state', name: 'State', field: 'state' }],
  operation: {
    add: false,
    edit: true,
    list: false
  },
  children: {}
}
</script>

<template>
  <ListViewModel
    :title="schema.title"
    :table="schema.table"
    :headers="schema.headers"
    :operation="schema.operation"
    :filter="schema.filter"
    :formSchema="TableSchama.schema"
    :zodSchema="TableSchama.zSchema"
    :children="schema.children"
  />
</template>
