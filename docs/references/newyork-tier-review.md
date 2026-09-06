# 纽约全城 tier review — 2026-09-06

范围：纽约 11 个模型，按 **tier 11 → 1** 检查、修正；不改变 ID、合成值、存档和其他城市。游戏卡通模型，非测绘复原。世贸一号保留本次开始前已有的几何修改，其余十座的模型或共用住宅构件得到修正。

## 约束与细节分档

坐标：Y 向上；通常 X 为 A 面宽度、Z 为进深，+Z 为入口面。不把 A/B 面猜作地理方位。大桥沿 X 延伸，其正向穿塔视角为沿 X 的 side 预览。地块 1.6 × 1.6，常规高度上限 2.65；沿用 ModelKit 柔和哑光材质和按材质合批。

| Tier | 建筑 | 轮廓/识别约束与本次处理 | 细节预算及省略 |
|---|---|---|---|
| 11 | 世贸一号 | 核对现有八切面、旋转方冠、水平屋顶、环形通信平台、斜拉针塔；保留几何 | 高：已有立面分组、基座门与鳍片、针塔构件；不继续增加微小设备 |
| 10 | 帝国大厦 | 长直塔身配宽肩退台；补齐两类立面竖向窗带、顶部观景台、系泊塔与分段天线 | 高：入口、壁柱、主要退台；窗带代表多层窗，不逐窗复刻 |
| 9 | 自由女神 | 保留右手火炬、左侧书板、七芒冠；袍身改八边截面，增加侧/背褶线、鼻与后脑、基座开口和十一角 Fort Wood 底座 | 高：大幅放大基座星形、冠芒与衣褶；省略面部细纹、铭文和微小锁链 |
| 8 | 克莱斯勒 | 原旋转圆顶改为四面七层冠弧壳；钢面、弧边、三角窗共用曲线采样；冠弧底部封闭；补鹰饰与塔身侧窗 | 高：强调扇形冠弧和大鹰饰，冠部比例有意夸张；省略密集钢板缝与重复设备 |
| 7 | 布鲁克林桥 | 双塔双尖拱真实贯通；桥面穿过拱洞；吊索与稀疏斜拉索；主索采样准确经过塔顶支点 | 中：压缩桥长、加宽门塔；少量吊杆，省略逐根主缆/钢丝、车辆与旗帜 |
| 6 | 中央车站 | 修复主体到檐口的缝隙；三大拱窗、成组柱、折坡屋顶、中央天窗；两侧较少拱窗；钟面与三尊雕像概括 | 中：屋顶进深压缩、钟面放大；省略雕刻、栏杆与内部院落精确布局 |
| 5 | 熨斗大厦 | 三角平面保留不对称；尖端用少量切面圆钝化；主身、基座、上部三分区，粗檐口替代等间距十层腰线 | 中：六排分组窗，圆角窗概括；省略人物雕饰、密集浮雕与逐层凸窗 |
| 4 | 水塔公寓 | 保留木圆筒、锥顶、箍带、四腿；补支架斜撑及稀疏侧窗/入口 | 中：三列四排主体窗，水箱放大；只保留两道箍带，省略木板逐条刻纹 |
| 3 | 消防梯公寓 | 保留暖砖、厚檐和三层阳台；两段折返斜梯接在平台之间；补必要栏杆支点 | 低：四列四排窗减为三列三排；省略密集铁栏、梯级和侧墙装饰 |
| 2 | 褐石联排 | 三户连续共墙，轻微暖色差；每户高台阶、窄门、平顶厚檐 | 低：复用 tier 1 的两排成组上窗；省略细栏杆、复杂门套，不在共墙开窗 |
| 1 | 褐石屋 | 台阶改为落地连续实体并接到抬高门槛；窄体量、厚檐、平屋顶 | 低：两排上窗与一扇低窗；只保留三阶，省略装饰细部 |

## 实际查看的参考与不确定项

以下实景均通过浏览器打开来源/图像查看，而不是只读搜索摘要。网络检索使用中英文名称并补搜缺失角度；无法取得严格相邻正投影时，以斜视约束进深，未声称正侧面测绘资料齐全。

### 11 世贸一号

