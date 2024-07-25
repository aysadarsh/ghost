<script setup lang="ts">
import { IconNewSection, IconArrowBack } from '@tabler/icons-vue'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import * as z from 'zod'
import { pass } from '@/lib'
import Swal from 'sweetalert2'

import { HandleApi } from '@/lib/handleApi'

const store = useStore()

const router = useRouter()

const form = ref({
  name: ''
})

const message = ref('')
const formSchema = z.object({
  name: z.string().min(1, 'Please enter state name')
})

type formSchemaType = z.infer<typeof formSchema>

const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null)

const handleSubmit = async (e: Event) => {
  try {
    e.preventDefault()
    store.state.awating = true
    message.value = ''

    const validScehma = formSchema.safeParse(form.value)
    if (!validScehma.success) {
      store.state.awating = false
      return (errors.value = validScehma.error.format())
    }

    errors.value = null

    const get = await HandleApi(`state/create`, {
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
        text: 'State created successfully',
        icon: 'success'
      })

      return router.push({ name: 'admin-state' })
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
</script>

<template>
  <div className="p-2 px-3 mb-4">
    <div className="grid grid-cols-1 gap-x-0 gap-y-6">
      <div className="col">
        <div className="card h-full">
          <div className="card-body">
            <div class="flex justify-between">
              <div>
                <h4 className="text-gray-600 text-lg font-semibold mb-6">Create State</h4>
              </div>
              <div>
                <RouterLink
                  type="submit"
                  className="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
                  to="/admin/state"
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
                <div class="flex justify-center">
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
