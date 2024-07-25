<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { Media } from '@/lib/formModel'

const schema = {
  title: 'Media',
  table: 'media',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'Audio', value: 'media' },
    { text: 'Operation', value: 'operation' }
  ],
  filter: [
    // { text: 'organization', name: 'Organization', field: 'organization' },
    // { text: 'brand', name: 'Brand', field: 'brand' }
  ],
  operation: {
    add: false,
    edit: false,
    list: false
  },
  children: {
    // title: 'Store',
    // table: 'store',
    // parentField: 'brandZone',
    // superParents: ['brand'],
    // headers: [
    //   { text: 'Name', value: 'name', sortable: true },
    //   { text: 'Brand Zone', value: 'brandZone.name', sortable: true }
    // ],
    // filter: [
    //   { text: 'organization', name: 'Organization', field: 'organization' },
    //   { text: 'brand', name: 'Brand', field: 'brand' },
    //   { text: 'brandZone', name: 'Brand Zone', field: 'brandZone' }
    // ],
    // schema: Store
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
    :formSchema="Media.schema"
    :zodSchema="Media.zSchema"
    :children="schema.children"
  />
</template>
