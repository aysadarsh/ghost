<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { BrandZone, Store } from '@/lib/formModel'

const schema = {
  title: 'Brand Zone',
  table: 'brandZone',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'Brand', value: 'brand.name', sortable: true },
    { text: 'Operation', value: 'operation' }
  ],
  filter: [
    { text: 'organization', name: 'Organization', field: 'organization' },
    { text: 'brand', name: 'Brand', field: 'brand' }
  ],
  operation: {
    add: true,
    edit: true,
    list: true
  },
  children: {
    title: 'Store',
    table: 'store',
    parentField: 'brandZone',
    superParents: ['brand'],
    headers: [
      { text: 'Name', value: 'name', sortable: true },
      { text: 'Brand Zone', value: 'brandZone.name', sortable: true }
    ],
    filter: [
      { text: 'organization', name: 'Organization', field: 'organization' },
      { text: 'brand', name: 'Brand', field: 'brand' },
      { text: 'brandZone', name: 'Brand Zone', field: 'brandZone' }
    ],
    schema: Store
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
    :formSchema="BrandZone.schema"
    :zodSchema="BrandZone.zSchema"
    :children="schema.children"
  />
</template>
