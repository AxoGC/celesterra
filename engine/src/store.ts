import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {Achievement, Area, Effect, Entity, Entitype, Item, Itemtype, Quest} from './types'

interface DatapackProfile {
  name: string,
  version: string,
  areas: string[],
  itemtypes: string[],
  entitypes: string[],
  quests: string[],
  achievements: string[],
  effects: string[],
  stats: string[],
}

interface SaveProfile {
  name: string
  updatedAt: string
  area: string
  place: string
  key: string
}

interface Save {
  area: string
  place: string
  stats: Record<string, number>
  flags: Record<string, any>
  entities: Record<string, Record<string, Entity[]>>
  items: Item[]
}

export const useStore = defineStore('store', () => {

  const datapacks = ref<Record<string, DatapackProfile>>({})
  const areas = ref<Record<string, Area>>({})
  const itemtypes = ref<Record<string, Itemtype>>({})
  const entitypes = ref<Record<string, Entitype>>({})
  const quests = ref<Record<string, Quest>>({})
  const achievements = ref<Record<string, Achievement>>({})
  const effects = ref<Record<string, Effect>>({})
  const stats = ref<Record<string, string>>({})

  const backups = ref<SaveProfile[]>([])

  const save = ref<Save>({
    area: '',
    place: '',
    stats: {},
    flags: {},
    entities: {},
    items: [],
  })

  return {
    datapacks, areas, itemtypes, entitypes, quests, achievements, effects, stats,
    backups, save,
  }
}, { persist: true })
