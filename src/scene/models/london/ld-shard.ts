import type { Factory } from "../../kit";
import * as T from "three";
import { loft } from "../../architecture";

/**
 * The Shard / London Bridge Tower (Renzo Piano, 309.6 m).
 *
 * Eight extra-white glass planes lean inward at different angles and never
 * touch — the gaps are the winter-garden "fractures". Occupied floors stop
 * at the observatory (~79% of height); above that the shards continue as
 * unequal blades around an open steel radiator. An east backpack thickens
 * the lower fifth so the tower meets the irregular site.
 */
export const ldShardFactory: Factory = (k, g) => {
  const glass = [
    "#b7cdd4",
    "#c8d8da",
    "#a8c2ca",
    "#d2dee0",
    "#b0c6ce",
    "#cfdce0",
    "#9eb8c2",
    "#c4d4d8",
  ];
  const core = "#8fa8b0";
  const mullion = "#e4eeea";
  const steel = "#c5cfcb";

  const apex = 2.6;
  // 244.3 / 309.6 — occupied core and observatory, then open blades.
  const observatory = 2.05;

  // Mid-angle from +Z (A elevation), angular span, base radius, tip
  // height as a fraction of apex, tip radius. Spans leave ~5° fracture slots.
  const shards = [
    { a: 0.0, span: 0.76, r0: 0.37, ht: 1.0, r1: 0.04 },
    { a: 0.84, span: 0.7, r0: 0.41, ht: 0.84, r1: 0.046 },
    { a: 1.62, span: 0.74, r0: 0.39, ht: 0.96, r1: 0.034 },
    { a: 2.42, span: 0.66, r0: 0.35, ht: 0.78, r1: 0.044 },
    { a: 3.16, span: 0.76, r0: 0.36, ht: 0.98, r1: 0.036 },
    { a: 3.96, span: 0.68, r0: 0.34, ht: 0.86, r1: 0.048 },
    { a: 4.74, span: 0.74, r0: 0.38, ht: 0.93, r1: 0.038 },
    { a: 5.54, span: 0.7, r0: 0.35, ht: 0.76, r1: 0.05 },
  ];

  const xz = (r: number, a: number): [number, number] => [
    Math.sin(a) * r,
    Math.cos(a) * r,
  ];
  const polar = (r: number, a: number, y: number): [number, number, number] => [
    Math.sin(a) * r,
    y,
    Math.cos(a) * r,
  ];

  const quad = (
    a: number[],
    b: number[],
    c: number[],
    d: number[],
    out: number[],
  ) => out.push(...a, ...b, ...c, ...a, ...c, ...d);

  // Darker occupied core visible in the fractures; stops at the observatory
  // so the crown reads as open blades rather than a closed pyramid.
  loft(
    k,
    g,
    "ld-shard-core",
    [
      {
        y: 0,
        points: shards.map((s) => xz(s.r0 * 0.92, s.a)),
      },
      {
        y: observatory,
        points: shards.map((s) => {
          const t = observatory / (apex * s.ht);
          const r = s.r0 + (s.r1 - s.r0) * Math.min(1, t);
          return xz(r * 0.9, s.a);
        }),
      },
    ],
    core,
  );

  // Independent glass blades — each is its own plane, so neighbours never meet.
  shards.forEach((s, i) => {
    const a0 = s.a - s.span / 2;
    const a1 = s.a + s.span / 2;
    const h = apex * s.ht;
    const thick = 0.014;
    const nx = Math.sin(s.a);
    const nz = Math.cos(s.a);
    const inset = (p: [number, number, number]): [number, number, number] => [
      p[0] - nx * thick,
      p[1],
      p[2] - nz * thick,
    ];
    const o0 = polar(s.r0, a0, 0);
    const o1 = polar(s.r0, a1, 0);
    const o2 = polar(s.r1, a1, h);
    const o3 = polar(s.r1, a0, h);
    const i0 = inset(o0);
    const i1 = inset(o1);
    const i2 = inset(o2);
    const i3 = inset(o3);
    const geo = k.geometry("ld-shard-blade-" + i, () => {
      const p: number[] = [];
      quad(o0, o1, o2, o3, p);
      quad(i1, i0, i3, i2, p);
      quad(o1, i1, i2, o2, p);
      quad(i0, o0, o3, i3, p);
      quad(o3, o2, i2, i3, p);
      quad(o0, i0, i1, o1, p);
      const a = new T.BufferGeometry();
      a.setAttribute("position", new T.Float32BufferAttribute(p, 3));
      a.computeVertexNormals();
      return a;
    });
    k.mesh(g, geo, glass[i]);

    // Grouped vertical mullions on the same plane as the glass.
    for (let m = 0; m < 3; m++) {
      const u = (m + 1) / 4;
      // Sample the blade chord so ribs do not float off its flat surface.
      const point = (v: number): [number, number, number] => {
        const left = o0.map((n, j) => n + (o3[j] - n) * v);
        const right = o1.map((n, j) => n + (o2[j] - n) * v);
        return [
          left[0] + (right[0] - left[0]) * u + nx * 0.004,
          h * v,
          left[2] + (right[2] - left[2]) * u + nz * 0.004,
        ];
      };
      k.beam(g, point(0.008), point(0.992), 0.008, mullion);
    }
  });

  // Closed glass skirt at grade — fractures stay as slots, not a cave.
  loft(
    k,
    g,
    "ld-shard-plinth",
    [
      { y: 0, points: shards.map((s) => xz(s.r0 * 0.98, s.a)) },
      { y: 0.08, points: shards.map((s) => xz(s.r0 * 0.94, s.a)) },
    ],
    "#c5d4d8",
  );

  // East backpack: office plates pushed to the site edge, ~16–19 storeys.
  const packH = 0.5;
  const packR = 0.47;
  const packA0 = 1.3;
  const packA1 = 1.86;
  {
    const o0 = polar(packR, packA0, 0);
    const o1 = polar(packR, packA1, 0);
    const o2 = polar(0.22, packA1, packH);
    const o3 = polar(0.22, packA0, packH);
    const nx = Math.sin(1.58);
    const nz = Math.cos(1.58);
    const inset = (p: [number, number, number]): [number, number, number] => [
      p[0] - nx * 0.03,
      p[1],
      p[2] - nz * 0.03,
    ];
    const i0 = inset(o0);
    const i1 = inset(o1);
    const i2 = inset(o2);
    const i3 = inset(o3);
    const geo = k.geometry("ld-shard-backpack", () => {
      const p: number[] = [];
      quad(o0, o1, o2, o3, p);
      quad(i1, i0, i3, i2, p);
      quad(o1, i1, i2, o2, p);
      quad(i0, o0, o3, i3, p);
      quad(o3, o2, i2, i3, p);
      quad(o0, i0, i1, o1, p);
      const a = new T.BufferGeometry();
      a.setAttribute("position", new T.Float32BufferAttribute(p, 3));
      a.computeVertexNormals();
      return a;
    });
    k.mesh(g, geo, "#c5d6da");
    for (const u of [0.3, 0.7]) {
      k.beam(
        g,
        [
          o0[0] + (o1[0] - o0[0]) * u + nx * 0.004,
          0,
          o0[2] + (o1[2] - o0[2]) * u + nz * 0.004,
        ],
        [
          o3[0] + (o2[0] - o3[0]) * u + nx * 0.004,
          packH,
          o3[2] + (o2[2] - o3[2]) * u + nz * 0.004,
        ],
        0.01,
        mullion,
      );
    }
  }

  // Exposed steel "radiator" decks in the open crown above the observatory.
  for (const [y, s] of [
    [2.12, 0.09],
    [2.28, 0.07],
    [2.42, 0.05],
  ] as const) {
    k.box(g, s, 0.012, s, steel, 0, y);
  }
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + 0.2;
    k.box(
      g,
      0.01,
      0.42 - (i % 3) * 0.07,
      0.004,
      steel,
      Math.sin(a) * 0.03,
      observatory + 0.24 - (i % 3) * 0.03,
      Math.cos(a) * 0.03,
    );
  }
};
