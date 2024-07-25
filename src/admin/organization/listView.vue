<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { Brand, Organization } from '@/lib/formModel'

const schema = {
  title: 'Organization',
  table: 'organization',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'State', value: 'state.name', sortable: false },
    { text: 'Operation', value: 'operation' }
  ],
  filter: [{ text: 'state', name: 'State', field: 'state' }],
  operation: {
    add: true,
    edit: true,
    list: true,
    childrenTitle: 'Brand',
    childrenTable: 'brand',
    childrenHeaders: [
      { text: 'Name', value: 'name', sortable: true },
      { text: 'Organization', value: 'organization.name', sortable: false },
      { text: 'Operation', value: 'operation' }
    ]
  },
  children: {
    title: 'Brand',
    table: 'brand',
    parentField: 'organization',
    headers: [
      { text: 'Name', value: 'name', sortable: true },
      { text: 'Organization', value: 'organization.name', sortable: false }
    ],
    filter: [{ text: 'organization', name: 'Organization', field: 'organization' }],
    schema: Brand
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
    :formSchema="Organization.schema"
    :zodSchema="Organization.zSchema"
    :childFormSchema="Brand.schema"
    :childZodSchema="Brand.zSchema"
    :children="schema.children"
  />
</template>
