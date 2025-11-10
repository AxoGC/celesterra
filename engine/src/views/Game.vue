<script setup lang="ts">
import {useStore} from '@/store';

const menuItems = [
  { index: '/saves', label: '存档' },
  { index: '/datapacks', label: '数据包' },
  { index: '/itemtypes', label: '物品类型' },
  { index: '/scenes', label: '场景' },
]

const store = useStore()
</script>

<template>
  <div class="h-screen max-w-5xl mx-auto flex flex-col md:flex-row">

    <div class="basis-1/3 p-4 flex flex-col gap-4 bg-gray-100">
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

      <div class="flex flex-col gap-2">
        <div class="text-xl">状态栏</div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-xl">任务栏</div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-xl">物品栏</div>
        <div class="flex flex-wrap gap-2">
          <el-popover v-for="item in store.items" :title="store.itemtypes[item.id]?.name">
            <template #reference>
              <div class="bg-white size-12 rounded-lg relative cursor-pointer">
                <div class="text-3xl absolute inset-0 flex justify-center items-center">
                  {{store.itemtypes[item.id]?.icon}}
                </div>
                <div v-if="item.amount" class="absolute right-0 bottom-0">
                  {{item.amount}}
                </div>
              </div>
            </template>
          </el-popover>
        </div>
      </div>

    </div>

    <div class="basis-3/4 p-4 flex flex-col gap-4">
    </div>

  </div>
</template>
