# 新加坡建筑逐级 review（2026-09-06）

范围：按 authoring 元数据的 tier 11 → 1 处理 10 个模型；tier 9 艺术科学博物馆跳过，其模型、说明及共享 petal 实现保持本轮开始时内容。

## 坐标、风格与取舍

Y 为高度；X 为 A 立面宽度，Z 为进深，默认以 +Z 为正面。未推定地理朝向。沿用 Three.js ModelKit 的低多边形、柔和材质与按材质批处理。原始模型约占 1.6 × 1.6 地块，现有检查允许边界 ±0.83、高度 2.66。合成值 2^tier 只用于选择模型。

卡通化比例均为有意选择：压缩酒店与组屋实际楼层、加粗树冠枝条与鱼尾狮喷水、放大入口和穹顶。这里不是测绘复原。等级决定可读结构与装饰预算，不要求三角形数严格单调。

| Tier / 模型 | Review 后保留与修正 | 细节档位与主要省略 |
| --- | --- | --- |
| 11 滨海湾金沙 | 保留三座双片塔身、侧面弯曲塔脚与顶部齐平；空中花园增加单端更长的悬挑、塔顶暗色连接层与支撑；保留泳池、树列和分组楼层带 | 高：不复制实际逐层阳台、全部酒店裙房或三塔各自的精确曲率 |
| 10 擎天树 | 收腰树干、分叉的开放树冠、绿化色块和小型顶部设备帽；把斜直杆空桥改成水平、平面弯曲的桥面，补栏杆和悬索 | 高：三树代表整片树林，不复刻 18 棵树布局、全部枝条、植物和照明 |
| 9 艺术科学博物馆 | 跳过 | 本轮无改动 |
| 8 鱼尾狮 | 连续收腰鱼身取代圆柱叠层；下垂鬃毛、双眼、吻部、胸鳍、分组鱼鳞、波浪基座；连续弧形水柱从嘴接到水面 | 高：鳞片和鬃毛概括，底座水景为地块内构图；不逐片还原雕刻 |
| 7 滨海艺术中心 | 两个稍不同大小的椭圆壳体；沿曲面铺设三角折面遮阳片，代替全竖直尖锥；增加低裙台和入口玻璃带 | 中：保留榴莲纹理，约五组遮阳片纬带；省略细密真实网架 |
| 6 国家美术馆 | 分开旧最高法院与较长市政厅体块；左侧前突山花、后退铜绿穹顶，右侧长柱廊，中间金色连接顶棚；补侧面窗组和台阶 | 中：省略柱头雕刻、真实柱数、内部庭院及完整金属帷幕曲面 |
| 5 莱佛士酒店 | 三层白色立面、中央白色山花、突出两端与低红瓦门廊；拱形窗组和侧面窗组 | 中：用主体入口楼概括酒店，不做完整庭院与翼楼群；省略细栏杆与文字招牌 |
| 4 组屋街区 | 两座不同高度的板楼；长侧面走廊暗带与浅色栏板、端部窗组、彩色墙带、平屋顶、开放底层 | 中：四至五组楼层；省略空调、晾衣架、电梯细部 |
| 3 黑白洋房 | 宽大四坡屋檐、白墙深色木构、遮蔽外廊、少量窗块 | 低：三开间构图，无密集栏杆、瓦缝；建筑类型示意，不绑定特定门牌 |
| 2 店屋街区 | 三间粉彩店屋连续排列，屋脊平行街道，前檐平齐；真正贯通的五脚基 | 低：每扇百叶仅两道分组线，省略花砖和灰泥雕饰 |
| 1 娘惹店屋 | 单间粉彩体块、浅色框边、双窗、平行街道的瓦屋脊、遮蔽通道 | 低：与 tier 2 共用简洁部件，以单体/连排区分 |

## 实际查阅的参考

完成中英文首轮检索，再对屋顶、侧面与通廊补查。来源页上的实景图通过浏览器实际打开检查；文字资料与没能显示的图片不算视觉证据。参考媒体没有打包进产品。

