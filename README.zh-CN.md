# CityMaker

<p align="center">
  <a href="https://citymaker.0to1app.com">在线游玩</a> ·
  <a href="README.md">English</a>
</p>

CityMaker 是一款以真实城市建筑为灵感的浏览器 2048 游戏。每次合并都会让传统民居逐步成长为城市地标；所有建筑均使用 Three.js 程序化建模，无需账号或后端服务即可游玩。

目前包含北京、香港、上海、深圳、东京、新加坡、迪拜、悉尼、纽约、巴黎、伦敦和罗马共 12 座城市。每座城市有 11 个建筑等级，总计 132 个原创微缩模型，并提供英文、简体中文和繁体中文界面。

<p align="center">
  <a href="https://citymaker.0to1app.com">
    <img src="docs/images/citymaker-game.png" alt="CityMaker 香港高阶棋盘" width="100%">
  </a>
</p>

## 项目亮点

- **一城一套成长路线**：从地方民居、街区建筑一路合并到代表性城市地标。
- **132 个原创模型**：建筑由仓库中的程序化几何生成，不依赖第三方模型或贴图。
- **完整地标图鉴**：可以查看每座城市的 11 个等级，并拖动或使用方向键旋转模型。
- **响应式体验**：桌面端、手机端和触控操作使用各自适配的界面。
- **动态天气**：支持晴天、阴天、雨、雪和雾，并尊重系统的减少动态效果设置。
- **本地进度与战绩**：使用 IndexedDB 保存各城市进度、最高分和对局历史，数据不会上传。
- **可访问性**：支持方向键、WASD、屏幕按钮、触摸滑动以及键盘导航。

## 截图

每座城市都拥有独立的建筑图鉴，从传统建筑逐步过渡到现代天际线。

<p align="center">
  <img src="docs/images/citymaker-gallery.png" alt="CityMaker 巴黎地标图鉴" width="100%">
</p>

移动端提供更聚焦的棋盘和城市选择体验。

<p align="center">
  <img src="docs/images/citymaker-mobile-game.png" alt="CityMaker 移动端棋盘" width="32%">
  &nbsp;&nbsp;
  <img src="docs/images/citymaker-mobile-cities.png" alt="CityMaker 移动端城市选择" width="32%">
</p>

## 本地运行

需要 Node.js 22.12 或更高版本（已在 22.19 上测试）。

```sh
npm install
npm run dev
```

打开 Vite 输出的本地地址即可游玩。生产构建会生成在 `dist/`：

```sh
npm run build
npm run preview
```

运行自动化检查：

```sh
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
```

## 玩法

- 棋盘为 4×4，开局会生成两座低等级建筑。
- 使用方向键、WASD、屏幕方向按钮或触摸滑动移动所有建筑。
- 两座相同建筑相遇时会合并为下一等级，并把合并后的数值加入分数。
- 达到 2048 即完成当前城市；棋盘填满且无法继续合并时结束。
- 每次有效移动后可以撤销一次，重新开始不会清除图鉴和最高分。
- 切换城市会保留各自独立的棋盘和进度。
- 打开地标图鉴可以查看已经发现和尚未发现的建筑。
- iPhone 和 iPad 用户可以在手机首页点击「添加到主屏幕」，按提示通过浏览器的分享菜单把 CityMaker 放到主屏幕；之后它会以独立图标全屏竖屏启动，并读取与浏览器相同的存档。已经从主屏幕启动，或在微信等内置浏览器中打开时，该按钮会自动隐藏。

## 添加一座城市

游戏引擎只处理数值和合并规则，城市资料与模型彼此独立。新增城市的基本流程是：

使用 AI 协助贡献模型时，可以调用仓库中的 `$building-reference-modeling` [建筑参考图建模 skill](.agents/skills/building-reference-modeling/SKILL.md)。它涵盖多视角资料检索、按 tier 控制细节、卡通化建模和视觉验证，并要求明确记录仍属推断的部分。

1. 在 `src/cities/<id>.ts` 添加城市资料、三语言文本和配色。
2. 在 `src/cities/<id>/buildings/` 为 2 到 2048 的 11 个等级分别添加建筑资料。
3. 在 `src/scene/models/<id>/` 为每座建筑实现对应的 Three.js 模型工厂并注册。
4. 将新城市追加到 `src/cities/packs.ts`；不要插入或改写已经发布的城市 ID，以免破坏现有存档。
5. 运行模型边界、唯一性、城市资料和浏览器测试，并通过 `/?gallery` 检查所有视角。

完整的模型约束、缓存规则和保存兼容要求请参阅[英文 README](README.md#add-a-city)。

## 主要目录

- `src/game/`：2048 规则、存档验证、IndexedDB 仓库和天气状态。
- `src/cities/`：城市资料、建筑等级、翻译和参考链接。
- `src/scene/`：Three.js 渲染、模型工具、动画、天气及每座城市的模型工厂。
- `src/mobile/`：移动端界面。
- `tests/`：规则、存储、模型约束和浏览器交互测试。
- `docs/references/`：建筑参考与风格化处理记录。

## 存档与隐私

网页版本使用浏览器内的 `citymaker` IndexedDB 数据库保存进度和战绩。存档不会跨设备同步，也不会发送到服务器。首次运行新版时，旧的 `citymaker:v1` localStorage 存档会自动迁移，并保留原数据作为备份。

主屏幕图标只是网页版的快捷方式：项目未使用 Service Worker，因此启动时仍需联网，也没有离线缓存。图标、名称和启动配色来自 `public/manifest.webmanifest`、`apple-touch-icon` 与 `index.html` 中的 Apple 元标签；`npm run build:icons` 会从 `public/favicon.svg` 重新生成 PNG 图标。

## 微信小游戏原型

仓库还包含独立的 Canvas 2D 微信小游戏验证版本：

```sh
npm run build:wechat
npm run test:wechat
```

它验证了规则、触摸操作和微信本地存储，但尚未移植完整 3D 渲染、图鉴及战绩，也尚未经过微信开发者工具和真机验收。详细范围与迁移路线见 [WECHAT.md](WECHAT.md)。

## 原创内容与参考

仓库中的 132 个微缩建筑均以程序化几何原创实现。建筑比例会为了棋盘可读性进行压缩和风格化，并不用于测绘或历史复原。建筑资料中的来源链接用于记录视觉研究依据，不代表对第三方照片、商标或建筑作品拥有权利。

## 许可证

CityMaker 的源代码与原创程序化模型采用 [MIT License](LICENSE)。第三方依赖继续适用各自的许可证。

建筑、地标、机构和产品名称仅用于识别建筑参考；相关名称、商标和设计属于各自权利人。CityMaker 是独立、非官方项目，与相关所有者、建筑师、运营方或机构不存在隶属、认可或赞助关系。
