# sy-university — 悉尼大学钟楼 / University of Sydney Clock Tower

- Tier 8 / value 256，身份、Factory 接口不变。高档细节，但低于 tier 9 One Central Park 的分层阳台、植被及反射镜阵列密度。
- 2026-09-06 先打开原 default/front/side/top 预览；原形体为实心横楼加方塔，入口不贯通、无方庭、缺角塔与斜屋顶。

## 实际打开的参考图

1. [Toby Hudson, Wikimedia 正面实景](https://commons.wikimedia.org/wiki/File:SydneyUniversity_MainBuilding_Tower.jpg) / [图像](https://upload.wikimedia.org/wikipedia/commons/d/d3/SydneyUniversity_MainBuilding_Tower.jpg)：正面长窗、尖拱通道、钟面置于顶部中央、突出八角形竖向角柱及尖顶角塔、翼楼垛口后有坡屋面。CC BY-SA / GFDL，来源页注明具体许可。
2. [悉大官方 Flickr：Library Lawn 斜视](https://www.flickr.com/photos/sydneyuni/6808222500) / [图像](https://live.staticflickr.com/7062/6808222500_6ceca62bea_b.jpg)：可见钟楼侧面、四角塔的空间分离；长翼楼和一端更高、屋顶更陡的 Great Hall。照片为已建成实景，2010。
3. [悉大官方：1949 历史航拍](https://www.sydney.edu.au/news-opinion/news/2016/11/10/9-surprising-moments-in-the-life-of-the-quad-jacaranda.html) / [图像](https://www.sydney.edu.au/content/dam/historical-and-archival/2016/archive-jacaranda.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg)：四边围合、中央草地与十字步道、钟楼位于外立面中部、长脊屋顶。历史照片仅用于基本平面关系，不证明现时景观配置。
4. [悉大官方 Flickr：从内庭另一端看钟楼](https://www.flickr.com/photos/sydneyuni/6954331741) / [图像](https://live.staticflickr.com/7056/6954331741_9f791abe05.jpg)：穿过庭院看贯通尖拱及外部远景，证明入口通道的空间连通。并非纯侧立面。

第一轮中英文检索：`悉尼大学 钟楼 方庭 正面`、`University Sydney quadrangle clock tower aerial courtyard`；第二轮补充 `University Sydney quadrangle clock tower side view courtyard roof`。以上图均下载后实际打开查看。两轮后没有严格正交侧立面；侧面开窗数量及后翼精确比例为推断，采用斜视和航拍约束。

## 形体与取舍

- X 为正面宽，Y 向上，+Z 入口。模型是整组四边围合的压缩意象，不是测绘复原。
- 保持方塔直立、四角八角柱与尖顶、水平垛口和圆钟面；钟面不能放到侧面充当四面钟。
- 入口必须实际穿透塔底并接入内庭，不能以深色贴片代替；草地上方为空，翼楼沿外围布置。
- 将长翼楼和庭院明显压缩、入口及钟面放大、四角尖塔加粗，让 1.6×1.6 棋盘仍可识别。塔尖约 1.60，不以增高模拟更高 tier。
- 高档标志构件：圆钟、尖拱、长窗竖梃、水平石带、角柱尖塔、翼楼垛口、坡顶和可见方庭。只保留两排分组窗，省略精细雕像、兽首、花饰、旗帜、密集烟囱及完整后方附属院落；不复制历史树木配置。
- 与已完成 tier 9 的 `sy-centralpark-final.png` 实际对比：本模型采用较少重复窗组和大块石墙，丰富度来自建筑轮廓，不用密集饰件堆层。

## 验证记录

- 已亲自查看 massing 和 final 的 default/front/side/top：入口石框无封堵，透视可见内庭，俯视确认草地和十字步道，侧面没有误加钟面。另看 rotation=2.4 默认斜视以核对后方和翼楼。
- 已亲自查看产品 `sy-university-desktop.png`、`sy-university-mobile.png`（390×844）、`sy-university-catalog.png`，与同板 tier 9 比较；无裁切，轮廓清楚，窗组不过密。不是物理手机验证。
- 产物目录 `artifacts/sydney-review/`：`sy-university-final.png`、`sy-university-final-front.png`、`sy-university-final-side.png`、`sy-university-final-top.png`；另有 `sy-university-rotated.png` 及三正交视图。
- Playwright 原预览及专属产品测试 2/2 通过；旋转预览 1/1 通过。使用已有 5273 服务，CLI 显式 PORT 和 120 秒 timeout。
- 专属 Vitest 1/1 通过：入口射线贯通、门柱命中、庭院无遮挡、地块边界/高度、法线/顶点有限、按材质批处理少于 10 网格。
- packs 6 项中 5 通过；全城边界测试失败于未修改的 `sg-sands` max.x=0.8626800179481506 > 0.83。sy-university 自身专属几何断言通过。
- 全仓 `npm run typecheck` 失败于其他任务文件：`tests/browser/ny-onewtc-preview.spec.ts` 的 src/ctx null；`tests/dubai-models.test.ts` 的 Building.tier；`tests/eiffel.test.ts` 的 Factory 参数数目。未修改这些文件。
- 本次模型和两个专属测试以相同 strict/noUnused 编译选项单独 tsc 检查通过；`git diff --check` 本次模型通过。

首次原模型预览遇到导航/30 秒超时；提高本次 CLI `--timeout=120000` 后四视图通过，未改公共配置。
