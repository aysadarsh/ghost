<script setup lang="ts">
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import * as z from 'zod'
import { pass } from '@/lib'
import Swal from 'sweetalert2'
import { IconArrowBack } from '@tabler/icons-vue'
import Multiselect from 'vue-multiselect'

import { HandleApi } from '@/lib/handleApi'

const store = useStore()

const router = useRouter()

const form = ref({
  name: '',
  _id: '',
  industry: '',
  registredAddress: '',
  pincode: '',
  contacts: [],
  costType: '',
  amount: '',
  billingCycle: '',
  paymentMode: '',
  prepaidPer: '',
  postpaidPer: '',
  state: '',
  city: ''
})

const costTypeOptions = ref<string[]>(['Fixed', 'Perstore'])

const billingCycleOptions = ref<string[]>(['Monthly', 'Quarterly', 'Half-yearly', 'Yearly'])

const states = ref<any[] | null>([])
const cities = ref<any[] | null>([])

const selectedState = ref<any | null>('')
const selectedCity = ref<any | null>('')
const selectedIndustry = ref<any | null>(null)

const paymentModeOptions = ref<string[]>(['Prepaid', 'Postpaid', 'Others'])

const message = ref('')
const formSchema = z.object({
  name: z.string().min(1, 'Please enter organization name'),
  industry: z.string().min(1, 'Please select industry'),
  registredAddress: z.string().min(1, 'Please enter Address'),
  pincode: z.string().min(1, 'Please enter pincode'),
  costType: z.string().min(1, 'Please select cost type'),
  amount: z.string().min(1, 'Please enter amount'),
  billingCycle: z.string().min(1, 'Please select billing cycle'),
  paymentMode: z.string().min(1, 'Please select payment mode'),
  state: z.string().min(1, 'Please select state'),
  city: z.string().min(1, 'Please select city')
})

type formSchemaType = z.infer<typeof formSchema>

const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null)
const industries = ref<any[] | null>([])
const props = defineProps({
  id: { type: String, required: true }
})

