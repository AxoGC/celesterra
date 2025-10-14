<script setup lang="ts">
import {useStore} from '@/store';

const menuItems = [
  { index: '/saves', label: '存档' },
  { index: '/datapacks', label: '数据包' },
]

const store = useStore()
</script>

<template>
  <div class="h-screen max-w-5xl mx-auto flex flex-col md:flex-row">

    <div class="basis-1/3 bg-white p-4 flex flex-col gap-4 border-2 border-gray-100">
      <el-dropdown>
        <el-button>
          菜单
        </el-button>
        <template #dropdown>
          <el-dropdown-item v-for="item in menuItems" :key="item.index" @click="$router.push(item.index)">
            {{item.label}}
          </el-dropdown-item>
        </template>
      </el-dropdown>
    </div>

    <div class="basis-3/4 p-4 flex flex-col gap-4">
    </div>

  </div>
</template>
