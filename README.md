## 项目命名来源

* 项目名称 “Celesterra” 源自 “Celeste”（意为“天空”或“天界”）与 “Terra”（意为“大地”）的合成。
* 寓意“连接天空与大地的世界”——既象征理想与现实的融合，也暗示游戏中世界观的广阔与层次感。
* 同时，名称开头的 “Cel” 还致敬 CEL 表达式语言，体现项目在技术层面对逻辑与表达式驱动设计的核心理念。

## 核心理念

Celesterra 是一个为创作者设计的文字RPG游戏引擎，其灵感类似于 Twine 或 Ren'py，但完全由**数据**和**表达式**驱动。

游戏的所有内容，从地点、事件、UI到物品和交互，都被抽象为**场景 (Scene)**。游戏逻辑则通过 **CEL (Common Expression Language)** 来描述。CEL 表达式用于定义 UI 的显示、动态内容，以及最重要的——生成一个**效果 (Effect)** 对象，从而驱动游戏状态的改变。

  * **场景 (Scene) 驱动**: “场景”是引擎的唯一核心。它取代了传统的“地点”、“实体”、“物品”或“事件”等具体概念。任何时候，玩家都位于一个场景中，无论是“森林”、“背包界面”、“与NPC的对话”还是“一个锻造台”。
  * **CEL 驱动逻辑**: 使用 CEL 表达式处理条件显示、动态文本和游戏事件。
  * **声明式 UI**: 每个场景的UI本身就是一个 CEL 表达式，它返回一个组件对象数组，由引擎负责渲染。
  * **原子化效果 (Effect) 系统**: 游戏中的所有行为（如跳转场景、修改属性、显示消息）都被抽象为一个**单一的** `Effect` 对象。
  * **数据驱动**: 所有的游戏元素都定义在结构化的 `Datapack` 中。

## 快速上手

在 Celesterra 中，没有“地点”或“实体”。我们只有一个“场景”。下面是一个简单的场景定义，它展示了引擎的核心：

```jsonc
// Datapack 的 "scenes" 字段中
"scene_forest_entry": {
  // 场景UI是一个CEL表达式，返回一个组件数组
  "ui": "[
    {
      'type': 'text',
      'text': f('你站在森林入口。你的健康值是 %d。', stats.hp)
    },
    {
      'type': 'button',
      'text': '进入森林深处',
      // 按钮的 'effect' 字段是一个单一的 Effect 对象
      'effect': {
        'set_stat': [
          { 'key': 'stats.location', 'value': 'deep_forest' },
          { 'key': 'stats.stamina', 'value': 'stats.stamina - 1' }
        ],
        'to': 'scene_deep_forest'
      }
    },
    {
      'type': 'button',
      'text': '返回村庄',
      'effect': {
        'to': 'scene_village'
      },
      // 'condition' 字段决定组件是否显示
      'condition': 'stats.stamina > 0'
    }
  ]"
}
```

-----

## 核心设计详解

### 1\. 场景 (Scene) - 唯一的抽象

游戏世界由 `scenes` 组成。一个 `Scene` 定义了玩家在特定时刻所能看到和交互的一切。

  * `scene_forest` 是一个场景。
  * `scene_inventory` (背包) 也是一个场景。
  * `scene_item_sword` (查看“黄金剑”详情) 也是一个场景。
  * `scene_dialog_guard` (与卫兵对话) 也是一个场景。

一个基础的场景定义如下：

```typescript
export interface Scene {
  // 场景的UI定义，是一个CEL表达式，必须返回 Component[]
  ui: string;

  // (可选) 当玩家进入此场景时触发的效果
  on_enter?: Effect;

  // (可选) 当玩家离开此场景时触发的效果
  on_leave?: Effect;
}
```

### 2\. 场景UI描述语言

`Scene` 的 `ui` 字段是一个 CEL 表达式，它返回一个**组件对象数组**。引擎会使用 `flex flex-col` 布局来渲染它们。

  * **组件类型**: `text`, `button`, `image`, `video`, `input`, `progress`, `group`。
  * **`condition`**: 所有组件都支持一个可选的 `condition` 字段 (CEL 表达式)，若为 `false`，则该组件不被渲染。

<!-- end list -->

```cel
// 这是一个 'ui' 字段的 CEL 表达式示例
[
  { 'type': 'text', 'text': '#yellow{黄金剑}' },
  { 'type': 'text', 'text': '一把锋利的剑。' },
  {
    'type': 'group',
    'direction': 'row', // group 可用于嵌套，支持 'row' 或 'col'
    'children': [
      { 'type': 'button', 'text': '装备', 'effect': { ... } },
      { 'type': 'button', 'text': '丢弃', 'effect': { ... } }
    ]
  }
]
```

### 3\. 效果 (Effect) 描述语言

