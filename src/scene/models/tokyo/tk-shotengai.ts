import type { Factory } from "../../kit";
export const tkShotengaiFactory: Factory = (k, g) => {
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 0.44,
      h = [0.57, 0.68, 0.59][i];
    const color = ["#b46b54", "#c1ab7b", "#73918a"][i];
    k.box(g, 0.43, h, 0.52, "#cfc0a3", x, h / 2, -0.06);
    k.box(g, 0.43, 0.19, 0.035, color, x, h - 0.1, 0.218);
    k.box(g, 0.45, 0.035, 0.57, "#646c6d", x, h + 0.01, -0.06);
    k.box(g, 0.3, 0.23, 0.025, "#526975", x, 0.14, 0.213);
    k.box(g, 0.41, 0.055, 0.22, color, x, 0.34, 0.31);
    for (const dx of [-0.13, 0, 0.13])
      k.box(g, 0.06, 0.058, 0.225, "#eadfc9", x + dx, 0.342, 0.31);
    k.box(g, 0.075, 0.27, 0.055, "#e4d1aa", x + 0.14, h + 0.045, 0.245);
  }
};
