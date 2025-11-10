<script setup lang="ts">
import {useStore} from '@/store';
import {Delete} from '@element-plus/icons-vue';
import {computed, ref} from 'vue';

const store = useStore()
const currentId = ref('')
const current = computed(() => store.scenes[currentId.value])
</script>

<template>
  <div class="h-screen max-w-5xl mx-auto flex">

    <div class="basis-1/3 bg-gray-100 flex flex-col gap-4 p-4">
      <el-input v-model="currentId" spellcheck="false">
        <template #append>
          <el-button @click="store.scenes[currentId] = { content: '' }">
            添加
          </el-button>
        </template>
      </el-input>
      <div class="flex flex-col">
        <div v-for="_, id in store.scenes" class="hover:bg-white p-2 rounded-2xl duration-200 cursor-pointer" @click="currentId = id">
          {{id}}
        </div>
      </div>
    </div>

    <div class="basis-3/4 flex flex-col gap-4 p-4">
      <div v-if="current !== undefined" class="grow flex flex-col gap-4">
        <el-button @click="delete store.scenes[currentId]" :icon="Delete" circle>
        </el-button>
        <el-input v-model="current.content"
          class="grow !flex flex-col font-mono" type="textarea" :input-style="{flexGrow: 1}" spellcheck="false"
        ></el-input>
      </div>
      <div v-else>
        当前地点尚未创建
      </div>
    </div>

  </div>
</template>
