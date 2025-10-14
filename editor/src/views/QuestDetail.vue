<script setup lang="ts">
import {useDataStore} from '@/data';
import {ArrowLeft} from '@element-plus/icons-vue';
import {useRouteParams} from '@vueuse/router';
import {computed} from 'vue';

const datapackId = useRouteParams<string>('datapackId')
const questId = useRouteParams<string>('questId')

const data = useDataStore()

const quest = computed(() => data.data[datapackId.value]?.quests[questId.value])
</script>

<template>
  <div v-if="quest" class="max-w-5xl mx-auto p-4 flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <el-button :icon="ArrowLeft" @click="$router.push(`/${datapackId}`)">
        {{data.data[datapackId]?.name}}
      </el-button>
      <div class="text-2xl">任务详情: {{quest.name}}</div>
    </div>
    <el-form>
      <el-form-item label="名称">
        <el-input v-model="quest.name">
        </el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="quest.description" type="textarea">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="flex justify-between">
      <div class="text-xl">阶段列表</div>
    </div>
    <div class="flex flex-col gap-4">
      <el-form v-for="q in quest.questeps" class="card">
        <el-form-item label="文本">
          <el-input v-model="q.label" type="textarea" autosize>
          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="q.description" type="textarea" autosize>
          </el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="q.order">
          </el-input-number>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
