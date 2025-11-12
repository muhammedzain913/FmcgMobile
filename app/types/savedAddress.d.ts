export interface SavedAddress {
  userId : string;  
  firstName: string;
  lastName : string;
  email : string;
  phone: string;
  pinCode: string;
  streetAddress: string;
  city: string;
  state: string;
  district : string;
  country : string;
  label: "Home" | "Shop" | "Office";
}
