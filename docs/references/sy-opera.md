# sy-opera — 悉尼歌剧院

2026-09-06。Tier 11 / value 2048，最高细节档；身份、Factory 接口不变。

## 检索与实际查看

先打开当前 default/front/side/top 预览（`artifacts/sydney-review/sy-opera-before*.png`），然后两轮中英文检索：第一轮「悉尼歌剧院 航拍 侧面 屋顶」「Sydney Opera House spherical solution roof glass walls side view」；第二轮「Sydney Opera House south front steps elevation」「悉尼歌剧院 西侧 立面 实景」。以下图像均实际打开查看，不仅阅读摘要。

- [Arup 工程项目页](https://www.arup.com/projects/designing-the-sydney-opera-house/) / [侧面实景图](https://www.arup.com/globalassets/images/projects/s/sydney-opera-house/sydney-opera-house-hero.jpg)：近侧面，夜间投影不会作为表面纹理；确认弧形升起的主壳、反向端壳、连续平台。
- [Australia Cruise Association 歌剧院页面](https://www.australiancruiseassociation.com/member/sydney-opera-house) / [Hamilton Lund 航拍](https://www.australiancruiseassociation.com/sites/default/files/images/media/2024-01/SOH%20HL%202017%20247_retouched.jpg)：高斜视清楚显示两厅错位、主壳朝港湾、较小反向壳朝大台阶，以及独立餐厅壳组。
- [Arup 端墙图](https://www.arup.com/globalassets/images/projects/s/sydney-opera-house/carousel-6-plans-for-the-glass-wall.jpg?height=802&quality=80&width=1200)：工程轴测示意，确认尖拱端口、下部外折玻璃和竖梃；不能视作正投影实景。
- [歌剧院官方球面解说明](https://www.sydneyoperahouse.com/our-story/the-spherical-solution)：辅助理解球面壳的设计逻辑。游戏使用连续三角网格圆弧近似，没有宣称严格同球半径重建。

两轮后未取得可直接核对的完整正投影端面实景或垂直正顶图；端面与平面比例由工程端墙图及航拍推断。未臆造测绘尺寸。

## 形体约束与取舍

- x 是横向两厅，y 向上，z 是纵深；局部 +z 为台阶前场，-z 为主要壳顶开口侧。按用户最终要求，建筑整体绕 y 轴旋转 180°，产品坐标中台阶位于 -z、主要壳顶开口朝 +z。局部最大壳位于较大左厅，另一厅错位且略低；不能成为等高对称队列。
- 纵剖用 sin/cos 圆弧参数，横剖为双侧尖拱，保持薄壳内外面、端口封边。主壳与反向壳的网格绕序分别控制；玻璃向外可见。
- 平台上层止于踏步顶端；六级外露踏步由前向后逐级升高。浅玻璃侧厅将壳脚接到平台。
- 端墙使用两段折面与共享坐标竖梃；增加次要餐厅壳组。适量屋面纵缝，不逐块复制瓷砖。
- 有意夸张：压缩纵深、提高壳顶和台阶高度、加粗少量竖梃，台阶仅六级；约 1.6×1.6 地块，模型自身高于 1.0、低于 1.1。
- 省略：百万瓷砖、室内结构、栏杆和游客、完整港湾与不规则海岸轮廓。餐厅位置/尺度及玻璃下折量为视觉近似。
- 对比当前 tier 10 海港大桥 default 预览：桥以拱桁架和四桥塔表达，本 tier 11 增加连续曲面、反向壳、玻璃折面、平台踏步；丰富来自标志构件而非重复微细窗格。Sydney 无 tier 12，故不能对比更高一级。

## 验证

- 复用原有 `model-preview.html`、`tests/browser/model-preview.spec.ts`，显式 PORT=5273、PREVIEW_CITY=sydney、PREVIEW_VALUE=2048。
- 最终四视图：`artifacts/sydney-review/sy-opera-final.png`、`-final-front.png`、`-final-side.png`、`-final-top.png`。
- 专属几何测试覆盖双向端墙法线、六级踏步无遮挡、地块与高度边界。首次发现玻璃边缘低于设定墙脚导致窄条翻面，降低墙脚后重验通过。
- packs：6/6 通过，含全城市几何边界。
- typecheck 已运行，受任务外既有错误阻塞：`tests/browser/ny-onewtc-preview.spec.ts` 第 47–52 行 nullable src/ctx；`tests/eiffel.test.ts:17` Factory 参数不足。未修改这些文件。
- 最终 packs + 专属几何测试合计 7/7 通过；最终四视图预览、产品页面专属测试、180° 旋转预览均通过。typecheck 复验仍仅以上任务外错误。
- 已亲自查看最终 default/front/side/top、`sy-opera-rotated.png`、`sy-opera-desktop.png`、`sy-opera-mobile.png`（390×844）、`sy-opera-catalog.png`，均位于 `artifacts/sydney-review/`。双厅、壳顶和台阶可读，无裁切；少量细缝在缩略图自然消失。
- 棋盘存档到达 2048 自动触发完成遮罩；专属浏览器测试仅在页面注入 `.end-overlay {display:none}` 以检查下面的真实产品棋盘，没有更改产品实现或存档规则。第一次图鉴截图未等待图像解码，补充滚动/解码等待后已重拍并查看。

## 用户朝向修正

按用户「应该转180度」要求，Factory 内增加独立组绕 y 轴旋转 Math.PI，厅体、平台、餐厅与台阶整体转向；原有地块装饰不受影响。踏步射线断言同步到旋转后坐标。packs + 专属几何测试 7/7 通过，typecheck 仍为上文任务外错误。共享 5273 服务截图超时后，使用独立 5293 端口（临时禁用文件监听，无公共配置更改）复验四视图通过，已打开查看。
旋转后桌面与手机棋盘截图已重新生成并亲自查看，默认图鉴缩略图也在桌面侧栏核对。产品测试在最后的全城市 gallery 卡片截图处耗尽 120 秒，故此次不声称该浏览器测试整体通过；`sy-opera-catalog.png` 仍是旋转前记录。新的四视图与 desktop/mobile 文件才是本次朝向验收依据。
