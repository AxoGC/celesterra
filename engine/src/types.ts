export interface Scene {
  content: string
}

export interface Itemtype {
  icon: string
  name: string
  description: string
  groups: string[]
  stack?: number
  wearable?: boolean
  tags?: string[]
}

export interface Item {
  id: string
  amount?: number
  meta?: {}
}
