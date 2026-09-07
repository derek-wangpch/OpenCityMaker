import { Game, type Storage } from "./state";
import { cities } from "../cities/packs";
import { randomWeather, type Weather } from "../game/weather";

type Touch = { identifier: number; clientX: number; clientY: number };
type TouchEvent = { touches: Touch[]; changedTouches: Touch[] };
type WindowInfo = {
  windowWidth: number;
  windowHeight: number;
  pixelRatio: number;
  safeArea?: { top: number; bottom: number };
};
// Narrow platform contract; DOM types describe drawing methods only, no DOM is accessed.
interface Wechat extends Storage {
  createCanvas(): {
    width: number;
    height: number;
    getContext(type: "2d"): CanvasRenderingContext2D | null;
  };
  getWindowInfo?(): WindowInfo;
  getSystemInfoSync(): WindowInfo;
  getMenuButtonBoundingClientRect?(): { bottom: number };
  onTouchStart(fn: (e: TouchEvent) => void): void;
  onTouchEnd(fn: (e: TouchEvent) => void): void;
  onTouchCancel(fn: () => void): void;
  onHide(fn: () => void): void;
  onShow(fn: () => void): void;
  onWindowResize(fn: () => void): void;
  showModal(options: {
    title: string;
    content: string;
    success: (r: { confirm: boolean }) => void;
    complete: () => void;
  }): void;
}
declare const wx: Wechat;
const game = new Game(wx);
const canvas = wx.createCanvas();
const context = canvas.getContext("2d");
if (!context) throw new Error("Canvas 2D unavailable");
const ctx = context;
let width = 0,
  height = 0,
  top = 0,
  bottom = 0,
  boardX = 0,
  boardY = 0,
  size = 0;
let visible = true,
  modal = false;
let start: Touch | undefined;
type Button = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  action: () => void;
};
let buttons: Button[] = [];
// --- diorama weather -------------------------------------------------------
// A tiny 2D cousin of src/scene/weather.ts: rect-only particles so the wx-only
// test harness (whose canvas stub draws nothing but rects) stays honest. The
// tick chain is a self-rescheduling setTimeout that dies on hide/modal,
// so no clearTimeout is ever needed.
const WEATHER_LABELS: Record<Weather, string> = {
  off: "关闭",
  clear: "晴",
  rain: "雨",
  snow: "雪",
  fog: "雾",
  cloudy: "多云",
};
const RAIN_COUNT = 90,
  SNOW_COUNT = 70;
const drops = new Float32Array(RAIN_COUNT * 2);
const flakes = new Float32Array(SNOW_COUNT * 2);
let ticks = 0;
let weatherTimer: ReturnType<typeof setTimeout> | undefined;
/** Deterministic pseudo-random in [0, 1) — same layout on every device. */
const seeded = (i: number, salt: number) =>
  ((Math.imul(i + 1, salt) >>> 0) % 1000) / 1000;
