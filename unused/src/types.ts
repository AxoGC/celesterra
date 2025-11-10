export interface Datapack {
  name: string
  version: string
  description: string
  dependencies: Record<string, string>
  effects: Record<string, Effect>
  itemtypes: Record<string, Itemtype>
  entitypes: Record<string, Entitype>
  areas: Record<string, Area>
  achievements: Record<string, Achievement>
  quests: Record<string, Quest>
  stats: Record<string, string>
}

export interface Effect {
  description: string
  expression: string
}

export interface Itemtype {
  name: string
  description: string
  stackable: boolean
  tags: string[]
  actions: Action[]
}

export interface Item {
  type: string
  amount?: number
  meta?: {}
}

export interface Action {
  effect: string
  label: string
  condition?: string
}

export interface Entitype {
  name: string
  description: string
  storable: boolean
  tags: string[]
  actions: Action[]
}

export interface Area {
  name: string
  description: string
  tags: string[]
  places: Record<string, Place>
}

export interface Place {
  name: string
  description: string
  tags: string[]
  actions: Action[]
}

export interface Achievement {
  name: string
  description: string
}

export interface Quest {
  name: string
  description: string
  questeps: Questep[]
}

export interface Questep {
  label: string
  description: string
}

export interface Entity {
  type: string
  meta: Record<string, any>
  stats: Record<string, number>
}
