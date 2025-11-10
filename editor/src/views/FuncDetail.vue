<script setup lang="ts">
import {useDataStore} from '@/data';
import {ArrowLeft, Delete} from '@element-plus/icons-vue';
import {useRouteParams} from '@vueuse/router';
import {computed} from 'vue';

const datapackId = useRouteParams<string>('datapackId')
const funcId = useRouteParams<string>('funcId')

const data = useDataStore()
const func = computed(() => data.data[datapackId.value]?.funcs[funcId.value])
</script>

<template>
  <div v-if="func" class="max-w-5xl mx-auto p-4 flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <el-button :icon="ArrowLeft" @click="$router.push(`/${datapackId}`)">
        {{data.data[datapackId]?.name}}
      </el-button>
      <div class="text-2xl">函数详情</div>
      <el-button class="ms-auto" :icon="Delete"
        @click="delete data.data[datapackId]?.funcs[funcId]; $router.push(`/${datapackId}`)"
      >
        删除
      </el-button>
    </div>
    <el-form>
      <el-form-item label="描述">
        <el-input v-model="func.description">
        </el-input>
      </el-form-item>
      <el-form-item label="表达式">
        <el-input v-model="func.expression" type="textarea" class="font-mono" :input-style="{whiteSpace: 'pre'}" autosize spellcheck="false">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
