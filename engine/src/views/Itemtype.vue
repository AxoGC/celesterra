<script setup lang="ts">
import {useStore} from '@/store';
import {Delete} from '@element-plus/icons-vue';
import {computed, ref} from 'vue';

const groups: Record<string, string> = {
  vegetables: '蔬菜',
  fruits: '水果',
  foods: '食物',
  clothing: '服装',
  tools: '工具',
}

const store = useStore()
const currentId = ref('')
const selectedGroups = ref<string>('')
const current = computed(() => store.itemtypes[currentId.value])
</script>

<template>
  <div class="h-screen max-w-5xl mx-auto flex">

    <div class="basis-1/3 bg-gray-100 dark:bg-gray-950 flex flex-col gap-4">

      <div class="flex flex-col gap-4 px-4 pt-4">
        <div class="text-2xl dark:text-gray-100">
          物品列表
        </div>
        <el-input v-model="currentId" placeholder="请输入标识">
          <template #append>
            <el-button @click="store.itemtypes[currentId] = { icon: '', name: '', description: '', groups: [] }">
              添加
            </el-button>
          </template>
        </el-input>
        <el-select v-model="selectedGroups" placeholder="请选择分类">
          <el-option value="" label="全部">
          </el-option>
          <el-option v-for="name, id in groups" :label="name" :value="id">
          </el-option>
        </el-select>
      </div>

      <div class="flex px-2 flex-wrap justify-center gap-2 overflow-y-auto">
        <template v-for="item, id in store.itemtypes">
          <div v-if="!selectedGroups || item.groups.some(group => group === selectedGroups)"
            class="size-12 flex justify-center items-center bg-white dark:bg-gray-800 rounded-lg cursor-pointer text-3xl"
            @click="currentId = id"
          >
            {{item.icon}}
          </div>
        </template>
      </div>

    </div>

    <div class="basis-3/4 p-4 flex flex-col gap-4">
      <div class="text-2xl">
        物品详情
      </div>
      <div>
        <el-button :icon="Delete" circle @click="delete store.itemtypes[currentId]">
        </el-button>
      </div>
      <el-form v-if="current">
        <el-form-item label="图标">
          <el-input v-model="current.icon" class="!w-16">
          </el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="current.name" class="!w-64">
          </el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-checkbox-group v-model="current.groups">
            <el-checkbox v-for="name, id in groups" :key="name" :label="name" :value="id">
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="堆叠性">
          <el-input v-if="current.stack" v-model="current.stack" class="!w-64">
            <template #prepend>
              <el-button @click="current.stack = undefined">
                堆叠上限
              </el-button>
            </template>
          </el-input>
          <el-button v-else @click="current.stack = 16">
            不可堆叠
          </el-button>
        </el-form-item>
        <el-form-item label="穿戴性">
          <el-button @click="current.wearable = current.wearable ? undefined : true"
            :type="current.wearable ? 'success' : 'danger'"
          >
            {{current.wearable ? '可穿戴' : '不可穿戴'}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
