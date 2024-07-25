<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { Licence as TableSchama } from '@/lib/formModel'

const schema = {
  title: 'Licence',
  table: 'licence',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'Operation', value: 'operation', sortable: true }
  ],
  filter: [],
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
