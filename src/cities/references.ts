import type { Building, Locale } from "./types";

/** Verified Baidu entries. Unlisted models retain their configured reference. */
export const baiduReferences: Readonly<Partial<Record<string, string>>> = {
  "bj-cwt": "https://baike.baidu.com/item/国贸大厦A座/61263940",
  "bj-gate": "https://baike.baidu.com/item/北京城门/4268838",
  "bj-heaven": "https://baike.baidu.com/item/祈年殿/2034363",
  "bj-house": "https://baike.baidu.com/item/民居/647853",
  "bj-hutong": "https://baike.baidu.com/item/胡同/250397",
  "bj-ncpa": "https://baike.baidu.com/item/国家大剧院/68088165",
  "bj-palace": "https://baike.baidu.com/item/太和殿/2225506",
  "hk-icc": "https://baike.baidu.com/item/环球贸易广场/10458972",
  "hk-walled": "https://baike.baidu.com/item/围村/10016999",
  "ny-empire": "https://baike.baidu.com/item/帝国大厦/771609",
  "sh-peace": "https://baike.baidu.com/item/和平饭店/49918",
  "sh-shikumen": "https://baike.baidu.com/item/石库门/701960",
  "sh-yangfang": "https://baike.baidu.com/item/洋房/10790744",
  "sz-civic": "https://baike.baidu.com/item/市民中心/2687471",
  "sz-diwang": "https://baike.baidu.com/item/深圳地王大厦/4986719",
  "sz-hakka": "https://baike.baidu.com/item/客家民居/615376",
  "sz-kk100": "https://baike.baidu.com/item/京基100大厦/8369773",
  "sz-pingan": "https://baike.baidu.com/item/平安国际金融中心/4521205",
  "sg-hdb": "https://baike.baidu.com/item/组屋/9902050",
  "sg-sands": "https://baike.baidu.com/item/滨海湾金沙/60657147",
  "tk-station": "https://baike.baidu.com/item/东京站/1863771",
  "ld-towerbridge": "https://baike.baidu.com/item/伦敦塔桥/360449",
  "rm-pantheon": "https://baike.baidu.com/item/万神庙/10451365",
  "pa-notredame": "https://baike.baidu.com/item/巴黎圣母院/5586",
  "bj-courtyard": "https://baike.baidu.com/item/北京四合院/2346166",
  "bj-zun": "https://baike.baidu.com/item/北京中信大厦/23605023",
  "pa-triumph": "https://baike.baidu.com/item/凯旋门/11999994",
  "pa-louvre": "https://baike.baidu.com/item/卢浮宫/163199",
};

export function buildingReference(building: Building, locale: Locale): string {
  return (
    (locale === "zh-CN" ? baiduReferences[building.model] : undefined) ??
    building.sources[0]
  );
}
