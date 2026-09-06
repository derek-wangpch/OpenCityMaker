# 巴黎歌剧院 / Palais Garnier / pa-garnier

Tier 5（数值 32），中等细节游戏卡通模型。对象是加尼叶宫，不是巴士底歌剧院。沿用现有 1.6×1.6 地块、y 向上、柔和哑光材质和几何批处理。

## 参考与查看范围

- [巴黎歌剧院官方页面](https://www.operadeparis.fr/en/visits/palais-garnier)：对象与项目出处。
- [建筑资料及图像出处](https://en.wikipedia.org/wiki/Palais_Garnier)：用于定位下列正面、侧面实景与屋顶平面；正文说明两组金色前檐雕塑与后部舞台山墙的 Apollo 群像是不同构件。
- [正面，2009](https://commons.wikimedia.org/wiki/File:Paris_Opera_full_frontal_architecture,_May_2009.jpg) / [查看图像](https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Paris_Opera_full_frontal_architecture%2C_May_2009.jpg/500px-Paris_Opera_full_frontal_architecture%2C_May_2009.jpg)：已在浏览器亲自查看，确认底层拱廊、上层成对柱、横向阁楼带、两端金色雕饰及其后方绿色穹顶。
- [东侧立面，2014](https://commons.wikimedia.org/wiki/File:Palais_Garnier_(Eastern_Elevation),_2014-07-05.jpg) / [查看图像](https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Palais_Garnier_%28Eastern_Elevation%29%2C_2014-07-05.jpg/960px-Palais_Garnier_%28Eastern_Elevation%29%2C_2014-07-05.jpg)：已查看，近正侧面；确认长进深、突出的圆形侧厅、后部高舞台体量。黑白照片不用作色彩依据。
- [屋顶平面，Mead 1991 p104](https://commons.wikimedia.org/wiki/File:Palais_Garnier_plan_of_the_roof_-_Mead_1991_p104.jpg) / [查看图像](https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Palais_Garnier_plan_of_the_roof_-_Mead_1991_p104.jpg/960px-Palais_Garnier_plan_of_the_roof_-_Mead_1991_p104.jpg)：已查看；历史建筑图，支持中央穹顶、后部矩形舞台屋顶与两翼圆厅的位置关系，不当作现代设备测绘图。
- [航拍候选来源](https://generationvoyage.fr/monuments-historiques-paris/)的图片在浏览器呈黑屏，未用于形体判断；以上屋顶平面补足顶部证据。

## 建模约束与简化

| 项目 | 选择 |
| --- | --- |
| 坐标 | +z 是主入口 A 面，x 是正面宽度；B 面沿 z 显示进深，不将坐标强行对应真实方位 |
| 体量 | 正面宽、主体向后延伸；中央低穹顶与后部较高的舞台坡屋顶分开，两侧圆厅外凸 |
| 正面 | 底层七个分组拱门、上层稀疏双柱、水平檐带、两端金色顶饰 |
| 顶部 | 绿色穹顶、后部绿色山墙屋顶和小型青铜色顶饰；不可合成单一圆顶或把全部雕饰涂成金色 |
| tier | Tier 5：优先轮廓与前立面节奏，略去浮雕、作曲家胸像、微小窗套和室内；雕塑仅做易读剪影 |
| 卡通比例 | 压缩真实进深、加宽前立面与圆厅、放大双柱和金色顶饰；比例以游戏中辨识度为准 |

侧厅在模型中概括为成对圆形体量，真实东西两侧入口、坡道和装饰存在差异，这些不逐一复刻。雕像姿势、各部分尺寸、柱间距与色彩均为有意风格化取舍，不宣称精确复原。

## 验证

- 已打开检查 `artifacts/pa-garnier/after.png`、`after-front.png`、`after-side.png` 和 `after-top.png`。正面保留七拱门与成对柱；B 面可区分圆厅、低穹顶与后部较高舞台体量，屋顶平面前后关系与参考一致。比例为卡通化压缩。
- 现有建筑包和缩略图测试共 8 项通过（包含全部建筑边界、有限顶点与法线）。多视角浏览器预览通过。
- 全项目类型检查仍存在 `tests/browser/ny-onewtc-preview.spec.ts` 空值错误和 `tests/eiffel.test.ts` 工厂调用缺少第三参数；没有歌剧院文件诊断。本次未改动这些测试。
- 已亲自检查桌面棋盘、390×844 手机棋盘及旋转后桌面/手机详情图（同目录 `desktop.png`、`mobile-board.png`、`rotated-dialog.png`、`mobile-dialog.png`）。与 Tier 4、6、7 模型同屏比较；柱廊和屋顶色块在小尺寸清楚，无裁切，浏览器流程无页面异常。临时截图测试已移除。
