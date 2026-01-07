import { City } from "./area";

export type GovernorateData = {
  governorate: string;
  cities: City[];
};


export type KuwaitLocations = {
  kuwait_locations: GovernorateData[];
};