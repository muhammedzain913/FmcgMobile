import { BaseLocation } from "../location";

export interface LocationResponse extends BaseLocation {
  id: string;
  userId: string;
}