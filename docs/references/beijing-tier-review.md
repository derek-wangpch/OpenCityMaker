# 北京全建筑 tier review — 2026-09-06

按元数据 **tier 11 → 1** 检查，不把 value 当作等级。范围仅北京；沿用已有未提交模型与元数据，不调整建筑 ID、顺序或合成数值。坐标 y 向上、x 为正面宽度、z 为进深；正面检查从 +z，侧面从 +x。无方位依据时不指定地理朝向。默认斜视来自产品 SceneView。

## 细节与形体决定

| Tier | 建筑       | 形体检查 / 本轮处理                                                                        | 细节取舍                                                     |
| ---- | ---------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| 11   | 中国尊     | 保留收腰、方圆转角、四角抬高的冠口；统一壳体与竖肋的高度采样和截面位置，补冠口内壁         | 16 组连续主肋、6 道设备带、冠部次肋；不复刻每层窗格          |
| 10   | 国贸三期 A | 保留连续直线收分、削角方形截面、水平冠顶和开放梳齿；塔身和塔冠改为一致的 7 组宽面竖片      | 合并过密遮阳片；保留两道主要设备带及基部扇形收脚             |
| 9    | 央视总部   | 保留两根相对布置的倾斜塔、L 形悬挑、两面贯通空洞；稍提亮结构网格                           | 大菱格与局部加密保留，屋面碟形天线从 5 组概括到 3 组         |
| 8    | 国家大剧院 | 保留加高的卡通椭球、水池、跨顶玻璃带；玻璃竖肋细分以跟随曲面，避免长弦埋入球壳             | 保留 11 道清晰水平分缝与稀疏玻璃肋，不刻画每块钛板           |
| 7    | 天坛祈年殿 | 修复原三层悬空伞状屋顶；三重蓝檐之间有连续彩绘圆鼓，补三层白台基的四向台阶、金顶与牌匾色块 | 中档偏丰富：分组门洞、稀疏栏杆；省略逐块瓦片、斗拱雕花、文字 |
| 6    | 故宫大殿   | 以太和殿提炼宽殿身、双檐庑殿顶、三层白台基；不再用两个完整楼层叠成楼阁                     | 七组门窗与彩绘檐带、正中阶梯；省略脊兽阵列和密集栏杆         |
| 5    | 鼓楼       | 独立红色高台、上层廊柱、三道檐线和歇山上顶；替代与故宫共用且穿进台座的殿体                 | 三滴水是身份特征而非额外装饰；门窗分组，拱洞简化到一孔       |
| 4    | 传统城门   | 泛型北京城门，灰色厚台座、实际贯穿的中央拱洞、单檐红楼；双面设门窗                         | 保留入口、檐带；不复制正阳门的全部楼层及门洞                 |
| 3    | 四合院     | 保留四面围合、角门朝外、主房高于侧房、开放院心；去掉瓦缝、细窗棂和鱼缸                     | 识别来自平面、屋脊和冷暖色块；不增加庭院小摆件               |
| 2    | 胡同街巷   | 两列民居的门转向中央街巷；去掉出口树，保留两端通路；屋顶改硬山                             | 六个简洁体块，无瓦缝、窗棂；独立加高房屋以便小尺寸读图       |
| 1    | 传统民居   | 灰砖、硬山灰瓦、单门双窗与一棵树                                                           | 最低档：无瓦缝及窗棂，仅主轮廓和色块                         |

所有比例均服务于游戏：塔身加宽、古建台阶加粗、胡同房屋适度加高、大剧院保留此前明确选定的加高椭球。没有把写实比例作为验收条件，也不要求面数或高度严格随 tier 递增。

## 参考来源与实际查看范围

本轮进行了中英文首轮搜索及缺失视角补搜。以下链接指向来源页面和实际查看的图像；既有本地实景参考也重新打开检查。只看到文本的页面不算看过照片。

