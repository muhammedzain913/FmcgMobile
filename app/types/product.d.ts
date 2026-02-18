interface Category {
  title : string
}

export interface Variant {
  id?: string;
  salePrice: number;
  productId: string;
  price: number;
  productStock: number;
  quantity: number;
  // Add other variant-specific fields as needed
}

export interface Product {
  id: string;
  title: string;
  slug: string; 
  description?: string;
  userId : string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  productImages: string[];
  unit : string; // Keep unit at product level if it's not variant-specific
  category : Category;
  variants: Variant[]; // Array of variants
}
