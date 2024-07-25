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
  username: '',
  password: '',
  email: '',
  brand: '',
  brandZone: '',
  role: ''
})

const message = ref('')
const formSchema = z.object({
  name: z.string().min(1, 'name must be at least 3 characters long'),
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'invalid role')
})

type formSchemaType = z.infer<typeof formSchema>

const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null)
const brands = ref<any[] | null>([])
const brandZones = ref<any[] | null>([])
const roles = ref<any[] | null>([])

const selectedBrand = ref<any | null>(null)
const selectedBrandZone = ref<any | null>(null)
const selectedRole = ref<any | null>(null)

const props = defineProps({
  id: { type: String, required: true }
})

onMounted(async () => {
  // console.log(props.id, 'check oprios')
  const get = await HandleApi(`user/${props.id}`)
  const response = await get.json()
  getBrand()
  getBrandZone()
  getRole()

  if (pass(get)) {
    form.value.name = response?.data?.name ?? ''
    form.value._id = response?.data?._id ?? ''
    form.value.username = response?.data?.username ?? ''
    form.value.password = ''
    form.value.email = response?.data?.email ?? ''
    form.value.brand = response?.data?.brand ?? ''
    form.value.brandZone = response?.data?.brandZone ?? ''
    form.value.role = response?.data?.roles?.[0] ?? ''
  }
})

const getBrand = async () => {
  const url = `brand`
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    brands.value = response.data
  }
}

const getBrandZone = async (id: string = '') => {
  let url = `brandZone`
  if (id) {
    url = `brandZone?where=${id}&&whereBy=brand`
  }
  const get = await HandleApi(url)
  const response = await get.json()

  if (pass(get)) {
    brandZones.value = response.data
  }
}

const getRole = async () => {
  let url = `role`

  const get = await HandleApi(url)
  const response = await get.json()
  console.log('roles', response)
  if (pass(get)) {
    roles.value = response.data
  }
}

const handleSubmit = async (e: Event) => {
  try {
    e.preventDefault()
    store.state.awating = true
    message.value = ''
    form.value.brand = selectedBrand.value?._id ?? ''
    form.value.brandZone = selectedBrandZone.value?._id ?? ''
    form.value.role = selectedRole.value?._id ?? ''

    const validScehma = formSchema.safeParse(form.value)
    if (!validScehma.success) {
      store.state.awating = false
      return (errors.value = validScehma.error.format())
    }

    errors.value = null

    const get = await HandleApi(`user/${props.id}`, {
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
        text: 'User updated successfully',
        icon: 'success'
      })

      return router.push({ name: 'admin-user' })
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
  selectedBrand,
  (newBrand) => {
    getBrandZone(newBrand?._id)
  },
  { immediate: true }
)
watch(
  [form, brands, brandZones, roles],
  ([newForm, newBrands, newBrandZones, newRoles]) => {
    console.log(newForm, 'form updated roles')
    if (newForm && newBrands) {
      if (newForm?.brand && newBrands.length > 0) {
        selectedBrand.value = newBrands.find((v: any) => v._id === newForm.brand)
      }
    }

    if (newForm && newBrandZones) {
      if (newForm?.brandZone && newBrandZones.length > 0) {
        selectedBrandZone.value = newBrandZones.find((v: any) => v._id === newForm.brandZone)
      }
    }

    if (newForm?.role && newRoles) {
      selectedRole.value = newRoles.find((v: any) => v._id === newForm.role)
    }
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
                <h4 className="text-gray-600 text-lg font-semibold mb-6">Edit User</h4>
              </div>
              <div>
                <RouterLink
                  type="submit"
                  className="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
                  to="/admin/store"
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
                <div className="">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">
                    Username
                  </label>
                  <input
                    type="text"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    :class="errors?.name ? 'border-red-400' : ''"
                    aria-describedby="hs-input-helper-text"
                    name="username"
                    placeholder="Enter username"
                    defaultValue=""
                    v-model="form.username"
                  />
                  <div v-if="errors?.username" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.username?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">Email</label>
                  <input
                    type="email"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    :class="errors?.email ? 'border-red-400' : ''"
                    aria-describedby="hs-input-helper-text"
                    name="email"
                    placeholder="Enter email"
                    defaultValue=""
                    v-model="form.email"
                  />
                  <div v-if="errors?.email" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.email?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">Password</label>
                  <input
                    type="password"
                    class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
                    aria-describedby="hs-input-helper-text"
                    name="password"
                    placeholder="Password"
                    defaultValue=""
                    v-model="form.password"
                  />
                  <!-- <div v-if="errors?.password" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.password?._errors">{{
                      error
                    }}</span>
                  </div>
                  <div v-else class="text-red-400 text-[14px]">&nbsp;</div> -->
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"> Brand </label>
                  <multiselect
                    v-model="selectedBrand"
                    :options="brands"
                    placeholder="Select brand"
                    label="name"
                    track-by="name"
                  ></multiselect>
                  <!-- <div v-if="errors?.brand" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.brand?._errors">{{
                      error
                    }}</span>
                  </div> -->
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600">
                    Brand Zone</label
                  >
                  <multiselect
                    v-model="selectedBrandZone"
                    :options="brandZones"
                    placeholder="Select brand zone"
                    label="name"
                    track-by="name"
                  ></multiselect>
                  <!-- <div v-if="errors?.brandZone" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.brandZone?._errors">{{
                      error
                    }}</span>
                  </div> -->
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2 text-gray-600"> Role</label>
                  <multiselect
                    v-model="selectedRole"
                    :options="roles"
                    placeholder="Select role"
                    label="name"
                    track-by="name"
                    :class="errors?.role ? 'border-red-400' : ''"
                  ></multiselect>
                  <div v-if="errors?.role" class="text-red-400 text-[14px]">
                    <span :key="index" v-for="(error, index) in errors?.role?._errors">{{
                      error
                    }}</span>
                  </div>
                </div>
                <div class="flex justify-center mt-8">
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
