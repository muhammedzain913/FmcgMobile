import { BaseLocation } from "../location";

export interface LocationRequest extends BaseLocation {
  userId: string;
}