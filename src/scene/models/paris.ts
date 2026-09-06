import type { Factory } from "../kit";
import { paCafeFactory } from "./paris/pa-cafe";
import { paApartmentFactory } from "./paris/pa-apartment";
import { paBlockFactory } from "./paris/pa-block";
import { paVosgesFactory } from "./paris/pa-vosges";
import { paGarnierFactory } from "./paris/pa-garnier";
import { paLouvreFactory } from "./paris/pa-louvre";
import { paNotredameFactory } from "./paris/pa-notredame";
import { paSacrecoeurFactory } from "./paris/pa-sacrecoeur";
import { paInvalidesFactory } from "./paris/pa-invalides";
import { paTriumphFactory } from "./paris/pa-triumph";
import { paEiffelFactory } from "./paris/pa-eiffel";
export const parisModels: Record<string, Factory> = {
  "pa-cafe": paCafeFactory,
  "pa-apartment": paApartmentFactory,
  "pa-block": paBlockFactory,
  "pa-vosges": paVosgesFactory,
  "pa-garnier": paGarnierFactory,
  "pa-louvre": paLouvreFactory,
  "pa-notredame": paNotredameFactory,
  "pa-sacrecoeur": paSacrecoeurFactory,
  "pa-invalides": paInvalidesFactory,
  "pa-triumph": paTriumphFactory,
  "pa-eiffel": paEiffelFactory,
};
