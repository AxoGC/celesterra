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
        'set_stats': {
          'location': 'deep_forest',
          'stamina': stats.stamina - 1,
        },
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
  //    使用对象的不同键以支持一次设置多个属性
  set_stats?: { key: value };

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
  "set_stat": {
    "gold": stats.gold - 10,
    "inventory.wood": stats.inventory.wood + 1,
  },
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
    > `{ 'set_stats': { 'hp': 100, 'initialized': true }, 'to': 'scene_start' }`
  * **幂等性**: 引擎应确保此函数只执行一次。创作者也应在 `func` 内部设置一个标记（如 `initialized`）来防止重复执行。

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
          'set_stats': {
            'health': (stats.health + args.value) > stats.max_health ? stats.max_health : (stats.health + args.value),
          }
        }
      "
    },
    "remove_health": {
      "description": "扣除玩家生命值，并处理死亡事件。",
      "expression": "
        (stats.health - args.value <= 0) ?
        {
          'message': '你已经死亡！',
          'set_stats': { 'health': 0 },
          'to': 'scene_game_over'
        } :
        {
          'set_stats': { 'stats.health': stats.health - args.value }
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

# Celesterra 官方数据包

欢迎来到 Celesterra 的核心数据包。这不是引擎，而是使用 Celesterra 引擎构建的一个**官方游戏世界和玩法框架**。

本数据包旨在提供一个以**生活模拟、探索、建造和社交**为核心的“vanilla”体验。它全面利用了 Celesterra 引擎的 `Scene`, `Effect`, `stats` 和 `templates` 机制，来构建一个动态的、随时间变化的世界。

## 核心机制实现

本数据包的设计思路与引擎的抽象概念（如 `Scene`）紧密相连。

### 1. 动态时间与环境系统

游戏世界的核心是**全局时间系统**（游戏内时钟）。

* **引擎状态 (`stats`)**:
    * 本包的 `init_func` 会初始化 `stats.game.time` (一个不断递增的数字)。
    * `calculations` (计算属性) 会基于 `stats.game.time` 派生出：
        * `stats.game.hour` (0-23)
        * `stats.game.day_of_season` (1-30)
        * `stats.game.season` ('spring', 'summer', 'autumn', 'winter')
    * `stats.game.weather` ('sunny', 'rainy', 'snowy') 也会随时间动态变化。
* **状态栏 (`hud_ui`)**:
    * 本包提供了一个默认的 `hud_ui`，用于在屏幕角落始终显示当前时间、日期、季节和天气。
* **玩法影响 (场景 `condition`)**:
    * **昼夜**: `scene_city_gate` (城门) 的 `on_enter` 效果在夜晚 (`stats.game.hour > 22`) 会 `to: 'scene_city_gate_closed'` (关闭的城门)。
    * **季节**: `scene_river` (河流) 在冬天 (`stats.game.season == 'winter'`) 会有一个 `condition` 为 `true` 的按钮，允许 "在冰面上行走"。
    * **保暖/降温**: `scene_wilderness` (野外) 的 `on_enter` 效果会调用一个 `func('check_temperature')`，根据季节和天气，为玩家添加 `Effect` (如 `set_stat: [{ key: 'stats.player.cold_debuff', value: 1 }]`)。

### 2. 探索与收集 (场景即万物)

在 Celesterra 中，没有“实体”或“物品”的特殊定义。**万物皆场景**。

* **垃圾桶**: 这不是一个“物品”，这是一个 `Scene`。
    * `scene_alley_dumpster` (后巷垃圾桶)
    * **UI**: 包含一个按钮 `{'type': 'button', 'text': '翻找', 'effect': func('rummage_dumpster')}`
    * `func('rummage_dumpster')` 会检查 `stats.game.time` 与 `stats.player.last_rummage_time`，如果允许，则给予物品并更新时间戳。
* **钓鱼**: 这是一个 `Scene`。
    * `scene_lake_fishing_spot` (湖边钓鱼点)
    * **UI**: 包含按钮 `{'type': 'button', 'text': '开始钓鱼 (需要鱼饵)', 'condition': 'stats.inventory.bait > 0', 'effect': {'to': 'scene_minigame_fishing'}}`
* **资源点**: 这是一个 `Scene`。
    * `scene_forest_mine_node` (森林矿点)
    * **UI**: 包含按钮 `{'type': 'button', 'text': '开采', 'effect': func('harvest_node')}`。
    * `func('harvest_node')` 会检查资源点状态 (`stats.nodes.forest_mine_01.respawn_time`)。

### 3. 经济与建造 (动态状态驱动)

* **地皮与房屋**:
    * `scene_player_house` 是玩家的家。
    * **建造**: 这是一个 `Scene` (`scene_workbench_build`)，允许玩家消耗 `stats.inventory` 中的材料，来修改 `stats.player.house.upgrades` (例如 `house.upgrades.has_kitchen = true`)。
    * `scene_player_house` 的 `ui` 表达式会**动态读取** `stats.player.house.upgrades` 来决定显示哪些按钮（例如，`condition: 'stats.player.house.upgrades.has_kitchen'` 的 "烹饪" 按钮）。
* **种植与饲养**:
    * `scene_player_farm` (玩家农场)
    * **UI**: 其 `ui` 表达式会迭代 `stats.player.farm.plots` (一个对象数组)。
    * **数据**: `stats.player.farm.plots[0]` 可能是 `{ 'seed': 'tomato', 'plant_time': 12345, 'watered': true }`。
    * **交互**: 按钮的 `condition` 会检查 `game.time` 和 `plant_time` 的差距，来动态显示 "浇水"、"除草" 或 "收获" 按钮。
* **商店**:
    * NPC 商店 (`scene_shop_general`) 是一个简单的 `Scene`，其按钮 `effect` 会执行交易逻辑（检查 `stats.gold` 并修改 `stats.inventory`）。

### 4. 社交与组织 (状态即关系)

* **NPC 好感度**:
    * 每个 NPC 的好感度存储在 `stats.npc.<npc_id>.friendship`。
    * `scene_dialog_<npc_id>` (对话场景) 中的 `button` 会使用 `condition: 'stats.npc.npc_id.friendship > 50'` 来解锁新的对话选项。
* **组织 (公会)**:
    * `stats.player.guild_id` 存储玩家的公会。
    * `scene_guild_hall` (公会大厅) 的 `on_enter` 效果会检查 `stats.player.guild_id`，如果为空则 `to: 'scene_guild_reception'` (接待处)，否则 `to: 'scene_guild_main_hall'` (公会内部)。

### 5. 技能与成长 (模板与配方)

* **技能等级**:
    * 所有技能等级存储在 `stats.skills` (例如 `stats.skills.cooking`, `stats.skills.forging`)。
* **静态模板 (`templates`)**:
    * 本包的 `templates` 字段定义了所有“静态蓝图”。
        * `templates.items`: 定义所有物品的静态属性 (如 `sword_iron: { 'name': '铁剑', 'base_damage': 10 }`)。
        * `templates.recipes`: 定义所有配方 (如 `recipe_bread: { 'name': '面包', 'skill': 'cooking', 'level': 1, 'materials': [{'item': 'flour', 'amount': 2}] }`)。
* **合成场景**:
    * `scene_workbench_kitchen` (烹饪台)
    * **UI**: 其 `ui` 表达式会**迭代 `templates.recipes`**，并使用 `condition` 来检查玩家是否满足材料和技能等级 (`stats.skills.cooking >= recipe.level`)，只显示玩家可制作的选项。

### 6. 事件与剧情 (状态机)

* **任务系统**:
    * 任务进度是典型的“状态机”，存储在 `stats.quests`。
    * 例如, `stats.quests.main_01.stage` (0=未接, 10=已接, 20=已杀怪, 30=已交任务)。
    * NPC 对话按钮的 `condition` 会检查 `stats.quests.main_01.stage == 10`，其 `effect` 会设置 `set_stat: [{ 'key': 'stats.quests.main_01.stage', 'value': 20 }]`。
* **动态事件**:
    * `scene_forest` (森林) 的 `on_enter` 效果可能会调用一个 `func('check_random_encounter')`。
    * 这个 `func` 会根据 `rand()` (CEL内置的随机函数) 有一定几率返回一个 `Effect` 对象，例如 `{ 'message': '你遭遇了土匪！', 'to': 'scene_combat_bandits' }`。

## 本数据包提供的关键定义

* **`init_func`**: 提供 `'homestead.init_game'` 函数，用于设置初始玩家状态、初始时间和 `game.initialized` 标记。
* **`hud_ui`**: 提供一个默认的HUD，显示时间、天气、玩家核心状态 (HP/MP) 以及全局按钮 (背包、菜单)。
* **`templates`**:
    * `items`: (武器、工具、食物、材料...)
    * `recipes`: (烹饪、锻造、炼金...)
    * `crops`: (作物生长周期、季节...)
* **`scenes`**:
    * `scene_main_menu`: 游戏主菜单。
    * `scene_player_home`: 玩家的家。
    * `scene_player_farm`: 玩家的农场。
    * `scene_town_center`: 城镇中心 (枢纽场景)。
    * `scene_shop_*`: 各种商店。
    * `scene_workbench_*`: 各种工作台。
    * `scene_inventory`: 背包界面。
    * `scene_dialog_*`: 各种NPC对话。
    * ...以及大量用于探索和任务的场景。
