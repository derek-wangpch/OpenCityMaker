# 伦敦 tier 11 → 1 模型 review

日期：2026-09-06。范围为伦敦现有 11 个模型；保留建筑 ID、tier、合成值、城市顺序和存档契约。采用游戏卡通比例，不是测绘复原。

**状态：代码修正和几何检查完成；参考图片目视对照及产品视觉验收未完成。** 浏览器访问 ArchDaily 和本地预览均被自动审批拒绝。独立 Playwright 截图受系统 Chromium 启动权限限制。搜索、网页文字及图片线索可取得，但工具未返回可实际查看的图片，不能视为完成了照片核对。没有把搜索摘要中的视角描述当成已查看照片。下面比例、屋顶曲线和未核实的次要构件均属于待目视校准的游戏表达。

## 统一约束

- X 为宽度、Y 为竖向、Z 为进深；默认 +Z 为 A 面，+X 为 B 面，不据此猜测真实方位。塔桥道路沿 X、马厩巷通道沿 Z。
- 地块约 1.6 × 1.6，沿用 ModelKit 的几何/材质缓存与按颜色批处理。
- tier 8–11 保留可辨识的结构层次；4–7 保留主要入口、体量分区、稀疏立面；1–3 压缩重复装饰。细节预算不以高度或面数严格排序。
- 实景资料优先于未建成方案。圣保罗官网历史设计页只作为资料线索，不能把早期设计当作现存建筑。

## 降序 review 与实施

| tier / 模型 | 核心约束与修正 | 细节取舍与推断 |
| --- | --- | --- |
| 11 碎片大厦 `ld-shard` | 保留八片错高玻璃和开放塔冠；竖梃改为玻璃平面端点插值，消除按圆周取样产生的悬空；下部附加片同步修正。 | 保留已有塔冠构架。片间角度、各片高度与底部附加体量为卡通参数，未获正交照片复核；注释取消未确认的 +Z 地理方位。 |
| 10 伦敦眼 `ld-eye` | 32 个座舱放到轮缘外、保持水平长轴；双轮缘形成进深；补交错辐条、轮轴、单侧 A 架和后拉索。 | 放大座舱与支架以便小尺寸识别；省略真实全部轮缘桁架和驱动装置。当前轮面保持竖直，实际悬挑角度与倾斜仍待侧面校准。 |
| 9 大本钟 `ld-bigben` | 保留四面钟盘，补四面竖向分区、横带、钟盘上方百叶层、角尖塔；钟针改为蓝色。 | 窗列分组，屋顶斜面仍为简化四棱形；冠顶比例和装饰配置待照片核对。 |
| 8 塔桥 `ld-towerbridge` | 原实心塔身改成沿道路贯通的真拱洞；双塔四角尖塔、中央屋顶、两条高位步道与交叉桁架；外跨悬链由直杆改分段曲线及吊杆；中央桥面接缝。 | 横向压缩跨度；不逐根复刻栏杆、雕刻和悬链，曲线为卡通近似。闭合桥面，不实现开桥动画。 |
| 7 圣保罗 `ld-stpauls` | 方块基座改长中殿与横翼；三个台阶式锥台改连续半球壳；鼓座柱列、稀疏肋线、灯亭与十字；门廊及双前塔层次。 | 不是葱头顶，也不增加穹顶台阶。穹顶径高比、双塔曲线、横翼位置待实景复核；窗格和柱列概括。 |
| 6 白金汉宫 `ld-buckingham` | 前长翼、两侧翼、后翼围出露天内院；保留中央阳台、浅山花及水平檐线；补侧翼窗组。 | 压缩宫院、简化后翼；不声称实际平面尺寸或所有庭院均已表达。省略雕像、密集栏杆及真实旗面。 |
| 5 巴特西 `ld-battersea` | 明确较高中央锅炉房与两侧低汽轮机房，四角烟囱和砖基座；补前后窗带、侧面窗组及烟囱顶口色带。 | 保留历史发电站主体，省略再开发的周边新建筑与屋顶设备；屋面及烟囱间距待航拍校准。 |
| 4 考文特市场 `ld-covent` | 三角屋顶改连续拱形玻璃薄壳，屋脊沿 X；两侧石柱廊及完整跨越两坡的绿色肋线，端部留通道。 | 以一条代表性拱廊概括市场，不复刻全部多列大厅；省略微小铁花、店招和货摊。拱曲率待照片核对。 |
| 3 马厩巷 `ld-mews` | 两列低屋围出贯通 Z 轴的巷道，宽马厩门朝内；每户两扇上层窗。 | 四户粉彩色块，门板仅一条中缝，无细栅格；采用类型化巷道，不声称复原 Holland Park 的特定门牌。 |
| 2 红电话亭 `ld-telephone` | 三面玻璃、实背板；带宽中央窗区的分组窗格；圆形蘑菇顶改方形浅拱冠轮廓，保留街灯。 | 三组横窗概括真实更多玻璃分格，省略铭文字体与王冠浮雕；浅顶由连续连接的少量截面表达。 |
| 1 砖排屋 `ld-terrace` | 两户共享连续屋脊、相接山墙；两排窗、前门、浅檐口和简化烟囱。 | 省略多层窗台、细窗框、砖缝；这是伦敦住宅类型，非指定建筑复原。 |

