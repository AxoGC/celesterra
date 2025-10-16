// 输出中的Effect是指一个Record<string, any>，其中必须包括type: string，其他字段作为payload
// 输出为Effect[]指输出Effect的数组表示一组效果，输出为boolean和string分别代表条件判断和动态内容显示
// 示例CEL表达式：[{ "type": "move", "area": "city", "place": "smithy" }]
// 系统有一组基础的type，另外我们可以在这些基础的type上自定义type
// 在上面的示例里，如果area不存在，就代表前往当前区域的地点
// 可以直接在CEL表达式里面存放静态数据，代表静态效果，也可以进行条件判断，代表动态效果
// 所有interface里面不存储引用标识id，引用标识作为上级对象存放当前对象使用的键名
// 区域 / 地点 / 选项 / 物品 的名称或显示文本的前面可以使用emoji作为图标

export interface Datapack {
  id: string
  name: string
  version: string
  description: string
  dependencies: Record<string, string>
  funcs: Record<string, Func>
  itemtypes: Record<string, Itemtype>
  entitypes: Record<string, Entitype>
  areas: Record<string, Area>
  achievements: Record<string, Achievement>
  quests: Record<string, Quest>
  stats: Record<string, string> // 玩家或实体的状态，值表示显示文本CEL
}

// 自定义函数，函数名是datapack的键名，逻辑在expression里面
// 使用方法：func('key', { arg_1: val_1, arg_2: val_2, ... })
export interface Func {
  description: string
  expression: string // CEL => any
}

export interface Itemtype {
  name: string
  description: string
  stackable: boolean
  tags: string[] // 用于标记，辅助CEL表达式进行逻辑判断，可选的
  actions: Action[]
}

// condition 返回 false 时，既不显示选项，也无法执行，如果选项无条件则为true或undefined或""
export interface Action {
  effect: string // CEL => Effect[]
  label: string // CEL => string
  condition?: string // CEL => boolean
}

// 实体类型，实体是指存在于特定地点，可以生成、移除、交互的功能，可以有状态或存储
// 实体以实体类型为模板，在游戏里动态创建
// 耕地、动物、怪物、工作台都可以是实体
// 如果一个任务NPC是固定的，可以不做成实体，而是做成地点的行为选项
export interface Entitype {
  name: string
  description: string
  storable: boolean
  tags: string[] // 用于标记，辅助CEL表达式进行逻辑判断，可选的
  actions: Action[]
}

export interface Area {
  name: string
  description: string
  tags: string[] // 用于标记，辅助CEL表达式进行逻辑判断，可选的
  places: Record<string, Place>
}

export interface Place {
  name: string
  description: string
  tags: string[] // 用于标记，辅助CEL表达式进行逻辑判断，可选的
  actions: Action[]
}

export interface Achievement {
  name: string
  description: string
}

export interface Quest {
  name: string
  description: string
  steps: Step[]
}

export interface Step {
  label: string
  description: string
}

// 内置 types 列表，一部分
// 移动到指定地点，area为空代表移动到当前区域的地点
// { type: 'move', area?: string, place: string }
// 展示消息
// { type: 'message', content: string }
// 展示对话框
// { type: 'dialog', content: string[] }
// 给予物品，amount默认为1，默认物品不带有元信息
// { type: 'give_item', type: string, amount?: number, meta?: object }
// 移除物品，amount默认为1
// { type: 'clear_item', item: string, amount?: number }
// 如果效果由使用物品触发，那么将物品数量减一
// { type: 'consume' }
// 增加或减少玩家属性
// { type: 'set_stat', stat: string, value: number }
// 生成实体，没有area代表当前区域，没有place代表当前地点，数量默认为1
// { type: 'spawn', type: string, area?: string, place?: string, meta?: string, amount?: number }
// 移除实体
// { type: 'despawn', entity: string, area?: string, place?: string }
// 移动实体
// { type: 'move_entity', entity: string, from?: { area?: string, place: string }, to?: { area?: string, place: string } }
// 达成成就
// { type: 'achieve', achievement: string }
// 设置标志
// { type: 'set_flag', key: string, value: any }
// 删除标志
// { type: 'delete_flag', key: string }
// 播放音效
// { type: 'play_sound', filename: string }
// 展示图片
// { type: 'show_image', filename: string }
// 目前只能想到这些，不过可能不够
// 自定义的type使用方法
// 1. 贸易系统
// { custype: 'trade', cost: { item: 'gold', amount: 50 }, reward: { item: 'iron_sword', meta: { durability: 100 } } }
// { custype: 'trade', cost: { item: 'wood', amount: 10 }, reward: { item: 'gold', amount: 50 } }
// 对应的 Effect 定义
// player.items.exists(item, item.id == cost.item && item.amount >= cost.amount) ? [
//   {type: 'message', content: '交易成功'},
//   {type: 'remove_item', item: cost.item, count: cost.count},
//   {type: 'give_item', item: reward.item, count: reward.count}
// ] : [{type: 'message', content: '成本不足，无法交易'}]
// 2. 相对状态变化
// { custype: 'add_health', value: 10 }
// [{ type: 'set_stat', stat: 'health', value: player.stat.health + value > 100 ? 100 : player.stat.health + value }]
// { custype: 'remove_health', value: 10 }
// player.stat.health - value < 0 ? [
//   { type: 'move', area: 'heaven', place: 'heaven' }
// ] : [
//   { type: 'set_stat', stat: 'health', value: player.stat.health - value }
// ]
