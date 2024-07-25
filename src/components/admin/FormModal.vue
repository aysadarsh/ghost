<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { IconEye, IconX } from '@tabler/icons-vue'
import * as z from 'zod'
import Multiselect from 'vue-multiselect'
import { type Dic, pass } from '@/lib'
import { HandleApi } from '@/lib/handleApi'
import Swal from 'sweetalert2'

const props = defineProps<{
  closeModal: VoidFunction
  isModal: Boolean
  title: String | undefined
  form: any
  zodSchema: z.AnyZodObject[]
  table: string
  formType: string
  document?: any
  parent?: string
  superParents?: string[]
  parentField?: any
}>()

const forceText = ref<boolean>(false)
// let originalFormData = []

const formData = ref<any>(props.form)

const errors = ref<any | null>(null)

const superParentIds = ref<any>({})

const superParentIndex = ref<any>({})

const formStep = ref<number>(0)

const message = ref<String>('')
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  errors.value = null
  let validForm: Dic = {}

  Object.keys(formData.value[formStep.value]).map((v: string) => {
    if (
      formData.value[formStep.value][v].type === 'select' &&
      formData.value[formStep.value][v].optionfield
    ) {
      // console.log(formData.value[formStep.value][v].value, 'dkahdkashdjasghdjasgdhasfdhafdh')
      validForm[v] = formData.value[formStep.value][v].value._id
    } else {
      validForm[v] = formData.value[formStep.value][v].value
    }
  })

  const validate = props.zodSchema[formStep.value].safeParse(validForm)
  if (validate.success && formStep.value < formData.value.length - 1) {
    return ++formStep.value
  }
  if (validate.error) {
    let fieldErrors = validate.error.flatten()
    console.log('validation errors', fieldErrors, validForm)
    return (errors.value = fieldErrors.fieldErrors)
  }

  // ++formStep.value

  // create new entry
  const body = {}
  formData.value.map((form: Dic) => {
    Object.keys(form).map((v: any) => {
      if (form[v].type === 'select' && form[v].optionfield) {
        console.log(form[v].value)
        Object.assign(body, { [v]: form[v].value._id })
      } else {
        Object.assign(body, { [v]: form[v].value })
      }
    })
  })

  let url = 'create'
  const option = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (props.formType === 'edit') {
    option.method = 'PUT'
    url = props.document._id
  }

  const get = await HandleApi(`${props.table}/${url}`, option)

  const response = await get.json()
  if (pass(get)) {
    Swal.fire({
      title: 'Success!',
      text: `${props.title} ${props.formType === 'edit' ? 'updated' : 'created'} successfully`,
      icon: 'success'
    })

    props.closeModal()
  } else {
    if (response.errors) {
      errors.value = response.errors.fieldErrors
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

const handleSelectChange = async (e: any, field: any) => {
  if (field === 'state') {
    formData.value[formStep.value].city.value = ''
    const newCities = await getSelectOptions('city', e?._id, 'state')
    formData.value[formStep.value].city.options = newCities
  } else if (field === 'brand') {
    formData.value[formStep.value].city.value = ''
    const newBrandZones = await getSelectOptions('brandZone', e?._id, 'brand')
    formData.value[formStep.value].brandZone.options = newBrandZones
  }
}

onMounted(async () => {
  formData.value.map((form: Dic, index: number) => {
    Object.keys(form).map(async (v: string) => {
      // reset form value when click on create model
      if (props.formType === 'create') {
        formData.value[index][v].value = ''
      }
      // foreach for all select option containing field model
      if (formData.value[index][v].type === 'select' && formData.value[index][v].optionfield) {
        // get option from api

        formData.value[index][v].options = await getSelectOptions(formData.value[index][v].table)
        if (props.superParents?.includes(v)) {
          superParentIndex.value[v] = index
        }

        // set parent field pre selected
        if (props.parentField && props.parent && props.parentField === v) {
          formData.value[index][v].value = formData.value[index][v].options.find(
            (vj: Dic) => vj._id === props.parent
          )

          // set super parents id
          if (
            props.superParents &&
            props.superParents?.length > 0 &&
            formData.value[index][v].options.length > 0
          ) {
            props.superParents.map((fiel: string) => {
              let superparentId =
                formData.value[index][v].options?.[0]?.[fiel]?._id ??
                formData.value[index][v].options?.[0]?.[fiel]
              superParentIds.value[fiel] = superparentId
            })
          }
        }

        if (props.document) {
          if (props.document[v]?._id) {
            formData.value[index][v].value = formData.value[index][v].options.find(
              (vj: Dic) => vj._id === props.document[v]._id
            )
          } else {
            formData.value[index][v].value = formData.value[index][v].options.find(
              (vj: Dic) => vj._id === props.document[v]
            )
          }
        }
      } else if (formData.value[index][v].type === 'date' && props.document) {
        if (formData.value[index][v].value) {
          formData.value[index][v].value = new Date(props.document[v]).toISOString().slice(0, 10)
        }
      } else if (props.document) {
        formData.value[index][v].value = props.document[v]
      }
    })
  })
})

const getSelectOptions = async (table: string, documentId: string = '', by: string = '') => {
  let url = table
  if (documentId) {
    url = `${table}?filter=${documentId}&filterBy=${by}`
  }
  const get = await HandleApi(url)
  if (pass(get)) {
    const response = await get.json()
    return response.data
  }
}

const uploadFile = async (e: Event, field: string) => {
  let url = 'file/upload'
  let target = e.currentTarget as HTMLInputElement
  if (target?.files) {
    console.log(target.files, 'files')
    const newformData = new FormData()
    newformData.append('file', target.files[0])
    const get = await HandleApi(url, { body: newformData, method: 'POST' })
    if (pass(get)) {
      const response = await get.json()
      formData.value[formStep.value][field].value = response.path
    }
  }
}

watch(
  [formData, superParentIds],
  ([newformData, newSuperParentId]) => {
    Object.keys(newSuperParentId).map((v: any) => {
      let index = superParentIndex.value[v]
      if (newformData[index][v].value === '' && newformData[index][v].options.length > 0) {
        let selectedValue = newformData[index][v].options.find(
          (d: Dic) => d._id === superParentIds.value[v]
        )
        formData.value[index][v].value = selectedValue
        console.log(index, selectedValue, formData.value[index][v].value)
      }
    })
  },
  { immediate: true, deep: true }
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
                <h4 className="text-gray-600 text-lg font-semibold mb-2">
                  {{ formType === 'edit' ? 'Edit' : 'Add' }} {{ title }}
                </h4>
              </div>
              <div v-if="isModal">
                <button :onclick="closeModal">
                  <IconX size="24" class="me-2" />
                </button>
              </div>
            </div>
            <div class="text-red-400 text-[14px] mb-1" id="message">{{ message }} &nbsp;</div>

            <form method="POST" @submit.prevent="handleSubmit" enctype="multipart/form-data">
              <div :key="index" v-for="(step, index) in formData">
                <div v-if="formStep === index">
                  <div :key="j" v-for="(v, j) in Object.keys(step)">
                    <div v-if="step[v].type === 'textarea'">
                      <div class="mb-1">
                        <label class="block text-sm font-semibold mb-2 text-gray-600">{{
                          step[v].title
                        }}</label>
                        <textarea
                          :name="v"
                          class="w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                          v-model="formData[index][v].value"
                          :class="errors?.[v] ? 'border-red-400' : ''"
                        ></textarea>
                        <div v-if="errors?.[v]" class="text-red-400 text-[14px]">
                          <span :key="index" v-for="(error, index) in errors?.[v]"
                            >{{ error }} !</span
                          >
                        </div>
                        <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                      </div>
                    </div>
                    <div v-else-if="step[v].type === 'select'">
                      <div class="mb-1">
                        <label class="block text-sm font-semibold mb-2 text-gray-600">{{
                          step[v].title
                        }}</label>

                        <multiselect
                          v-if="step[v].optionfield"
                          v-model="formData[index][v].value"
                          :options="step[v].options"
                          :placeholder="`Select ${step[v].title}`"
                          :class="errors?.[v] ? 'border-red-400' : ''"
                          label="name"
                          track-by="name"
                          @select="handleSelectChange($event, step[v].table)"
                        ></multiselect>
                        <multiselect
                          v-else
                          v-model="formData[index][v].value"
                          :options="step[v].options"
                          :placeholder="`Select ${step[v].title}`"
                          :class="errors?.[v] ? 'border-red-400' : ''"
                          @select="handleSelectChange($event, step[v].table)"
                        ></multiselect>
                        <div v-if="errors?.[v]" class="text-red-400 text-[14px]">
                          <span :key="index" v-for="(error, index) in errors?.[v]"
                            >{{ error }} !</span
                          >
                        </div>
                        <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                      </div>
                    </div>
                    <div v-else-if="step[v].type === 'hidden'">
                      <input type="hidden" v-model="formData[index][v].value" />
                    </div>
                    <div v-else-if="step[v].type === 'file'">
                      <div class="mb-1">
                        <label class="block text-sm font-semibold mb-2 text-gray-600">
                          {{ step[v].title }}
                        </label>
                        <div
                          class="py-1 flex px-1 block w-full rounded-md text-sm focus-within:border-blue-600 focus:ring-0 border"
                          :class="errors?.[v] ? 'border-red-400' : ''"
                        >
                          <input
                            type="file"
                            class="block w-full rounded-md text-sm focus:ring-0 border-none"
                            aria-describedby="hs-input-helper-text"
                            :name="v"
                            :placeholder="`Enter ${formData[index][v].title}`"
                            :defaultValue="formData[index][v].value"
                            v-on:change.prevent="uploadFile($event, formData[index][v].affected)"
                            :accept="formData[index][v].accept ?? '*'"
                          />

                          <button
                            v-if="step[v].type === 'password'"
                            v-on:click.prevent="forceText = !forceText"
                          >
                            <IconEye size="24" />
                          </button>
                        </div>
                        <div v-if="errors?.[v]" class="text-red-400 text-[14px]">
                          <span :key="index" v-for="(error, index) in errors?.[v]"
                            >{{ error }} !</span
                          >
                        </div>
                        <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                      </div>
                    </div>
                    <div v-else>
                      <div
                        v-if="
                          (['postpaidPer', 'prepaidPer'].includes(v) &&
                            formData[index].paymentMode.value === 'Others') ||
                          !['postpaidPer', 'prepaidPer'].includes(v)
                        "
                        class="mb-1"
                      >
                        <label class="block text-sm font-semibold mb-2 text-gray-600">
                          {{ step[v].title }}
                        </label>
                        <div
                          class="py-1 flex px-1 block w-full rounded-md text-sm focus-within:border-blue-600 focus:ring-0 border"
                          :class="errors?.[v] ? 'border-red-400' : ''"
                        >
                          <input
                            :type="forceText ? 'text' : step[v].type"
                            class="block w-full rounded-md text-sm focus:ring-0 border-none"
                            aria-describedby="hs-input-helper-text"
                            :name="v"
                            :placeholder="`Enter ${formData[index][v].title}`"
                            :defaultValue="formData[index][v].value"
                            v-model="formData[index][v].value"
                          />

                          <button
                            v-if="step[v].type === 'password'"
                            v-on:click.prevent="forceText = !forceText"
                          >
                            <IconEye size="24" />
                          </button>
                        </div>
                        <div v-if="errors?.[v]" class="text-red-400 text-[14px]">
                          <span :key="index" v-for="(error, index) in errors?.[v]"
                            >{{ error }} !</span
                          >
                        </div>
                        <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="flex justify-center">
                  <button
                    type="submit"
                    class="flex bg-blue-600 text-white p-2 px-2 rounded-md justify-center shadow-md min-w-24"
                  >
                    {{ formStep === formData.length - 1 ? 'Submit' : 'Next' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="flex justify-evenly items-stretch">
            <button
              v-if="formStep > 0"
              type="button"
              class="flex bg-slate-100 text-gray-500 text-[14px] p-2 px-2 border w-full justify-center"
              @click.prevent="formStep = formStep - 1"
            >
              Back
            </button>
            <button
              class="flex bg-slate-100 text-gray-500 text-[14px] p-2 px-2 border w-full justify-center"
              v-on:click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
