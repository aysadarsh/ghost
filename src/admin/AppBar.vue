<script setup lang="ts">
import ProfilePic from '@/assets/images/profile/user-2.jpg'
import { IconMenu2, IconBellRinging } from '@tabler/icons-vue'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
const { resetAuth } = useStore()

const toggleMenu = ref<boolean>(false)

const menuRef = ref(null)

const router = useRouter()

const handletoggleMenu = () => {
  toggleMenu.value = !toggleMenu.value
}

onClickOutside(menuRef, (event) => (toggleMenu.value = false))

const handlelogout = () => {
  resetAuth()
  router.push({ name: 'admin' })
}
</script>

<template>
  <header class="container full-container w-full text-sm py-5 xl:px-9 px-5 max-h-[60px]">
    <nav class="w-full flex items-center justify-between" aria-label="Global">
      <ul class="icon-nav flex items-center gap-4">
        <li class="relative">
          <button class="text-xl sm:block md:hidden icon-hover cursor-pointer text-heading">
            <IconMenu2 size="24" class="relative z-1"></IconMenu2>
          </button>
        </li>
        <li class="relative">
          <div
            class="hs-dropdown relative inline-flex [--placement:bottom-left] sm:[--trigger:hover]"
          >
            <a class="relative hs-dropdown-toggle inline-flex icon-hover text-gray-600" href="#">
              <IconBellRinging size="24" class="text-xl relative z-[1]"></IconBellRinging>
              <div
                class="absolute inline-flex items-center justify-center text-white text-[11px] font-medium bg-blue-600 w-2 h-2 rounded-full -top-[1px] -right-[6px]"
              ></div>
            </a>
            <div
              class="card hs-dropdown-menu transition-[opacity,margin] border border-gray-400 rounded-md duration hs-dropdown-open:opacity-100 opacity-0 mt-2 min-w-max w-[300px] hidden z-[12]"
              aria-labelledby="hs-dropdown-custom-icon-trigger"
            >
              <div>
                <h3 class="text-gray-600 font-semibold text-base px-6 py-3">Notification</h3>
                <ul class="list-none flex flex-col">
                  <li>
                    <a href="#" class="py-3 px-6 block hover:bg-blue-500">
                      <p class="text-sm text-gray-600 font-semibold">Roman Joined the Team!</p>
                      <p class="text-xs text-gray-500 font-medium">Congratulate him</p>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="py-3 px-6 block hover:bg-blue-500">
                      <p class="text-sm text-gray-600 font-semibold">New message received</p>
                      <p class="text-xs text-gray-500 font-medium">Salma sent you new message</p>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="py-3 px-6 block hover:bg-blue-500">
                      <p class="text-sm text-gray-600 font-semibold">New Payment received</p>
                      <p class="text-xs text-gray-500 font-medium">Check your earnings</p>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="py-3 px-6 block hover:bg-blue-500">
                      <p class="text-sm text-gray-600 font-semibold">Jolly completed tasks</p>
                      <p class="text-xs text-gray-500 font-medium">Assign her new tasks</p>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="py-3 px-6 block hover:bg-blue-500">
                      <p class="text-sm text-gray-600 font-semibold">Roman Joined the Team!</p>
                      <p class="text-xs text-gray-500 font-medium">Congratulate him</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="flex items-center gap-4">
        <!-- <a href="#" class="btn font-medium hover:bg-blue-700 py-2" aria-current="page">
          Download Free
        </a> -->
        <div
          class="hs-dropdown relative inline-flex [--placement:bottom-right] sm:[--trigger:hover]"
        >
          <button
            class="relative hs-dropdown-toggle cursor-pointer align-middle rounded-full"
            :onClick="handletoggleMenu"
          >
            <img
              class="object-cover w-9 h-9 rounded-full"
              :src="ProfilePic"
              alt=""
              aria-hidden="true"
            />
          </button>
          <div
            class="card right-0 top-[30px] hs-dropdown-menu transition-[opacity,margin] border border-gray-400 rounded-[7px] duration mt-2 min-w-max absolute w-[200px] z-[12]"
            :class="[toggleMenu ? 'opacity-100 ' : 'hidden opacity-0']"
            ref="menuRef"
            aria-labelledby="hs-dropdown-custom-icon-trigger"
          >
            <div class="card-body p-0 py-2">
              <a
                href="javscript:void(0)"
                class="flex gap-2 items-center px-4 py-[6px] hover:bg-blue-500"
              >
                <IconUser class="text-gray-500 text-xl"></IconUser>
                <p class="text-sm text-gray-500">My Profile</p>
              </a>
              <a
                href="javscript:void(0)"
                class="flex gap-2 items-center px-4 py-[6px] hover:bg-blue-500"
              >
                <IconMail class="text-gray-500 text-xl"></IconMail>
                <p class="text-sm text-gray-500">My Account</p>
              </a>
              <a
                href="javscript:void(0)"
                class="flex gap-2 items-center px-4 py-[6px] hover:bg-blue-500"
              >
                <IconListCheck class="text-gray-500 text-xl"></IconListCheck>
                <p class="text-sm text-gray-500">My Task</p>
              </a>
              <div class="px-4 mt-[7px] grid">
                <button
                  @click="handlelogout"
                  class="btn-outline-primary w-full hover:bg-blue-600 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
