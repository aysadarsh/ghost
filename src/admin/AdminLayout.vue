<script lang="ts" setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import Logo from '@/assets/images/Logo.png'
import AppBar from '@/admin/AppBar.vue'
import {
  IconLayoutDashboard,
  IconDots,
  IconArticle,
  IconAlertCircle,
  IconBuildingFactory2,
  IconBuildingCommunity,
  IconCopyright,
  IconTag,
  IconBuildingSkyscraper,
  IconBuildingEstate,
  IconBrandSketch,
  IconMapUp,
  IconBuildingStore,
  IconUsers,
  IconMusic,
  IconPlaylist
} from '@tabler/icons-vue'

const path = useRoute()

console.log(path.name, 'currrent')
</script>

<template>
  <main>
    <div id="main-wrapper" class="flex">
      <aside
        id="application-sidebar-brand"
        class="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transform hidden xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 fixed top-0 with-vertical h-screen z-[50] flex-shrink-0 border-r-[1px] w-[270px] border-gray-400 bg-white left-sidebar transition-all duration-300"
      >
        <div class="p-5">
          <RouterLink to="/admin" class="text-nowrap">
            <div class="flex items-center">
              <div
                class="bg-blue-600 rounded-full w-14 h-14 flex justify-center items-center border-4 shadow-md me-4"
              >
                <img :src="Logo" alt="" class="mx-auto h-10" />
              </div>
              <div class="text-4xl font-thin">Ghost</div>
            </div>
          </RouterLink>
        </div>
        <div class="scroll-sidebar" data-simplebar="">
          <div class="px-6 mt-4">
            <nav class="w-full flex flex-col sidebar-nav">
              <ul id="sidebarnav" class="text-gray-600 text-sm">
                <li class="text-xs font-bold pb-4">
                  <IconDots
                    class="nav-small-cap-icon text-lg xs:block md:hidden text-center"
                  ></IconDots>
                  <span>HOME</span>
                </li>
                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="path.name === 'dashboard' ? 'text-blue-600 bg-blue-100' : ''"
                    to="/admin"
                  >
                    <IconLayoutDashboard size="24" class="ti ti-layout-dashboard">
                    </IconLayoutDashboard>
                    <span>Dashboard</span>
                  </RouterLink>
                </li>
                <li class="text-xs font-bold mb-4 mt-8">
                  <i class="ti ti-dots nav-small-cap-icon text-lg hidden text-center"></i>
                  <span>ADMIN</span>
                </li>

                <!-- <li class="text-xs font-bold mb-4 mt-8">
                  <IconDots
                    size="24"
                    class="nav-small-cap-icon text-lg hidden text-center"
                  ></IconDots>
                  <span>Modules</span>
                </li> -->

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-industry', 'create-industry', 'edit-industry'].includes(
                        path?.name as string
                      )
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/industry"
                  >
                    <IconBuildingFactory2 size="24" class="text-xl"></IconBuildingFactory2>
                    <span>Industries</span>
                  </RouterLink>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-state', 'create-state', 'edit-state'].includes(path?.name as string)
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/state"
                  >
                    <IconBuildingSkyscraper size="24" class="text-xl"></IconBuildingSkyscraper>
                    <span>States</span>
                  </RouterLink>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-city', 'creatn-city', 'edin-city'].includes(path?.name as string)
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/city"
                  >
                    <IconBuildingCommunity size="24" class="text-xl"></IconBuildingCommunity>
                    <span>Cities</span>
                  </RouterLink>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-licence', 'create-licence', 'edit-licence'].includes(
                        path?.name as string
                      )
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/licence"
                  >
                    <IconCopyright size="24" class="text-xl"></IconCopyright>
                    <span>Licence</span>
                  </RouterLink>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-music-label', 'create-music-label', 'edit-music-label'].includes(
                        path?.name as string
                      )
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/musiclabel"
                  >
                    <IconTag size="24" class="text-xl"></IconTag>
                    <span>Music Labels</span>
                  </RouterLink>
                </li>

                <li class="text-xs font-bold mb-4 mt-8">
                  <i class="ti ti-dots nav-small-cap-icon text-lg hidden text-center"></i>
                  <span>CLIENT</span>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-organization', 'create-organization', 'edit-organization'].includes(
                        path?.name as string
                      )
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/organization"
                  >
                    <IconBuildingEstate size="24" class="text-xl"></IconBuildingEstate>
                    <span>Organizations</span>
                  </RouterLink>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-brand', 'create-brand', 'edit-brand'].includes(path?.name as string)
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/brand"
                  >
                    <IconBrandSketch size="24" class="text-xl"> </IconBrandSketch>
                    <span>Brands</span>
                  </RouterLink>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-brand-zone', 'create-brand-zone', 'edit-brand-zone'].includes(
                        path?.name as string
                      )
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/brandZone"
                  >
                    <IconMapUp size="24" class="text-xl"> </IconMapUp>
                    <span>Brand Zone</span>
                  </RouterLink>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-store', 'create-store', 'edit-store'].includes(path?.name as string)
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/store"
                  >
                    <IconBuildingStore size="24" class="text-xl"> </IconBuildingStore>
                    <span>Stores</span>
                  </RouterLink>
                </li>

                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin-user', 'create-user', 'edit-user'].includes(path?.name as string)
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/user"
                  >
                    <IconUsers size="24" class="text-xl"> </IconUsers>
                    <span>Users</span>
                  </RouterLink>
                </li>
                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin/media'].includes(path?.name as string)
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/media"
                  >
                    <IconMusic size="24" class="text-xl"></IconMusic>
                    <span>Media</span>
                  </RouterLink>
                </li>
                <li class="sidebar-item">
                  <RouterLink
                    class="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-100"
                    :class="
                      ['admin/playlist', 'admin/playlist/create'].includes(path?.name as string)
                        ? 'text-blue-600 bg-blue-100'
                        : ''
                    "
                    to="/admin/playlist"
                  >
                    <IconPlaylist size="24" class="text-xl"></IconPlaylist>
                    <span>Playlist</span>
                  </RouterLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- <div class="m-6 relative">
          <div class="bg-blue-500 p-5 rounded-md flex items-center justify-between">
            <div>
              <h5 class="text-base font-semibold text-gray-700 mb-3">Upgrade to Pro</h5>
              <button
                class="text-xs font-semibold hover:bg-blue-700 text-white bg-blue-600 rounded-md px-4 py-2"
              >
                Buy Pro
              </button>
            </div>
            <div class="-mt-12 -mr-2">
              <img src="../assets/images/profile/rocket.png" class="max-w-fit" alt="profile" />
            </div>
          </div>
        </div> -->
      </aside>
      <div class="w-full page-wrapper overflow-hidden min-h-full">
        <AppBar />
        <main class="h-full overflow-y-auto max-w-full pt-4">
          <div class="container full-container py-5 flex flex-col gap-6 admin-container">
            <RouterView />
            <footer>
              <p class="text-base text-gray-500 font-normal p-3 text-center">
                Design and Developed by MediaIsYou
                <RouterLink
                  to="#"
                  target="_blank"
                  class="text-blue-600 underline hover:text-blue-700"
                >
                </RouterLink>
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  </main>
</template>

<style scoped>
.admin-container {
  min-height: calc(100vh - 80px);
}

/* .multiselect__option--highlight {
  background: #5d87ff !important;
}

.multiselect {
  --multiselect-border-color: #5d87ff;
  --multiselect-background-color: #5d87ff;
  --multiselect-text-color: #5d87ff;
} */
</style>
