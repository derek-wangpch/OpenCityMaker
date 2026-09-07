// Run the actual generated bundle with wx only: no window/document/crypto/IndexedDB.
import vm from "node:vm";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const callbacks = {};
let value,
  texts = [],
  modalConfirm = false;
const ctx = {
  scale() {},
  beginPath() {},
  ellipse() {},
  fill() {},
  fillRect() {},
  fillText(text) {
    texts.push(text);
  },
};
const touch = (x, y) => ({ identifier: 1, clientX: x, clientY: y });
const wx = {
  createCanvas: () => ({ getContext: () => ctx }),
  getWindowInfo: () => ({
    windowWidth: 390,
    windowHeight: 844,
    pixelRatio: 3,
    safeArea: { top: 47, bottom: 810 },
  }),
  getMenuButtonBoundingClientRect: () => ({ bottom: 80 }),
  getStorageSync: () => structuredClone(value),
  setStorageSync: (_, next) => {
    value = structuredClone(next);
  },
  showModal: ({ success, complete }) => {
    success({ confirm: modalConfirm });
    complete();
  },
};
for (const event of [
  "TouchStart",
  "TouchEnd",
  "TouchCancel",
  "Hide",
  "Show",
  "WindowResize",
])
  wx[`on${event}`] = (fn) => {
    callbacks[event] = fn;
  };
const source = readFileSync(
  new URL("../dist-wechat/game.js", import.meta.url),
  "utf8",
);
vm.runInNewContext(source, { wx }, { timeout: 5000 });
assert(texts.includes("CityMaker · 小游戏验证版"));
callbacks.Hide();
value.progress[0].run = {
  board: [2, 2, ...Array(14).fill(0)],
  score: 0,
  undo: null,
  status: "playing",
};
vm.runInNewContext(source, { wx }, { timeout: 5000 });
const gesture = (a, b) => {
  callbacks.TouchStart({ touches: [a] });
  callbacks.TouchEnd({ changedTouches: [b] });
};
gesture(touch(250, 250), touch(60, 250));
assert.equal(value.progress[0].run.score, 4);
// At 390x844: top 88, board y168, size366, buttons y578..622.
gesture(touch(70, 600), touch(70, 600));
assert.equal(value.progress[0].run.score, 0);
assert.deepEqual(value.progress[0].run.board.slice(0, 2), [2, 2]);
gesture(touch(195, 600), touch(195, 600));
assert.deepEqual(value.progress[0].run.board.slice(0, 2), [2, 2]);
modalConfirm = true;
gesture(touch(195, 600), touch(195, 600));
assert.equal(value.progress[0].run.undo, null);
gesture(touch(320, 600), touch(320, 600));
assert.equal(value.city, 1);
// Exercise every city in the actual wx-only bundle, including a last-city reload.
const names = [
  "北京",
  "香港",
  "上海",
  "深圳",
  "东京",
  "新加坡",
  "迪拜",
  "悉尼",
  "纽约",
  "巴黎",
  "伦敦",
  "罗马",
];
assert.equal(value.progress.length, names.length);
for (let i = 2; i < names.length; i++) {
  texts = [];
  gesture(touch(320, 600), touch(320, 600));
  assert.equal(value.city, i);
  assert(texts.some((text) => text.includes(names[i])));
}
vm.runInNewContext(source, { wx }, { timeout: 5000 });
assert.equal(value.city, 11);
gesture(touch(320, 600), touch(320, 600));
assert.equal(value.city, 0);
callbacks.Hide();
texts = [];
callbacks.WindowResize();
assert.equal(texts.length, 0);
callbacks.Show();
assert(texts.length > 0);
// Cycle every weather mode and check the persisted state and repainted label.
assert.equal(value.weather, undefined);
for (const [kind, label] of [
  ["cloudy", "多云"],
  ["rain", "雨"],
  ["snow", "雪"],
  ["fog", "雾"],
  ["off", "关闭"],
  ["clear", "晴"],
]) {
  texts = [];
  gesture(touch(348, 107), touch(348, 107));
  assert.equal(value.weather, kind);
  assert(texts.includes(label));
}
// Switching out of snowy Beijing normalizes Hong Kong before the next draw/save.
for (let i = 0; i < 3; i++) gesture(touch(348, 107), touch(348, 107));
assert.equal(value.weather, "snow");
gesture(touch(320, 600), touch(320, 600));
assert.equal(value.city, 1);
assert.equal(value.weather, "clear");
for (const kind of ["cloudy", "rain", "fog", "off"]) {
  gesture(touch(348, 107), touch(348, 107));
  assert.equal(value.weather, kind);
}
callbacks.Hide();

// Exercise the actual automatic timer in Singapore. With all weather modes,
// random=0.5 would choose snow; the city's filtered choices must select rain.
value.city = 5;
value.weather = "clear";
const pending = [];
vm.runInNewContext(
  source,
  {
    wx,
    Math: Object.assign(Object.create(Math), { random: () => 0.5 }),
    setTimeout: (callback) => {
      pending.push(callback);
      return pending.length;
    },
  },
  { timeout: 5000 },
);
for (let i = 0; i < 700; i++) {
  assert.equal(pending.length, 1);
  pending.shift()();
}
assert.equal(value.city, 5);
assert.equal(value.weather, "rain");
callbacks.Hide(); // any pending weather tick chain must end so Node can exit
pending.shift()();
assert.equal(pending.length, 0);
console.log(
  "Built bundle passed: wx-only boot, swipe/merge, undo, restart cancel/confirm, city persistence, hide/show/resize, city-specific manual and automatic weather.",
);
