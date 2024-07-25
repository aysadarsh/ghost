<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { HandleApi } from '@/lib/handleApi'

import { useStore } from '@/stores/store'
import { type Dic, pass } from '@/lib/index'
import SearchForm from '@/components/admin/SearchForm.vue'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-vue'

const props = defineProps<{
  handleMedia: Function
}>()

const { state } = useStore()

const media = ref<Dic[]>([])

const selectedMedia = ref<Dic | null>()

const isPlaying = ref<boolean>(false)

const audioFile = ref<string>('')

const audioPlayer = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  loadMedia()
})

const loadMedia = async () => {
  try {
    state.awating = true
    const call = await HandleApi('media')
    if (pass(call)) {
      const response = await call.json()
      if (response.data) {
        media.value = response.data
      }
    }
    state.awating = false
  } catch (e) {
    state.awating = false
    return false
  }
}

const dragenter = (e: Event) => {
  e.preventDefault()
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

const move = (e: Event, row: Dic) => {
  const element = e.target as HTMLTableRowElement
  element.classList.add('dragging')
}

const endMove = async (e: Event, row: Dic) => {
  const element = e.target as HTMLTableRowElement

  element.classList.remove('dragging')
}

const dragStart = (event: Event, row: Dic) => {
  selectedMedia.value = row
  props.handleMedia(selectedMedia.value)
  // console.log(selectedMedia.value, 'check this working')
}
</script>

<template>
  <div class="">
    <div class="p-2 px-3">
      <!-- <div class="p-1 focus-within:textLight rounded-full bg-secondry max-w-48 px-4 flex">
		<input type="text" on:change={(e)=>{getMedia()}} bind:value={pageSetting.search} class="w-full bg-transparent focus:border-none focus:outline-none" />
		<button class="flex justify-center items-center focus-visible:outline-none focus-visible:border-none">
			<span aria-hidden="true" class="icon_search"></span>
		</button>
	</div> -->
      <audio ref="audioPlayer" :src="selectedMedia?.media"></audio>
    </div>
    <div class="p-2">
      <ul class="rounded-md overflow-x-auto">
        <li
          v-for="(row, index) in media"
          draggable="true"
          class="hover:bg-gray-200 cursor-pointer bg-secondry rounded-sm mb-1 bg-white shadow"
          :key="index"
          v-on:dragstart="dragStart($event, row)"
        >
          <div class="flex items-center px-4 py-2">
            <div class="flex-grow flex items-center">
              <div class="icon">
                <button class="flex justify-center items-center">
                  <span v-if="isPlaying && audioFile === row?.audio">
                    <IconPlayerPause size="24" />
                  </span>
                  <span v-else><IconPlayerPlay size="24" /></span>
                </button>
              </div>
              <div class="mx-3">
                <div>
                  <h1>{{ row?.name }}</h1>
                  <p class="text-[12px]">{{ row?.artist }}</p>
                </div>
              </div>
              <div>
                <!-- {row?.duration} s -->
              </div>
            </div>
            <!-- <div class="">
							<button
								class="flex justify-center items-center"
								on:click|stopPropagation={(e) => remove(e, row)}
							>
								<span aria-hidden="true" class="icon_trash text-red-600"></span>
							</button>
						</div> -->
          </div>
        </li>
      </ul>
    </div>
    <div class="relative">
      <div class="absolute w-full">
        <div class="flex items-center justify-end p-2">
          <PaginationLinks bind:pageSetting bind:meta on:load="{getMedia}" />
        </div>
      </div>
    </div>
  </div>
</template>
