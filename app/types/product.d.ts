interface Category {
  title : string
}

export interface Product {
  id: string;
  title: string;
  slug: string; 
  salePrice: number;
  description?: string;
  userId : string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  productImages: string[];
  productStock : number;
  unit : number;
  category : Category
}