- [SOM 项目页](https://www.som.com/projects/one-world-trade-center/)：本次联网打开被 403 拒绝；既有记录及已保存实景见 [ny-onewtc.md](ny-onewtc.md)。本次重新查看 `artifacts/ny-onewtc-ref/wtc-2021-cropped.jpg`，核对主体与冠部关系。
- 已有 `wtc-west-side.jpg`、`wtc-liberty-park.jpg`、`wtc-antenna.jpg` 提供侧向、斜视和针塔图；本次补看侧向与斜视。
- 屋顶内设备布置仍是概括。旧记录中的 0.275/2.02/2.60 数值已过时：当前代码 PODIUM=0.22、ROOF=2.04、TIP=2.65、W=0.28、TOP=0.88；实际部件按当前代码生成。正文的“六根拉索”亦应以当前八根为准。几何本次未改。

### 10 帝国大厦

- [业主历史页](https://www.esbnyc.com/about/history/)：建筑身份与建成背景。
- [实景图集](https://commons.wikimedia.org/wiki/Empire_State_Building)；实际打开 [Day into Night](https://commons.wikimedia.org/wiki/File:Empire_State_Building-_Day_into_Night_(21637448828).jpg)：完整斜立面，支持竖向壁柱、长塔身和分级顶部。这三张是同角度不同光照，不算三种视角。
- 补看 [街角仰视](https://commons.wikimedia.org/wiki/File:USA-NYC-Empire_State0.JPG)，交叉核对宽肩、相邻两立面竖向壁柱与塔身纵深。
- 相邻侧面、背面与屋顶设备并无完整测绘图；侧向纵深与竖梃分组是由斜视和原模型约束的卡通推断。入口门与观景台栏线有意放大。

### 9 自由女神

- [NPS 统计/识别资料](https://www.nps.gov/stli/learn/historyculture/statue-statistics.htm)：七芒冠、书板、火炬等依据。
- [正面实景](https://commons.wikimedia.org/wiki/File:Statue_of_Liberty_frontal_2.jpg)：实际放大查看，支持袍褶、火炬、书板及基座开口。
- [左前方远景](https://commons.wikimedia.org/wiki/File:Liberty-statue-from-front2.jpg)：实际查看，补充基座与雕像关系；不是严格 90° 侧面。
- [NPS Fort Wood](https://www.nps.gov/places/000/fort-wood.htm)：补看页面基座航拍，核实十一角星形与中央方形台座关系。
- 袍身背面截面、冠芒前后倾角、星形底座径向深度均为概括；十一角星形做对称、平铺玩具化处理，不代表 Fort Wood 完整平面。

### 8 克莱斯勒

- [CTBUH 建筑资料](https://www.skyscrapercenter.com/building/chrysler-building/422)；[纽约地标报告](https://s-media.nyc.gov/agencies/lpc/lp/0992.pdf)为目录原有链接，未逐页核验。
- [冠部近正面](https://commons.wikimedia.org/wiki/File:Chrysler_building-_top.jpg)：实际放大查看七层冠弧、三角窗、鹰饰。
- [街道斜视](https://commons.wikimedia.org/wiki/File:ChryslerBuilding.JPG)：实际查看相邻两立面和塔身退台；有仰拍透视。
- 冠部壳面以四面曲线收分概括，非真实钢板展开图；弧高与层间距夸张，塔身退台数量合并。顶部无独立航拍测绘。

### 7 布鲁克林桥

- [NYC DOT 桥梁页](https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml)：实际查看页面完整河岸斜视，支持桥面位置、两座石塔、双尖拱与主缆走势。
- 图片搜索补找双尖拱近景，未把搜索缩略图当作单独的侧面证据。
- 桥长、塔距、桥面宽度均为游戏压缩；斜拉索数量概括。桥塔三维进深由斜视和原模型推断，非结构设计。

### 6 中央车站

- [业主历史页](https://grandcentralterminal.com/history/)：身份与建成形态背景。
- [LHP Architects 修复项目](https://www.lhparch.com/grand-central-station-restoration)：实际查看正面夜景与 [屋顶/相邻立面航拍](https://images.squarespace-cdn.com/content/v1/5731f0f159827eed2999a74e/1464023909572-EML7LN917QRPJ3HB0L23/img102.jpg?format=1500w)。支持三拱窗、柱组、厚檐、折坡屋顶、中央屋面区域及顶部雕像。
- 模型用平顶上层加天窗概括复杂屋面；后部、内部庭院与侧窗数量不按精确图纸复原。

### 5 熨斗大厦

- [纽约旅游局](https://www.nyctourism.com/attractions-tours/flatiron-building/)：实际查看圆钝船艏细部照（Tagger Yancey IV），支持弧形转角、分区与檐口。
- [完整建筑与航拍](https://en.wikipedia.org/wiki/Flatiron_Building)：实际查看页面的南向航拍，支持三角进深与平顶；[图像](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Edificio_Fuller_%28Flatiron%29_en_2010_desde_el_Empire_State_crop_boxin.jpg/960px-Edificio_Fuller_%28Flatiron%29_en_2010_desde_el_Empire_State_crop_boxin.jpg)。
- 不完整复制 2026 住宅改造的屋顶设备；旧有经典外轮廓为目标。圆角半径及主体比例为卡通推断。

### 4 水塔公寓

- [R. Baker & Son 工程商资料](https://www.rbaker.com/press-room.php?id=182&title=Wooden+Rooftop+Water+Tanks%3A+Familiar+Fixtures+of+NYC+Skyline)，实际打开 [水箱照片](https://www.rbaker.com/blog_image.php?id=182)：圆筒、浅锥顶、多道箍带和交叉支架清晰。
- 水塔公寓为类型模型，不对应照片下方某栋确定地址的公寓；主体进深、开窗、门和水箱安装位置为类型化设计。圆筒旋转对称，支架以该斜视概括，无精确屋顶平面。

### 3 消防梯公寓

- [Tenement Museum](https://www.tenement.org/)；[Li/Saltzman 修复项目](https://www.lisaltzman.com/lower-east-side-tenement-museum)，实际打开 [正面照片](https://images.squarespace-cdn.com/content/v1/5f628edbf3af6b39dcb69bb9/1607550791112-T1K4NYSI2Q288IOF660H/Facade.jpg)：砖墙、檐口、消防梯阳台与开窗节奏。
- 这是街区类型提炼，不是 97 Orchard 的精确复制；窗数、梯子折返与低层入口位置概括。侧墙保留共墙式整面砖色，后立面与进深推断。

### 2 / 1 褐石联排与褐石屋

- [Brownstone Builders NYC 修复实例](https://brownstonebuildersnyc.com/)，实际打开 [台阶与连续街墙斜视](https://brownstonebuildersnyc.com/wp-content/uploads/2023/06/stoop-step-4-1.jpg)：高门槛、连续实体台阶、暖色石墙、成组窗。
- 原目录的 [Brooklyn Heights 地标报告](https://s-media.nyc.gov/agencies/lpc/lp/0099.pdf)保留作后续深入资料，本次未逐页核验。
- 两者为住宅类型，不宣称某个地址复原；无完整侧/背面证据，采用共墙、平屋顶和既有进深。省略细栏杆是 tier 取舍；抬高门槛和连续台阶是必要身份特征。

## 验证产物

- `artifacts/newyork-review/before-<tier>-<view>.png` / `after-<tier>-<view>.png`：11→1，default/front/side/top 共四视角。
- [高等级四视角](../../artifacts/newyork-review/after-high.jpg)、[中等级四视角](../../artifacts/newyork-review/after-mid.jpg)、[低等级四视角](../../artifacts/newyork-review/after-low.jpg)。这些汇总已实际打开检查，并修复发现的冠底漏洞、侧窗节奏和消防梯悬空段。
- 桌面、390×844 手机棋盘及图鉴/旋转检查结果，见本目录产物与下方最终验证记录。
- `tests/newyork-models.test.ts`：射线检查双尖拱贯通与中央实柱、四面冠底封闭、台阶连续上升；`tests/packs.test.ts`：全城市目录及有限顶点/地块/高度边界。

### 最终验证记录

- 最后一次模型改动后，44 张 default/front/side/top 截图完成，全部打开检查；另有桌面 11 座默认/旋转图、390×844 手机 11 座默认/旋转图，以及未通关棋盘和图鉴截图。浏览器手机尺寸检查不等于 iOS/Android 真机验收。
- `npx vitest run tests/newyork-models.test.ts tests/packs.test.ts`：9 / 9 通过。
- 应用源码及纽约专项测试的严格类型检查通过；Vite 生产构建通过，输出到独立临时目录，未替换工作区已有 dist。
- 全量 `npm run typecheck` 仍被本次未改的 `tests/browser/ny-onewtc-preview.spec.ts:47–52` 空值检查和 `tests/eiffel.test.ts:17` 调用参数错误阻挡；未修改这些其他工作中的测试。
- 浏览器运行：四视角整组通过；桌面 11 座图鉴整组曾通过；手机 11 座图鉴重跑通过。桌面未通关棋盘重跑时遭开发热更新回到首页，随后改用独立生产构建复核；截图稳定性等待曾超时，保留日志于产物目录，未把超时批次记成通过。页面实际图像与已完成批次均作人工对照。
- `ny-onewtc.ts` 与本次开始时保存的副本逐字比较一致；其 Git diff 是此前已有改动。没有提交、推送或发布。
