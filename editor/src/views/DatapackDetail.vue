<script setup lang="ts">
import {useDataStore} from '@/data';
import {ArrowLeft, Delete, Plus} from '@element-plus/icons-vue';
import {useRouteParams} from '@vueuse/router';
import {computed, ref} from 'vue';

const datapackId = useRouteParams<string>('datapackId')

const data = useDataStore()

const datapack = computed(() => data.data[datapackId.value])

const areaId = ref('')
const itemId = ref('')
const entitypeId = ref('')
const questId = ref('')
const achievementId = ref('')
const effectId = ref('')
const statId = ref('')

</script>

<template>
  <div v-if="datapack" class="max-w-5xl mx-auto p-4 flex flex-col gap-4">

    <div class="flex items-center gap-4">
      <el-button :icon="ArrowLeft" @click="$router.push('/')">数据包列表</el-button>
      <div class="text-2xl">数据包详情: {{datapack.name}}</div>
    </div>

    <el-form>
      <el-form-item label="名称">
        <el-input v-model="datapack.name">
        </el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="datapack.description" type="textarea">
        </el-input>
      </el-form-item>
    </el-form>

    <div class="flex justify-between">
      <div class="text-xl">区域列表</div>
      <el-input v-model="areaId" class="!w-64">
        <template #append>
          <el-button @click="datapack.areas[areaId] = { name: '', description: '', tags: [], places: {} }" :icon="Plus" circle>
          </el-button>
        </template>
      </el-input>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <div v-for="a, k in datapack.areas" :key="k"
        class="card flex flex-wrap items-center gap-2 cursor-pointer content-start"
        @click="$router.push(`/${datapackId}/areas/${k}`)"
      >
        <span>{{a.name}}</span>
        <span class="text-sm text-subtle">{{k}}</span>
        <div class="text-sm text-subtle truncate">{{a.description}}</div>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="text-xl">物品列表</div>
      <el-input v-model="itemId" class="!w-64">
        <template #append>
          <el-button
            @click="datapack.itemtypes[itemId] = { name: '', description: '', tags: [], stackable: false, actions: [] }"
            :icon="Plus" circle
          ></el-button>
        </template>
      </el-input>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <div v-for="i, k in datapack.itemtypes" :key="k"
        class="card flex flex-wrap items-center gap-2 cursor-pointer content-start"
        @click="$router.push(`/${datapackId}/itemtypes/${k}`)"
      >
        <span>{{i.name}}</span>
        <span class="text-sm text-subtle">{{k}}</span>
        <div class="text-sm text-subtle truncate">{{i.description}}</div>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="text-xl">实体类型列表</div>
      <el-input v-model="entitypeId" class="!w-64">
        <template #append>
          <el-button :icon="Plus" circle
            @click="datapack.entitypes[entitypeId] = { name: '', description: '', tags: [], storable: false, actions: [] }"
          >
          </el-button>
        </template>
      </el-input>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <div v-for="e, k in datapack.entitypes" :key="k"
        class="card flex flex-wrap items-center gap-2 cursor-pointer content-start"
        @click="$router.push(`/${datapackId}/entitypes/${k}`)"
      >
        <span>{{e.name}}</span>
        <span class="text-sm text-subtle">{{k}}</span>
        <div class="text-sm text-subtle truncate">{{e.description}}</div>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="text-xl">任务列表</div>
      <el-input v-model="questId" class="!w-64">
        <template #append>
          <el-button @click="datapack.quests[questId] = { name: '', description: '', steps: [] }" :icon="Plus" circle>
          </el-button>
        </template>
      </el-input>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <div v-for="q, k in datapack.quests" :key="k"
        class="card flex flex-wrap items-center gap-2 cursor-pointer content-start"
        @click="$router.push(`/${datapackId}/quests/${k}`)"
      >
        <span>{{q.name}}</span>
        <span class="text-sm text-subtle">{{k}}</span>
        <div class="text-sm text-subtle truncate">{{q.description}}</div>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="text-xl">成就列表</div>
      <el-input v-model="achievementId" class="!w-64">
        <template #append>
          <el-button @click="datapack.achievements[achievementId] = { name: '', description: '' }" :icon="Plus" circle>
          </el-button>
        </template>
      </el-input>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <div v-for="a, k in datapack.achievements" :key="k"
        class="card flex flex-wrap items-center gap-2 cursor-pointer content-start"
        @click="$router.push(`/${datapackId}/achievements/${k}`)"
      >
        <div>{{a.name}}</div>
        <div class="text-sm text-subtle">{{k}}</div>
        <div class="text-sm text-subtle truncate">{{a.description}}</div>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="text-xl">效果列表</div>
      <el-input v-model="effectId" class="!w-64">
        <template #append>
          <el-button @click="datapack.effects[effectId] = { description: '', expression: '' }" :icon="Plus" circle>
          </el-button>
        </template>
      </el-input>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      <div v-for="e, k in datapack.effects" :key="k"
        class="card flex flex-wrap items-center gap-2 cursor-pointer content-start"
        @click="$router.push(`/${datapackId}/effects/${k}`)"
      >
        <div>{{k}}</div>
        <div class="text-sm text-subtle truncate">{{e.description}}</div>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="text-xl">属性列表</div>
      <el-input v-model="statId" class="!w-64">
        <template #append>
          <el-button @click="datapack.stats[statId] = ''" :icon="Plus" circle>
          </el-button>
        </template>
      </el-input>
    </div>
    <el-form>
      <el-form-item v-for="_, k in datapack.stats" :key="k" :label="k">
        <div class="w-full flex gap-4">
          <el-input v-model="datapack.stats[k]" class="font-mono" autosize type="textarea" spellcheck="false">
          </el-input>
          <el-button @click="delete datapack.stats[k]" :icon="Delete" circle>
          </el-button>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>
