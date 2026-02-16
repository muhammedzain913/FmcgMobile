


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
  block: Block;
  city: City;
  country: string;
}







