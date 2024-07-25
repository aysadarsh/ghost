<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { User } from '@/lib/formModel'

const schema = {
  title: 'User',
  table: 'user',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'Email', value: 'email', sortable: false },
    { text: 'Store', value: 'store.name', sortable: false },
    { text: 'Operation', value: 'operation' }
  ],
  filter: [
    { text: 'brand', name: 'Brand', field: 'brand' },
    { text: 'brandZone', name: 'Brand Zone', field: 'branZone' },
    { text: 'store', name: 'Store', field: 'store' }
  ],
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
    :formSchema="User.schema"
    :zodSchema="User.zSchema"
    :children="schema.children"
  />
</template>
