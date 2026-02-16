export interface AddressResponse {
  id: string;
  userId: string;
  type: string;
  label?: string | null;
  isDefault?: boolean;
  street?: string | null;
  building?: string | null;
  zipCode?: string | null;
  apartmentName?: string | null;
  apartmentNumber?: string | null;
  flatNumber?: string | null;
  floorNumber?: string | null;
  landmark?: string | null;
  directions?: string | null;
  contactPhone?: string | null;
  contactPerson?: string | null;
  deliveryInstructions?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    location?: {
      governorate?: {
        id: string;
        name: string;
      };
      city?: {
        id: string;
        name: string;
      };
      block?: {
        id: string;
        name: string;
      };
    };
  };
}
