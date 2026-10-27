import type { CartItem } from "@/lib/cart-store";

export type PaymentMethod = "UPI" | "Card" | "Cash on delivery";

export type CheckoutDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  payment: PaymentMethod;
};

export type PlacedOrder = {
  number: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  coupon?: string;
  total: number;
  details: CheckoutDetails;
};

const ORDER_KEY = "lotus-order";

export function saveOrder(order: PlacedOrder) {
  window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function readOrder(): PlacedOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ORDER_KEY);
    if (!raw) return null;
    const order = JSON.parse(raw) as PlacedOrder;
    if (!order?.number || !Array.isArray(order.items)) return null;
    return order;
  } catch {
    return null;
  }
}

export function createOrderNumber() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `LL-${digits}`;
}
