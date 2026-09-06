# sy-harbourbridge — Sydney Harbour Bridge / 悉尼海港大桥

2026-09-06。tier 10，value 1024，身份、model key 和 Factory 接口不变。

## 实际查看的参考

先查看原模型 default/front/side/top 和已完成的 tier 11 歌剧院 default，再进行两轮中英文检索。第一轮：`悉尼 海港大桥 正面 侧面 钢拱 桥塔`、`Sydney Harbour Bridge aerial end view arch truss pylons`；第二轮补齐大拱立面：`Sydney Harbour Bridge side elevation photograph full arch`、`悉尼 海港大桥 桥塔 正面 照片`。

- [Globalroamer 2014 航拍，Wikimedia](https://commons.wikimedia.org/wiki/File:Aerial_view_of_Sydney_Harbour_Bridge.jpg)，[实际打开的原图](https://upload.wikimedia.org/wikipedia/commons/c/cd/Aerial_view_of_Sydney_Harbour_Bridge.jpg)。已建成实景，斜上方：两片平行拱桁架、顶部横联、四座分列的桥塔、桥面穿行及塔身收分清楚。
- [Eustaquio Santimano 2009 实景，Wikimedia](https://commons.wikimedia.org/wiki/File:Sydney_Harbour_Bridge.jpg)，[实际打开的原图](https://live.staticflickr.com/2698/4206640352_752a0f9543_o.jpg)。近完整长立面：下弦在端部降至桥面以下，拱弦间距向端部增加；竖吊杆从下弦落到水平桥面，三角腹杆和低于拱顶的桥塔可辨。
- [Australian War Memorial 064726](https://www.awm.gov.au/collection/C56770)，[实际打开图像](https://s3-ap-southeast-2.amazonaws.com/awm-media/collection/064726/screen/3939464.JPG)。1944 年实景端视：路廊上方交叉横联、两侧略收分桥塔、平顶小退台和拱形开口。用于稳定结构，历史路面设施不照搬。
- [Sydney.com 中文官方介绍](https://www.sydney.com/cn/destinations/sydney/sydney-city/sydney-harbour/sydney-harbour-bridge)：检索结果文字补充桥塔花岗岩材料，修改原有砂岩表述。
- NSW Transport 的 arch-units PDF 返回 403，未用未查看的 PDF 图像做形体依据。

## 形体约束与本次实现

X 为桥跨、Z 为桥宽、Y 竖直；front 是沿 Z 看长立面，side 是沿 X 看端部。不推定模型的真实地理朝向。

- 两片钢拱位于 Z=±0.22；下弦端高 0.13、顶高 0.93；上弦端高 0.46、顶高 1.08。两套曲线共用 12 段采样，端部支承落到桥面以下。
- 桥面保持水平，顶高 0.43；吊杆仅在下弦高于桥面的范围设置。连续道路、分组轨道、边步道及稀疏护栏可辨。
- 七道拱间横联及六组顶部交叉支撑连接两片拱；不封成实体屋顶。
- 四塔在 X=±0.66、Z=±0.35；宽脚、连续收分塔身、小檐口和平顶。拱形暗色面是开口的卡通表达，并非真实可穿行洞口。
- 全部使用 ModelKit 的共享几何/材质；不修改 shared.ts。几何保持约 1.6×1.6 范围，高度低于原模型 1.25。

## Tier 与有意夸张、推断

高档 tier 10：丰富度来自双拱上下弦、腹杆、横联、吊杆与塔身层次。与 tier 11 歌剧院最终图及同屏棋盘对照，保留更少的几何类型、单一重复桁架节奏，无复杂曲面屋盖与细密装饰；不以构件数硬性判等级。

为棋盘可读性压缩桥长、扩大桥宽和桥塔、加粗钢构，拱高相对跨度明显夸张。12 格桁架、合并的轨道/车道和抽象塔面不代表真实数量或测绘比例。省略铆钉、逐块石砌纹、检修设施、车辆、旗帜、完整两岸引桥；使细节低于 tier 11 的造型丰富度。

没有严格正交端面或垂直俯拍；端面使用历史近正面，顶部用实景航拍约束。具体杆件截面、塔后小开口以及现代车道划分属于简化/推断，未声称精确复原。

## 验证

复用现有 5273 服务器与原有 model-preview.html、tests/browser/model-preview.spec.ts，均未修改或删除。

- `PORT=5273 PREVIEW_CITY=sydney PREVIEW_VALUE=1024 PREVIEW_OUT=artifacts/sydney-review/sy-harbourbridge-final.png npx playwright test tests/browser/model-preview.spec.ts tests/browser/sy-harbourbridge-review.spec.ts`：2 passed。
- 亲自打开验收 `sy-harbourbridge-final.png`、`-final-front.png`、`-final-side.png`、`-final-top.png`：拱轮廓连续、横联连通、桥下贯通、四塔可辨，没有裁切。
- 亲自打开 `sy-harbourbridge-desktop.png`、`-mobile.png`（390×844）、`-catalog.png`：棋盘与歌剧院同屏，桥在手机及图鉴缩略图尺度仍可辨；细杆合并成清晰的钢构色块。浏览器模拟尺寸，未做物理手机验收。
- 专属几何断言检查四象限桥塔、两拱之间横联、低于桥面的拱脚、吊杆落点、桥下净空和精确顶点边界。旋转圆柱的普通 AABB 会高估边界，整组边界使用 `setFromObject(group, true)`；连接端点断言采用浮点容差。
- 全仓 `npm run typecheck` 执行但受既有 `tests/browser/ny-onewtc-preview.spec.ts:47–52` 的 null 错误及 `tests/eiffel.test.ts:17` 的 Factory 参数错误阻塞，未修改这些其他任务文件。
- `npx vitest run tests/packs.test.ts tests/sy-harbourbridge.test.ts tests/sy-opera.test.ts`：3 files / 8 tests passed，包含所有城市 packs 几何检查及上一级歌剧院回归。
- 临时 `/tmp/sy-harbourbridge-tsconfig.json` 继承仓库 tsconfig，include 全部 src、本建筑几何及浏览器测试；`npx tsc --noEmit -p /tmp/sy-harbourbridge-tsconfig.json` 通过。独立检查不等于全仓 typecheck 通过。
- 未提交、推送、发布或修改 hosting；保留所有其他城市及公共文件已有改动。