| 对象 | 来源页 / 图像 | 实际视角与类型 | 支持特征 / 局限 |
| --- | --- | --- | --- |
| 金沙 | [Safdie Hotel and SkyPark](https://www.safdiearchitects.com/projects/marina-bay-sands-hotel-and-skypark) | 建筑师项目页：夜景斜正面、窄侧面、仰视、空中花园高位斜视实景 | 双片结构与塔脚、塔间空隙、顶部泳池及悬挑；三座塔的不同底部形态仍合并成同一游戏轮廓 |
| 擎天树 | [Gardens by the Bay 官方图库](https://www.gardensbythebay.com.sg/en/things-to-do/attractions/supertree-grove.html)；[Ingenia 工程说明](https://www.ingenia.org.uk/articles/singapores-supertrees/) | 官方主图和图库首张：树林侧向斜视；Ingenia 为文字工程补充 | 枝条分叉、树冠透空、垂直植物、水平弯曲空桥；未得到正交顶部证据，径向分枝和三树位置为卡通推断。Ingenia 旧照片 URL 浏览器被阻挡，未作为已看图片 |
| 鱼尾狮 | [Singapore Tourism Board](https://www.visitsingapore.com.cn/neighbourhood/featured-neighbourhood/marina-bay/merlion-park/) | 日景侧前方、夜景另一侧偏后方实景 | 吻部、下垂鬃毛、鱼鳞胸鳍、水柱弧线和波浪基座；没有近正面正交照片，面部宽度为对称化推断，水柱进深有意压缩 |
| 滨海艺术中心 | [DP Architects](https://www.dpa.com.sg/projects/esplanade-theatres-on-the-bay/) | 内部玻璃网架照片、项目正文旁夜景航拍，实际打开查看 | 双壳完整顶部、进深和三角遮阳片；真实壳体平面偏转简化为两条近平行轴。未获取独立正交侧立面 |
| 国家美术馆 | [官方建筑历史页](https://www.nationalgallery.sg/sg/en/architecture-and-history.html)；[studioMilou 项目册](https://www.studiomilou.sg/wp-content/uploads/2018/06/Milou-Book-3-National-Gallery-Singapour.pdf) | 官网全景近正面实景；项目册文字与图页索引辅助 | 两座立面分别处理、左山花右长柱廊、中央金色连接。项目册截图未能可靠显示，因此不声称已核对其中侧面/平面图；后部进深与穹顶位置按文字及已有布局概括 |
| 莱佛士 | [NHB Roots](https://www.roots.gov.sg/places/places-landing/Places/national-monuments/raffles-hotel) | 主入口正前方略斜实景 | 三层白色立面、中央白色三角山花、低瓦门廊；背立面及整栋进深为概括，未作为全酒店场地复原 |
| 组屋 | [NHB Rainbow Block 316](https://www.roots.gov.sg/places/places-landing/Places/landmarks/Hougang-Heritage-Trail/Rainbow-Block-316)；[NHB 早期板楼说明](https://www.roots.gov.sg/places/places-landing/Places/landmarks/my-queenstown-heritage-trail/the-first-point-blocks) | Rainbow Block 全楼正面略斜实景；第二来源用于板楼公共走廊类型的文字说明 | 长走廊与栏板、平顶、底层架空。这里只提取组屋类型特征，没有复制 Block 316 的彩虹、弯曲平面或具体配色。HDB 官方历史页显示拒绝访问，已换用 NHB |
| 黑白洋房 | [URA 类型指南](https://www.ura.gov.sg/conservation/conservation-resources/understanding-the-bungalow/)；[NHB 图文](https://www.roots.gov.sg/stories-landing/stories/black-and-white-houses-in-singapore/story) | 历史外廊侧向照片、现代黑白住宅正面照片；URA 四坡屋顶类型文字约束 | 黑白色块、宽屋檐、外廊；NHB 正面图本身是双坡屋顶变体，模型选择 URA 描述的四坡类型，不能当作同一门牌多角度复原 |
| 店屋 / 店屋街区 | [URA 类型指南](https://www.ura.gov.sg/conservation/conservation-resources/understanding-the-shophouse/)；[NHB 图文](https://www.roots.gov.sg/stories-landing/stories/singapore-shophouses/story)；[Petain Road 实景](https://www.roots.gov.sg/api/media/2aba831c-58f6-477e-a93a-e22d55518b52/late-shophouse-style-example-at-petain-road.jpg?h=430&w=645)；[通廊实景](https://www.roots.gov.sg/api/media/fdae0063-b61a-47b6-ad3d-739429671c7f/five-footway-and-floor-tiles.jpg?h=auto&w=100%25) | 转角街景可见两向立面与屋檐；沿五脚基看的纵深照片 | 瓦屋顶、粉彩/灰泥框边、上层窗组、首层连续通道。纵深被显著压缩，省略内部天井与后部楼翼；不指定具体店屋门牌 |

## 验证和产物

- [离线预览页](../../artifacts/singapore-review/gallery.html)：10 个模型，每个有默认、正面、侧面、顶部、旋转背面。50 张视图均已在组合图中人工检查；金沙与店屋最终修正后重跑并重看受影响视图。
- [可重新生成的预览页](../../tests/fixtures/singapore-model-review.html)：通过项目开发服务打开，使用实际 `SceneView` / `createBuilding` 和游戏材质。
- 浏览器实际检查：桌面新加坡棋盘、低等级缩略图、金沙产品弹窗；390 × 844 手机图鉴全部 11 项（9 仅作邻级对比）、擎天树弹窗与拖动旋转后视图，无模型裁切。手机浏览器尺寸检查不等同实体手机或微信设备验收。
- `tests/packs.test.ts`：6 项通过，包括全部城市几何边界与有限数值。首次发现金沙超边界已修复；一次 5 秒默认超时后以 30 秒限时重跑通过。
- `tests/singapore-models.test.ts`：4 项通过，验证五脚基贯通、组屋架空、空桥水平/树冠透空、喷水起终位置。
- `tests/browser/singapore-review-session.spec.ts`：1 项通过，10 行 / 50 视图，未出现 pageerror。
- 本轮构建时全 `src` 的独立 TypeScript 检查通过，Vite 生产构建通过；收尾时其他任务修改的 `sy-stmarys.ts` 出现未使用变量错误，故最新整仓状态不能视为通过。新加坡范围与新增测试另行检查。
- 全项目 `npm run typecheck` 没有通过：已有 `ny-onewtc-preview.spec.ts` 空值检查、`dubai-models.test.ts` 不存在的 tier 属性、`eiffel.test.ts` 参数数目错误。本轮没有修改这些其他任务文件，不能宣称全项目检查全绿。
- 未推送或发布。共享 `petal` 函数和艺术科学博物馆两文件与本轮起点比较保持一致。
