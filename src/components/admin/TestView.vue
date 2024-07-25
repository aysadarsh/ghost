<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ListViewModel from '@/components/admin/ListViewModel.vue'
import { object, z, ZodSchema } from 'zod'
import { pass, type Dic } from '@/lib'
import { HandleApi } from '@/lib/handleApi'

const states = ref<Dic[]>([])
const cities = ref<Dic[]>([])
const industries = ref<Dic[]>([])

const schema = {
  title: 'Organization',
  table: 'organization',
  headers: [
    { text: 'Name', value: 'name', sortable: true },
    { text: 'State', value: 'state.name', sortable: false },
    { text: 'Operation', value: 'operation' }
  ],
  filter: [{ text: 'state', name: 'State', field: 'state' }],
  operation: { add: true, edit: true, list: true, childrenTitle: 'Brand', childrenTable: 'brand' }
}

const formSchema = ref<any>([
  {
    name: { title: 'Name', type: 'text', value: '' },
    industry: {
      title: 'Industry',
      type: 'select',
      value: '',
      table: 'industry',
      options: industries,
      optionfield: 'name'
    }
  },
  {
    registredAddress: { title: 'Registred Address', type: 'textarea', value: '' },
    state: {
      title: 'State',
      type: 'select',
      value: '',
      table: 'state',
      options: states,
      optionfield: 'name'
    },
    city: {
      title: 'City',
      type: 'select',
      value: '',
      table: 'city',
      filter: 'state',
      options: cities,
      optionfield: 'name'
    },
    pincode: { title: 'Pincode', type: 'text', value: '' }
  },
  {
    // contacts: { title: 'contacts', type: 'text', value: '' },
    costType: { title: 'Cost Type', type: 'select', value: '', options: ['Fixed', 'Perstore'] },
    amount: { title: 'Amount', type: 'text', value: '' },
    billingCycle: {
      title: 'Billing Cycle',
      type: 'select',
      value: '',
      options: ['Monthly', 'Quarterly', 'Half-yearly', 'Yearly']
    },
    paymentMode: {
      title: 'Payment Mode',
      type: 'select',
      value: '',
      options: ['Prepaid', 'Postpaid', 'Others']
    },
    prepaidPer: {
      title: 'Prepaid Per',
      type: 'texts',
      value: ''
    },
    postpaidPer: {
      title: 'Postpaid Per',
      type: 'text',
      value: ''
    }
  }
])

const zformSchema = ref<z.AnyZodObject[]>([
  z.object({
    name: z.string().min(1, 'Please enter organization name'),
    industry: z.string().min(1, 'Please select industry')
  }),
  z.object({
    registredAddress: z.string().min(1, 'Please enter Address'),
    pincode: z.string().min(1, 'Please enter pincode'),
    state: z.string().min(1, 'Please select state'),
    city: z.string().min(1, 'Please select city')
  }),
  z.object({
    costType: z.string().min(1, 'Please select cost type'),
    amount: z.string().min(1, 'Please enter amount'),
    billingCycle: z.string().min(1, 'Please select billing cycle'),
    paymentMode: z.string().min(1, 'Please select payment mode')
  })
])

//
onMounted(() => {
  getStates()
  getCities()
  getIndustry()
})

const getStates = async () => {
  const get = await HandleApi('state')
  if (pass(get)) {
    const response = await get.json()
    states.value = response.data
  }
}

const getCities = async () => {
  const get = await HandleApi('city')
  if (pass(get)) {
    const response = await get.json()
    cities.value = response.data
  }
}

const getIndustry = async () => {
  const get = await HandleApi('industry')
  if (pass(get)) {
    const response = await get.json()
    industries.value = response.data
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
    :formSchema="formSchema"
    :zodSchema="zformSchema"
  />
</template>
