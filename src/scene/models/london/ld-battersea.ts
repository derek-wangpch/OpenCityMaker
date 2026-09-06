import type { Factory } from "../../kit";
export const ldBatterseaFactory: Factory = (k, g) => {
  k.box(g, 0.65, 0.77, 1.02, "#aa795b");
  for (const x of [-0.49, 0.49]) {
    k.box(g, 0.32, 0.48, 1.03, "#b88665", x, 0.24);
    k.box(g, 0.34, 0.045, 1.05, "#7e8982", x, 0.5);
    for (const z of [-0.41, 0.41]) {
      k.box(g, 0.2, 0.71, 0.23, "#ae7e5e", x, 0.49, z);
      k.box(g, 0.23, 0.055, 0.25, "#d4b38b", x, 0.87, z);
      k.cylinder(g, 0.077, 0.66, "#e1d9bf", x, 1.22, z, 0.057);
      k.cylinder(g, 0.06, 0.04, "#eae1c7", x, 1.56, z);
    }
    for (const z of [-0.27, 0, 0.27])
      k.box(g, 0.018, 0.25, 0.09, "#68787a", Math.sign(x) * 0.659, 0.27, z);
  }
  k.box(g, 0.68, 0.04, 1.04, "#8c958a", 0, 0.79);
  for (const z of [-0.522, 0.522])
    for (const x of [-0.22, 0, 0.22]) {
      k.box(g, 0.072, 0.43, 0.016, "#68787a", x, 0.39, z);
      k.box(g, 0.035, 0.63, 0.024, "#c2916d", x + 0.09, 0.4, z);
    }
};
