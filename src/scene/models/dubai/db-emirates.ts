import * as T from "three";
import type { Factory } from "../../kit";
import { loft } from "../../architecture";

/**
 * Emirates Towers (Hazel Wong / NORR, 2000), Sheikh Zayed Road.
 *
 * Twin triangular slabs in silver aluminium cladding — metal is the dominant
 * material, the blue glass lives in horizontal strips down the middle of each
 * broad face between plain silver edge piers and a plain silver base. Both
 * towers share one plan orientation (broad faces parallel, diagonal offset so
 * neither blocks the other) and both crowns are big solid metal blocks whose
 * tops slope down from one front corner; a blade fin and needle rise from the
 * high corner, a copper core drum pokes through the low side beside dark slit
 * windows. The office tower is taller (355 m tip vs 309 m) and greyer, the
 * hotel a touch whiter. Omitted within the tier-9 budget: the curved glass
 * entrance annexes, the office's bowed face and the hotel's chamfered corners,
 * and the drum/slot mirroring across the gap (both drums sit at the same
 * corner here).
 */
export const dbEmiratesFactory: Factory = (k, g) => {
  const metalOffice = "#cfd8dc"; // greyer aluminium cladding
  const metalHotel = "#e4e8ea"; // the hotel reads a step whiter
  const glassOffice = "#567a92"; // darker blue reflective strips
  const glassHotel = "#7fa6ba";
  const slot = "#3e4f59"; // vertical slot windows and crown slits
  const copper = "#917456"; // cylindrical core drum in the crown
  const steel = "#e9ece7"; // blade fin and needle
  const podiumC = "#e8e4da"; // shared two-storey Boulevard podium

  // Shared equilateral-ish plan: broad face to +z, apex away. One unit-height
  // shaft loft serves both towers; per-tower scale sets the height.
  const A = 0.23,
    ZF = 0.22,
    ZB = 0.26;
  const FL: [number, number] = [-A, ZF];
  const FR: [number, number] = [A, ZF];
  const AP: [number, number] = [0, -ZB];
  const pts = [FL, FR, AP];

  /** Solid crown whose top plane falls from the blade corner (FL) to the far
   * edge — the signature sloped metal cap. Built at origin, unit footprint,
   * and positioned per tower. Winding mirrors loft()'s convention. */
  const crownGeo = (key: string, low: number, high: number) =>
    k.geometry(key, () => {
      const lows = pts.map(([x, z]) => [x, 0, z]);
      const tops = [
        [FL[0], high, FL[1]],
        [FR[0], low, FR[1]],
        [AP[0], low, AP[1]],
      ];
      const p: number[] = [];
      const tri = (a: number[], b: number[], c: number[]) =>
        p.push(...a, ...b, ...c);
      for (let i = 0; i < 3; i++) {
        const n = (i + 1) % 3;
        tri(lows[i], tops[i], lows[n]);
        tri(lows[n], tops[i], tops[n]);
      }
      tri(tops[0], tops[1], tops[2]); // sloped roof (CCW from above)
      tri(lows[0], lows[2], lows[1]); // bottom cap (buried at the crown base)
      const geo = new T.BufferGeometry();
      geo.setAttribute("position", new T.Float32BufferAttribute(p, 3));
      geo.computeVertexNormals();
      return geo;
    });

  const tower = (
    x: number,
    z: number,
    hC: number, // crown base = top of the banded shaft
    crownLow: number,
    crownHigh: number,
    tipAboveRoof: number, // blade + needle extension past the high corner
    metal: string,
    glass: string,
    strips: number,
  ) => {
    // Silver shaft: plain base, then horizontal glass strips laid proud of the
    // metal face (never coplanar — the colour step and a hair of relief carry
    // the band rhythm without z-fighting). Spandrels are just bare metal
    // between strips, which is how the real cladding reads.
    const shaft = loft(
      k,
      g,
      `db-em-shaft-${metal}`,
      [
        { y: 0, points: pts },
        { y: 1, points: pts },
      ],
      metal,
    );
    shaft.scale.y = hC;
    shaft.position.set(x, 0, z);

    const zoneBot = hC * 0.14; // plain silver base block, as on the real towers
    const pitch = (hC - zoneBot) / strips;
    for (let i = 0; i < strips; i++)
      k.box(
        g,
        A * 1.06,
        pitch * 0.55,
        0.016,
        glass,
        x,
        zoneBot + (i + 0.5) * pitch,
        z + ZF + 0.004,
      );
    // Dark vertical slot window strip beside the glass zone (gap-side detail
    // on the real broad faces) — a fine line, not a pillar.
    k.box(
      g,
      0.014,
      hC - zoneBot - 0.02,
      0.012,
      slot,
      x + A * 0.72,
      (zoneBot + hC) / 2,
      z + ZF + 0.003,
    );

    // The adjacent elevations have tall glazed fields rather than blank
    // silver slabs. Keep broad silver borders and a few structural bands.
    for (const [a, b] of [
      [FR, AP],
      [AP, FL],
    ]) {
      const dx = b[0] - a[0],
        dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      const nx = -dz / length,
        nz = dx / length;
      const cx = x + (a[0] + b[0]) / 2 + nx * 0.008;
      const cz = z + (a[1] + b[1]) / 2 + nz * 0.008;
      const panel = k.box(
        g,
        length * 0.58,
        hC * 0.72,
        0.015,
        glass,
        cx,
        hC * 0.53,
        cz,
      );
      panel.rotation.y = -Math.atan2(dz, dx);
      for (const f of [0.2, 0.68, 0.87]) {
        const band = k.box(
          g,
          length * 0.62,
          0.027,
          0.022,
          metal,
          cx + nx * 0.005,
          hC * f,
          cz + nz * 0.005,
        );
        band.rotation.y = panel.rotation.y;
      }
    }

    // Sloped metal crown block.
    k.mesh(
      g,
      crownGeo(`db-em-crown-${crownLow}-${crownHigh}`, crownLow, crownHigh),
      metal,
      x,
      hC,
      z,
    );

    // Crown face details: four dark slit windows left of the drum, and a
    // louver hint tucked under the high corner.
    for (let i = 0; i < 4; i++)
      k.box(
        g,
        0.018,
        crownLow * 0.62,
        0.012,
        slot,
        x - 0.075 + i * 0.045,
        hC + crownLow * 0.48,
        z + ZF + 0.005,
      );
    for (let i = 0; i < 3; i++)
      k.box(
        g,
        0.09,
        0.011,
        0.012,
        slot,
        x - A * 0.55,
        hC + crownHigh - 0.045 - i * 0.026,
        z + ZF + 0.005,
      );

    // Copper core drum poking through the low side of the crown; it drops a
    // little below the crown base the way the real cylinder sits in its recess.
    const drumH = crownLow + 0.1;
    k.cylinder(
      g,
      0.044,
      drumH,
      copper,
      x + A * 0.7,
      hC - 0.06 + drumH / 2,
      z + ZF * 0.55,
      0.044,
      12,
    );

    // Blade fin at the high corner with the needle rising out of it — the
    // spike that punctuates every skyline photo of the pair.
    const roofHigh = hC + crownHigh;
    k.box(
      g,
      0.06,
      tipAboveRoof * 0.45,
      0.018,
      steel,
      x + FL[0] * 0.96,
      roofHigh + tipAboveRoof * 0.16,
      z + FL[1] * 0.98,
    );
    k.cylinder(
      g,
      0.011,
      tipAboveRoof * 0.8,
      steel,
      x + FL[0] * 0.96,
      roofHigh + tipAboveRoof * 0.52,
      z + FL[1] * 0.98,
      0.004,
      8,
    );
  };

  // Shared Boulevard podium linking the pair.
  k.box(g, 1.05, 0.08, 0.42, podiumC, 0, 0.04, 0.06);

  // Office tower: taller and greyer. Hotel: shorter, whiter, a step forward so
  // the broad faces never overlap from the default camera (as siting intends).
  tower(-0.35, -0.08, 1.6, 0.19, 0.32, 0.4, metalOffice, glassOffice, 12);
  tower(0.35, 0.16, 1.44, 0.16, 0.28, 0.28, metalHotel, glassHotel, 11);
};