这是设计的**关键迭代**。一个 `Effect` 不再是数组，而是**一个单一的对象**。

这个对象可以包含多种操作，**不同操作的执行顺序是固定的**。

```typescript
// Effect 是一个对象，包含零个或多个预定义的操作键
export interface Effect {
  // 1. 设置或修改属性 (set_stat 总是最先执行)
  //    使用对象数组以支持一次设置多个属性
  set_stat?: { key: string, value: any }[];

  // 2. 删除属性
  del_stat?: string[];

  // 3. 显示消息 (例如 toast)
  message?: string;

  // ... 其他操作类型，例如 play_sound, give_item 等

  // 4. 跳转场景 (to 总是最后执行)
  to?: string; // 目标场景的 ID
}
```

#### 为什么这样设计？

1.  **执行顺序固定**：你不再需要关心是先跳转场景还是先改属性。引擎保证了 `set_stat` 总是发生在 `to` 之前。
2.  **原子性**：一个 `effect` 字段只定义一个 `Effect` 对象，结构更清晰。
3.  **批量操作**：`set_stat` 是一个**对象数组**，允许你在同一步操作中修改多个属性。

**示例：**

```json
// 一个按钮的效果：
// 扣除10金币，增加1木材，并跳转到商店
"effect": {
  "set_stat": [
    { "key": "stats.gold", "value": "stats.gold - 10" },
    { "key": "stats.inventory.wood", "value": "stats.inventory.wood + 1" }
  ],
  "to": "scene_shop"
}
```

### 4\. Datapack 数据结构 (已扩展)

`Datapack` 是组织所有游戏内容的顶层容器。随着新机制的加入，其结构已扩展：

```typescript
export interface Datapack {
  id: string;
  name: string;
  version: string;
  description: string;
  dependencies: Record<string, string>; // 模块化机制会用到

  // 核心：所有场景的定义
  scenes: Record<string, Scene>;

  // 新：状态栏 (HUD) UI 定义
  // 这是一个CEL表达式，返回一个组件数组
  hud_ui?: string; 

  // 新：静态模板，用于定义物品/实体等的静态属性
  templates?: Record<string, any>;

  // 玩家或实体的状态定义
  stats: Record<string, StatDefinition>;

  // 可复用的CEL表达式
  calculations: Record<string, string>;

  // 可复用的自定义函数
  funcs: Record<string, Func>;
  
  // 新：初始化函数ID (在 funcs 中定义)
  init_func?: string; 
}
```

-----

## 扩展机制详解

基于更新后的 `Datapack`，以下是新增的核心机制：

### 1\. 状态栏UI机制 (HUD)

除了场景内的UI，引擎还支持一个全局的“状态栏”或“HUD”（Head-Up Display）。

  * **定义**: 在 `Datapack` 的 `hud_ui` 字段中定义。
  * **语法**: 与场景UI完全相同，是一个返回组件数组的 CEL 表达式。
  * **用途**: 用于显示全局信息，如玩家的生命值、饱食度、时间、代办任务或全局按钮（如“背包”、“菜单”）。
  * **绝对定位**: 与场景UI不同，HUD中的组件**支持绝对定位** (`layout: { 'position': 'absolute', 'top': '10px', 'left': '10px' }`)，允许你将元素固定在屏幕的任意角落。

### 2\. 模块化机制 (Datapack Chaining)

Celesterra 允许同时加载多个 `Datapack`。

  * **数据隔离与合并**: 每个数据包都可以定义自己的 `scenes`, `funcs`, `templates` 和 `hud_ui`。加载时，这些数据会合并，后加载的包可以覆盖（或补充）先加载的包。
  * **依赖管理**: `Datapack` 的 `dependencies` 字段用于声明依赖。
  * **功能连接 (Linking)**: 模块化的核心在于“场景链接”。一个基础包（例如“核心包”）可以定义一个按钮，其效果指向一个它自己并未实现的场景：
    > `// 核心包的 "scene_village" 中`
    > `{ 'type': 'button', 'text': '前往公会', 'effect': { 'to': 'scene_guild_hall' } }`
  * 此时，如果玩家没有加载“公会”数据包，点击按钮会（例如）提示错误。但如果玩家加载了“公会”数据包，该数据包**实现了** `scene_guild_hall`，那么链接就会无缝建立，玩家就可以访问公会了。

### 3\. 初始化函数机制

