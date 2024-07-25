<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { Brand, BrandZone } from '@/lib/formModel'

const schema = {
  title: 'Brand',
  table: 'brand',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'Organization', value: 'organization.name', sortable: false },
    { text: 'Operation', value: 'operation' }
  ],
  filter: [{ text: 'organization', name: 'Organization', field: 'organization' }],
  operation: {
    add: true,
    edit: true,
    list: true
  },
  children: {
    title: 'Brand Zone',
    table: 'brandZone',
    parentField: 'brand',
    headers: [
      { text: 'Name', value: 'name', sortable: true },
      { text: 'Brand', value: 'brand.name', sortable: false }
    ],
    filter: [{ text: 'brand', name: 'Brand', field: 'brand' }],
    schema: BrandZone
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
    :formSchema="Brand.schema"
    :zodSchema="Brand.zSchema"
    :children="schema.children"
  />
</template>
