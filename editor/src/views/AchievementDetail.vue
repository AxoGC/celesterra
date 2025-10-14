<script setup lang="ts">
import {useDataStore} from '@/data';
import {ArrowLeft} from '@element-plus/icons-vue';
import {useRouteParams} from '@vueuse/router';
import {computed} from 'vue';

const datapackId = useRouteParams<string>('datapackId')
const achievementId = useRouteParams<string>('achievementId')

const data = useDataStore()
const achievement = computed(() => data.data[datapackId.value]?.achievements[achievementId.value])
</script>

<template>
  <div v-if="achievement" class="max-w-5xl mx-auto p-4 flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <el-button :icon="ArrowLeft" @click="$router.push(`/${datapackId}`)">
        {{data.data[datapackId]?.name}}
      </el-button>
      <div class="text-2xl">成就详情: {{achievement.name}}</div>
    </div>
    <el-form>
      <el-form-item label="名称">
        <el-input v-model="achievement.name">
        </el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="achievement.description" type="textarea">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
