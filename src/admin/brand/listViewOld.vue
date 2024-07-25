<script setup lang="ts">
import { HandleApi } from '@/lib/handleApi'
import { IconNewSection } from '@tabler/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { pageOption, pass, themeColor, type Dic } from '@/lib'
import { IconPencil, IconX, IconSearch } from '@tabler/icons-vue'
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'
import AdminListSearch from '@/components/AdminListSearch.vue'
import AddBrandZoneComponent from '@/admin/zone/createView.vue'
import EditView from '@/admin/brand/editView.vue'

const metaData = ref<any | null>(null)
const list = ref<Item>([])

const loading = ref<boolean>(false)

const getParams = ref<any | null>(pageOption)

const filter = ref<Dic[]>([{ text: 'organization', name: 'Organization', field: 'organization' }])

const showEditModel = ref<boolean>(false)

const organizationId = ref<String>('')

const brandId = ref<String>('')

const router = useRouter()

const showAddBrandModal = ref<boolean>(false)
const headers = ref<Header[]>([
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Organization', value: 'organization.name', sortable: false }
])

const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: getParams.value.limit
})

const props = defineProps({
  isModal: { type: Boolean, default: false, isRequired: false },
  closeModal: { type: Function as () => void, isRequired: false },
  organization: { type: String, isRequired: false }
})

onMounted(() => {
  getParams.value = pageOption
  if (!props.isModal) {
    headers.value.push({ text: 'Operation', value: 'operation' })
    console.log(headers, 'check headers')
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

const getList = async (params: Dic) => {
  console.log(params, 'check list function')
  loading.value = true
  if (props.organization) {
    params.organization = props.organization
  }
  const searchParams = new URLSearchParams(params)

  const url = `brand/?${searchParams.toString()}`
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    metaData.value = response.metadata
    list.value = response.data
  }
  loading.value = false
}

const toggleAddModal = (id: string = '') => {
  showAddBrandModal.value = !showAddBrandModal.value
}

const toggleEditModel = (id: string = '') => {
  organizationId.value = id
  showEditModel.value = !showEditModel.value
}
</script>

<template>
  <!-- Add model -->
  <div
    v-if="showAddBrandModal"
    class="fixed w-full z-50 left-0 top-0 modal max-h-svh overflow-y-auto"
  >
    <div class="container flex justify-center items-center min-h-svh">
      <div class="p-2 top-0 w-full">
        <AddBrandZoneComponent :closeModal="toggleAddModal" :brand="brandId" :isModal="true" />
      </div>
    </div>
  </div>
  <!-- / Add Model -->
  <!-- Edit model -->
  <div v-if="showEditModel" class="fixed w-full z-50 left-0 top-0 modal max-h-svh overflow-y-auto">
    <div class="container flex justify-center items-center min-h-svh">
      <div class="p-2 top-0 w-full">
        <EditView :closeModal="toggleEditModel" :organization="organizationId" :isModal="true" />
      </div>
    </div>
  </div>
  <!-- / Add Model -->
  <div className="p-2 px-3 mb-4">
    <div className="grid grid-cols-1 gap-x-0 gap-y-6">
      <div className="col">
        <div className="card h-full">
          <div className="card-body">
            <div class="flex justify-between">
              <div>
                <h4 className="text-gray-600 text-lg font-semibold mb-6">Brand</h4>
              </div>
              <div v-if="isModal">
                <button :onclick="closeModal">
                  <IconX size="24" class="me-2" />
                </button>
              </div>
              <div v-else>
                <!-- <RouterLink
                  type="submit"
                  className="flex bg-blue-600 text-white p-2 px-4 rounded-3xl shadow-md"
                  to="/admin/brand/create"
                >
                  <IconNewSection size="24" class="me-2" />
                  Create
                </RouterLink> -->
                <button
                  @click="toggleAddBrandModal()"
                  class="flex bg-blue-600 text-white p-2 px-4 rounded-3xl shadow-md text-[13px] me-2"
                >
                  <IconNewSection size="24" class="me-2" />
                  Create
                </button>
              </div>
            </div>

            <AdminListSearch :getList="getList" :params="getParams" :filter="filter" />

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
              <template v-if="!isModal" #item-operation="item">
                <div class="operation-wrapper flex items-center">
                  <button
                    @click="toggleAddModal(item?._id)"
                    class="flex bg-blue-600 text-white p-2 px-4 rounded-3xl shadow-md text-[13px] me-2"
                  >
                    Add Brand Zone
                  </button>
                  <button
                    @click="toggleListModal(item?._id)"
                    class="flex bg-blue-600 text-white p-2 px-4 rounded-3xl shadow-md text-[13px] me-2"
                  >
                    View Brand Zone
                  </button>
                  <button
                    @click="toggleEditModel(item._id)"
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
