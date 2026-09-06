# 上海建筑 tier 9 → 1 参考审查

2026-09-06。跳过 tier 11 上海中心与 tier 10 环球金融中心。沿用 Three.js 低多边形、哑光色块、1.6 × 1.6 地块，Y 向上；正面 A 为 +Z、侧面 B 为 +X，不推定实际方位。tier 来自 authoring.b 的第一个参数（运行时 value = 2 ** tier）。保留既有城市、model ID、合成值与其他工作区改动。

## 已查看的实景来源与约束

|tier / 模型|来源、视角与资料类型|形体约束与本次取舍|
|---|---|---|
|9 金茂|[SOM 建成项目](https://www.som.com/projects/jin-mao-tower/)：首屏近立面、下方两张完整斜视与远景，实际浏览图片|保留银灰凹角主体、上段密集退台和尖冠；将被主体吞没的正侧面竖线移到对应外表面。退台数量与层高为既有游戏夸张，不声称测绘复原。省略逐层小窗。|
|8 东方明珠|[实景全塔与下球近照](https://en.wikipedia.org/wiki/Oriental_Pearl_Tower)，已查看全塔、支腿和球体腰带；[中国文化网](https://en.chinaculture.org/focus/focus/2010expo_en/2010-04/09/content_375823.htm)补充文字|三根平行柱与三根下部斜撑分开；上大球仅略小于下大球；球壳银灰、红紫玻璃腰带齐平；保留三个支腿小球与五个中段小球。天线分段。没有独立正交侧照，平面三向支撑用旋转对称推断。省略三角密网。|
|7 和平饭店北楼|[Peace Hotel](https://en.wikipedia.org/wiki/Peace_Hotel)首图：正面略俯拍可见两侧进深与铜绿冠；[酒店官网](https://www.fairmont.com/zh/hotels/shanghai/fairmont-peace-hotel.html)身份核对；补搜 side view 后未取得独立无遮挡侧立面|取消三层等比例塔状楼身，改长侧翼、临街凸起塔部与铜绿四坡金字塔；窗组、入口圆拱、中上段檐口。后部精确平面与背面属于推断，塔冠夸大以便游戏识别。|
|6 外滩|[摄影原文](https://www.everettpotter.com/2018/07/strolling-shanghais-bund/)、[已查看实景图](https://www.everettpotter.com/wp-content/uploads/2018/07/HSBC-Bank-Building-left-PHOTO-Monique-Burns-768x576.jpg)：汇丰与海关钟楼相邻斜视、可见邻接面和穹顶|改为宽穹顶银行与钟楼组合，突出列柱、横檐、四面钟盘。不是完整外滩平面；进深和两栋的横向占比为压缩构图推断，省略细柱头和密窗。|
|5 老洋房|[武康路395号实访图文](https://www.thepaper.cn/newsDetail_forward_9262514)：已查看街景、弧形阳台、侧向近照；[武康路100弄修缮说明](https://mzj.sh.gov.cn/lnb-xw/20200518/MZ_LNB4_16050.html)文字补充|本模型是类型化花园洋房，并非395号复刻。保留既有坡顶、圆弧凸窗和柱廊，补稀疏窗组、烟囱，修复圆拱色块。凸窗与屋面组合为游戏类型设计；不把395号阳台描述为凸窗实证。省略栏杆和浮雕。|
|4 豫园水榭|[Yu Garden](https://en.wikipedia.org/wiki/Yu_Garden)首图及 Gallery：实际查看水边亭台、曲桥、假山、池岸，屋顶斜视|类型化园林小景，不冒充湖心亭精确复刻。保留灰瓦红柱、假山与水面；折桥连通前岸与亭台，减少无意义桥段。池塘、桥路线和亭台相对位置为游戏构图。省略复杂栏杆、龙墙和湖心亭多层结构。|
|3 弄堂街区|[Shikumen](https://en.wikipedia.org/wiki/Shikumen)实景弄内照片：门框与相邻墙面；[住宅类型与布局研究](https://thethinkingarchitect.wordpress.com/2015/10/21/chinese-puzzle-shifting-spatial-and-social-patterns-in-shanghai-shikumen-architecture/)补充类型约束|沿用产品明确描述的隔弄相望布局，转动两排入口朝向中间通道。不是所有真实里弄都面对面；历史常见同向排列不能被此游戏类型代替。保留牌额与门框，省略小装饰。|
|2 里弄联排|同上石库门实景与[摄影资料](https://shanghaistreetstories.com/?page_id=1288)|三户共墙、连续瓦顶、石框木门；消除房屋之间意外缝隙，铺路贴近入口。无独立特定地址复原。|
|1 石库门民居|同上石库门实景门与侧墙|保留两层砖屋、深色坡顶和石门框，补闭合天井侧墙与山墙屋顶端面，删除小型叠层门饰。院落尺寸为推断。|

## 核查边界

所有比例为游戏卡通化分配，不按照片估算精确尺寸。中低等级类型建筑的正侧面不具备完整测绘证据；没有把不同类型建筑硬称为某一栋现实建筑。未下载或打包参考图片到产品。

## 最终验证

- `artifacts/shanghai-tier-review/index.html`：九级图集；`overview.jpg` 为默认视角总览；每个 `review-N.jpg` 为正侧面等四视角合图。
- 已亲自查看 tier 9 → 1 的默认、正面、侧面、顶部共36张渲染，以及桌面棋盘、390×844手机棋盘、9个手机详情和旋转后的另一面。低级保留大色块，高级以柱体、塔冠、退台提升层次。截图无裁切；手机页面无横纵溢出。未进行真机性能和闪烁长时间测试。
- 视觉复查后降低 tier 3 牌楼高度、补 tier 5 两侧稀疏窗、闭合低层坡屋顶端面。豫园假山已抬到水面以上，排除穿地。
- 两个 Shanghai Playwright 检查均通过；专门的地块/有限几何与弄堂射线检查 2/2 通过。截图工具使用同一 SceneView 连续换模，关闭测试连接的实时刷新，避免其他工作区改动干扰截图。
- 本次 `src` 与上海测试范围的 TypeScript 检查通过（临时配置继承项目严格配置）。全量检查未通过：现有 `ny-onewtc-preview.spec.ts` 的空值检查与 `eiffel.test.ts` 工厂参数错误；全城 packs 测试为北京 `bj-hutong` 高度小于既有0.4断言。未改动这些范围外文件，也未以此宣称全项目通过。
- 本次仅修改上海模型、外滩描述、参考记录和上海验证入口。预览图片为本地生成产物，不纳入提交。
