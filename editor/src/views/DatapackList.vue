<script setup lang="ts">
import {useDataStore} from '@/data';
import type {Datapack} from '@/types';
import {toRaw} from 'vue';

const data = useDataStore()

const exportJson = (v: Datapack) => {
  const rawData = toRaw(v) // remove Vue reactivity
  const jsonString = JSON.stringify(rawData, null, 2) // pretty print JSON

  // 3️⃣ Create a downloadable file
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'data.json'
  link.click()

  // optional: revoke URL to free memory
  URL.revokeObjectURL(url)
}

function handleFileUpload(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = (e: ProgressEvent<FileReader>) => {
    try {
      const text = e.target?.result as string
      const parsed: Datapack = JSON.parse(text)
      data.data[parsed.id] = parsed
    } catch (err) {
      alert('Invalid JSON format!')
      console.error(err)
    }
  }

  reader.readAsText(file)
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 flex flex-col gap-4">

    <div class="flex flex-wrap items-center gap-4">
      <span class="text-2xl">数据包列表</span>
      <el-input class="!w-64 ms-auto">
        <template #append>
          <el-button>
            从URL导入
          </el-button>
        </template>
      </el-input>
      <input type="file" accept=".json" @change="handleFileUpload" placeholder="从文件导入" class="rounded-2xl bg-white">
      </input>
    </div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      <div v-for="v, k in data.data" class="card flex flex-col gap-2 cursor-pointer" @click="$router.push(`/${k}`)">
        <div class="flex gap-2">
          <span>{{v.name}}</span>
          <el-button @click="exportJson(v)">
            导出
          </el-button>
        </div>
        <div class="text-sm text-subtle">{{v.description}}</div>
      </div>
    </div>

  </div>
  <div class="p-4">
    <div class="text-green-500">█████████▓</div>
    <div class="text-amber-500">█████▓░░░░</div>
    <div class="text-red-500">█▓░░░░░░░░</div>
  </div>
</template>
