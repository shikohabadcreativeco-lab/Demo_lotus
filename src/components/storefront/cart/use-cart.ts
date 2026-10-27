"use client";

import { useSyncExternalStore } from "react";
import { getCart, getServerCart, subscribe } from "@/lib/cart-store";

export function useCart() {
  return useSyncExternalStore(subscribe, getCart, getServerCart);
}
