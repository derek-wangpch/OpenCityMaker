# 卢浮宫与玻璃金字塔 / pa-louvre

## 范围与 tier

Tier 6（合成数值 64），采用中等细节的游戏卡通模型。表现拿破仑庭院及其围合宫殿，不复刻整个卢浮宫园区。保留 U 形庭院、浅石色立面、深灰坡屋顶、凸出的馆阁和主金字塔；窗格分组，省略雕像、繁密浮雕、水池、室内与地下倒金字塔。

## 实际查看的参考

- [卢浮宫官方介绍](https://www.louvre.fr/en/explore/the-palace/a-pyramid-for-a-symbol)：确认金字塔入口、方形与三角形母题和玻璃菱格。官方正文给出约 21 m 高、35 m 宽，仅作形体参考，不作为模型的比例约束。页面原图在浏览器呈黑屏，未将其记为完成图像核对。
- [Benh LIEU SONG 庭院全景，2007](https://commons.wikimedia.org/wiki/File:Cour_Napol%C3%A9on_at_night_-_Louvre.jpg) / [查看图像](https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Cour_Napol%C3%A9on_at_night_-_Louvre.jpg/960px-Cour_Napol%C3%A9on_at_night_-_Louvre.jpg)：已在浏览器查看；主金字塔近正面、两翼斜面、馆阁屋顶、分层檐线及菱形玻璃网格。是三张照片拼接的夜景，不用于量取尺寸或昼间色彩。
- [Paris Insiders Guide，航拍来源页](https://www.parisinsidersguide.com/mona-lisa-in-the-louvre.html) / [航拍图像](https://www.parisinsidersguide.com/image-files/louvre-from-above-wide-musee-du-louvre-1000-2x1.webp)：已在浏览器查看；支持 U 形围合、前方开放、长翼楼与中央馆阁、主金字塔周围的小金字塔及水池位置关系。图片标注 Musée du Louvre。

## 形体与风格约束

| 项目 | 本次模型选择 |
| --- | --- |
| 坐标 | y 向上，x 横向，+z 为庭院开放面（A 面），侧面为 B 面；不将模型坐标当作真实方位 |
| 宫殿 | 两条纵向翼楼和后方横楼形成开放 U 形；以凸出的馆阁和坡屋顶打破方盒轮廓 |
| 金字塔 | 方形底座，四个连续三角面，网格和边框共用面坐标；主金字塔放大，翼楼高度和长度压缩，强调游戏辨识度 |
| 细节 | Tier 6：两排分组窗、主要檐线、少量馆阁和三个简化小金字塔；不做逐窗装饰和精密玻璃分片 |
| 材质 | 温暖石色、灰蓝屋顶、浅蓝绿玻璃面与浅色框架；用哑光色块表现玻璃，沿用批处理材质，不添加透明排序负担 |

两轮检索后未取得独立正交侧立面照片，B 面进深取自航拍及全景翼楼斜面。庭院与馆阁间距、玻璃颜色均是游戏化取舍，不是测绘复原。三个小金字塔按航拍与常见布局表达；官方英文页的小金字塔数量文字与总数描述存在不一致，不据此编造精确尺寸。


## 验证

- 已打开检查 `artifacts/pa-louvre/after.png`、`after-front.png`、`after-side.png`、`after-top.png`：开放 U 形庭院、三角面与网格对齐、馆阁屋顶和侧翼进深均可辨认。侧立面中宫殿遮住金字塔的下部是围合布局的正常遮挡。
- 现有建筑包与缩略图测试共 8 项通过，含全部模型有限顶点、法线与地块边界检查。
- 全项目类型检查仍受现有 `tests/browser/ny-onewtc-preview.spec.ts` 空值错误，以及 `tests/eiffel.test.ts` 缺少工厂第三参数影响；没有卢浮宫文件诊断。
- 产品页面检查通过并已亲自看图：桌面棋盘 `desktop.png`、390×844 手机棋盘 `mobile-board.png`、默认详情 `dialog.png`、键盘旋转后 `rotated-dialog.png`、手机详情 `mobile-dialog.png`（均位于 `artifacts/pa-louvre/`）。与 Tier 5 歌剧院、Tier 7 巴黎圣母院同屏比较，体量与配色协调；金字塔在小尺寸仍可辨认，无裁切。浏览器流程无页面异常。
