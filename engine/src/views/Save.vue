<script setup lang="ts">
import {useStore} from '@/store';
import {ArrowLeft} from '@element-plus/icons-vue';
import {ref} from 'vue';
import { parse } from 'smol-toml';

const store = useStore()

const params = ref('')

</script>

<template>
  <div class="max-w-5xl mx-auto p-4 flex flex-col gap-4">

    <div class="flex items-center gap-4">
      <el-button :icon="ArrowLeft" @click="$router.push('/')">
        返回游戏
      </el-button>
      <span class="text-2xl">存档管理器</span>
    </div>

    <div class="flex gap-4">
      <el-input v-model="params" type="textarea" autosize placeholder="请输入启动参数...">
      </el-input>
      <el-button @click="store.saves.push(parse(params) as any)">
        创建新存档
      </el-button>
    </div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      <div v-for="s in store.saves" :key="s.name" class="card">
        {{s}}
      </div>
    </div>

  </div>
</template>
