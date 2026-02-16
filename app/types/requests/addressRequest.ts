export interface AddressRequest {
  id?: string; // Optional: Address ID (required for update, not included for create)
  userId?: string; // Optional: User ID (can also be extracted from JWT token)
  type: string; // Required: Address type (e.g., "HOME", "WORK", "OTHER")
  street?: string | null; // Optional: Street address
  building?: string | null; // Optional: Building name/number
  zipCode?: string | null; // Optional: ZIP/Postal code
  apartmentName?: string | null; // Optional: Apartment name
  apartmentNumber?: string | null; // Optional: Apartment number
  floorNumber?: string | null; // Optional: Floor number
  landmark?: string | null; // Optional: Nearby landmark
  directions?: string | null; // Optional: Directions to the address
  contactPhone?: string | null; // Optional: Contact phone number
  contactPerson?: string | null; // Optional: Contact person name
}
