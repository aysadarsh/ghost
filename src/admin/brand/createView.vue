<script setup lang="ts">
import { IconNewSection, IconArrowBack, IconX } from '@tabler/icons-vue'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import * as z from 'zod'
import { pageOption, pass } from '@/lib'
import Swal from 'sweetalert2'

import { HandleApi } from '@/lib/handleApi'
import Multiselect from 'vue-multiselect'
import type { Dic } from '@/lib'

const store = useStore()

const router = useRouter()

const form = ref({
  name: '',
  organization: '',
  storeCount: '',
  brief: '',
  contractType: '',
  contractDocument: '',
  contractStartDate: '',
  contractEndDate: '',
  autoCreateStore: false,
  state: '',
  city: ''
})

const contractTypeOptions = ref<string[]>(['Demo', 'Live'])

const states = ref<any[] | null>([])
const cities = ref<any[] | null>([])
const organizations = ref<any[] | null>([])

const selectedState = ref<any | null>('')
const selectedCity = ref<any | null>('')
const selectedOrganization = ref<any | null>('')

const isChecked = ref(false)

const message = ref('')
const formSchema = z.object({
  name: z.string().min(1, 'Please enter brand name'),
  organization: z.string().min(1, 'Please select organization'),
  storeCount: z.string().min(1, 'Please enter no of store'),
  brief: z.string().min(1, 'Please enter brief'),
  contractType: z.string().min(1, 'Please select contract type'),
  state: z.string().min(1, 'Please select state'),
  city: z.string().min(1, 'Please select city')
})

type formSchemaType = z.infer<typeof formSchema>

const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null)

const props = defineProps<{
  isModal: Boolean
  closeModal: VoidFunction
  organization?: String
}>()

onMounted(() => {
  getOrganizations()
  getState()
  getCities()
})

const getState = async () => {
  const url = `state`
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    states.value = response.data
  }
}

const getCities = async (id: string = '') => {
  let url = `city`
  if (id) {
    url = `city?where=${id}&&whereBy=state`
  }
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    cities.value = response.data
  }
}

const getOrganizations = async () => {
  const url = `organization`
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    organizations.value = response.data
    if (props.organization) {
      selectedOrganization.value = response.data.find((v: Dic) => v._id === props.organization)
    }
  }
}

