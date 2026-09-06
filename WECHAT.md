# CityMaker 微信小游戏迁移与上线清单

检查日期：2026-09-05。结论：可迁移，但网页产物不能直接上传为小游戏。本次新增独立 Canvas 2D 可玩验证包；完整 3D CityMaker 尚未迁移，尚未在微信开发者工具或真机验收，也未提交或发布。

## 1. 当前项目的实际结构

以下命令和路径均以仓库根目录为起点。

| 项目       | 检查结果                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| 框架       | React / React DOM 19，TypeScript 5.9，Vite 7；本机安装版本分别为 React 19.2.8、TypeScript 5.9.3、Vite 7.3.6                |
| 图形       | Three.js 0.180.0 + WebGL，程序生成城市建筑；不是 Pixi、Phaser 或 Cocos                                                     |
| 页面       | `src/main.tsx` 挂载 React；`src/App.tsx`、`src/History.tsx`、`src/styles.css` 实现 DOM 界面                                |
| 渲染       | `src/scene/Canvas.tsx` 包装画布；`src/scene/render.ts` 使用 DOM、ResizeObserver、浏览器动画帧和多个画布                    |
| 规则       | `src/game/engine.ts`：纯 TypeScript、4×4、合并、随机生成、撤销、2048 胜利与失败；可直接复用                                |
| 数据与美术 | `src/cities/` 十二城市、132 个建筑等级；`src/scene/models/`、`kit.ts`、`parts.ts` 为程序化模型                             |
| 持久化     | `src/game/repository.ts` 使用 IndexedDB 保存进度及战绩；`storage.ts` 读取旧 localStorage，创建会话依赖 `crypto.randomUUID` |
| 网络       | 未发现游戏后端或登录请求；CSS 请求 Google Fonts；建筑来源网址用于元数据/网页链接，不是下载模型的地址                       |
| 网页构建   | `npm run dev`；`npm run build` 输出 `dist/`；`npm run preview`；Node 22.12+                                                |

本次网页构建通过；Three.js chunk 约 514 KB，有 Vite 大分块提示。这是网页体积提示，不是微信真机性能结论。

## 2. 本次已实现的最小可玩验证版

新增独立入口，不改写现有网页游戏：

- `src/wechat/main.ts`：单个 `wx.createCanvas()` 的 Canvas 2D 界面，简体中文、十二城市名称与建筑名称、正交四方向滑动、分数和最高分、撤销、重开确认、切换城市。
- `src/wechat/state.ts`：复用原规则引擎，使用 `wx.getStorageSync/setStorageSync` 存十二城市进度；每步有效操作及进入后台时保存，失败有提示。
- 城市入口与状态层的 CITY_IDS 均从 `src/cities/packs.ts` 派生，顺序为北京、香港、上海、深圳、东京、新加坡、迪拜、悉尼、纽约、巴黎、伦敦、罗马。保留版本 1 的城市下标及进度数组，读取旧四城存档时补建八城进度，原四个下标不变。
- 独立存档 key `citymaker:wechat:prototype:v1`；不迁移浏览器存档，不保存战绩或会话 ID，不调用 IndexedDB/crypto。
- 存档读取异常或不支持的版本只允许临时游玩，保留原存档；写入失败下次操作重试。存档棋盘、分数及撤销数据经过校验，终局状态重新推导。
- `wx.onTouchStart/End/Cancel`、`wx.onShow/Hide`、`wx.onWindowResize`；避让安全区域与胶囊按钮，像素比上限 2；按需绘制，无常驻动画循环。
- `scripts/build-wechat.mjs`：使用已安装 Vite，输出自包含 IIFE；没有新增依赖。
- `wechat/game.json`：竖屏和状态栏设置源文件。
- `tests/wechat.test.ts` 与 `scripts/test-wechat.mjs`：持久化测试及实际生成包的 wx-only 启动/交互测试。

**范围边界：这是迁移验证原型，不是完整城市游戏的发布候选版。** 没有 3D 建筑、等距棋盘、合并动画、图鉴、战绩、三语言设置，也没有登录、广告、支付、云存档、实名或防沉迷接入。验证版为正交滑动；现有等距网页使用对角线映射，两者提示不同。

## 3. 构建和开发者工具操作

在仓库目录运行：

```sh
npm ci
npm run test:wechat
```

这会类型检查、构建并执行生成包测试。仅构建用 `npm run build:wechat`。输出：

```text
dist-wechat/
  game.js                 # 生成的自包含运行入口，约 56.1 KB
  game.json               # deviceOrientation: portrait
  project.config.json     # compileType: game, miniprogramRoot: ./
```

不需要 `app.json`、页面 WXML/WXSS 或 HTML。`project.config.json` 按官方小游戏示例的游戏编译类型配置。源码更新后重新构建；输出目录会重建，不要把长期配置只改在产物中。网页仍用 `dist/`，两种产物互不覆盖。

没有 AppID 时生成 `touristappid` 占位配置；工具版本可能限制游客导入和能力，不能凭占位值上传或保证真机预览。拿到自己的**小游戏 AppID**后运行：

```sh
WECHAT_APPID='替换成你的小游戏AppID' npm run build:wechat
```

