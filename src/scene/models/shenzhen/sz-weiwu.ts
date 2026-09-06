import type { Factory } from "../../kit";
import { EARTH, GREY, TRIM, simpleRoof, pyramid } from "./shared";

const DOOR = "#5c4a3c"; // timber leaf, matching the Hakka house door
const OPENING = "#4c4238"; // shadow inside wall openings, as in sz-dapeng
const RED = "#a45a44"; // festive couplet scrolls flanking the gate

export const szWeiwuFactory: Factory = (k, g) => {
  // 鹤湖新居-style 回字形 compound: two concentric rammed-earth rings, tile
  // copings, four corner blockhouses, and one axis running arched gate (门) →
  // 望楼 watchtower → ancestral hall at the rear. Front = +z, facing the path.
  const [OW, OD, OH] = [1.5, 1.42, 0.34];
  const [IW, ID, IH] = [0.94, 0.86, 0.26];
  const r = 0.13; // gate half-width == arch radius; arch springs at y = 0.13
  const front = OD / 2 + 0.04; // outer wall's outer face (z = 0.75)

  // Outer ring: sides and back are solid; the front wall is split around the
  // gate opening so the passage reads as a hole, not a painted arch.
  for (const side of [-1, 1]) {
    k.box(g, 0.08, OH, OD, EARTH, (side * OW) / 2, OH / 2);
    if (side === 1) k.box(g, OW, OH, 0.08, EARTH, 0, OH / 2, -OD / 2);
    k.box(
      g,
      OW / 2 - r,
      OH,
      0.08,
      EARTH,
      side * (OW / 4 + r / 2),
      OH / 2,
      OD / 2,
    );
  }
  // Inner ring keeps all four walls; the 望楼 below straddles its front-center.
  for (const side of [-1, 1]) {
    k.box(g, 0.08, IH, ID, EARTH, (side * IW) / 2, IH / 2);
    k.box(g, IW, IH, 0.08, EARTH, 0, IH / 2, (side * ID) / 2);
  }
  // Grey tile copings overhang every wall top, as along the real frontage.
  for (const side of [-1, 1]) {
    k.box(g, 0.11, 0.03, OD + 0.03, GREY, (side * OW) / 2, OH + 0.015, 0);
    k.box(g, 0.11, 0.03, ID + 0.03, GREY, (side * IW) / 2, IH + 0.015, 0);
    if (side === 1)
      k.box(g, OW + 0.03, 0.03, 0.11, GREY, 0, OH + 0.015, -OD / 2);
    k.box(g, IW + 0.03, 0.03, 0.11, GREY, 0, IH + 0.015, (-side * ID) / 2);
    // Front copings split around the gate (outer) and the 望楼 (inner).
    k.box(
      g,
      OW / 2 - r + 0.02,
      0.03,
      0.11,
      GREY,
      side * (OW / 4 + r / 2),
      OH + 0.015,
      OD / 2,
    );
  }
  // Coping bridge carrying the tile band across the gate bay.
  k.box(g, 2 * r + 0.04, 0.03, 0.11, GREY, 0, OH + 0.015, OD / 2);

  // Stone jambs flank the opening; voussoirs ride the semicircle while the
  // haunches above are filled with wall, so the hole keeps its round head
  // (same trick as sz-dapeng's rampart).
  for (const side of [-1, 1])
    k.box(g, 0.045, 0.13, 0.1, GREY, side * (r + 0.022), 0.065, OD / 2);
  for (let i = 0; i < 9; i++) {
    const a = ((i + 0.5) * Math.PI) / 9; // 10°..170°, both halves
    const x = Math.cos(a) * r;
    const y = 0.13 + Math.sin(a) * r;
    k.box(g, 0.058, 0.058, 0.1, GREY, x, y, OD / 2);
    const fill = OH - y - 0.029;
    if (fill > 0.02)
      k.box(g, 0.058, fill, 0.08, EARTH, x, OH - fill / 2, OD / 2);
  }

  // Dark passage shadow behind, timber leaf in front of it, both recessed
  // inside the wall mouth so the doorway reads with depth.
  k.box(g, 2 * r, 0.29, 0.04, OPENING, 0, 0.145, OD / 2 - 0.03);
  k.box(g, 0.21, 0.25, 0.02, DOOR, 0, 0.125, front - 0.03);

  // Stone plaque above the arch, flanked by red couplet scrolls and a
  // threshold step where the path meets the gate.
  k.box(g, 0.3, 0.062, 0.02, TRIM, 0, 0.305, front + 0.008);
  k.box(g, 0.23, 0.034, 0.008, OPENING, 0, 0.305, front + 0.024);
  for (const side of [-1, 1])
    k.box(g, 0.034, 0.15, 0.012, RED, side * (r + 0.055), 0.095, front + 0.006);
  k.box(g, 0.32, 0.02, 0.05, TRIM, 0, 0.01, front + 0.025);

  // 望楼: watchtower straddling the inner gate on the axis, kept below the
  // corner-tower crown line.
  k.box(g, 0.26, 0.52, 0.16, EARTH, 0, 0.26, ID / 2);
  k.box(g, 0.18, 0.24, 0.014, GREY, 0, 0.12, ID / 2 + 0.086);
  k.box(g, 0.12, 0.18, 0.012, DOOR, 0, 0.09, ID / 2 + 0.094);
  pyramid(k, g, 0.17, 0.12, GREY, 0, 0.52, ID / 2);

  // Four corner blockhouses remain the tallest silhouettes of the ring.
  for (const x of [-0.7, 0.7])
    for (const z of [-0.66, 0.66]) {
      k.box(g, 0.19, 0.56, 0.19, "#b08f63", x, 0.28, z);
      pyramid(k, g, 0.16, 0.16, GREY, x, 0.56, z);
    }

  // Ancestral hall: one clear grey pitched roof closes the courtyard axis.
  k.box(g, 0.44, 0.34, 0.34, "#a97f5c", 0, 0.17, -0.16);
  simpleRoof(k, g, 0.48, 0.38, 0.35, 0.13, GREY, 0, -0.16);
};
