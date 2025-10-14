import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {Datapack} from './types'

export const useDataStore = defineStore('data', () => {
  const data = ref<Record<string, Datapack>>({})
  return { data }
}, { persist: true })
