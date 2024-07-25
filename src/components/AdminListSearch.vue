<script setup lang="ts">
import { IconX, IconSearch } from '@tabler/icons-vue'
import { ref, watch } from 'vue'
import { pass, type Dic } from '@/lib/index'
import Multiselect from 'vue-multiselect'
import { HandleApi } from '@/lib/handleApi'

const props = defineProps<{
  params: Dic
  getList: Function
  filter?: Dic[]
}>()

const searchText = ref<String>('')

const selectedFilterBy = ref<any | null>(null)
const selectedFilter = ref<any | null>(null)

const filterOptions = ref<any[]>([])

const handleSearch = (e: SubmitEvent) => {
  e.preventDefault()
  const newParams = props.params
  newParams.page = 1
  newParams.search = searchText.value
  if (selectedFilter.value) {
    newParams.filterBy = selectedFilterBy.value.field
    newParams.filter = selectedFilter.value._id
  }
  props.getList(newParams)
}

const resetSearch = (e: Event) => {
  e.stopPropagation()
  searchText.value = ''
  const newParams = props.params
  newParams.search = searchText.value
  newParams.filterBy = null
  newParams.filter = null
  props.getList(newParams)
}

const getFilterOptions = async (filter: Dic) => {
  if (filter) {
    const get = await HandleApi(filter.text, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (pass(get)) {
      const response = await get.json()
      if (response?.data) {
        filterOptions.value = response.data
      }
    }
  }
}

watch(
  selectedFilterBy,
  async (newFilter) => {
    getFilterOptions(newFilter)
  },
  { immediate: true }
)
</script>

<template>
  <div className="flex mb-2">
    <form method="post" :onsubmit="handleSearch" className="me-2 flex">
      <div
        className="flex items-center focus-within:border-blue-600 border  border-gray-200 rounded-md me-2"
      >
        <input
          type="text"
          placeholder="Search ..."
          className="py-3 border-none px-4 block w-full text-sm focus:ring-0 rounded-md focus:border-none focus-visible:outline-nonem flex-grow"
          aria-describedby="hs-input-helper-text"
          v-model="searchText"
        />
        <div v-if="filter" class="flex items-center justify-center rounded-md">
          <div class="w-64 no-border-multiselect">
            <multiselect
              v-model="selectedFilterBy"
              :options="filter"
              placeholder="Filter by"
              label="name"
              track-by="name"
            ></multiselect>
          </div>
          <div class="w-64 no-border-multiselect" :key="index" v-for="(value, index) in filter">
            <multiselect
              v-model="selectedFilter"
              :options="filterOptions"
              placeholder="Select option"
              label="name"
              track-by="name"
            ></multiselect>
          </div>
        </div>
        <button type="submit" className="hover:bg-slate-100 py-3">
          <div className="w-12 flex justify-center items-center">
            <IconSearch size="24" className="text-xl mx-2"></IconSearch>
          </div>
        </button>
        <button
          type="button"
          :onclick="resetSearch"
          className="hover:bg-slate-100 py-3 rounded-e-md"
        >
          <div className="w-12 flex justify-center items-center">
            <IconX size="24" className="text-xl mx-2"></IconX>
          </div>
        </button>
      </div>
    </form>
  </div>
</template>
