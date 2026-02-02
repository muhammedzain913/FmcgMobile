


export interface Governorate {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  governorateId: string;
}

export interface Block {
  id: string;
  name: string;
  cityId: string;
}

export interface BaseLocation {
  governorate: Governorate;
  street?: string;
  block: Block;
  city: City;
  phone? :string;
  building? : string
  country: string;
}







