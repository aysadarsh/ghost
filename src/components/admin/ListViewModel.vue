<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import SearchForm from '@/components/admin/SearchForm.vue'
import { pageOption, type Dic, pass, themeColor, type paramOption } from '@/lib'
import { HandleApi } from '@/lib/handleApi'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'
import { IconNewSection, IconPencil, IconX } from '@tabler/icons-vue'
import FormModal from '@/components/admin/FormModal.vue'
import ListViewModel from '@/components/admin/ListViewModel.vue'

import * as z from 'zod'

const props = defineProps<{
  title: string
  table: string
  headers: Header[]
  filter: Dic[]
  formSchema: any
  zodSchema: any[]
  operation: any
  children?: any
  closeModal?: VoidFunction
  isModal?: boolean
  parentFilter?: string
  parentFilterBy?: string
  superParents?: string[]
}>()

const mediaPath = import.meta.env.VITE_MEDIA_PATH
const loading = ref<boolean>(false)

const formType = ref<string>('create')

const parentDocuemntId = ref<string>('')

const getParams = ref<paramOption>({
  pagination: true,
  limit: 10,
  page: 1,
  offset: 0,
  sort: 'desc',
  sortBy: '_id',
  search: '',
  filter: '',
  filterBy: ''
})

const showModal = ref<Dic>({
  add: false,
  list: false,
  form: false
})

const documentId = ref<string>('')

const document = ref<any | null>({})

const metaData = ref<Dic>({})

const list = ref<Dic[]>([])

const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: getParams.value.limit
})

const toggleAddModal = (id: string = '') => {
  parentDocuemntId.value = id
  showModal.value.add = !showModal.value.add
}

const toggleListModal = (id: string = '') => {
  parentDocuemntId.value = id
  showModal.value.list = !showModal.value.list
}

const toggleEditModal = async (id: string = '') => {
  formType.value = 'edit'
  await getDocument(id)

  showModal.value.form = !showModal.value.form
}

const toggleFormModal = () => {
  showModal.value.form = !showModal.value.form
  if (!showModal.value.form && formType.value === 'create') {
    getList(getParams)
  }
}

const toggleCreateModal = () => {
  formType.value = 'create'
  document.value = null
  showModal.value.form = true
}

const getList = async (params: Dic) => {
  loading.value = true

  const searchParams = new URLSearchParams(params)

  const url = `${props.table}/?${searchParams.toString()}`
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    metaData.value = response.metadata
    list.value = response.data
  }
  loading.value = false
}

onMounted(() => {
  console.log(props, 'list view mounted')
  if (props.parentFilter) {
    getParams.value.filter = props.parentFilter
    getParams.value.filterBy = props.parentFilterBy ?? ''
  }
  getList(getParams.value)
})

watch(
  serverOptions,
  (value) => {
    getParams.value.page = value.page
    getParams.value.limit = value.rowsPerPage
    getParams.value.sortBy = value.sortBy ?? getParams.value.sortBy
    getParams.value.sort = value.sortType ?? getParams.value.sort
    getList(getParams.value)
  },
  { deep: true }
)

const getDocument = async (id: any) => {
  const get = await HandleApi(`${props.table}/${id._id}`)
  if (pass(get)) {
    const response = await get.json()
    document.value = response.data
  }
}
</script>
<template>
  <!-- Add model -->
  <div v-if="showModal.add" class="fixed w-full z-50 left-0 top-0 modal max-h-svh overflow-y-auto">
    <div class="container flex justify-center items-center min-h-svh">
      <div class="p-2 top-0 w-full">
        <FormModal
          :closeModal="toggleAddModal"
          :isModal="true"
          :title="children.title"
          :form="children.schema.schema"
          :zodSchema="children.schema.zSchema"
          :table="children.table"
          :formType="`create`"
          :parent="parentDocuemntId"
          :parentField="children.parentField"
          :superParents="children.superParents"
        />
      </div>
    </div>
  </div>
  <!-- / Add Model -->
  <!-- List model -->
  <div
    v-if="showModal.list"
    class="fixed w-full z-50 left-0 top-0 modal max-h-full overflow-y-auto"
  >
    <div class="container flex justify-center items-center min-h-svh">
      <div class="w-full">
        <ListViewModel
          :closeModal="toggleListModal"
          :isModal="true"
          :title="children?.title ?? ''"
          :table="children?.table ?? ''"
          :headers="children?.headers ?? []"
          :operation="{}"
          :filter="children?.filter ?? []"
          :formSchema="children.schema"
          :zodSchema="children.zSchema"
          :parent="parentDocuemntId"
          :parentFilterBy="children.parentField"
          :parentFilter="parentDocuemntId"
        />
      </div>
    </div>
  </div>
  <!-- / List Model -->

  <!-- create model -->
  <div
    v-if="showModal.form"
    class="fixed w-full z-50 left-0 top-0 modal max-h-full overflow-y-auto"
  >
    <div class="container flex justify-center items-center min-h-svh">
      <div class="w-full">
        <FormModal
          :closeModal="toggleFormModal"
          :isModal="true"
          :title="title"
          :form="formSchema"
          :zodSchema="zodSchema"
          :table="table"
          :formType="formType"
          :document="document"
          :superParents="superParents"
        />
      </div>
    </div>
  </div>
  <!-- / Create Model -->

  <!-- Edit model -->
  <div
    v-if="showModal.edit"
    class="fixed w-full z-50 left-0 top-0 modal max-h-full overflow-y-auto"
  >
    <div class="container flex justify-center items-center min-h-svh">
      <div class="w-full">
        <ListBrand :closeModal="toggleListModal" :documentId="documentId" :isModal="true" />
      </div>
    </div>
  </div>
  <!-- / Edit Model -->
  <!-- Listing table -->
  <div className="p-2 px-3 mb-4">
    <div className="grid grid-cols-1 gap-x-0 gap-y-6">
      <div className="col">
        <div className="card h-full">
          <div className="card-body">
            <div class="flex justify-between">
              <div>
                <h4 className="text-gray-600 text-lg font-semibold mb-6">{{ title }}</h4>
              </div>
              <div>
                <button v-if="isModal" :onclick="closeModal">
                  <IconX size="24" class="me-2" />
                </button>
                <button
                  v-else
                  className="flex bg-blue-600 text-white p-2 px-4 rounded-3xl shadow-md"
                  v-on:click="toggleCreateModal"
                >
                  <IconNewSection size="24" class="me-2" />
                  Create
                </button>
              </div>
            </div>
            <div className="flex mb-2">
              <SearchForm :params="getParams" :getList="getList" :filter="filter" />
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
                <div class="operation-wrapper flex items-center">
                  <button
                    v-if="operation.add"
                    @click="toggleAddModal(item?._id)"
                    class="flex bg-blue-600 text-white p-2 px-4 rounded-3xl shadow-md text-[13px] me-2"
                  >
                    Add {{ children.title }}
                  </button>
                  <button
                    v-if="operation.list"
                    @click="toggleListModal(item?._id)"
                    class="flex bg-blue-600 text-white p-2 px-4 rounded-3xl shadow-md text-[13px] me-2"
                  >
                    View {{ children.title }}
                  </button>
                  <button
                    @click="toggleEditModal(item)"
                    class="bg-yellow-500 rounded-full text-white h-8 w-8 shadow-md me-2 flex items-center justify-center"
                  >
                    <IconPencil size="20" />
                  </button>
                </div>
              </template>
              <template #item-media="item">
                <div class="audio-wrapper flex items-center">
                  <audio :src="`${mediaPath}${item.media}`" controls></audio>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