onMounted(async () => {
  const get = await HandleApi(`organization/${props.id}`)
  const response = await get.json()
  getIndustry()
  getState()
  getCities()

  if (pass(get)) {
    console.log(response?.data, 'akjsdaskdj')
    form.value.name = response?.data?.name ?? ''
    form.value._id = response?.data?._id ?? ''
    form.value.state = response?.data?.state ?? ''
    form.value.industry = response?.data?.industry ?? ''
    form.value.city = response?.data?.city ?? ''
    form.value.registredAddress = response?.data?.registredAddress ?? ''
    form.value.pincode = response?.data?.pincode ?? ''
    form.value.costType = response?.data?.costType ?? ''
    form.value.amount = response?.data?.amount ?? ''
    form.value.billingCycle = response?.data?.billingCycle ?? ''
    form.value.paymentMode = response?.data?.paymentMode ?? ''
    form.value.prepaidPer = response?.data?.prepaidPer ?? ''
    form.value.postpaidPer = response?.data?.postpaidPer ?? ''

    console.log(form, 'akjsdaskdj')
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

const getIndustry = async () => {
  const url = `industry`
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    industries.value = response.data
  }
}

const handleSubmit = async (e: Event) => {
  try {
    e.preventDefault()
    store.state.awating = true
    message.value = ''
    form.value.industry = selectedIndustry?.value?._id ?? ''
    form.value.state = selectedState?.value?._id ?? ''
    form.value.city = selectedCity?.value?._id ?? ''

    const validScehma = formSchema.safeParse(form.value)
    if (!validScehma.success) {
      store.state.awating = false
      return (errors.value = validScehma.error.format())
    }

    errors.value = null

    const get = await HandleApi(`organization/${props.id}`, {
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
        text: 'Organization updated successfully',
        icon: 'success'
      })

      return router.push({ name: 'admin-organization' })
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

watch(
  [form, states, industries, cities],
  ([newForm, newStates, newIndustries, newCities]) => {
    if (newForm && newStates) {
      if (newForm?.state && newStates.length > 0) {
        selectedState.value = newStates.find((v: any) => v._id === newForm.state)
      }
    }

    if (newForm && newIndustries) {
      if (newForm?.industry && newIndustries.length > 0) {
        selectedIndustry.value = newIndustries.find((v: any) => v._id === newForm.industry)
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
                <h4 className="text-gray-600 text-lg font-semibold mb-6">Edit Organization</h4>
              </div>
              <div>
                <RouterLink
                  type="submit"
                  className="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
                  to="/admin/organization"
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
                  <label className="block text-sm font-semibold mb-2 text-gray-600"> Name </label>
                  <input
                    type="text"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    :class="errors?.name ? 'border-red-400' : ''"
                    aria-describedby="hs-input-helper-text"
                    name="name"
                    placeholder="Enter Name"
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
                  <label className="block text-sm font-semibold mb-2 text-gray-600">Industry</label>
                  <multiselect
                    v-model="selectedIndustry"
                    :options="industries"
                    placeholder="Select industry"
                    :class="errors?.industry ? 'border-red-400' : ''"
                    label="name"
                    track-by="name"
                  ></multiselect>
                  <div v-if="errors?.industry" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.industry?._errors">{{
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
                    >Registred address</label
                  >
                  <textarea
                    name="registredAddress"
                    class="w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    v-model="form.registredAddress"
                    :class="errors?.registredAddress ? 'border-red-400' : ''"
                  ></textarea>
                  <div v-if="errors?.registredAddress" class="text-red-400 text-[14px]">
                    <span
                      :key="index"
                      v-for="(error, index) in errors?.registredAddress?._errors"
                      >{{ error }}</span
                    >
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">Pincode</label>
                  <input
                    type="text"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    :class="errors?.pincode ? 'border-red-400' : ''"
                    aria-describedby="hs-input-helper-text"
                    name="pincode"
                    placeholder="Enter pincode"
                    defaultValue=""
                    v-model="form.pincode"
                  />
                  <div v-if="errors?.pincode" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.pincode?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Cost Type</label
                  >
                  <multiselect
                    :class="errors?.costType ? 'border-red-400' : ''"
                    v-model="form.costType"
                    :options="costTypeOptions"
                    placeholder="Select cost type"
                  ></multiselect>
                  <div v-if="errors?.costType" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.costType?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>

                <div className="">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">Amount</label>
                  <input
                    type="text"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    :class="errors?.amount ? 'border-red-400' : ''"
                    aria-describedby="hs-input-helper-text"
                    name="amount"
                    placeholder="Enter amount"
                    defaultValue=""
                    v-model="form.amount"
                  />
                  <div v-if="errors?.amount" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.amount?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Billing Cycle</label
                  >
                  <multiselect
                    v-model="form.billingCycle"
                    :options="billingCycleOptions"
                    placeholder="Select billing cycle"
                    :class="errors?.billingCycle ? 'border-red-400' : ''"
                  ></multiselect>
                  <div v-if="errors?.billingCycle" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.billingCycle?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"
                    >Payment Mode</label
                  >
                  <multiselect
                    v-model="form.paymentMode"
                    :options="paymentModeOptions"
                    placeholder="Select payment mode"
                    :class="errors?.paymentMode ? 'border-red-400' : ''"
                  ></multiselect>
                  <div v-if="errors?.paymentMode" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.paymentMode?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div v-if="form.paymentMode === 'Others'">
                  <div className="">
                    <label className="block text-sm font-semibold mb-2 text-gray-600"
                      >Prepaid %</label
                    >
                    <input
                      type="text"
                      class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                      aria-describedby="hs-input-helper-text"
                      name="prepaidPer"
                      placeholder="Enter prepaid percentage"
                      defaultValue=""
                      v-model="form.prepaidPer"
                    />
                  </div>
                  <div className="">
                    <label className="block text-sm font-semibold mb-2 text-gray-600"
                      >Postpaid %</label
                    >
                    <input
                      type="text"
                      class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                      aria-describedby="hs-input-helper-text"
                      name="postpaidPer"
                      placeholder="Enter postpaid percentage"
                      defaultValue=""
                      v-model="form.postpaidPer"
                    />
                  </div>
                </div>
                <div class="flex justify-center mt-2">
                  <button
                    type="submit"
                    className="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
                  >
                    Submit
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
