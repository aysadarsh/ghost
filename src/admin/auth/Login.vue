<script lang="ts" setup>
import { pass } from '@/lib'
import LogoImg from '../../assets/images/Logo.png'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/store'
import * as z from 'zod'
import { ref } from 'vue'
import { IconEye } from '@tabler/icons-vue'

const store = useStore()

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const message = ref('')
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Invalid password' })
})

type formSchemaType = z.infer<typeof formSchema>

const errors = ref<z.ZodFormattedError<formSchemaType> | null>(null)

const showPassword = ref<boolean>(false)

const handleShowPassword = (e: Event) => {
  showPassword.value = !showPassword.value
}

const login = async (e: Event) => {
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

    const get = await fetch(`${import.meta.env.VITE_API_URL}auth/login`, {
      method: 'POST',
      body: JSON.stringify(form.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = await get.json()
    if (pass(get)) {
      if (response.token) {
        console.log(response)
        store.setToken(response.token)
        store.setUser(response.user)
        // console.log(store.state.token, 'state after loagin')
        router.push('/admin')
      }
    } else {
      if (response.errors) {
        errors.value = response.errors
      }

      if (response?.fail) {
        message.value = response?.fail
      }
    }
    store.state.awating = false
  } catch (e) {
    store.state.awating = false
    message.value = 'login failed !'
  }
}
</script>

<template>
  <main>
    <div class="min-h-screen flex items-center justify-center">
      <div class="justify-center items-center w-full card lg:flex max-w-md">
        <div class="w-full card-body">
          <a href="../" class="pb-4 block">
            <div class="flex justify-center items-center">
              <div
                class="bg-blue-600 rounded-full w-20 h-20 flex justify-center items-center border-4 shadow-md"
              >
                <img :src="LogoImg" alt="" class="mx-auto h-14" />
              </div>
            </div>
          </a>
          <p class="mb-4 text-gray-500 text-sm text-center">Your Social Campaigns</p>

          <div class="text-red-400 text-[14px] mb-1" id="message">{{ message }} &nbsp;</div>

          <form method="POST" @submit.prevent="login">
            <div class="mb-4">
              <label class="block text-sm font-semibold mb-2 text-gray-600"> Email </label>
              <input
                type="email"
                class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0 border-gray-200"
                aria-describedby="hs-input-helper-text"
                name="email"
                :class="errors?.email ? 'border-red-400' : ''"
                v-model="form.email"
              />
              <div v-if="errors?.email" class="text-red-400 text-[14px]">
                <span :key="index" v-for="(error, index) in errors?.email?._errors">{{
                  error
                }}</span>
              </div>
              <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-semibold mb-2 text-gray-600"> Password </label>
              <div
                class="w-full border rounded-md text-sm focus-within:border-blue-600 focus:ring-0 border-gray-200 flex"
                :class="errors?.password ? 'border-red-400' : ''"
              >
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="forPassword"
                  class="w-full py-3 rounded-md text-sm border-none focus:ring-0"
                  aria-describedby="hs-input-helper-text"
                  name="password"
                  v-model="form.password"
                />
                <button type="button" class="px-2" @click.prevent="handleShowPassword">
                  <IconEye size="24"></IconEye>
                </button>
              </div>

              <div v-if="errors?.password" class="text-red-400 text-[14px]">
                <span :key="index" v-for="(error, index) in errors?.password?._errors">{{
                  error
                }}</span>
              </div>
              <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
            </div>

            <!-- <div class="flex justify-between">
              <div class="flex">
                <input
                  type="checkbox"
                  class="shrink-0 mt-0.5 border-gray-200 rounded-[4px] text-blue-600 focus:ring-blue-500 "
                  id="hs-default-checkbox"
                  checked="true"
                />
                <label class="text-sm text-gray-600 ms-3"> Remeber this Device </label>
              </div>
              <a href="../" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot Password ?
              </a>
            </div> -->

            <div class="grid my-6">
              <button
                type="submit"
                class="btn py-[10px] text-base text-white font-medium hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>

            <div class="flex justify-center gap-2 items-center">
              <!-- <p class="text-base font-medium text-gray-500">New to Modernize?</p> -->
              <a
                href="./authentication-register.html"
                class="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forget password
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
