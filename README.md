## Celesterra
* 尚开发中，未完成。
* 本项目的灵感来自于一个成人游戏Degree of Lewdity，但它本身没有任何成人内容。
* 准确来说，这不是一个游戏，这是一个游戏引擎。

## 介绍，AI生成的，自己懒得写
好的，这是一份为您生成的 `README.md` 文件，它详细介绍了您的 **Celesterra** 项目。

-----

# Celesterra

欢迎来到 Celesterra！一个基于 Vue.js 构建，由 **CEL (Common Expression Language)** 驱动的动态游戏引擎。通过结构化的数据包（Datapack），您可以轻松创建丰富的游戏世界、复杂的逻辑和引人入胜的故事情节。

[](https://vuejs.org/)
[](https://opensource.org/licenses/MIT)

## 核心理念

Celesterra 的核心在于其灵活性和数据驱动的设计。所有游戏内容，从区域、物品到任务和成就，都定义在 **Datapack** 中。游戏逻辑则通过 CEL 表达式来描述，这些表达式最终输出一个或多个 **Effect** 对象，从而驱动游戏状态的改变。

  - **数据驱动**: 所有的游戏元素都通过清晰的 TypeScript/JSON 结构进行定义。
  - **表达式逻辑**: 使用 CEL 表达式处理条件判断、动态内容生成和复杂的游戏事件。
  - **效果（Effect）系统**: 游戏中的所有行为都被抽象为一系列的“效果”。例如，移动、显示消息、给予物品等。
  - **高度可扩展**: 通过全新的自定义函数 (Func) 机制，您可以将任何复杂的 CEL 逻辑（无论是用于计算还是生成效果）封装成可复用的模块，极大地提升了开发效率和代码的可维护性。

## 快速上手

下面是一个简单的 CEL 表达式示例，当玩家执行某个动作时，它会触发一个效果——将玩家移动到 `smithy` 地点。

```json
[{ "type": "move", "area": "city", "place": "smithy" }]
```

这个表达式是一个静态的效果数组。您也可以使用 CEL 来实现动态和条件逻辑：

```cel
player.stats.gold > 10 ?
  [{ "type": "message", "content": "你可以购买这把剑！" }] :
  [{ "type": "message", "content": "你的金币不够。" }]
```

## 数据结构（类型定义）

引擎的所有内容都围绕着以下核心 `interface` 进行构建。所有 `interface` 中都不存储自身的引用 ID，ID 是其在上级对象中作为 `key` 存在的。

### `Datapack`

Datapack 是组织所有游戏内容的顶层容器。

```typescript
export interface Datapack {
  id: string;          // 数据包的唯一标识
  name: string;        // 名称
  version: string;     // 版本
  description: string; // 描述
  dependencies: Record<string, string>; // 依赖的其他数据包 { id: version }
  effects: Record<string, Effect>;       // 自定义效果
  itemtypes: Record<string, Itemtype>;   // 物品类型
  entitypes: Record<string, Entitype>;   // 实体类型
  areas: Record<string, Area>;           // 区域
  achievements: Record<string, Achievement>; // 成就
  quests: Record<string, Quest>;         // 任务
  stats: Record<string, string>;         // 玩家或实体的状态，值是显示文本的CEL
  calculations: Record<string, Calculation>; // 辅助计算的表达式
}
```

### `Effect`

自定义效果，允许您将复杂的 CEL 逻辑封装成可复用的模块。

```typescript
// `Effect` 是一个 Record<string, any>，其中必须包含 `type` 字段
// 当调用自定义效果时，传入的其他 payload 字段可以在 `expression` 中被引用
export interface Effect {
  description: string;
  expression: string; // CEL => Effect[]
}
```

### `Action`

Action 定义了一个可交互的选项，例如一个按钮或一个对话选项。它可以有条件地显示，并执行一个或多个效果。

```typescript
export interface Action {
  effect: string;    // CEL => Effect[]
  label: string;     // CEL => string，选项的显示文本
  condition?: string; // CEL => boolean，决定选项是否可见或可用
}
```

### 核心游戏对象

  - **`Itemtype`**: 定义了物品的类型、属性和可执行的动作。
  - **`Entitype`**: 实体的模板，例如怪物、NPC、工作台等。实体可以在游戏中动态创建和销毁。
  - **`Area` & `Place`**: 游戏世界的基本组成部分，区域（Area）包含多个地点（Place）。
  - **`Achievement` & `Quest`**: 用于定义游戏的目标和叙事。

<!-- end list -->

```typescript
// 物品类型
export interface Itemtype {
  name: string;
  description: string;
  stackable: boolean; // 是否可堆叠
  tags: string[];     // 标签，用于逻辑判断
  actions: Action[];  // 物品可执行的动作
}

// 实体类型
export interface Entitype {
  name: string;
  description: string;
  storable: boolean; // 状态是否可持久化
  tags: string[];
  actions: Action[];
}

// 区域
export interface Area {
  name: string;
  description: string;
  tags: string[];
  places: Record<string, Place>;
}

// 地点
export interface Place {
  name: string;
  description: string;
  tags: string[];
  actions: Action[];
}
```

## 效果（Effect）系统

效果是驱动游戏世界变化的核心。一个效果就是一个简单的对象，它必须包含一个 `type` 字段和一些相关的 `payload`。

### 内置效果类型 (部分列表)

| Type | 描述 | Payload 示例 |
| :--- | :--- | :--- |
| `move` | 移动到指定地点。`area` 为空则代表当前区域。 | `{ "type": "move", "area": "city", "place": "smithy" }` |
| `message` | 在界面上展示一条消息。 | `{ "type": "message", "content": "你找到了一把生锈的钥匙。" }` |
| `dialog` | 展示一个包含多行文本的对话框。 | `{ "type": "dialog", "content": ["你好，旅行者。", "需要什么帮助吗？"] }` |
| `give_item` | 给予玩家物品。 | `{ "type": "give_item", "item": "health_potion", "amount": 3 }` |
| `clear_item` | 移除玩家的物品。 | `{ "type": "clear_item", "item": "gold_coin", "amount": 50 }` |
| `consume` | （通常在物品动作中）消耗当前物品一个。 | `{ "type": "consume" }` |
| `set_stat` | 增加或减少玩家/实体的属性。 | `{ "type": "set_stat", "stat": "health", "value": 85 }` |
| `spawn` | 在指定位置生成一个实体。 | `{ "type": "spawn", "type": "goblin", "place": "forest_path" }` |
| `despawn` | 移除一个实体。 | `{ "type": "despawn", "entity": "goblin_123" }` |
| `achieve` | 达成一个成就。 | `{ "type": "achieve", "achievement": "first_step" }` |
| `set_flag` | 设置一个全局或局部标志位，用于任务跟踪等。 | `{ "type": "set_flag", "key": "main_quest_started", "value": true }` |
| `play_sound`| 播放一个音效。 | `{ "type": "play_sound", "filename": "door_open.ogg" }` |

自定义函数 (func) 系统

为了解决传统自定义效果无法复用计算逻辑的问题，Celesterra 引入了一套强大的自定义函数系统。您可以在 Datapack 的 funcs 字段中定义任意可复用的 CEL 表达式，然后在游戏的其他任何表达式中通过内置的 func() 函数来调用它们。

func() 的使用方式非常简单：

```cel
func('function_id', { 'arg1': value1, 'arg2': value2, ... })
```

function_id: 在 Datapack 的 funcs 中定义的函数键名。

第二个参数: 一个包含所有参数的字典。在被调用的表达式中，可以通过 args 变量来访问这些参数 (例如 args.arg1)。

这个机制的强大之处在于，func 可以返回任何类型的数据，这使得它既能用于封装复杂的效果组合，也能用于创建可复用的计算属性。

示例 1: 可复用的计算

假设您需要一个在多处使用的加法逻辑。

Datapack 定义 (funcs 部分):

```json
{

  "funcs": {

    "plus": {

      "description": "计算两个数字的和。",

      "expression": "args.a + args.b"

    }

  }

}
```

在其他表达式中调用:

现在，您可以在任何 CEL 表达式中像调用普通函数一样使用它，比如计算伤害或价格：



```cel
// 基础伤害 1 + 额外加成

1 + func('plus', { 'a': 2, 'b': 3 }) // 表达式的计算结果为 6
```

示例 2: 可复用的效果 (新的贸易系统)

我们可以将之前的贸易系统改写为 func，使其更清晰、更易于调用。

Datapack 定义 (funcs 部分):

```json
{

  "funcs": {

    "trade": {

      "description": "通用交易逻辑，传入 cost 和 reward 对象，返回一组 Effect。",

      "expression": "player.items.exists(item, item.id == args.cost.item && item.amount >= args.cost.amount) ? [{ 'type': 'message', 'content': '交易成功' }, { 'type': 'clear_item', 'item': args.cost.item, 'amount': args.cost.amount }, { 'type': 'give_item', 'item': args.reward.item, 'amount': args.reward.amount, 'meta': args.reward.meta }] : [{ 'type': 'message', 'content': '成本不足，无法交易' }]"

    }

  }

}
```

在 Action 的 effect 字段中调用:

调用方式变得非常简洁直观。

```json
{

  "label": "购买铁剑 (50金币)",

  "effect": "func('trade', { 'cost': { 'item': 'gold', 'amount': 50 }, 'reward': { 'item': 'iron_sword', 'amount': 1, 'meta': { 'durability': 100 } } })"

}
```

示例 3: 相对状态变化

同样，我们可以将相对生命值变化封装为 func。

Datapack 定义 (funcs 部分):

```json
{

  "funcs": {

    "add_health": {

      "description": "为玩家增加生命值，并处理上限。",

      "expression": "[{ 'type': 'set_stat', 'stat': 'health', 'value': player.stat.health + args.value > 100 ? 100 : player.stat.health + args.value }]"

    },

    "remove_health": {

      "description": "扣除玩家生命值，并处理死亡事件。",

      "expression": "player.stat.health - args.value <= 0 ? [{ 'type': 'message', 'content': '你已经死亡！' }, { 'type': 'move', 'area': 'heaven', 'place': 'gate' }] : [{ 'type': 'set_stat', 'stat': 'health', 'value': player.stat.health - args.value }]"

    }

  }

}
```

在 Action 中调用:



```json
// 受到伤害

{

  "effect": "func('remove_health', { 'value': 10 })"

}// 使用治疗药水

{

  "effect": "func('add_health', { 'value': 25 })"

}
```

## 贡献

我们欢迎任何形式的贡献！如果您有任何想法、建议或 Bug 修复，请随时提交 Pull Request 或创建 Issue。

## 许可证

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源。
