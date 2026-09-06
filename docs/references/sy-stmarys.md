# sy-stmarys — 圣玛丽大教堂 / St Mary’s Cathedral, Sydney

Tier 7, value 128: 中档适量层次；身份及 Factory 接口不变。2026-09-06 建模核对。

## 参考与实际查看

两轮中英文检索：`悉尼 圣玛丽大教堂 正面 侧面` / `St Mary's Cathedral Sydney aerial roof side`，再补 `侧面 平面` / `south front facade twin rose window`。

- [业主 Architecture](https://stmaryscathedral.org.au/explore/history-art/)：确认纵向长体量、南端入口双塔夹玫瑰窗、飞扶壁。网页已打开；[屋脊朝双塔照片](https://stmaryscathedral.org.au/wp-content/uploads/2025/04/2000-Cathedral-aerial-749x999.jpg)已实际打开，可见窄长中殿、八角针状塔尖、两侧低屋面。注意文件名虽含 aerial，实际是屋顶高度朝双塔背面拍摄；同页 stmarys-from-book-edited.jpg 是旧教堂历史插图，不用于现状模型。
- [OHTA 来源](https://www.ohta.org.au/confs/Sydney/STMARYSCATHEDRAL.html) / [正面实景](https://www.ohta.org.au/confs/Sydney/Sydney_conf_photos/StMarysCathedral9.jpg)：实际查看近正面完整南立面，双尖塔、玫瑰窗、中央尖拱入口及两侧小入口、宽台阶。逆光照片只用于形体。
- [Trip 来源](https://au.trip.com/travel-guide/attraction/sydney/saint-mary-s-cathedral-79221/) / [侧面实景](https://ak-d.tripcdn.com/images/0HJ7212000h9uhe2dC786.jpg)：实际查看横翼玫瑰窗、侧廊、上层窗及扶壁；此图是侧面而非南主入口。
- [Wikimapia 来源](https://wikimapia.org/22390/es/Catedral-de-Santa-Mar%C3%ADa-Sidney) / [斜俯视实景](https://photos.wikimapia.org/p/00/02/12/66/41_full.jpeg)：实际查看长轴、横翼及交叉部方形平顶钟塔，附属建筑不并入主体。
- [Wikimedia 实景](https://upload.wikimedia.org/wikipedia/commons/6/61/StMarysSydneyCathedral1.jpg)：实际打开侧面斜视，再核查中央平顶塔及侧廊与高窗层的关系。

## 形体约束与取舍

+Z 为南主入口，X 为正面宽度、Z 为中殿长轴、Y 向上。双塔必须对称且等高；尖顶为八角针状轮廓，明显高于交叉部平顶塔。窄长中殿与较低侧廊区分；横翼在靠后位置向 X 两侧伸出，屋脊与中殿正交。后端为方形收头，不增加圆形后殿。

地块在约 1.6 × 1.6 内，高度保持原模型约 1.535 上限。为棋盘可读性有意压缩真实长轴、加宽玫瑰窗和门洞、加粗扶壁；不是测绘比例。tier 7 只分组表现窗户、扶壁、塔身横带，省略微型屋顶老虎窗、密集雕像、石缝、百叶与复杂窗花。相较 tier 8 悉尼大学，窗格与装饰层次减量，核心构件完整。

没有完整正交实测顶部图；已用斜俯视和屋顶照片约束十字轮廓。背面窗洞与被遮住的东侧细部采用克制对称推断；具体窗数及间距为游戏概括，不主张精确复原。

## 验证

- 修改前及体量阶段的 default/front/side/top 已实际查看；体量阶段发现塔脚基座覆盖不足，已扩宽基座，并校正侧廊屋面外缘。
- 最终 `sy-stmarys-final.png`、`-front.png`、`-side.png`、`-top.png` 均已亲自打开：双针塔等高，玫瑰窗与入口可读，侧面低廊/高窗层清晰，顶视十字横翼成立。截图位于 `artifacts/sydney-review/`。
- `sy-stmarys-desktop.png` 和 `sy-stmarys-mobile.png` 已实际查看，390×844 手机与桌面棋盘无裁切，与 tier 8 悉尼大学并排比较，大学窗格及装饰更丰富。
- `npx vitest run tests/packs.test.ts tests/sy-stmarys.test.ts --testTimeout=120000 --maxWorkers=1`：7/7 通过。默认 5 秒时限首轮全城几何测试超时，增加命令行时限后通过；不改公共配置。
- `npm run typecheck`：失败在已有 `tests/browser/ny-onewtc-preview.spec.ts` 的空值检查（47–52 行）及 `tests/eiffel.test.ts:17` Factory 缺参数。本任务没有修改这两个文件。`npx tsc --noEmit -p /tmp/citymaker-sy-stmarys-typecheck.json`（仅排除这两个已有错误测试）通过。
- 四视角 Playwright 最终复验通过。首轮因 Vite 热重载导致 canvas 脱离 DOM，稳定后重跑成功。产品检查首次已获取桌面和手机截图，但图鉴阶段整项 120 秒超时，拆分专属图鉴检查复验。
- 共享工作区中原有 `model-preview.html` 和 `tests/browser/model-preview.spec.ts` 在检查期间被外部操作移除。本 worker 恢复了已读取的 spec 内容；HTML 从仓库保留的 `tests/fixtures/dubai-preview.html` 恢复通用 city/value/rotation 入口，并使用相同 SceneView、四视角相机。已向 DAG 报告，两个入口均保留，未删除任何预览工具。
- 图鉴复验改走产品 Landmark atlas；专属测试延后非当前城市的 requestIdleCallback 预览任务，悉尼图鉴继续使用原产品同步缩略图。这样不改公共实现即可避免其他城市批量渲染与并发编辑干扰。图鉴及旋转图最终结果待补。