1. 安装并打开微信开发者工具，用具有该 AppID 开发权限的微信账号登录。
2. 选择小游戏项目，导入仓库根目录下生成的 `dist-wechat/`；确认编译类型是小游戏、AppID 属于你的小游戏。
3. 选择工具支持的基础库，记录版本；编译，确认启动无异常。本包已打包依赖，不需要再“构建 npm”。
4. 在模拟器检查滑动、撤销、取消/确认重开、切换十二城市、关闭重进续玩。Canvas 界面用鼠标拖动模拟触摸，不支持网页键盘快捷键。
5. 用“预览”或“真机调试”生成二维码，由有权限的体验者在微信打开；这一步需要真实账号/AppID。
6. iPhone 和 Android 分别验收，通过后上传开发版本，填写版本号与变更说明，在公众平台设置体验版/体验成员，再准备提审。

本机仅发现 WeChat 客户端，未发现微信开发者工具；本次没有执行以上平台操作。

## 4. 完整 3D 版本必须改变什么

| 现有实现                                       | 微信实现与验收点                                                                                                                                                                               |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React DOM、CSS、dialog、lucide-react 图标      | Canvas UI 或适配小游戏的 UI 库；按钮命中检测、确认框、城市选择、图鉴和战绩重做；不是安装 Adapter 就可运行 React DOM                                                                            |
| WebGLRenderer / HTMLCanvasElement              | 显式注入微信画布和 WebGL2 context；当前 Three.js r180 源码只请求 `webgl2`，不支持 WebGL1。先用北京满盘验证兼容和性能，再扩展十二城                                                             |
| 多画布及 DOM 叠层                              | 一个上屏 WebGL 画布；HUD 可用离屏 2D 画布作为纹理合成到同一 WebGL 输出。上屏画布不能同时拿 2D 和 WebGL context；正式 3D 入口需替换本原型渲染                                                   |
| ResizeObserver、clientWidth/Height、window DPR | 平台注入逻辑尺寸与 DPR，`wx.getWindowInfo`（需要时旧接口回退）及 `wx.onWindowResize`；避让安全区域和胶囊                                                                                       |
| document.hidden、浏览器动画帧                  | `wx.onHide/onShow` 管理渲染和存档，使用小游戏支持的动画调度；测试后台返回不跳帧、不重复响应触摸                                                                                                |
| document.createElement('canvas') 标签纹理      | `wx.createCanvas` 离屏绘字并创建纹理；避免假设所有新 Canvas 2D 方法存在，逐项验证 roundRect 等用法                                                                                             |
| 图片、字体、音效                               | 当前程序化模型无外部 mesh/texture；新增资源随包存相对路径，图片使用 `wx.createImage`，本地字体用 `wx.loadFont` 并保留系统回退；音效使用小游戏音频 API。删除 Google Fonts 网络依赖              |
| fetch / 外链（未来能力）                       | 当前原型无网络请求、无需游戏服务器。未来请求用 `wx.request`，下载用 `wx.downloadFile`，配置相应合法 HTTPS 域名；生产验收保持域名校验开启。网页参考链接改为静态来源说明，不能假设能打开任意网页 |
| IndexedDB / localStorage                       | 正式版实现 `GameRepository` 的微信后端，保存成功后才显示成功；设计单记录快照或文件事务策略、串行提交和战绩去重。不能用多次 wx 写入假装 IndexedDB 事务                                          |
| 无限战绩、会话 ID                              | 采用明确的战绩保留上限或分页/文件归档，核对当前存储额度；注入平台 ID 生成器，避免依赖 crypto.randomUUID。原型只有固定十二份进度，不实现完整 repository 接口                                    |

建议的完整迁移顺序：

1. 保留本原型作为 wx 构建/交互基线；单独做北京 Three.js 渲染探针，验证 WebGL2、光照、阴影、字体、销毁与恢复。不要盲目降级 Three.js 或引入未经验证的旧 adapter。
2. 若 3D 探针通过，抽离 `SceneView` 对 DOM 的依赖，复用模型和 ModelKit；构建单画布 HUD、等距滑动、合并动画、撤销和终局。
3. 接入正式微信 repository、十二城市、图鉴和战绩。测试重开归档、撤销终局去重、更新版本和缓存损坏。
4. 真机性能验收后才加入广告等商业功能。若最低目标设备不能满足 WebGL2，评估将原建筑离线渲染成 sprite atlas：保留城市视觉，运行时走 2D；需要额外制作贴图与动画。改用 Cocos 是较大重写，不是当前最小路线。

## 5. 测试记录与剩余验收

本次已通过：

- `npm test`：6 个文件、35 项测试（包含微信存储兼容测试）。
- `npm run test:wechat`：类型检查、小游戏构建、生成包在没有 window/document/crypto/IndexedDB 的隔离环境运行；验证滑动合并、撤销、重开取消/确认、十二城遍历、末城保存恢复、回到第一城、后台/前台及尺寸回调；构建不引入 Three.js 或浏览器运行时。
- `npm run build`：网页生产构建通过。
- 此前四城原型已用浏览器真实 Canvas 检查 390×844 布局；旧截图是 wx 模拟环境。本轮十二城运行验证采用 wx-only 自动测试，尚无新的微信设备截图。