游戏启动或加载新游戏时，需要设置初始状态（例如，玩家的初始位置、初始物品等）。

  * **定义**: 你可以在 `Datapack` 的 `init_func` 字段中指定一个 `func` 的ID。
  * **执行**: 引擎在游戏**首次**启动时会调用这个 `func`。
  * **效果**: 这个 `func` 应该返回一个 `Effect` 对象，用于设置初始状态。
    > `// 'init_game' func 的 expression:`
    > `{ 'set_stat': [ { 'key': 'stats.hp', 'value': 100 }, { 'key': 'game.initialized', 'value': true } ], 'to': 'scene_start' }`
  * **幂等性**: 引擎应确保此函数只执行一次。创作者也应在 `func` 内部设置一个标记（如 `game.initialized`）来防止重复执行。

### 4\. 静态模板机制 (Templates)

当游戏变得复杂时，你可能需要一个地方来存储“物品原型”或“敌人原型”的静态属性（例如，一把剑的基础攻击力、一个怪物的基本掉落）。

  * **定义**: `Datapack` 的 `templates` 字段是一个全局可访问的字典。
  * **用途**: 你可以在这里定义你的“数据蓝图”。
    ```json
    // Datapack 的 "templates" 字段
    "templates": {
      "items": {
        "sword_iron": { "name": "铁剑", "damage": 10, "price": 50 },
        "potion_health": { "name": "生命药水", "heal": 25 }
      },
      "enemies": {
        "goblin": { "name": "哥布林", "hp": 30, "loot": "gold_coin" }
      }
    }
    ```
  * **访问**: 在任何 CEL 表达式中，你都可以通过 `templates` 这个全局变量来访问它们。
    > `// 示例：显示伤害`
    > `f('伤害：%d', templates.items[stats.player.weapon].damage)`

-----

## 自定义函数 (Func) 系统

自定义函数系统依然保留，它用于将可复用的 CEL 逻辑封装起来。**请注意：现在 `func` 的 `expression` 应该返回一个新的 `Effect` 对象**，而不是 `Effect[]`。

`func()` 的使用方式不变：

```cel
func('function_id', { 'arg1': value1, 'arg2': value2, ... })
```

### 示例 1: 可复用的计算

(此功能不变)

```json
"funcs": {
  "plus": {
    "description": "计算两个数字的和。",
    "expression": "args.a + args.b"
  }
}
// 调用: 1 + func('plus', { 'a': 2, 'b': 3 }) // 结果为 6
```

### 示例 2: 可复用的效果 (更新版)

将相对生命值变化封装为 `func`。

Datapack 定义 (`funcs` 部分):

```json
{
  "funcs": {
    "add_health": {
      "description": "为玩家增加生命值，并处理上限。",
      "expression": "
        {
          'set_stat': [{
            'key': 'stats.health',
            'value': '(stats.health + args.value) > stats.max_health ? stats.max_health : (stats.health + args.value)'
          }]
        }
      "
    },
    "remove_health": {
      "description": "扣除玩家生命值，并处理死亡事件。",
      "expression": "
        (stats.health - args.value <= 0) ?
        {
          'message': '你已经死亡！',
          'set_stat': [{ 'key': 'stats.health', 'value': 0 }],
          'to': 'scene_game_over'
        } :
        {
          'set_stat': [{ 'key': 'stats.health', 'value': 'stats.health - args.value' }]
        }
      "
    }
  }
}
```

在 Action 中调用:

```json
// 受到伤害
{
  "effect": "func('remove_health', { 'value': 10 })"
}

// 使用治疗药水
{
  "effect": "func('add_health', { 'value': 25 })"
}
```

-----

## 富文本格式化 (Rich Text Formatting)

为了增强游戏的表现力，Celesterra 在 `text` 和 `button` 等组件的文本字段中支持一种简单的富文本格式化语法。

#### 语法

格式化语法非常直观：

```
#<style>{<content>}
```

  * `style`: 预定义的样式名称，例如 `red` 或 `bold`。
  * `content`: 您希望应用该样式的文本内容。

#### 示例

1.  **改变颜色:**

      * **源码:** `"你获得了#yellow{50}枚金币！"`
      * **显示效果:** "你获得了**50**枚金币！" (其中 "50" 将以黄色显示)。

2.  **强调文本:**

      * **源码:** `"接受这个#bold{重要}的任务吗？"`
      * **显示效果:** "接受这个**重要**的任务吗？" (其中 "重要" 将以粗体显示)。

3.  **动态内容:**

      * **源码:** `f('你的状态是：#%s{正常}', stats.status_color)`
      * **显示效果:** (如果 `stats.status_color` 是 `green`) "你的状态是：**正常**" (绿色显示)。

#### 预定义样式列表

引擎内置了一系列基础样式，包括但不限于：

  * **样式:** `bold`, `italic`, `underline`
  * **大小:** `large`, `small`
  * **颜色:** `green`, `red`, `yellow`, `blue`, `white`, `black`, `gray`

## 贡献

我们欢迎任何形式的贡献！如果您有任何想法、建议或 Bug 修复，请随时提交 Pull Request 或创建 Issue。

## 许可证

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源。