- **中国尊**：[KPF 项目页](https://www.kpf.com/project/citic-tower-china-zun)。重新查看 `artifacts/bj-zun-ref/zun-2018.jpg`（近正面已建成全高）、`zun-head.jpg`（冠部双面）、`zun-corner.jpg`（另一视角，施工期，仅参考主体）。支持收腰、方圆平面与冠口起伏。[原参考记录](bj-zun.md)。屋内屋面设备仍是推断；未找到独立屋顶俯拍。
- **国贸三期 A**：[SOM 项目页](https://www.som.com/projects/china-world-trade-center-3a/) 本轮返回 403；改看[照片集](https://megaconstrucciones.net/en/china-world-trade-center-tower-iii/)，[近正面全高图](https://megaconstrucciones.net/images/rascacielos/foto/china-world-trade-center-tower-iii-6.jpg)、[冠部相邻两面](https://megaconstrucciones.net/images/rascacielos/foto/china-world-trade-center-tower-iii-2.jpg)。支持连续收分、竖向遮阳片、梳齿冠部；侧面进深按相邻立面估计，非测绘，未取得独立屋顶平面。
- **央视总部**：[OMA 项目页](https://www.oma.com/projects/cctv-headquarters)。查看 `artifacts/modeling/bj-cctv/references/960px-CCTV_Headquarters_1.jpg`（建成仰视，悬挑底及双面）与 `960px-Beijing_CCTV_Headquarters.jpg`（施工期前面，结构环）；国贸全高图右侧亦提供远距离央视正面。施工起重机、临时支架不入模型。结构环保留既有空间关系；菱格密度为概括。
- **国家大剧院**：[来源页](https://zh.wikipedia.org/wiki/国家大剧院)，查看 `artifacts/bj-ncpa-ref/ncpa-main.jpg`（斜视）与 `ncpa-north-gate.jpg`（近正面）。支持低宽椭球、玻璃分区和水平板缝。[原记录](bj-ncpa.md)。纯钛板端面仍按椭球推断，未获得独立近正交端面照片；加高为有意卡通化。
- **天坛**：[正面来源页](https://www.travelchinaguide.com/attraction/beijing/temple-of-heaven/hall-of-prayer-for-good-harvests.htm)、[已看正面图](https://www.travelchinaguide.com/images/photogallery/2026/temple-heaven-prayer-good-harvests-hall.jpg)；[北京日报来源页](https://xinwen.bjd.com.cn/content/s62b981d4e4b01c9fa7b21204.html) 正文抓取失败，但[航拍图](https://static.bjd.com.cn/dams-res/editing/image/202312/31/659077edd5de9bf2816a2ec7.jpeg)在浏览器成功查看。支持三圆檐、彩绘鼓壁、圆台及轴向台阶。侧面依圆形旋转对称推断，入口牌匾另保留正面差异。
- **故宫大殿**：[故宫博物院](https://intl.dpm.org.cn/hallsinfo/374.html) 提供三层台基的文字证据，其图片是内景，不当作外观；[正面照片](https://youimg1.c-ctrip.com/target/010081200009nq5joD41F.jpg) （搜索来源页为去哪儿旧景点索引，现已失效，图片仍可查看）；另打开[太和殿专题](https://www.ourchinastory.com/zh/5763/)和[侧向俯视图](https://www.ourchinastory.com/images/content/explore-hkpm/2023/02/故宮前三殿台基_x1.jpg)，确认宽深、双檐、三层台基。模型代表故宫大殿而非复原整片前三殿。
- **鼓楼**：[携程来源页](https://you.ctrip.com/sight/beijing1/5169.html)，[实景图一](https://youimg1.c-ctrip.com/target/100b0b0000005odpmAC1F.jpg)、[实景图二](https://dimg04.c-ctrip.com/images/100d1f000001fyvfa9AED_W_640_10000.jpg?proc=autoorient)，两张实际是同一面的稍不同斜视，**不冒充正侧面齐全**。支持红色高台、三滴水和上层廊柱；独立侧面未补齐，进深与背面开间为推断。北京文旅图片域名解析失败。
- **传统城门**：泛型而非正阳门复制。[北京中轴线来源](https://www.81.cn/wh_208594/16329108.html)，[正阳门参考图](https://www.81.cn/wh_208594/_attachment/2024/08/02/16329108_80c4d9f9f5d4837c6adecc73a56edda3.jpg)。只提取台座、拱门、红楼和檐口；本模型保持单檐，背面按泛型对称设计。
- **四合院、胡同、民居**：[胡同实景来源](https://www.sohu.com/a/230119278_99988222)、[已看街墙照片](https://5b0988e595225.cdn.sohucs.com/q_70%2Cc_zoom%2Cw_640/images/20180502/7aef2b9eaa3d4762929af290114c9ca1.jpeg)；[四合院平面来源](https://www.sohu.com/a/168599708_99968459)、[已看示意平面](https://5b0988e595225.cdn.sohucs.com/q_70%2Cc_zoom%2Cw_640/images/20170831/3d250cffe39b406e9f46d55ceaca9f0e.jpeg)。照片支持灰瓦灰砖与街门，示意图支持围合、角门、倒座房，不用于精确尺寸；三级均为类型化设计，院数、开间与街巷布局是游戏概括。

## 验证产物

- `artifacts/beijing-tier-review/after/`：按 tier 11 → 1 的默认、正面、侧面、俯视、旋转后视图。
- `tests/beijing-models.test.ts`：检查城门贯通、胡同出口与门向、天坛封闭鼓壁、鼓楼台座与廊身；通用 `tests/packs.test.ts` 检查包与全部建筑几何边界。
- `tests/browser/beijing-tier-review.spec.ts` 与 `beijing-product-review.spec.ts` 为显式 `BEIJING_REVIEW=1` 才运行的视觉检查，避免普通套件承担截图开销。


## 本轮验证结果

- 已亲自查看 11 栋模型的默认 / 正面 / 侧面 / 顶部渲染，以及手机图鉴全部 11 栋旋转前后截图；高塔冠部与中档古建另放大核对。
- 多视角检查：tier 11–2 的 10 项通过，tier 1 因截图进程停滞单独重跑后通过，最终 55 张视角图齐全；初次基线截图不完整，仅作为局部对照。
- 桌面 1440×1100 与浏览器模拟手机 390×844 的真实游戏页面检查通过（2 项）。正常游戏棋盘显示 tier 1–10，中国尊在已解锁图鉴及详情中核验；没有隐藏通关遮罩来伪造可玩状态。未测试实体手机。
- 北京语义几何 + 全城通用边界检查：10 项通过；应用源码和本轮新增测试的定向 TypeScript 检查通过。
- 全项目 `npm run typecheck` 仍有本轮范围外的既有错误：`tests/browser/ny-onewtc-preview.spec.ts` 的 canvas/context 可空值，以及 `tests/eiffel.test.ts` 的工厂参数数量。未修改这些其他任务文件，也不声称全项目类型检查通过。
- 总览：[overview.jpg](../../artifacts/beijing-tier-review/overview.jpg)。[高 tier 正侧面](../../artifacts/beijing-tier-review/after/sheet-11-8.jpg)、[中 tier 正侧面](../../artifacts/beijing-tier-review/after/sheet-7-4.jpg)、[低 tier 正侧面](../../artifacts/beijing-tier-review/after/sheet-3-1.jpg)。[桌面棋盘](../../artifacts/beijing-tier-review/desktop-board.png)、[手机棋盘](../../artifacts/beijing-tier-review/mobile-board.png)。
