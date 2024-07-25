<script setup lang="ts">
import * as z from 'zod'
import { ref, watch } from 'vue'
import Media from '@/admin/media/mediaView.vue'
import { IconArrowBack, IconPlayerPause, IconPlayerPlay, IconTrash } from '@tabler/icons-vue'
import { type Dic, pass } from '@/lib/index'
import Swal from 'sweetalert2'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { HandleApi } from '@/lib/handleApi'

const router = useRouter()

// playlist
const songSchema = z.object({
  _id: z.string()
})
const playlistSchema = z.object({
  name: z.string().min(1, 'Name required!'),
  media: z.array(songSchema)
})

const list = ref<Dic[]>([])
const name = ref<string>('')
const mediaSchema = z.object({
  _id: z.string(),
  name: z.string()
})

const formSchema = z.object({
  name: z.string().min(1),
  list: z.array(mediaSchema)
})

type formSchemaType = z.infer<typeof formSchema>

const errors = ref<any | null>(null)

const selectedMedia = ref<Dic | null>()

const mediaPath = import.meta.env.VITE_MEDIA_PATH

const sortableList = ref<any | null>(null)

const isPlaying = ref<boolean>(false)

const audioFile = ref<string>('')

const handleSelectMedia = (media: Dic) => {
  selectedMedia.value = media
}

const dragLeave = (e: Event) => {
  if (selectedMedia.value && selectedMedia.value?._id) {
    let isExists = list.value.find((v: Dic) => v._id === selectedMedia.value?._id)
    if (!isExists) {
      list.value.push(selectedMedia.value)
      console.log(list.value)
    }
  }
}

const move = (e: Event, row: Dic) => {
  const element = e.target as HTMLTableRowElement
  element.classList.add('dragging')
}

const remove = (e: Event, row: Dic) => {
  let isExists = list.value.findIndex((v: Dic) => v._id === row._id)

  if (isExists !== -1) {
    list.value.splice(isExists, 1)
  }
}

const endMove = async (e: Event, row: Dic) => {
  const element = e.target as HTMLTableRowElement
  element.classList.remove('dragging')
}

const initSortableList = (e: MouseEvent) => {
  e.preventDefault()

  sortableList.value = document.querySelector('.sortable-list')

  console.log(sortableList.value, 'siblings sortablelist')

  let target = e.currentTarget as HTMLTableRowElement

  const draggingItem = document.querySelector('.dragging')

  if (sortableList.value) {
    let siblings = [...sortableList.value.querySelectorAll('.item:not(.dragging)')]

    let nextSibling = Array.from(siblings).find((sibling: any) => {
      console.log(e.clientY, sibling.offsetTop + sibling.offsetHeight / 2, 'check this')
      return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2
    })

    console.log(nextSibling, 'check next siblings')

    if (draggingItem) {
      if (!nextSibling) {
        sortableList.value.appendChild(draggingItem)
      } else {
        sortableList.value.insertBefore(draggingItem, nextSibling)
      }
    }
  }
}

const getList = async () => {
  const itemList = document.querySelectorAll('.item')
  const newList = Array.from(itemList).map((j) => j.getAttribute('data-id'))
  const newJson = newList.map((k) => {
    return list.value.find((p: Dic) => p._id === k)
  })

  return newJson
}

const handlePlay = (e: MouseEvent, data: Dic) => {
  const audioPlayer = document.querySelector('.player') as HTMLAudioElement
  if (isPlaying.value && data.audio === audioFile.value) {
    audioPlayer.pause()
  } else {
    audioFile.value = data.audio
    audioPlayer.load()
    audioPlayer.play()
  }
}

