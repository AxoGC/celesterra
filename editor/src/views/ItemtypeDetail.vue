<script setup lang="ts">
import {useDataStore} from '@/data';
import {ArrowDown, ArrowLeft, Delete} from '@element-plus/icons-vue';
import {useRouteParams} from '@vueuse/router';
import {computed} from 'vue';

const datapackId = useRouteParams<string>('datapackId')
const itemId = useRouteParams<string>('itemId')

const data = useDataStore()

const item = computed(() => data.data[datapackId.value]?.itemtypes[itemId.value])
</script>

<template>
  <div v-if="item" class="max-w-5xl mx-auto p-4 flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <el-button :icon="ArrowLeft" @click="$router.push(`/${datapackId}`)">
        {{data.data[datapackId]?.name}}
      </el-button>
      <div class="text-2xl">物品详情: {{item.name}}</div>
      <el-button class="ms-auto" :icon="Delete"
        @click="delete data.data[datapackId]?.itemtypes[itemId]; $router.push(`/${datapackId}`)"
      >
        删除
      </el-button>
    </div>
    <el-form>
      <el-form-item label="名称">
        <el-input v-model="item.name">
        </el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="item.description" type="textarea">
        </el-input>
      </el-form-item>
      <el-form-item label="可堆叠">
        <el-switch v-model="item.stackable">
        </el-switch>
      </el-form-item>
      <el-form-item label="标签">
        <el-input-tag v-model="item.tags">
        </el-input-tag>
      </el-form-item>
    </el-form>
    <div class="flex justify-between">
      <div class="text-xl">行为列表</div>
      <el-button @click="item.actions.push({ label: '', effect: '' })">
        添加
      </el-button>
    </div>
    <div class="flex flex-col gap-4">
      <el-form v-for="a, i in item.actions" class="card">
        <el-form-item>
          <el-button @click="a.condition = a.condition === '' ? undefined : ''" class="ms-auto">
            {{a.condition !== undefined ? '有条件' : '无条件'}}
          </el-button>
          <el-button :icon="Delete" @click="item.actions.splice(i, 1)" circle>
          </el-button>
          <el-button v-if="i != item.actions.length - 1" :icon="ArrowDown" circle
          @click="[item.actions[i], item.actions[i + 1]] = [item.actions[i + 1], item.actions[i]] as any"
          >
          </el-button>
        </el-form-item>
        <el-form-item label="文本">
          <el-input v-model="a.label" type="textarea" class="font-mono" :input-style="{whiteSpace: 'pre'}" autosize spellcheck="false">
          </el-input>
        </el-form-item>
        <el-form-item v-if="a.condition !== undefined" label="条件">
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
