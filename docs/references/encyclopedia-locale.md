# 按语言选择建筑百科

首次访问按浏览器首个受支持的语言选择界面语言；保存的语言（包括英语）优先。`zh-CN` 使用已核实的百度百科词条；`en` 和 `zh-HK` 继续使用建筑的 `sources[0]`。未配置百度词条时保留原来源。语言不作为 IP 或所在地区判定。

## 链接核实（2026-09-06）

检查了 132 个建筑名称，当前配置 28 个百度词条，104 个保留原来源。仅配置能够确认对应建筑或建筑类型、且具备非零词条编号的条目；未使用搜索结果页，也未自动从建筑名称拼接词条。

百度主站在当前验证环境返回访问限制，无法确认主站在真实中国大陆网络中的可达性。下列百度官方 `bkso` / `wapbaike` 入口提供了可核实的词条内容；应用使用相同名称和编号的 `baike.baidu.com` 主站链接。未核实到合适词条不代表百度没有该词条。

| 模型           | 词条             | 内容核实入口                                                                             |
| -------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| bj-cwt         | 国贸大厦A座      | [百度百科](https://bkso.baidu.com/item/国贸大厦A座/61263940?fromModule=lemma_inlink)     |
| bj-gate        | 北京城门         | [百度百科](https://bkso.baidu.com/item/北京城门/4268838?fromModule=lemma_inlink)         |
| bj-heaven      | 祈年殿           | [百度百科](https://bkso.baidu.com/item/祈年殿/2034363?fromModule=lemma_inlink)           |
| bj-house       | 民居             | [百度百科](https://bkso.baidu.com/item/民居/647853?fromModule=lemma_inlink)              |
| bj-hutong      | 胡同             | [百度百科](https://bkso.baidu.com/item/胡同/250397?fromModule=lemma_inlink)              |
| bj-ncpa        | 国家大剧院       | [百度百科](https://bkso.baidu.com/item/国家大剧院/68088165?fromModule=lemma_inlink)      |
| bj-palace      | 太和殿           | [百度百科](https://bkso.baidu.com/item/太和殿/2225506?fromModule=lemma_inlink)           |
| hk-icc         | 环球贸易广场     | [百度百科](https://bkso.baidu.com/item/环球贸易广场/10458972?fromModule=lemma_inlink)    |
| hk-walled      | 围村             | [百度百科](https://bkso.baidu.com/item/围村/10016999?fromModule=lemma_inlink)            |
| ny-empire      | 帝国大厦         | [百度百科](https://wapbaike.baidu.com/item/帝国大厦/771609)                              |
| sh-peace       | 和平饭店         | [百度百科](https://wapbaike.baidu.com/item/和平饭店/49918)                               |
| sh-shikumen    | 石库门           | [百度百科](https://wapbaike.baidu.com/item/石库门/701960)                                |
| sh-yangfang    | 洋房             | [百度百科](https://bkso.baidu.com/item/洋房/10790744?fromModule=lemma_inlink)            |
| sz-civic       | 市民中心         | [百度百科](https://wapbaike.baidu.com/item/市民中心/2687471)                             |
| sz-diwang      | 深圳地王大厦     | [百度百科](https://bkso.baidu.com/item/深圳地王大厦/4986719?fromModule=lemma_inlink)     |
| sz-hakka       | 客家民居         | [百度百科](https://bkso.baidu.com/item/客家民居/615376?fromModule=lemma_inlink)          |
| sz-kk100       | 京基100大厦      | [百度百科](https://bkso.baidu.com/item/京基100大厦/8369773?fromModule=lemma_inlink)      |
| sz-pingan      | 平安国际金融中心 | [百度百科](https://bkso.baidu.com/item/平安国际金融中心/4521205?fromModule=lemma_inlink) |
| sg-hdb         | 组屋             | [百度百科](https://bkso.baidu.com/item/组屋/9902050?fromModule=lemma_inlink)             |
| sg-sands       | 滨海湾金沙       | [百度百科](https://bkso.baidu.com/item/滨海湾金沙/60657147?fromModule=lemma_inlink)      |
| tk-station     | 东京站           | [百度百科](https://bkso.baidu.com/item/东京站/1863771?fromModule=lemma_inlink)           |
| ld-towerbridge | 伦敦塔桥         | [百度百科](https://bkso.baidu.com/item/伦敦塔桥/360449?fromModule=lemma_inlink)          |
| rm-pantheon    | 万神庙           | [百度百科](https://wapbaike.baidu.com/item/万神庙/10451365)                              |
| pa-notredame   | 巴黎圣母院       | [百度百科](https://wapbaike.baidu.com/item/巴黎圣母院/5586)                              |
| bj-courtyard   | 北京四合院       | [百度百科](https://wapbaike.baidu.com/item/北京四合院/2346166?page=160001&st=1)          |
| bj-zun         | 北京中信大厦     | [百度百科](https://bkso.baidu.com/item/北京中信大厦/23605023?fromModule=lemma_inlink)    |
| pa-triumph     | 凯旋门           | [百度百科](https://bkso.baidu.com/item/凯旋门/11999994?fromModule=lemma_inlink)          |
| pa-louvre      | 卢浮宫           | [百度百科](https://bkso.baidu.com/item/卢浮宫/163199?fromModule=lemma_inlink)            |

## 保留原来源

以下建筑尚未核实到匹配的百度词条（包括搜索歧义、检索未找到以及读取受限），继续使用已有的维基百科来源。上海环球金融中心、滨海艺术中心的检索入口仅提供编号 `0`，未据此生成主站链接。

- bj-cctv（央视总部大楼）、bj-drum（鼓楼）
- db-burj-al-arab（帆船酒店）、db-courtyard（庭院住宅）、db-emirates（阿联酋双塔）、db-fahidi（法希迪风塔街区）、db-frame（迪拜相框）、db-future（未来博物馆）、db-khalifa（哈利法塔）、db-mosque（朱美拉清真寺）、db-saeed（谢赫赛义德故居）、db-souk（传统市集）、db-windtower（风塔民居）
- hk-blue（蓝屋）、hk-boc（中银大厦）、hk-clock（尖沙咀钟楼）、hk-cluster（村屋群）、hk-house（乡村民居）、hk-hsbc（汇丰总行大厦）、hk-ifc（国际金融中心二期）、hk-temple（天后庙）、hk-tonglau（唐楼街区）
- ld-battersea（巴特西发电站）、ld-bigben（伊丽莎白塔（大本钟））、ld-buckingham（白金汉宫）、ld-covent（考文特花园市场）、ld-eye（伦敦眼）、ld-mews（马厩巷住宅）、ld-shard（碎片大厦）、ld-stpauls（圣保罗大教堂）、ld-telephone（红电话亭街角）、ld-terrace（砖砌排屋）
- ny-brooklyn（布鲁克林大桥）、ny-brownstone（褐石屋）、ny-chrysler（克莱斯勒大厦）、ny-flatiron（熨斗大厦）、ny-grandcentral（中央车站）、ny-liberty（自由女神像）、ny-onewtc（世界贸易中心一号楼）、ny-row（褐石联排）、ny-tenement（消防梯公寓）、ny-watertank（屋顶水塔公寓）
- pa-apartment（奥斯曼公寓）、pa-block（奥斯曼街区）、pa-cafe（街角咖啡馆）、pa-eiffel（埃菲尔铁塔）、pa-garnier（巴黎歌剧院）、pa-invalides（荣军院）、pa-sacrecoeur（圣心堂）、pa-vosges（孚日广场楼群）
- rm-aqueduct（高架引水渠）、rm-castel（圣天使堡）、rm-colosseum（斗兽场）、rm-domus（罗马庭院住宅）、rm-forum（罗马广场遗迹）、rm-insula（古罗马公寓）、rm-stpeters（圣彼得大教堂）、rm-trastevere（特拉斯提弗列民居）、rm-trevi（特雷维喷泉）、rm-vittoriano（维托里亚诺纪念堂）
- sh-bund（外滩万国建筑）、sh-jinmao（金茂大厦）、sh-lilong（里弄联排）、sh-longtang（弄堂街区）、sh-pearl（东方明珠）、sh-swfc（环球金融中心）、sh-tower（上海中心大厦）、sh-yuyuan（豫园水榭）
- sz-bamboo（春笋）、sz-dapeng（大鹏所城）、sz-factory（三来一补厂房）、sz-handshake（城中村握手楼）、sz-itc（国贸大厦）、sz-weiwu（客家围屋）
- sg-artscience（艺术科学博物馆）、sg-bungalow（黑白洋房）、sg-esplanade（滨海艺术中心）、sg-gallery（国家美术馆）、sg-merlion（鱼尾狮）、sg-raffles（莱佛士酒店）、sg-shophouse（娘惹店屋）、sg-supertrees（擎天树）、sg-terrace（店屋街区）
- sy-centralpark（中央公园大楼）、sy-cottage（砂岩小屋）、sy-harbourbridge（海港大桥）、sy-opera（悉尼歌剧院）、sy-qvb（维多利亚女王大厦）、sy-stmarys（圣玛丽大教堂）、sy-terrace（联排住宅）、sy-townhall（悉尼市政厅）、sy-university（悉尼大学钟楼）、sy-warehouse（岩石区仓库）、sy-wharf（码头棚屋）
- tk-diet（国会议事堂）、tk-kaminarimon（浅草寺雷门）、tk-machiya（町屋）、tk-nagaya（长屋街巷）、tk-sensoji（浅草寺本堂与五重塔）、tk-sento（钱汤）、tk-shotengai（商店街）、tk-skytree（东京晴空塔）、tk-tocho（东京都厅）、tk-tower（东京塔）