仍须手工完成：iOS/Android 真机启动；小屏/刘海屏/平板安全区域；多点触摸与系统取消；反复前后台；杀进程后续玩；无网络冷启动；缓存满/不可写；更新后读旧存档；胜利/失败和连续撤销；真实字体与按钮命中。完整 3D 版额外测 16 个高等级模型的启动耗时、内存、帧率、发热和 WebGL context 恢复。网页端回归及截图覆盖见 QA.md。

## 6. 发布与主体清单

**个人可以开发此项目，技术上不需要先注册公司；但当前证据不足以确认你的个人主体账号能直接公开发布、接广告或内购。** 不应把之前对话中“个体户或企业更稳妥”当作已核实的主体准入结论，也不能承诺个人做 2048 就免版号。微信后台准入和游戏出版审批是不同问题。

在投入完整 3D 迁移前，先用实际账号核验以下项目。微信文档站在本次访问多次失败；未登录你的公众平台，因而以下是办理检查清单，非已获资格结论：

- [ ] 在公众平台注册/创建小游戏，核实当前小游戏类目允许的主体类型（个人、个体户、企业分别核验），身份认证、负责人、地区与开发权限；获取真实 AppID。若个人账号不满足所需能力，再选择符合资格的主体或发行合作方，不要假设个体户与企业完全等同。
- [ ] 明确首版是否只免费游玩、是否接广告、是否有虚拟内购。原型没有任何商业能力。分别核对流量主准入、结算主体、税务资料和广告位要求；内购再核对主体/游戏资质及 iOS/Android 当前政策。不引用未经核实的固定用户门槛或费用。
- [ ] 核对小程序/小游戏互联网信息服务备案要求，提交主体和负责人材料；同时核对游戏作品资质、版权证明、自审材料及出版审批要求。ICP备案、游戏作品相关备案、版号与微信代码审核不可互相替代。
- [ ] 若适用国产网络游戏出版审批，按国家新闻出版署流程与有资质的出版单位办理，并核对运营机构条件、未成年人保护及实名/防沉迷要求。不能以“离线”“2048”或“不内购”自行判断豁免。
- [ ] 准备中文正式游戏名、图标、简介、符合实际版本的截图、客服/联系方式、版权及素材授权材料；城市模型虽为程序化原创，也要核验名称、素材、音乐和字体的权利。
- [ ] 配置隐私保护说明，准确描述本地存档及 SDK 数据行为。新增登录、广告、统计或云存档后重新核对个人信息清单和授权时机；“不要求用户登录”不等于平台/SDK 不处理数据。
- [ ] 按适用的平台与监管要求接入健康游戏提示、实名认证、防沉迷/未成年人限制，并完成对应验收；本原型未实现这些能力。
- [ ] 用真实 AppID 上传经过验收的版本，设置体验版和成员，核对后台当前要求的基础信息、备案和资质均完成。
- [ ] 提交代码及审核材料；提供可操作的玩法说明和必要的审核账号。审核通过后由你决定正式发布，再检查搜索、分享入口、版本及存档升级。

## 7. 依据及核验边界

成功读取的第一方来源：

- [微信官方小游戏示例](https://github.com/wechat-miniprogram/minigame-demo)：导入、AppID 和开发者工具示例。
- [官方 project.config.json](https://github.com/wechat-miniprogram/minigame-demo/blob/master/project.config.json)：`compileType: game`、AppID 和小游戏根目录结构；本项目未照搬示例的旧基础库版本或云开发配置。
- [官方 game.json](https://github.com/wechat-miniprogram/minigame-demo/blob/master/miniprogram/game.json)：小游戏配置参考。
- [国家新闻出版署：出版国产网络游戏作品审批](https://www.nppa.gov.cn/bsfw/xksx/cbfxl/wlcbfwspsx/202210/t20221013_600725.html)：出版单位、运营机构、著作权与未成年人保护条件；不能据此反推微信个人主体后台的具体准入结果。

下列为官方文档入口，本次访问失败，实施完整迁移时需在可访问环境重新核对；本报告不声称已核实其中的最新存储额度或政策：

- [运行环境 Adapter](https://developers.weixin.qq.com/minigame/dev/guide/runtime/adapter.html)
- [画布渲染](https://developers.weixin.qq.com/minigame/dev/guide/base-ability/render.html)
- [本地存储](https://developers.weixin.qq.com/minigame/dev/guide/base-ability/storage.html)
- [wx.setStorage](https://developers.weixin.qq.com/minigame/dev/api/storage/wx.setStorage.html)
- [小游戏配置](https://developers.weixin.qq.com/minigame/dev/reference/configuration/game.html)
- [微信公众平台](https://mp.weixin.qq.com/)

Three.js WebGL2 结论也直接核对了本机 `node_modules/three/src/renderers/WebGLRenderer.js`：r163 起不支持 WebGL1，r180 请求 webgl2 context。仓库已有并持续变化的建筑、截图、网页测试修改，本次未提交、推送或覆盖这些修改。
