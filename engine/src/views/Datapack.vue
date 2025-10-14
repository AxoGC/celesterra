<script setup lang="ts">
import {useStore} from '@/store';
import {Upload} from '@element-plus/icons-vue';
import {ref} from 'vue';

const store = useStore()

const importUrl = ref('')
</script>

<template>
  <div class="max-w-5xl mx-auto p-4 flex flex-col gap-4">

    <div class="flex flex-wrap items-center gap-4">
      <el-button @click="$router.push('/')">
        返回游戏
      </el-button>
      <span class="text-2xl">
        资源包管理
      </span>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <el-input v-model="importUrl">
        <template #append>
          <el-button>
            在线导入
          </el-button>
        </template>
      </el-input>
      <el-button :icon="Upload">
        从本地导入
      </el-button>
    </div>

    <div class="flex items-center gap-4">
      <div class="text-xl">已安装的资源包</div>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      <div v-for="d in store.datapacks" :key="d.name" class="card">
      </div>
    </div>

  </div>
</template>
