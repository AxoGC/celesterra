<script setup lang="ts">
import {useDataStore} from '@/data';
import {ArrowLeft, Delete} from '@element-plus/icons-vue';
import {useRouteParams} from '@vueuse/router';
import {computed} from 'vue';

const datapackId = useRouteParams<string>('datapackId')
const entitypeId = useRouteParams<string>('entitypeId')

const data = useDataStore()

const entitype = computed(() => data.data[datapackId.value]?.entitypes[entitypeId.value])
</script>

<template>
  <div v-if="entitype" class="max-w-5xl mx-auto p-4 flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <el-button :icon="ArrowLeft" @click="$router.push(`/${datapackId}`)">
        {{data.data[datapackId]?.name}}
      </el-button>
      <div class="text-2xl">实体类型详情: {{entitype.name}}</div>
      <el-button class="ms-auto" :icon="Delete"
        @click="delete data.data[datapackId]?.entitypes[entitypeId]; $router.push(`/${datapackId}`)"
      >
        删除
      </el-button>
    </div>
    <el-form>
      <el-form-item label="名称">
        <el-input v-model="entitype.name">
        </el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="entitype.description" type="textarea">
        </el-input>
      </el-form-item>
      <el-form-item label="可存储">
        <el-switch v-model="entitype.storable">
        </el-switch>
      </el-form-item>
      <el-form-item label="标签">
        <el-input-tag v-model="entitype.tags">
        </el-input-tag>
      </el-form-item>
    </el-form>
    <div class="flex justify-between">
      <div class="text-xl">行为列表</div>
      <el-button @click="entitype.actions.push({ label: '', effect: '' })">
        添加
      </el-button>
    </div>
    <div class="flex flex-col gap-4">
      <el-form v-for="a in entitype.actions" class="card">
        <el-form-item label="文本">
          <el-input v-model="a.label" type="textarea" class="font-mono" :input-style="{whiteSpace: 'pre'}" autosize spellcheck="false">
          </el-input>
        </el-form-item>
        <el-form-item label="条件">
          <el-input v-model="a.condition" type="textarea" class="font-mono" :input-style="{whiteSpace: 'pre'}" autosize spellcheck="false">
          </el-input>
        </el-form-item>
        <el-form-item label="效果">
          <el-input v-model="a.effect" type="textarea" class="font-mono" :input-style="{whiteSpace: 'pre'}" autosize spellcheck="false">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
