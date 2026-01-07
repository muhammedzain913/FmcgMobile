import { Block } from "./area";

export interface BaseLocation {
  governorate: string;
  street?: string;
  block: Block;
  city: string;
  phone? :string;
  building? : string
  country: string;
}