const handleSubmit = async (e: Event) => {
  try {
    e.preventDefault()
    store.state.awating = true
    message.value = ''
    form.value.organization = selectedOrganization?.value?._id ?? ''
    form.value.state = selectedState?.value?._id ?? ''
    form.value.city = selectedCity?.value?._id ?? ''
    const validScehma = formSchema.safeParse(form.value)
    if (!validScehma.success) {
      store.state.awating = false
      return (errors.value = validScehma.error.format())
    }

    errors.value = null

    const get = await HandleApi(`brand/create`, {
      method: 'POST',
      body: JSON.stringify(form.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await get.json()
    if (pass(get)) {
      Swal.fire({
        title: 'Success!',
        text: 'Brand created successfully',
        icon: 'success'
      })
      props.closeModal()
      // return router.push({ name: 'admin-brand' })
    } else {
      if (response.errors) {
        errors.value = response.errors
      }

      if (response?.message) {
        Swal.fire({
          title: 'Oops...',
          text: response.message,
          icon: 'warning'
        })
      }
    }
    store.state.awating = false
  } catch (e) {
    console.log('eeeee', e)
    store.state.awating = false
    Swal.fire({
      title: 'Oops...',
      text: 'Something went wrong!',
      icon: 'error'
    })
  }
}
const handleContractUpload = () => {
  console.log('hnalde upload')
}

const handleCheckboxChange = (e: Event) => {
  event?.preventDefault()

  // isChecked.value = !isChecked.value
}
watch(
  selectedState,
  (newState) => {
    getCities(newState._id)
  },
  { immediate: true }
)

// watch(
//   props,
//   (newProps) => {
//     //
//     if(newProps.organization)
//     {}
//   },
//   { immediate: true }
// )
</script>

<template>
  <div className="p-2 px-3 mb-4">
    <div className="grid grid-cols-1 gap-x-0 gap-y-6">
      <div className="col">
        <div className="card h-full">
          <div className="card-body">
            <div class="flex justify-between">
              <div>
                <h4 className="text-gray-600 text-lg font-semibold mb-6">Add Brand</h4>
              </div>
              <div v-if="isModal">
                <button @click="closeModal">
                  <IconX size="24" class="me-2" />
                </button>
              </div>
              <div v-else>
                <RouterLink
                  type="submit"
                  className="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
                  to="/admin/brand"
                >
                  <IconArrowBack size="24" class="me-2" />
                  Back
                </RouterLink>
              </div>
            </div>
            <div class="text-red-400 text-[14px] mb-1" id="message">{{ message }} &nbsp;</div>

            <form method="POST" @submit.prevent="handleSubmit">
              <div class="grid">
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Organization</label
                  >
                  <multiselect
                    v-model="selectedOrganization"
                    :options="organizations"
                    placeholder="Select organization"
                    :class="errors?.organization ? 'border-red-400' : ''"
                    label="name"
                    track-by="name"
                  ></multiselect>
                  <div v-if="errors?.organization" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.organization?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"> Name </label>
                  <input
                    type="text"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    :class="errors?.name ? 'border-red-400' : ''"
                    aria-describedby="hs-input-helper-text"
                    name="name"
                    placeholder="Enter name"
                    defaultValue=""
                    v-model="form.name"
                  />
                  <div v-if="errors?.name" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.name?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>

                <div className="">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">
                    No of stores
                  </label>
                  <input
                    type="text"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    :class="errors?.storeCount ? 'border-red-400' : ''"
                    aria-describedby="hs-input-helper-text"
                    name="storeCount"
                    placeholder="Enter no of stores"
                    defaultValue=""
                    v-model="form.storeCount"
                  />
                  <div v-if="errors?.storeCount" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.storeCount?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div class="mb-4">
                  <label class="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value="1"
                      class="sr-only peer"
                      v-model="form.autoCreateStore"
                    />
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-3xl peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-500"
                      >Auto create Store</span
                    >
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">Brief</label>
                  <textarea
                    name="brief"
                    class="w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    v-model="form.brief"
                    :class="errors?.brief ? 'border-red-400' : ''"
                  ></textarea>
                  <div v-if="errors?.brief" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.brief?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">State</label>
                  <multiselect
                    v-model="selectedState"
                    :options="states"
                    placeholder="Select state"
                    :class="errors?.state ? 'border-red-400' : ''"
                    label="name"
                    track-by="name"
                  ></multiselect>
                  <div v-if="errors?.state" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.state?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">City</label>
                  <multiselect
                    v-model="selectedCity"
                    :options="cities"
                    placeholder="Select city"
                    :class="errors?.city ? 'border-red-400' : ''"
                    label="name"
                    track-by="name"
                  ></multiselect>
                  <div v-if="errors?.city" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.city?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Contract Type</label
                  >
                  <multiselect
                    :class="errors?.contractType ? 'border-red-400' : ''"
                    v-model="form.contractType"
                    :options="contractTypeOptions"
                    placeholder="Select contract type"
                  ></multiselect>
                  <div v-if="errors?.contractType" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.contractType?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Contract Document</label
                  >
                  <input
                    type="file"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0 border"
                    aria-describedby="hs-input-helper-text"
                    name="contractDocument"
                    placeholder="Contract Document"
                    defaultValue=""
                    :onchange="handleContractUpload"
                  />
                  <!-- <div v-if="errors?.contractDocument" class="text-red-400 text-[14px]">
                    <span
                      :key="index"
                      v-for="(error, index) in errors?.contractDocument?._errors"
                      >{{ error }}</span
                    >
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div> -->
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Contract Start Date</label
                  >
                  <input
                    type="date"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    aria-describedby="hs-input-helper-text"
                    name="contractStartDate"
                    placeholder="Enter Contract start Date"
                    defaultValue=""
                    v-model="form.contractStartDate"
                  />
                  <!-- <div v-if="errors?.contractStartDate" class="text-red-400 text-[14px]">
                    <span
                      :key="index"
                      v-for="(error, index) in errors?.contractStartDate?._errors"
                      >{{ error }}</span
                    >
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div> -->
                </div>
                <div className="">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Contract End Date</label
                  >
                  <input
                    type="date"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    aria-describedby="hs-input-helper-text"
                    name="contractEndDate"
                    placeholder="Enter Contract end Date"
                    defaultValue=""
                    v-model="form.contractEndDate"
                  />
                  <!-- <div v-if="errors?.contractEndDate" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.contractEndDate?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div> -->
                </div>

                <div class="flex justify-center mt-8">
                  <button
                    type="submit"
                    className="flex bg-blue-600 text-white p-2 px-4 rounded-md shadow-md me-2"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="flex bg-orange-600 text-white p-2 px-4 rounded-md shadow-md"
                    @click="closeModal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
