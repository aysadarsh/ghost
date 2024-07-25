<script setup lang="ts">
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import * as z from 'zod'
import { pass } from '@/lib'
import Swal from 'sweetalert2'
import { IconArrowBack, IconX } from '@tabler/icons-vue'
import Multiselect from 'vue-multiselect'

import { HandleApi } from '@/lib/handleApi'

const store = useStore()

const router = useRouter()

interface forminterface {
  name: string
  _id: string
  organization: string
  storeCount: string
  brief: string
  contractType: string
  contractDocument: string
  contractStartDate: string | Date
  contractEndDate: string | Date
  autoCreateStore: string
  state: string
  city: string
}

const form = ref<forminterface>({
  name: '',
  _id: '',
  organization: '',
  storeCount: '',
  brief: '',
  contractType: '',
  contractDocument: '',
  contractStartDate: '',
  contractEndDate: '',
  autoCreateStore: '',
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

onMounted(async () => {
  console.log(props, 'check props')
  const get = await HandleApi(`brand/${props.organization}`)
  const response = await get.json()
  getOrganizations()
  getState()
  getCities()

  if (pass(get)) {
    console.log(response?.data, 'akjsdaskdj')
    form.value.name = response?.data?.name ?? ''
    form.value._id = response?.data?._id ?? ''
    form.value.state = response?.data?.state ?? ''
    form.value.organization = response?.data?.organization ?? ''
    form.value.city = response?.data?.city ?? ''
    form.value.storeCount = response?.data?.storeCount ?? ''
    form.value.brief = response?.data?.brief ?? ''
    form.value.contractType = response?.data?.contractType ?? ''
    form.value.contractDocument = response?.data?.contractDocument ?? ''
    form.value.contractStartDate = response?.data?.contractStartDate
      ? new Date(response?.data?.contractStartDate).toISOString().slice(0, 10)
      : ''
    form.value.contractEndDate = response?.data?.contractEndDate
      ? new Date(response?.data?.contractEndDate).toISOString().slice(0, 10)
      : ''
  }
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

    const get = await HandleApi(`brand/${props.organization}`, {
      method: 'PUT',
      body: JSON.stringify(form.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await get.json()
    if (pass(get)) {
      Swal.fire({
        title: 'Success!',
        text: 'Brand updated successfully',
        icon: 'success'
      })

      props.closeModal()
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

watch(
  [form, states, organizations, cities],
  ([newForm, newStates, newOrganizations, newCities]) => {
    console.log(newForm, 'new form')
    if (newForm && newStates) {
      if (newForm?.state && newStates.length > 0) {
        selectedState.value = newStates.find((v: any) => v._id === newForm.state)
      }
    }

    if (newForm && newOrganizations) {
      console.log('ckajsdkasdhjaskdsd', newForm, newOrganizations.length)
      if (newForm?.organization && newOrganizations.length > 0) {
        selectedOrganization.value = newOrganizations.find(
          (v: any) => v._id === newForm.organization
        )
      }
    }

    if (newForm && newCities) {
      if (newForm?.city && newCities.length > 0) {
        selectedCity.value = newCities.find((v: any) => v._id === newForm.city)
      }
    }
  },
  { immediate: true }
)

watch(
  selectedState,
  (newState) => {
    getCities(newState._id)
  },
  { immediate: true }
)
</script>

<template>
  <div className="p-2 px-3 mb-4">
    <div className="grid grid-cols-1 gap-x-0 gap-y-6">
      <div className="col">
        <div className="card h-full">
          <div className="card-body">
            <div class="flex justify-between">
              <div>
                <h4 className="text-gray-600 text-lg font-semibold mb-6">Edit Brand</h4>
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
                <div className="">
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
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Organization</label
                  >
                  <multiselect
                    v-model="selectedOrganization"
                    :options="organizations"
                    placeholder="Select industry"
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
                <div className="">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Contract Document</label
                  >
                  <input
                    type="file"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
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

                <div className="">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Contract Start Date</label
                  >
                  <input
                    type="date"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    aria-describedby="hs-input-helper-text"
                    name="contractStartDate"
                    placeholder="Enter Contract start Date"
                    :default-value="form.contractStartDate"
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
