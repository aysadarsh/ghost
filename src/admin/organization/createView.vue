<script setup lang="ts">
import { IconNewSection, IconArrowBack } from '@tabler/icons-vue'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import * as z from 'zod'
import { pageOption, pass } from '@/lib'
import Swal from 'sweetalert2'

import { HandleApi } from '@/lib/handleApi'
import Multiselect from 'vue-multiselect'

const store = useStore()

const router = useRouter()

const form = ref({
  name: '',
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

const paymentModeOptions = ref<string[]>(['Prepaid', 'Postpaid', 'Others'])

const formStep = ref<number>(1)

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

const selectedIndustry = ref<any | null>(null)

onMounted(() => {
  getIndustry()
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
    errors.value = null
    form.value.industry = selectedIndustry?.value?._id ?? ''
    form.value.state = selectedState?.value?._id ?? ''
    form.value.city = selectedCity?.value?._id ?? ''
    // form stap 1
    if (formStep.value === 1) {
      let formSchema = z.object({
        name: z.string().min(1, 'Please enter organization name'),
        industry: z.string().min(1, 'Please select industry')
      })
      const validScehma = formSchema.safeParse(form.value)
      if (!validScehma.success) {
        store.state.awating = false
        return (errors.value = validScehma.error.format())
      }
      formStep.value = 2
    } else if (formStep.value === 2) {
      let formSchema = z.object({
        registredAddress: z.string().min(1, 'Please enter Address'),
        pincode: z.string().min(1, 'Please enter pincode'),
        state: z.string().min(1, 'Please select state'),
        city: z.string().min(1, 'Please select city')
      })
      const validScehma = formSchema.safeParse(form.value)
      if (!validScehma.success) {
        store.state.awating = false
        return (errors.value = validScehma.error.format())
      }
      formStep.value = 3
    } else if (formStep.value === 3) {
      let formSchema = z.object({
        costType: z.string().min(1, 'Please select cost type'),
        amount: z.string().min(1, 'Please enter amount'),
        billingCycle: z.string().min(1, 'Please select billing cycle'),
        paymentMode: z.string().min(1, 'Please select payment mode')
      })
      const validScehma = formSchema.safeParse(form.value)
      if (!validScehma.success) {
        store.state.awating = false
        return (errors.value = validScehma.error.format())
      }

      const get = await HandleApi(`organization/create`, {
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
          text: 'Organization created successfully',
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

watch(
  selectedState,
  (newState) => {
    getCities(newState._id)
  },
  { immediate: true }
)
</script>

<template>
  <div class="p-2 px-3 mb-4">
    <div class="grid grid-cols-1 gap-x-0 gap-y-6">
      <div class="col">
        <div class="card h-full">
          <div class="card-body">
            <div class="flex justify-between">
              <div>
                <h4 class="text-gray-600 text-lg font-semibold mb-6">Create Organization</h4>
              </div>
              <div>
                <RouterLink
                  type="submit"
                  class="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
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
                <label class="text-gray-400 text-[25px] mb-4 inline-block">{{
                  formStep === 2 ? 'Address' : formStep === 3 ? 'Cost Model' : 'Details'
                }}</label>
                <div
                  v-if="formStep === 1"
                  v-motion-roll-visible-left
                  class="border border-gray-100 rounded-md p-3"
                >
                  <div class="">
                    <label class="block text-sm font-semibold mb-2 text-gray-600"> Name </label>
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
                  <div class="mb-4">
                    <label class="block text-sm font-semibold mb-2 text-gray-600">Industry</label>
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
                </div>
                <div
                  v-if="formStep === 2"
                  v-motion-roll-visible-left
                  class="border border-gray-100 rounded-md p-3"
                >
                  <div class="mb-2">
                    <label class="block text-sm font-semibold mb-2 text-gray-600"
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
                  <div class="grid md:grid-cols-3">
                    <div class="mb-4 md:me-2">
                      <label class="block text-sm font-semibold mb-2 text-gray-600">State</label>
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
                    <div class="mb-4 md:me-2">
                      <label class="block text-sm font-semibold mb-2 text-gray-600">City</label>
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

                    <div class="">
                      <label class="block text-sm font-semibold mb-2 text-gray-600">Pincode</label>
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
                  </div>
                </div>
                <div
                  v-if="formStep === 3"
                  v-motion-roll-visible-left
                  class="border border-gray-100 rounded-md p-3"
                >
                  <div class="grid md:grid-cols-2">
                    <div class="mb-2 md:me-2">
                      <label class="block text-sm font-semibold mb-2 text-gray-600"
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

                    <div class="">
                      <label class="block text-sm font-semibold mb-2 text-gray-600">Amount</label>
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
                    <div class="mb-2 md:me-2">
                      <label class="block text-sm font-semibold mb-2 text-gray-600"
                        >Billing Cycle</label
                      >
                      <multiselect
                        v-model="form.billingCycle"
                        :options="billingCycleOptions"
                        placeholder="Select billing cycle"
                        :class="errors?.billingCycle ? 'border-red-400' : ''"
                      ></multiselect>
                      <div v-if="errors?.billingCycle" class="text-red-400 text-[14px]">
                        <span
                          :key="index"
                          v-for="(error, index) in errors?.billingCycle?._errors"
                          >{{ error }}</span
                        >
                      </div>
                      <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                    </div>

                    <div class="mb-2">
                      <label class="block text-sm font-semibold mb-2 text-gray-600"
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
                    <div
                      class="mb-2 grid md:grid-cols-2 md:col-span-2"
                      v-if="form.paymentMode === 'Others'"
                    >
                      <div class="md:me-2">
                        <label class="block text-sm font-semibold mb-2 text-gray-600"
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
                        <!-- <div v-if="errors?.prepaidPer" class="text-red-400 text-[14px]">
                      <span :key="index" v-for="(error, index) in errors?.prepaidPer?._errors">{{
                        error
                      }}</span>
                    </div>
                    <div v-else class="text-red-400 text-[14px]">&nbsp;</div> -->
                      </div>
                      <div class="">
                        <label class="block text-sm font-semibold mb-2 text-gray-600"
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
                  </div>
                </div>
                <div class="flex justify-center mt-8">
                  <button
                    type="submit"
                    class="flex bg-blue-600 text-white p-2 px-2 min-w-20 justify-center rounded-md shadow-md"
                  >
                    {{ formStep === 3 ? 'Submit' : 'Next' }}
                  </button>
                  <button
                    v-if="formStep > 1"
                    type="button"
                    class="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md mx-2 min-w-20 justify-center"
                    @click.prevent="formStep = formStep - 1"
                  >
                    Back
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
