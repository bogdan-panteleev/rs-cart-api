export type CartItem = {
  // product: Product,
  productId: string;
  count: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
  imageUrl: string;
}

export interface ProductCheckout extends Product {
  orderedCount: number;
  /** orderedCount * price */
  totalPrice: number;
}
