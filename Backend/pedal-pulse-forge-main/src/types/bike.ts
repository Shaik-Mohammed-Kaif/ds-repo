export interface BikeSpec {
  battery: string;
  range: string;
  topSpeed: string;
  weight: string;
  motor: string;
  charging: string;
}

export interface Bike {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'mountain' | 'city' | 'road' | 'folding';
  image: string;
  images: string[];
  specs: BikeSpec;
  features: string[];
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  bike: Bike;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}