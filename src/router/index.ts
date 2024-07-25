import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLayout from '@/admin/AdminLayout.vue'
import Login from '@/auth/Login.vue'
import AdminLogin from '@/admin/auth/Login.vue'
import AdminDashboard from '@/admin/Dashboard.vue'
import IndustryList from '@/admin/industry/listView.vue'
import IndustryCreate from '@/admin/industry/createView.vue'
import IndustryEdit from '@/admin/industry/editView.vue'

import StateList from '@/admin/state/listView.vue'
import StateCreate from '@/admin/state/createView.vue'
import StateEdit from '@/admin/state/editView.vue'

import LicenceList from '@/admin/licence/listView.vue'
import LicenceCreate from '@/admin/licence/createView.vue'
import LicenceEdit from '@/admin/licence/editView.vue'

import MusicLabelList from '@/admin/musiclabel/listView.vue'
import MusicLabelCreate from '@/admin/musiclabel/createView.vue'
import MusicLabelEdit from '@/admin/musiclabel/editView.vue'

import CityList from '@/admin/city/listView.vue'
import CityCreate from '@/admin/city/createView.vue'
import CityEdit from '@/admin/city/editView.vue'

import OrganizationList from '@/admin/organization/listView.vue'
import OrganizationCreate from '@/admin/organization/createView.vue'
import OrganizationEdit from '@/admin/organization/editView.vue'

import BrandList from '@/admin/brand/listView.vue'
import BrandCreate from '@/admin/brand/createView.vue'
import BrandEdit from '@/admin/brand/editView.vue'

import BrandZoneList from '@/admin/zone/listView.vue'
import BrandZoneCreate from '@/admin/zone/createView.vue'
import BrandZoneEdit from '@/admin/zone/editView.vue'

import StoreList from '@/admin/store/listView.vue'
import StoreCreate from '@/admin/store/createView.vue'
import StoreEdit from '@/admin/store/editView.vue'

import UserList from '@/admin/user/listView.vue'
import UserCreate from '@/admin/user/createView.vue'
import UserEdit from '@/admin/user/editView.vue'

import TestView from '@/components/admin/TestView.vue'

import MediaView from '@/admin/media/listView.vue'
import PlaylistView from '@/admin/playlist/createView.vue'
import PlaylistListView from '@/admin/playlist/ListView.vue'

import { useStore } from '@/stores/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/auth/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: AdminDashboard
        },
        {
          path: 'test',
          name: 'test',
          component: TestView
        },
        {
          path: 'industry',
          name: 'industries',
          children: [
            {
              path: '',
              name: 'admin-industry',
              component: IndustryList
            },
            {
              path: ':id',
              name: 'edit-industry',
              component: IndustryEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-industry',
              component: IndustryCreate
            }
          ]
        },
        {
          path: 'state',
          name: 'states',
          children: [
            {
              path: '',
              name: 'admin-state',
              component: StateList
            },
            {
              path: ':id',
              name: 'edit-state',
              component: StateEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-state',
              component: StateCreate
            }
          ]
        },
        {
          path: 'licence',
          name: 'licences',
          children: [
            {
              path: '',
              name: 'admin-licence',
              component: LicenceList
            },
            {
              path: ':id',
              name: 'edit-licence',
              component: LicenceEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-licence',
              component: LicenceCreate
            }
          ]
        },
        {
          path: 'musiclabel',
          name: 'musiclabels',
          children: [
            {
              path: '',
              name: 'admin-music-label',
              component: MusicLabelList
            },
            {
              path: ':id',
              name: 'edit-music-label',
              component: MusicLabelEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-music-label',
              component: MusicLabelCreate
            }
          ]
        },
        {
          path: 'city',
          name: 'cities',
          children: [
            {
              path: '',
              name: 'admin-city',
              component: CityList
            },
            {
              path: ':id',
              name: 'edit-city',
              component: CityEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-city',
              component: CityCreate
            }
          ]
        },
        {
          path: 'organization',
          name: 'organizations',
          children: [
            {
              path: '',
              name: 'admin-organization',
              component: OrganizationList
            },
            {
              path: ':id',
              name: 'edit-organization',
              component: OrganizationEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-organization',
              component: OrganizationCreate
            }
          ]
        },
        {
          path: 'brand',
          name: 'brands',
          children: [
            {
              path: '',
              name: 'admin-brand',
              component: BrandList
            },
            {
              path: ':id',
              name: 'edit-brand',
              component: BrandEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-brand',
              component: BrandCreate
            }
          ]
        },
        {
          path: 'brandZone',
          name: 'brandZones',
          children: [
            {
              path: '',
              name: 'admin-brand-zone',
              component: BrandZoneList
            },
            {
              path: ':id',
              name: 'edit-brand-zone',
              component: BrandZoneEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-brand-zone',
              component: BrandZoneCreate
            }
          ]
        },
        {
          path: 'store',
          name: 'stores',
          children: [
            {
              path: '',
              name: 'admin-store',
              component: StoreList
            },
            {
              path: ':id',
              name: 'edit-store',
              component: StoreEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-store',
              component: StoreCreate
            }
          ]
        },
        {
          path: 'user',
          name: 'users',
          children: [
            {
              path: '',
              name: 'admin-user',
              component: UserList
            },
            {
              path: ':id',
              name: 'edit-user',
              component: UserEdit,
              props: true
            },
            {
              path: 'create',
              name: 'create-user',
              component: UserCreate
            }
          ]
        },
        {
          path: 'media',
          name: 'Media',
          component: MediaView
        },
        {
          path: 'playlist',
          name: 'Playlist',
          component: PlaylistListView
        },
        {
          path: 'playlist/create',
          name: 'Playlist-Create',
          component: PlaylistView
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/admin/login', '/auth/login']

  const authRequired = !publicPages.includes(to.path)

  const store = useStore()

  let routeName = 'login'

  if (to.path.startsWith('/admin')) {
    routeName = 'admin-login'
  }

  console.log(routeName, to.path)

  // for client login
  if (authRequired && !store.state.user) {
    store.state.returnUrl = to.path

    //  not token exists
    if (!store.state.token) {
      store.state.loading = false
      return next({ name: routeName })
    }
    // verify token and user
    const verified = await store.verifyUser()
    if (!verified) {
      store.state.loading = false

      return next({ name: routeName })
    }
  }

  // end for client login

  store.state.loading = false
  return next()
})

export default router
