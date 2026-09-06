# 悉尼 tier 9 → 1 建模检查

2026-09-06。按用户要求跳过 tier 11 歌剧院、tier 10 海港大桥；保留这两座模型及元数据的已有修改。本轮只调整九座模型、两条对应说明，新增专属验证入口。没有提交、推送或发布。

## 细节分配与形体约束

全城使用 X 宽、Y 高、Z 深；+Z 是游戏正面，不假定地理方位。QVB 长轴沿 X，码头、教堂长轴沿 Z。保留 1.6 × 1.6 地块和现有 ModelKit 材质批处理。所有尺寸是卡通比例，不是实测复原。

| tier | 建筑 | 本轮保留与修改 | 省略 / 推断 |
|---|---|---|---|
| 9 | 中央公园大楼 | 不等高双塔、绿植帘、悬挑花园、上下两套镜阵保持；阳台组从 6/10 减至 4/7 | 不模拟实际层数；后立面种植和进深沿用原有推断 |
| 8 | 悉尼大学钟楼 | 保留贯通尖拱、方庭、圆钟与四角尖塔；塔窗双梃减单梃，侧翼四列减三列，去掉侧翼微型窗梃 | 后翼比例与窗数为概括；庭院明确保持开敞 |
| 7 | 圣玛丽大教堂 | 保留双针塔、玫瑰窗、长中殿和十字横翼；窗花八辐减六辐，扶壁每侧五组减三组 | 不模拟实际窗花数量；背面细节继续克制概括 |
| 6 | 悉尼市政厅 | 分段方钟塔、四面圆钟、开敞八角顶亭、双层柱廊、三角山花、宽台阶、两侧截顶坡顶与独立后厅 | 省略雕塑、石缝、屋顶铁艺；后厅进深和侧窗数量为推断，未取得可靠完整正交侧立面 |
| 5 | QVB | 长楼体、中央铜绿大穹顶及顶灯亭、四角小圆顶、长短两面拱窗和入口 | 压缩真实长度；四角圆顶代表主要端部圆顶群，省略其他小圆顶、细柱、屋顶设备及天窗细节 |
| 4 | 码头棚屋 | 两条长指状码头、水道、桩脚、长坡顶与通风高窗、分组侧窗、装卸端门 | 不复制整个 Walsh Bay；高窗连续化，省略太阳能板、细轨道和排桩；端面门窗为类型化概括 |
| 3 | 岩石区仓库 | 双山墙、上下装卸门、挑出的吊货梁、少量侧窗；移除通用密窗模板 | Campbell's Stores 作为类型参考，不是完整街区复原；背面门窗为推断 |
| 2 | 联排住宅 | 三户紧密相连、连续横向屋脊、上层阳台与下层门廊、少量粗栏杆和烟囱 | 不复刻单栋房屋；省略铁艺花纹、前院栏杆和老虎窗；侧墙留白、背面少量窗 |
| 1 | 砂岩小屋 | 主门、两扇窗、长檐朝前、双烟囱，体量和色块为主 | Cadmans 仅作小屋类型参考，有意压成单层；不声称复原其两层立面或附属楼 |

## 参考：已打开来源和实际查看的图像

本轮先做中文/英文地标检索及图片检索，再补查侧面、屋顶、平面。两轮后仍无可靠视角的部分按上表标注推断，不把文字摘要当成照片。图像只用于检查，不加入产品资源。

### 高 tier 9–7

