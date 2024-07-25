<script setup lang="ts">
import { HandleApi } from '@/lib/handleApi'
import { IconNewSection } from '@tabler/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { pageOption, pass, themeColor } from '@/lib'
import { IconPencil, IconX, IconSearch } from '@tabler/icons-vue'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'

const metaData = ref<any | null>(null)
const list = ref<Item>([])
const itemsSelected = ref<Item>([])
const loading = ref<boolean>(false)

const getParams = ref<any | null>(pageOption)

const searchInput = ref<HTMLInputElement | null>(null)

const router = useRouter()

const headers: Header[] = [
  { text: 'Name', value: 'name', sortable: true },
  //   { text: 'State', value: 'state.name', sortable: false },
  { text: 'Operation', value: 'operation' }
]

const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: getParams.value.limit
})

onMounted(() => {
  getParams.value = pageOption

  getList()
})

watch(
  serverOptions,
  (value) => {
    getParams.value.page = value.page
    getParams.value.limit = value.rowsPerPage
    getParams.value.sortBy = value.sortBy ?? getParams.value.sortBy
    getParams.value.sort = value.sortType ?? getParams.value.sort
    getList()
  },
  { deep: true }
)

const getList = async () => {
  loading.value = true
  const searchParams = new URLSearchParams(getParams?.value)
  const url = `playlist/?${searchParams.toString()}`
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    metaData.value = response.metadata
    list.value = response.data
  }
  loading.value = false
}

const handleEdit = (item: Item) => {
  return router.push(`/admin/playlist/${item._id}`)
}

const handlesearch = async (e: Event) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  getParams.value.search = formData.get('search')
  getList()
}

const resetSearch = async () => {
  getParams.value.search = ''
  if (searchInput?.value) {
    searchInput.value.value = ''
  }
  getList()
}
</script>

<template>
  <div className="p-2 px-3 mb-4">
    <div className="grid grid-cols-1 gap-x-0 gap-y-6">
      <div className="col">
        <div className="card h-full">
          <div className="card-body">
            <div class="flex justify-between">
              <div>
                <h4 className="text-gray-600 text-lg font-semibold mb-6">Playlist</h4>
              </div>
              <div>
                <RouterLink
                  type="submit"
                  className="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
                  to="/admin/playlist/create"
                >
                  <IconNewSection size="24" class="me-2" />
                  Create
                </RouterLink>
              </div>
            </div>
            <div className="flex mb-2">
              <form method="post" @submit.prevent="handlesearch" className="me-2">
                <div
                  className="flex items-center focus-within:border-blue-600 border  border-gray-200 rounded-md "
                >
                  <input
                    type="text"
                    placeholder="Search ..."
                    id="search"
                    className="py-3 border-none px-4 block w-full text-sm focus:ring-0 rounded-md focus:border-none focus-visible:outline-nonem flex-grow"
                    aria-describedby="hs-input-helper-text"
                    name="search"
                    ref="searchInput"
                  />
                  <button type="submit" className="hover:bg-slate-100 py-3">
                    <div className="w-12 flex justify-center items-center">
                      <IconSearch size="24" className="text-xl mx-2"></IconSearch>
                    </div>
                  </button>
                  <button
                    type="button"
                    @click="resetSearch"
                    className="hover:bg-slate-100 py-3 rounded-e-md"
                  >
                    <div className="w-12 flex justify-center items-center">
                      <IconX size="24" className="text-xl mx-2"></IconX>
                    </div>
                  </button>
                </div>
              </form>
            </div>

            <EasyDataTable
              v-model:server-options="serverOptions"
              :headers="headers"
              :items="list"
              :theme-color="themeColor"
              :server-items-length="metaData?.total ?? 1"
              :loading="loading"
              buttons-pagination
              table-class-name="customize-table"
            >
              <template #item-operation="item">
                <div class="operation-wrapper">
                  <button
                    @click="handleEdit(item)"
                    class="bg-yellow-500 rounded-full text-white h-8 w-8 shadow-md me-2 flex items-center justify-center"
                  >
                    <IconPencil size="20" />
                  </button>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
