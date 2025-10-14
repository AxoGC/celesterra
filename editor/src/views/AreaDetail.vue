<script setup lang="ts">
import {useDataStore} from '@/data';
import {ArrowLeft, Delete} from '@element-plus/icons-vue';
import {useRouteParams} from '@vueuse/router';
import {computed, ref} from 'vue';

const datapackId = useRouteParams<string>('datapackId')
const areaId = useRouteParams<string>('areaId')
const data = useDataStore()

const area = computed(() => data.data[datapackId.value]?.areas[areaId.value])
const placeId = ref('')
</script>

<template>
  <div v-if="area" class="max-w-5xl mx-auto p-4 flex flex-col gap-4">

    <div class="flex gap-4 flex-wrap items-center">
      <el-button :icon="ArrowLeft" @click="$router.push(`/${datapackId}`)">
        {{data.data[datapackId]?.name}}
      </el-button>
      <div class="text-2xl">区域详情: {{area.name}}</div>
      <el-button class="ms-auto" :icon="Delete"
        @click="delete data.data[datapackId]?.areas[areaId]; $router.push(`/${datapackId}`)"
      >
        删除
      </el-button>
    </div>

    <el-form>
      <el-form-item label="名称">
        <el-input v-model="area.name">
        </el-input>
      </el-form-item>
      <el-form-item label="描述" class="w-full">
        <el-input v-model="area.description" type="textarea" autosize>
        </el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-input-tag v-model="area.tags">
        </el-input-tag>
      </el-form-item>
    </el-form>

    <div class="flex justify-between">
      <div class="text-xl">地点列表</div>
      <el-input v-model="placeId" class="!w-64">
        <template #append>
          <el-button @click="area.places[placeId] = { name: '', description: '', tags: [], actions: [] }">
            添加
          </el-button>
        </template>
      </el-input>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      <div v-for="p, k in area.places" :key="k"
        class="card flex flex-col gap-2 cursor-pointer"
        @click="$router.push(`/${datapackId}/areas/${areaId}/places/${k}`)"
      >
        <div class="flex items-center gap-2">
          <span>{{p.name}}</span>
          <span class="text-sm text-subtle">{{k}}</span>
        </div>
        <div class="text-sm text-subtle">{{p.description}}</div>
      </div>
    </div>
  </div>
</template>