- [Ateliers Jean Nouvel](https://www.jeannouvel.com/en/projects/one-central-park/)：[公园侧实景](https://www.jeannouvel.com/wp-content/uploads/2017/04/ajn-ptw-sydney-ocp-rolandhalbe-rh2336-0024.jpg) 本轮重新下载打开，核对不等高双塔、悬挑在高塔顶以下、低塔屋顶镜阵。更完整的既有来源与不确定项见 [sy-centralpark.md](sy-centralpark.md)。
- 悉大：重新打开已有正面实景 `artifacts/sydney-review/references/sy-university-front.jpg` 和官方 1949 航拍 `sy-university-aerial.jpg`；核对钟塔顶饰与围合庭院。来源页和原图链接见 [sy-university.md](sy-university.md)。航拍只支持基本布局，不作为当前景观证据。
- 教堂：重新打开已有横翼侧面 `artifacts/sydney-review/reference/stmarys-front.jpg` 和斜航拍 `stmarys-aerial.jpg`，后者能确认双尖塔、方形交叉塔与十字长轴。注意前者文件名虽叫 front，实际为横翼侧面。来源页和原图链接见 [sy-stmarys.md](sy-stmarys.md)。

### tier 6 市政厅

- [City of Sydney 地标页](https://www.cityofsydney.nsw.gov.au/landmarks/sydney-town-hall) / [正面实景](https://www.cityofsydney.nsw.gov.au/-/media/corporate/images/places-and-spaces/landmarks/sydney-town-hall/townhall_highres-1.jpg)：实际打开大图，核对双层柱廊、宽阶梯、三角山花、分段钟塔与八角顶亭。
- [Wikimedia 屋顶细节来源](https://commons.wikimedia.org/wiki/File:Sydney_Town_Hall_Roof_Detail.jpg) / [屋顶实景](https://upload.wikimedia.org/wikipedia/commons/2/25/Sydney_Town_Hall_Roof_Detail.jpg)：实际查看截顶陡坡屋面、顶部水平平台；微型铁艺不进入模型。
- [建筑资料](https://en.wikipedia.org/wiki/Sydney_Town_Hall)：后厅与坡屋顶关系的文字补充。
- [Druitt Street 历史侧面档案](https://archives.cityofsydney.nsw.gov.au/nodes/view/681522) 已发现但图像下载失败；不计作已查看。后厅形体为依据文字及正面屋顶线索的推断。

### tier 5 QVB

- [Porter House 来源](https://porterhousehotel.com.au/places/queen-victoria-building/) / [端部与长立面斜视照片](https://porterhousehotel.com.au/wp-content/uploads/sites/11/2022/10/Queen-Victoria-Building_The-Porter-House-Hotel-Sydney.jpeg)：实际查看短端面与长轴区别、角部穹顶和拱窗。
- [Broadsheet 来源，照片由 QVB 提供](https://www.broadsheet.com.au/sydney/fashion/article/qvb-turning-120) / [长立面实景](https://cdn.broadsheet.com.au/cache/08/4c/084ce6877e622bb6b178a808f64ad90c.jpg)：实际查看中央大穹顶、灯亭、窗组节奏。未取得完整现状俯视，屋脊和小圆顶布局为简化。

### tier 4 码头

- [Ilias 工程顾问项目页](https://www.iliasdesign.com.au/projects) / [长侧面实景](https://static.wixstatic.com/media/ea064b_501e35a1ffb140c6bd4a32e457c6bffa~mv2.jpg)：实际查看两层长棚、上层窗列、架空桩脚、屋脊高窗。
- [Infrastructure NSW 官方图库](https://www.infrastructure.nsw.gov.au/projects-nsw/completed/walsh-bay-arts-precinct/gallery/)：实际打开[第一张航拍](https://www.infrastructure.nsw.gov.au/media/bhxpqbxf/ifb220128_01359_result.jpg)，确认平行指状长码头、中央水道、双坡屋顶和屋面高窗。另打开 [Wharf 4/5 入口](https://www.infrastructure.nsw.gov.au/media/jq4dyzk1/wharf-4-5.png)，它是岸侧砖楼入口，不混入水端棚屋；图库 [roof feature](https://www.infrastructure.nsw.gov.au/media/ouclkvqq/walsh-bay-arts-precinct-roof-feature.png) 实际是室内天花，不用于推断外部屋顶。
- [项目建筑师关于工程改造的说明](https://createdigital.org.au/engineering-heritage-of-the-walsh-bay-arts-precinct/amp/)：木构码头的文字补充。

### tier 3–1 类型参考

- [Campbell's Stores 资料](https://en.wikipedia.org/wiki/Campbell%27s_Stores)、[Argyle Cut 来源](https://www.visitsydneyaustralia.com.au/lost-quarries9.html) / [仓库斜视实景](https://visitsydneyaustralia.com.au/images/Campbells-Stores-800.jpg)：实际查看连续山墙和上下装卸门。只提取两开间，不加入现代餐厅雨篷。
- [71 Fowler Street 来源](https://www.realestate.com.au/property/71-fowler-st-camperdown-nsw-2050/) / [三户住宅正面实景](https://i2.au.reastatic.net/800x600/ffb94c59b34cbb5cabd27929ba9644cb4cb78f2f3f6bd97c6607d6ceae30db03/main.jpg)：来源页打开失败，但照片下载并实际查看；只作为类型参考。两层门廊、附着阳台、紧邻户墙清晰。不要根据搜索结果中的房产广告文字判断几何。
- [Cadmans Cottage 来源](https://www.archiseek.com/1816-cadmans-cottage-the-rocks-sydney-australia/) / [近正面实景](https://www.archiseek.com/wp-content/gallery/australia_sydney/cadmanscottage.jpg)：实际查看双烟囱、长檐和中央入口。照片为两层实景；模型名称是砂岩小屋，tier 1 有意单层化，不更名为 Cadmans。

## 验证结果

- `sydney-tier-review.spec.ts`：9/9 通过，每座 default/front/side/top 共 36 张实际渲染图均已打开查看（四视图合页）。
- `sydney-product-review.spec.ts`：2/2 通过，实际桌面棋盘、390×844 手机棋盘、九座手机图鉴及拖动旋转后的另一面均已打开检查。没有发现模型裁切、悬空窗格或严重细节噪点；非物理手机验证。
- 既有 `packs`、`sy-centralpark`、`sy-university`、`sy-stmarys`：9/9 通过，包括全城市标准地块边界检查。
- 新增 `sydney-models.test.ts`：2/2 通过，九座有限顶点/法线、1.6 地块、高度、材质批处理，以及市政厅门廊通行空间与四面高位钟面。
- 全仓 `npm run typecheck` 失败于未改动的 `tests/browser/ny-onewtc-preview.spec.ts` 空值检查和 `tests/eiffel.test.ts:17` Factory 参数数量。本轮 src 和新增三个测试以原严格配置单独检查通过；临时配置 `/tmp/sydney-typecheck.json`，不改全局/仓库配置。

产物目录：`artifacts/sydney-tier-review/`。`high-views.jpg`、`mid-views.jpg`、`low-views.jpg` 是按 tier 递减排列的正/侧/顶/默认视图；每张原始视图为 `tier-N-VIEW.png`。`desktop-board.png`、`mobile-board.png`、`mobile-tier-N.png`、`rotated-tier-N.png` 为产品预览。