function seedWeather() {
  for (let i = 0; i < drops.length; i += 2) {
    drops[i] = seeded(i, 2654435761) * width;
    drops[i + 1] = seeded(i + 1, 40503) * height;
  }
  for (let i = 0; i < flakes.length; i += 2) {
    flakes[i] = seeded(i, 69069) * width;
    flakes[i + 1] = seeded(i + 1, 40503) * height;
  }
}
function advanceWeather() {
  for (let i = 0; i < drops.length; i += 2) {
    drops[i] = (drops[i] + 3 + width) % width;
    drops[i + 1] += 34;
    if (drops[i + 1] > height) {
      drops[i + 1] -= height + 14;
      drops[i] = seeded(i + ticks, 2654435761) * width;
    }
  }
  for (let i = 0; i < flakes.length; i += 2) {
    flakes[i + 1] += 7;
    if (flakes[i + 1] > height) {
      flakes[i + 1] -= height + 3;
      flakes[i] = seeded(i + ticks, 69069) * width;
    }
  }
}
function drawWeather() {
  const kind = game.state.weather ?? "clear";
  if (kind === "clear" || kind === "off") return;
  if (kind === "rain") {
    ctx.fillStyle = "rgba(40,55,75,0.1)"; // storm dim over the whole screen
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(120,150,175,0.45)";
    for (let i = 0; i < drops.length; i += 2)
      ctx.fillRect(drops[i], drops[i + 1], 2, 14);
  } else if (kind === "snow") {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let i = 0; i < flakes.length; i += 2) {
      const x = (flakes[i] + Math.sin((ticks + i) * 0.7) * 4 + width) % width;
      ctx.fillRect(x, flakes[i + 1], 3, 3);
    }
  } else if (kind === "fog") {
    // Five haze bands stacked over the lower two thirds, thickest at the bottom.
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(223,227,220,${0.28 - i * 0.03})`;
      const band = height * 0.14;
      ctx.fillRect(0, height - band * (i + 1), width, band);
    }
  } else {
    ctx.fillStyle = "rgba(238,242,238,0.62)";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.ellipse(
        width * (0.12 + i * 0.2),
        height * (0.2 + (i % 2) * 0.09),
        48,
        16,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
}
function scheduleWeather() {
  if (
    game.state.weather === "off" ||
    weatherTimer !== undefined ||
    !visible ||
    modal ||
    // The wx-only test sandbox has no timers; the real runtime always does.
    typeof setTimeout !== "function"
  )
    return;
  weatherTimer = setTimeout(weatherTick, 80);
}
function weatherTick() {
  weatherTimer = undefined;
  if (!visible || modal || game.state.weather === "off") return;
  ticks++;
  if (ticks % 700 === 0) {
    game.state.weather = randomWeather(game.state.weather ?? "clear");
    game.save();
  }
  advanceWeather();
  draw();
}
function text(
  value: string,
  x: number,
  y: number,
  font = 16,
  color = "#244d3d",
  maxWidth = width - 24,
) {
  ctx.fillStyle = color;
  ctx.font = `${font}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y, maxWidth);
}
function restart() {
  modal = true;
  start = undefined;
  wx.showModal({
    title: "重新开始？",
    content: "当前城市棋盘将重置，最高分保留。",
    success: (r) => {
      if (r.confirm) {
        game.restart();
        draw();
      }
    },
    complete: () => {
      modal = false;
      start = undefined;
      scheduleWeather(); // the tick chain pauses while a modal is open
    },
  });
}
function draw() {
  if (!visible) return;
  const city = cities[game.state.city];
  ctx.fillStyle = "#f3f0e5";
  ctx.fillRect(0, 0, width, height);
  text("CityMaker · 小游戏验证版", width / 2, top + 18, 21);
  text(
    `${city.name["zh-CN"]}   分数 ${game.current.run.score}   最高 ${game.current.best}`,
    width / 2,
    top + 52,
    15,
  );
  const gap = 6,
    cell = (size - gap * 5) / 4;
  ctx.fillStyle = "#bdc9b8";
  ctx.fillRect(boardX, boardY, size, size);
  game.current.run.board.forEach((value, i) => {
    const x = boardX + gap + (i % 4) * (cell + gap),
      y = boardY + gap + Math.floor(i / 4) * (cell + gap);
    ctx.fillStyle = value
      ? `hsl(${100 - Math.log2(value) * 5}, 35%, ${91 - Math.log2(value) * 3}%)`
      : "#d9dfcf";
    ctx.fillRect(x, y, cell, cell);
    if (value) {
      text(
        String(value),
        x + cell / 2,
        y + cell * 0.38,
        Math.min(28, cell * 0.32),
        "#244d3d",
        cell - 6,
      );
      text(
        city.buildings.find((b) => b.value === value)?.name["zh-CN"] ?? "",
        x + cell / 2,
        y + cell * 0.74,
        Math.min(12, cell * 0.16),
        "#244d3d",
        cell - 6,
      );
    }
  });
  drawWeather();
  const status = game.current.run.status;
  text(
    status === "won"
      ? "已合成 2048！可继续游戏（最高 2048）"
      : status === "lost"
        ? "没有可移动的格子，可撤销或重开"
        : "上下左右滑动，合并相同建筑",
    width / 2,
    boardY + size + 22,
    14,
  );
  const actions = [
    {
      label: game.current.run.undo ? "撤销" : "暂无撤销",
      action: () => game.undo(),
    },
    { label: "重新开始", action: restart },
    { label: "切换城市", action: () => game.nextCity() },
  ];
  if (status === "won")
    actions.unshift({ label: "继续游戏", action: () => game.continue() });
  const bw = (width - 32 - (actions.length - 1) * 8) / actions.length;
  buttons = actions.map((b, i) => ({
    ...b,
    x: 16 + i * (bw + 8),
    y: boardY + size + 44,
    w: bw,
    h: 44,
  }));
  // Compact weather chip beside the title; the main row keeps its geometry so
  // existing tap coordinates stay valid.
  buttons.push({
    label: WEATHER_LABELS[game.state.weather ?? "clear"],
    action: () => game.cycleWeather(),
    x: width - 68,
    y: top + 4,
    w: 52,
    h: 30,
  });
  buttons.forEach((b) => {
    ctx.fillStyle = "#dde4d4";
    ctx.fillRect(b.x, b.y, b.w, b.h);
    text(b.label, b.x + b.w / 2, b.y + b.h / 2, 14, "#244d3d", b.w - 8);
  });
  text(
    game.notice || "离线游玩 · 存档仅限本机",
    width / 2,
    Math.min(bottom - 14, boardY + size + 112),
    12,
  );
  scheduleWeather(); // any repaint with active weather keeps the loop alive
}
function resize() {
  const info = wx.getWindowInfo?.() ?? wx.getSystemInfoSync();
  width = info.windowWidth;
  height = info.windowHeight;
  top =
    Math.max(
      info.safeArea?.top ?? 0,
      wx.getMenuButtonBoundingClientRect?.().bottom ?? 0,
    ) + 8;
  bottom = Math.min(height, info.safeArea?.bottom ?? height);
  const ratio = Math.min(info.pixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.scale(ratio, ratio);
  size = Math.max(80, Math.min(width - 24, bottom - top - 214, 440));
  boardX = (width - size) / 2;
  boardY = top + 80;
  start = undefined;
  seedWeather();
  draw();
}
wx.onTouchStart((e) => {
  if (!visible || modal || e.touches.length !== 1) {
    start = undefined;
    return;
  }
  start = { ...e.touches[0] };
});
wx.onTouchEnd((e) => {
  const origin = start;
  start = undefined;
  if (!origin || modal || !visible) return;
  const end = e.changedTouches.find((t) => t.identifier === origin.identifier);
  if (!end) return;
  const dx = end.clientX - origin.clientX,
    dy = end.clientY - origin.clientY;
  if (Math.hypot(dx, dy) < 18) {
    buttons
      .find((b) =>
        [origin, end].every(
          (p) =>
            p.clientX >= b.x &&
            p.clientX <= b.x + b.w &&
            p.clientY >= b.y &&
            p.clientY <= b.y + b.h,
        ),
      )
      ?.action();
  } else if (
    origin.clientX >= boardX &&
    origin.clientX <= boardX + size &&
    origin.clientY >= boardY &&
    origin.clientY <= boardY + size
  ) {
    game.move(
      Math.abs(dx) > Math.abs(dy)
        ? dx < 0
          ? "left"
          : "right"
        : dy < 0
          ? "up"
          : "down",
    );
  }
  draw();
});
wx.onTouchCancel(() => {
  start = undefined;
});
wx.onHide(() => {
  visible = false;
  start = undefined;
  game.save();
});
wx.onShow(() => {
  visible = true;
  resize();
});
wx.onWindowResize(resize);
resize();
