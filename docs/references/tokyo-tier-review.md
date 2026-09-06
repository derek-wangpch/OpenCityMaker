# 东京全等级建筑审查（2026-09-06）

按 tier 11 → 1 审查。tier 来自 authoring 的第一个参数，value = 2 ** tier。
坐标：Y 向上，X 正面宽度，Z 进深，+Z 为模型主要入口；不将模型轴猜作真实方位。
全部沿用卡通、哑光、低多边形风格和 1.6 × 1.6 地块。比例为游戏构图，不是测绘复原。

## 参考与修改（由高到低）

| tier / 模型 | 本次检查的来源与视角 | 形体约束及处理 | 细节取舍与不确定性 |
|---|---|---|---|
| 11 晴空塔 | [官方结构](https://www.tokyo-skytree.jp/about/spec/structure/)、[实景来源](https://commons.wikimedia.org/wiki/File:Tokyo_Sky_Tree_2012.JPG)、[已查看全塔照片](https://upload.wikimedia.org/wikipedia/commons/3/3e/Tokyo_Sky_Tree_2012.JPG)，另参阅项目原有 `artifacts/modeling/tk-skytree/references.md` | 保留已有三角向圆形过渡、内凹塔身、上张观景层、小型上观景层与细长天线，不重做已完成几何 | 高档；9 条竖向构件和分组斜撑。当前源码宽度放大系数是 1.38，旧记录的 1.62 已过时。旧记录“观景层是全塔最宽处”也不适用于包含塔脚的整体。脚部和天线环位置仍是卡通推断 |
| 10 东京塔 | [官方旅游资料](https://www.japan.travel/en/spot/1709/)、[索尼实景来源](https://ssl.sme.co.jp/artist/whitneyhouston/info/548520)、[已查看全塔斜视图](https://ssl.sme.co.jp/img/common/artist_image/80003000/80003683/images/202301061249181.jpg) | 四足外张、下层开放、交叉桁架；宽主观景台、较小八角上观景台、红白天线分开表达；补低层塔脚建筑 | 高档；8 组桁架高度分段。未逐层复制钢结构，四面依近对称原型概括，未获得独立正交侧立面 |
| 9 东京都厅第一本厅舍 | [照片、立面及总平面来源](https://www.archdaily.com/793703/ad-classics-tokyo-metropolitan-government-building-kenzo-tange)，查看近正面夜景及白天斜视照片，并在页面检查平面/立面缩略图 | 改正双塔从地面分离的错误；下部约三分之二连体，塔身切角，立面成组纵线，顶部凹入并有水平框架 | 高档；12 组横向结构。只表达第一本厅舍，不把第二本厅舍混入双塔；卫星天线、议会楼完整弧形广场省略。框架进深为照片约束下的概括 |
| 8 国会议事堂 | [众议院官方照片集](https://www.shugiin.go.jp/internet/itdb_annai.nsf/html/statics/topics/gijidophoto.htm)，已查看正面、侧向及航拍三图 | 低矮对称翼楼围两处开敞内院；中央塔楼、柱廊、连续斜面金字塔顶及顶端小构件 | 高档下限；分组三层体量与两排翼楼窗，省略细石雕、窗框和附属楼 |
| 7 东京站 | [设计方项目页](https://www.jred.co.jp/projects/p007_en.html)、[全正面实景](https://www.jred.co.jp/projects/img/p007-mainvis.jpg)、[中央入口近景](https://www.jred.co.jp/projects/img/p007-slide1-pic01.jpg) | 红砖长翼和连续深灰坡屋顶；双端圆顶、中央弧形山花、浅石材带 | 中档上限；三排窗概括原三层，放大双圆顶。后侧、圆顶精确曲线及压缩后进深为推断；未将八重洲 GranRoof 混入 |
| 6 浅草寺本堂与五重塔 | [本堂官方页](https://www.senso-ji.jp/guide/guide04.html)、[本堂正面](https://www.senso-ji.jp/images/guide/images/guide04_img01.jpg)、[五重塔官方页](https://www.senso-ji.jp/guide/guide06.html)、[五重塔正面](https://www.senso-ji.jp/images/guide/images/guide06_img01.jpg)、[境内图](https://www.senso-ji.jp/pdf/keidai_map_2024.pdf) | 保留宽本堂和恰好五层塔檐；塔移至模型左前方，和本堂留间隔；本堂补台阶与红柱、明暗墙面分区 | 中档；删除逐瓦细线，五层塔身用白色横带概括。建筑相对距离大幅压缩；未取得独立本堂侧面，屋顶进深沿用项目形状 |
| 5 雷门 | [官方旅游页](https://www.gotokyo.org/en/spot/14/index.html)、[入口实景](https://www.gotokyo.org/en/spot/14/images/main.webp) | 大灯笼真实悬空；左右像龛、绿色格栅、红柱、宽檐 | 中档；像龛只用深色块，省略人物雕塑与文字。来源照片没有完整屋顶，屋顶/后侧为保守沿用与推断 |
| 4 钱汤 | [建筑园官方资料](https://www.tatemonoen.jp/zh-cn/restore/intro/east.php)、[子宝汤正面](https://www.tatemonoen.jp/images/restore/east_img04_1.jpg) | 保留大三角屋顶与烟囱，入口改连续弧形唐破风，蓝色双片门帘 | 中档下限；不复制木雕、瓦缝和围墙。类型模型借鉴子宝汤入口，非完整子宝汤复原；烟囱侧后位置与进深为类型推断 |
| 3 商店街 | [建筑园街铺资料](https://www.tatemonoen.jp/zh-cn/restore/intro/east.php)、[武居三省堂实景](https://www.tatemonoen.jp/images/restore/east_img06_1.jpg) | 三店相邻，平直招牌立面、少量高低错落、分色条纹雨篷及竖牌 | 低档；不再重复町屋全套格栅。为东京店铺类型组合，不对应某条实街，背面及雨篷是风格化组合 |
| 2 长屋街巷 | [Nagaya 类型资料](https://en.wikipedia.org/wiki/Nagaya_(architecture))、建筑园町屋实景作材料补充 | 将三栋孤立山墙改成连续共用屋顶和连接墙体；每户一门一窗；沿街通道两端开敞 | 低档；连体形制由类型资料约束，本次未取得明确长屋多角度实景，布局及进深为推断 |
| 1 町屋 | [建筑园裁缝店资料](https://www.tatemonoen.jp/zh-cn/restore/intro/east.php)、[正侧斜视实景](https://www.tatemonoen.jp/images/restore/east_img05_1.jpg) | 改正屋脊方向：沿街 X 向，正面是屋檐、侧面是山墙；保留深檐与成组木格栅 | 最低档；一块上层窗、三个粗分隔，不复制密木条与瓦片；窄而深比例有意夸张 |

两轮检索后，对缺失独立侧面/屋顶图的模型使用已取得斜视、类型资料和现有形体继续；未将文字摘要或 AI 图当实景证据。来源图片只查看，不打包进游戏。

## 验证产物

`artifacts/tokyo-tier-review/after/`：每级 default / front / side / top / rotated 五个视角。
`tests/fixtures/tokyo-preview.html` 使用产品 SceneView 和真实东京模型工厂。
`tests/tokyo-models.test.ts` 检查都厅上下连体关系、国会内院、雷门灯笼下通道、长屋巷道。

### 完成情况

- 11 个等级、每级 5 个视角，共 55 张最终渲染；高/中/低等级接触表已实际打开检查。
- `high-views.jpg` / `middle-views.jpg` / `low-views.jpg` 为正侧面及旋转对照；`tokyo-overview.jpg` 为统一相机总览。
- 实际图鉴检查东京全套缩略图；390 × 844 手机尺寸检查东京塔、晴空塔弹窗和町屋初始棋盘，未见模型裁切。
- 东京工厂、元数据与新增检查文件的定向 TypeScript 检查通过。完整项目检查曾受其他城市并行未提交文件错误影响，因此不声称全项目构建通过。
- 共享临时预览页在本次工作中被移除，改用东京专用 fixture。初次截图曾超时，后续完成全部模型视角；不修改全局浏览器配置。
- 晴空塔几何保持会话开始时的已有实现；其余十个等级通过各自工厂或东京共享 helper 修正。其他会话改动的参考链接保持原状。

全等级同屏棋盘自动截图未完成：桌面截图受胜利遮罩影响，移动布局切换脚本出现超时，未作为验证通过证据；已采用实际浏览器中的图鉴与手机棋盘人工检查。最终通用全城范围复跑超过 30 秒超时，东京专用几何检查单独执行。

最终东京专用测试：5/5 通过，包括全部 11 栋的有限坐标/法线和地块边界检查。源码范围的 TypeScript 定向检查通过；最终 diff whitespace 检查通过。
