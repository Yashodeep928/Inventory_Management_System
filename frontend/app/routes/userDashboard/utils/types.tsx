export type OrderStatus = "delivered" | "shipped" | "pending" | "default";

export type Product = {
  product_id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export type OrderRow = {
  order_id: number;
  order_status: OrderStatus;
  order_date: string;
};