let handleSubmit = async (e: Event) => {
  // const options = {
  //   method: 'POST',
  //   headers: {
  //     cookie:
  //       'musicon-refresh-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjI3LCJzZXNzaW9uS2V5IjoiZTM5NjZmNmYtNzRiMS00OThkLTk2OTEtMzM3Yjk1YjIwNTIwIiwicGFzc3dvcmRIYXNoIjoiJDJhJDEwJHpsSnVhRTNxS1QzTlNFUkFLRS5WVE9kQWVWanhtekRyYUdnN2pvUVFWS0JtUUpIV3U5Vm5LIiwic2NvcGUiOlsiVXNlciIsInJvb3QiLCJyZWFkVXNlciIsInVzZXItZTJiYTkwNWJmMzA2ZjQ2ZmFjYTIyM2QzY2IyMGUyY2YiXSwiaWF0IjoxNzA2MzMxMzY1LCJleHAiOjE3MDg5NTkzNjV9.NJWLu2gqDzTBpI9x6kGXKAVRmvfcXCKGR7FEn3oCQb0; musicon-access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJBZGFyc2giLCJtb2JpbGUiOjk5OTk5OTk5OTksInJvbGUiOnsibmFtZSI6IlVzZXIiLCJyYW5rIjoyfSwiY3JlYXRlZEF0IjoiMjAyNC0wMS0yNlQxNjo0NjoyOS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyNC0wMS0yNlQxNjo0NjoyOS4wMDBaIiwiaWQiOjh9LCJzY29wZSI6WyJVc2VyIiwicm9vdCIsInJlYWRVc2VyIiwidXNlci1lMmJhOTA1YmYzMDZmNDZmYWNhMjIzZDNjYjIwZTJjZiJdLCJpYXQiOjE3MDYyOTM1MzAsImV4cCI6MTcwNjI5NDEzMH0.llDAUJKSMh8_vTAfOB5wewAeKYUoz-G1HuhC3-Gtfec',
  //     'Content-Type': 'application/json',
  //     'User-Agent': 'insomnia/9.2.0',
  //     Authorization:
  //       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEwMTFiNTU0YjQ5NDZkYzhiODczN2UiLCJpYXQiOjE3MjE3NjY0MjYsImV4cCI6MTcyMTg1MjgyNn0.pKunrch25OwE74SoI4zju5-O1qOQAJZhPQm3uwXtDE4'
  //   },
  //   body: '{"name":"asdd","media":[{"_id":"66a0adb57b956f197d885671","media":"static/uploads/file-1721806040514.mp3","name":"Test mp3","createdAt":"2024-07-24T07:31:01.907Z","updatedAt":"2024-07-24T07:31:01.907Z","__v":0},{"_id":"66a0b0fa3dd73a0de6a39344","media":"static/uploads/file-1721807098163.mp3","name":"Test 123456","createdAt":"2024-07-24T07:44:58.777Z","updatedAt":"2024-07-24T07:44:58.777Z","__v":0}]}'
  // }

  // fetch('http://localhost:8002/api/playlist/create?=&=', options)
  //   .then((response) => response.json())
  //   .then((response) => console.log(response))
  //   .catch((err) => console.error(err))

  errors.value = null
  const formData = { name: name.value, media: list.value }

  // console.log(formData, 'formdata', JSON.stringify(formData))

  let validate = playlistSchema.safeParse(formData)

  if (!validate.success) {
    let fieldErrors = validate.error.flatten()
    errors.value = fieldErrors.fieldErrors
    console.log(errors, 'asdadasdasd')
    Swal.fire({
      title: 'Oops...',
      text: 'Vlidation Error',
      icon: 'warning'
    })
    return false
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const cr = await HandleApi('playlist/create', options)
  if (pass(cr)) {
    Swal.fire({
      title: 'Success!',
      text: `Playlist created successfully`,
      icon: 'success'
    })
    return router.push({ name: 'playlist' })
  } else {
    const response = await cr.json()
    console.log(response)
  }

  // const create = await HandleApi(`playlist/create`, {
  //   method: 'POST',
  //   body: JSON.stringify(formData),
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  // const response = await create.json()
  // if (pass(create)) {
  //   Swal.fire({
  //     title: 'Success!',
  //     text: `Playlist created successfully`,
  //     icon: 'success'
  //   })
  //   return router.push({ name: 'playlist' })
  // } else {
  //   if (response.errors) {
  //     errors.value = response.errors.fieldErrors
  //   }

  //   if (response?.message) {
  //     Swal.fire({
  //       title: 'Oops...',
  //       text: response.message,
  //       icon: 'warning'
  //     })
  //   }
  // }
}

const dragenter = (e: Event) => {
  e.preventDefault()
}
</script>

<template>
  <div className="p-2 px-3 mb-4">
    <div class="card h-full">
      <div class="card-body">
        <div class="flex items-center mb-1">
          <h1 class="flex-1 text-xl text-textLight">Create Playlist</h1>
          <div class="flex-1 flex justify-end items-center">
            <RouterLink
              type="submit"
              className="flex bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
              to="/admin/media"
            >
              <IconArrowBack size="24" class="me-2" />
              Back
            </RouterLink>
          </div>
        </div>
        <div class="bg-primary p-3 rounded-sm grid">
          <div>
            <label for="email" class="mb-1 inline-block text-textSecondry">Playlist name</label>

            <input
              v-model="name"
              id="name"
              type="name"
              name="name"
              class="py-3 border px-4 block w-full rounded-md text-sm focus:border-blue-600 focus:ring-0"
              :class="errors?.name ? 'border-red-400' : ''"
            />

            <div v-if="errors?.name" class="text-red-400 text-[14px]">
              <span :key="index" v-for="(error, index) in errors?.name">{{ error }} !</span>
            </div>
            <div v-else class="text-red-400 text-[14px]">&nbsp;</div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div
              class="p-1 bg-gray-500 rounded-md"
              v-on:dragleave="dragLeave"
              v-on:dragenter="dragenter"
            >
              <div
                class="border-2 border-dashed border-blue-400 rounded-md p-1"
                style="min-height: 55vh"
              >
                <audio
                  :src="audioFile ? `${mediaPath}/${audioFile}` : ''"
                  class="hidden player"
                ></audio>
                <ul class="table rounded-md overflow-x-auto sortable-list w-full">
                  <li
                    v-for="(row, index) in list"
                    :key="index"
                    class="hover:bg-gray-200 item cursor-pointer bg-secondry rounded-sm mb-1 bg-white shadow w-full"
                    draggable="true"
                    v-on:dragstart="move($event, row)"
                    v-on:dragend="endMove($event, row)"
                    v-on:dragover="initSortableList($event)"
                    v-on:dragenter="dragenter"
                    :data-id="row._id"
                  >
                    <div class="flex items-center px-4 py-2">
                      <div class="flex-grow flex items-center">
                        <div class="icon">
                          <button
                            class="flex justify-center items-center"
                            v-on:click="handlePlay($event, row)"
                          >
                            <span v-if="isPlaying && audioFile === row?.audio">
                              <IconPlayerPause size="24" />
                            </span>
                            <span v-else><IconPlayerPlay size="24" /></span>
                          </button>
                        </div>
                        <div class="mx-3">
                          <div>
                            <h1 class="tt">{{ row.name }}</h1>
                            <p class="text-[12px]">{{}}</p>
                          </div>
                        </div>
                        <div>
                          <!-- {row?.duration} s -->
                        </div>
                      </div>
                      <div class="">
                        <button
                          class="flex justify-center items-center rounded-full bg-primary p-2"
                          v-on:click="remove($event, row)"
                        >
                          <IconTrash size="24"></IconTrash>
                          <span aria-hidden="true" class="icon_trash text-red-500"></span>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="bg-gray-500 rounded-md p-1">
              <Media :handleMedia="handleSelectMedia" />
            </div>
          </div>
          <div class="flex py-3">
            <button
              class="flex w-full justify-center bg-blue-600 text-white p-2 px-2 rounded-md shadow-md"
              v-on:click="handleSubmit"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
