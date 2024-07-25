<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { BrandZone, Store, User } from '@/lib/formModel'

const schema = {
  title: 'Store',
  table: 'store',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'Brand', value: 'brand.name', sortable: false },
    { text: 'Brand zone', value: 'brandZone.name', sortable: false },
    { text: 'Operation', value: 'operation' }
  ],
  filter: [
    { text: 'brand', name: 'Brand', field: 'brand' },
    { text: 'brandZone', name: 'Brand Zone', field: 'branZone' }
  ],
  operation: {
    add: true,
    edit: true,
    list: true
  },
  children: {
    title: 'User',
    table: 'user',
    parentField: 'store',
    superParents: ['brand', 'brandZone'],
    headers: [
      { text: 'Name', value: 'name', sortable: true },
      { text: 'Email', value: 'email', sortable: false },
      { text: 'Store', value: 'store.name', sortable: false }
    ],
    filter: [{ text: 'store', name: 'Store', field: 'store' }],
    schema: User
  }
}
</script>

<template>
  <ListViewModel
    :title="schema.title"
    :table="schema.table"
    :headers="schema.headers"
    :operation="schema.operation"
    :filter="schema.filter"
    :formSchema="Store.schema"
    :zodSchema="Store.zSchema"
    :children="schema.children"
  />
</template>
