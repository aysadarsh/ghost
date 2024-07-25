<script setup lang="ts">
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { MusicLabel as TableSchama } from '@/lib/formModel'

const schema = {
  title: 'Music label',
  table: 'musiclabel',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'Licence', value: 'licence.name', sortable: true },
    { text: 'Operation', value: 'operation', sortable: true }
  ],
  filter: [{ text: 'licence', name: 'Licence', field: 'licence' }],
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
