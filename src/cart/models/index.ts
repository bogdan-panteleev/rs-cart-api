export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type CartItem = {
  // product: Product,
  productId: string;
  count: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
};