## 参考来源与视角缺口

以下为本轮检索及读取的公开来源/图片线索。**所有照片的实际目视核对均待完成**；“视角”是后续核对用途，不表示已经看过。

| 模型 | 来源与资料类型 | 核对用途 / 当前证据范围 |
| --- | --- | --- |
| 碎片大厦 | [建筑师供稿项目介绍](https://www.archdaily.com/889852/the-shard-renzo-piano-building-workshop)、[外墙承包商项目](https://www.permasteelisagroup.com/historic-project/the-shard/) | 网页文字支持八片倾斜玻璃与片间裂隙；项目图库含总图/剖面线索，浏览器图片访问被拒。核心轮廓沿用既有模型，本轮修复可直接证明的平面贴合错误。 |
| 伦敦眼 | [POMA 座舱供应商项目](https://www.poma.net/en/work/london-eye-capsule-giant-wheel/)、[运营方介绍](https://www.londoneye.com/about-us/)、[官方访客指南](https://www.londoneye.com/media/yjhpxdii/london-eye-widgit-guide.pdf)、[座舱图片线索](https://www.poma.net/wp-content/uploads/2020/09/london-eye-londres-observation-wheel-poma-6.png) | 文字确认 32 个座舱；轮缘外座舱、单侧支架和轮体厚度待正侧面及近照目视。PDF 截图工具未返回可查看图像。 |
| 大本钟 | [议会建筑介绍](https://www.parliament.uk/about/living-heritage/building/palace/big-ben/)、[屋顶修复记录](https://www.parliament.uk/about/living-heritage/building/palace/big-ben/news/big-bens-roof-is-revealed-as-conservation-work-continues/)、[现存塔资料](https://en.wikipedia.org/wiki/Big_Ben) | 建成状态/修复后配色线索；待核对全高 A/B 面、钟盘和塔冠近照。 |
| 塔桥 | [运营方结构与参观介绍](https://www.towerbridge.org.uk/explore-inside)、[道路方向实景来源页](https://commons.wikimedia.org/wiki/File:Tower_Bridge_road.jpg)、[原图线索](https://upload.wikimedia.org/wikipedia/commons/b/b3/Tower_Bridge_road.jpg) | 文字支持双塔、高位双步道；待核对道路方向拱洞、沿河长立面和俯视跨度。官方 visual-story PDF 返回 404。 |
| 圣保罗 | [现存建筑资料](https://en.wikipedia.org/wiki/St_Paul%27s_Cathedral)、[官网穹顶设计档案](https://www.stpauls.co.uk/5-designs-for-dome-c-1685-1710) | 需现存建筑正面、侧面、航拍三向对照；官网历史设计页读取超时，不能作为已建成形状证据。连续穹顶为现有模型的保守几何修正，比例待校准。 |
| 白金汉宫 | [Royal Collection Trust 东翼历史](https://www.rct.uk/visit/buckingham-palace/history-of-the-east-wing-of-buckingham-palace)、[王室四边院落说明](https://www.royal.uk/sites/default/files/media/introduction_and_overview_2009-10.pdf)、[正面图片来源页](https://commons.wikimedia.org/wiki/File:Buckingham_Palace_east_front_facade.jpg) | 东翼文字支持中央阳台；四翼院落资料线索。待正面照片与航拍核对后翼和浅山花。 |
| 巴特西 | [运营方](https://batterseapowerstation.co.uk/)、[建筑资料](https://en.wikipedia.org/wiki/Battersea_Power_Station)、[航拍来源页](https://commons.wikimedia.org/wiki/File:Battersea_Power_Station_from_the_air_(geograph_6087173).jpg) | 需前后面和航拍核对锅炉房、汽轮机房与四烟囱。旧航拍只用于历史主楼体量，不作为周边再开发现状。 |
| 考文特 | [建筑摄影资料页](https://victorianweb.org/art/architecture/london/37e.html)、[市场建筑资料](https://covent-garden.london/listing/covent-garden-market-building) | 文字与图库线索支持铁玻璃屋顶/石柱廊；需端部、长侧廊、屋顶俯视复核。对象为 Covent Garden，非 New Covent Garden Market。 |
| 马厩巷 | [Holland Park Mews](https://en.wikipedia.org/wiki/Holland_Park_Mews) | 文字支持旧马厩、石铺巷道与两端入口；用于建筑类型语法，具体屋顶/配色为概括。 |
| 电话亭 | [Historic England K6 登记](https://historicengland.org.uk/listing/the-list/list-entry/1395285) | 文字明确三面玻璃、一面实背、浅拱顶；该登记实例在 Dorset，仅作为通用 K6 类型资料，非伦敦街角地点复原。 |
| 砖排屋 | [Historic England 住宅类型指南](https://historicengland.org.uk/images-books/publications/conserving-georgian-victorian-terraced-housing/) | 住宅类型、窗与屋顶资料；没有选定单栋，使用相连排屋的保守简化。 |

## 验证

### 伦敦眼单侧支撑复核（2026-09-06）

[运营方施工说明](https://www.londoneye.com/our-company/blog/how-the-london-eye-was-built/)明确说明两根倾斜支腿、后拉索和单侧支撑；[Ingenia 工程说明](https://www.ingenia.org.uk/articles/the-wheel-the-british-airways-london-eye/)也说明轮轴仅由一侧支承，倾斜 A 架通过拉索稳定到基础。

本次直接检查当前 `ld-eye.ts`：两根粗支腿的底端为 `(±0.39, 0.12, 0.39)`，共同顶端为 `(0, 0.98, 0.1)`；两条细后拉索锚点为 `(±0.4758, 0.05, 0.51)`，接同一顶端。轮轴沿 Z 延伸至约 `[-0.09, 0.14]`，包含支架顶端，因此连接没有悬空。结构关系符合单侧双腿 A 架，不应补成轮体两侧对称支架。本次未修改模型。

设计方图片页再次被浏览器自动审批拒绝，仍未完成目视核对。两腿在严格侧视投影中会重合，这是现有坐标可直接推出的投影关系；具体游戏画面是否因此看不清、支架倾角和轮轴长度是否合适，尚未目视确认。

- `tests/london-models.test.ts`：塔桥车道跨越双塔的射线通行、马厩巷两端通行、宫院顶部开口、32 个外置水平座舱。
- `tests/packs.test.ts`：全城目录、模型注册、几何边界和有限坐标；与上述共 10 项通过。
- 整个 `src` 与上述两个相关测试的独立类型检查通过；Vite 生产打包通过（已有大包体积提示）。全仓库类型检查存在本轮未修改的 `tests/browser/ny-onewtc-preview.spec.ts` 空值错误和 `tests/eiffel.test.ts` 工厂参数错误，因此不将独立检查称作全仓库构建通过。
- **未完成**：照片实际查看、模型 A/B 面、默认斜视、顶视、旋转另一面、棋盘及手机尺寸目视验收。因此不能声称外观相似度已通过，也不发布。

恢复预览能力后，使用既有 `model-preview.html?city=london&v=2048&view=front`，`v=2**tier`，视角为 `default/front/side/top`，再检查产品棋盘和手机尺寸。此次截图脚本保存在本地忽略产物 `artifacts/london-review/capture.mjs`，尚未成功生成截图。
