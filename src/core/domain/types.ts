export type OrderStatus = "completed" | "cancelled";

export interface Product {
  id: string;
  name: string;
}

export interface OrderEntry {
  id: string;
  quantity: number;
}

export interface CompletedOrder {
  orderId: string;
  customerId: string;
  entries: OrderEntry[];
  date: string;
  status: "completed";
}

export interface CancelledOrder {
  orderId: string;
  customerId?: string;
  entries?: OrderEntry[];
  date: string;
  status: "cancelled";
}

export type Order = CompletedOrder | CancelledOrder;

export interface ProductSalesTotal {
  productId: string;
  productName: string;
  salesCount: number;
}

export interface SizzlingHotDailyResult {
  date: string;
  productId: string | null;
  productName: string | null;
  salesCount: number;
  totals: ProductSalesTotal[];
}

export interface SizzlingHotPeriodResult {
  startDate: string;
  endDate: string;
  productId: string | null;
  productName: string | null;
  salesCount: number;
  totals: ProductSalesTotal[];
}

export interface SizzlingHotProductsResult {
  today: string;
  daily: SizzlingHotDailyResult[];
  period: SizzlingHotPeriodResult;
}

export interface SizzlingHotProductsInput {
  products: Product[];
  orders: Order[];
  today?: string;
}
