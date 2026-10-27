export type CartItem = {
  slug: string;
  categorySlug: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  quantity: number;
  watt?: string;
  lightColor?: string;
};

const STORAGE_KEY = "lotus-cart";
const CHANGE_EVENT = "lotus-cart-change";
const emptyCart: CartItem[] = [];

let items: CartItem[] = emptyCart;
let loaded = false;

function isItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as CartItem;
  return (
    typeof item.slug === "string" &&
    typeof item.categorySlug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number"
  );
}

function load() {
  if (loaded || typeof window === "undefined") return items;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    items = Array.isArray(parsed) ? parsed.filter(isItem) : emptyCart;
  } catch {
    items = emptyCart;
  }
  return items;
}

function commit(next: CartItem[]) {
  items = next;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => onStoreChange();
  const onStorage = () => {
    loaded = false;
    load();
    onStoreChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function getCart() {
  return load();
}

export function getServerCart() {
  return emptyCart;
}

function sameLine(
  line: CartItem,
  slug: string,
  categorySlug: string,
  watt = "",
  lightColor = "",
) {
  return (
    line.slug === slug &&
    line.categorySlug === categorySlug &&
    (line.watt || "") === watt &&
    (line.lightColor || "") === lightColor
  );
}

export function optionLabel(item: { watt?: string; lightColor?: string }) {
  return [item.watt, item.lightColor].filter(Boolean).join(" · ");
}

export function addItem(item: CartItem) {
  const current = load();
  const watt = item.watt || "";
  const lightColor = item.lightColor || "";
  const index = current.findIndex((line) => sameLine(line, item.slug, item.categorySlug, watt, lightColor));
  const next = [...current];
  if (index === -1) {
    next.push({
      ...item,
      watt: watt || undefined,
      lightColor: lightColor || undefined,
      quantity: Math.min(9, Math.max(1, item.quantity)),
    });
  } else {
    next[index] = {
      ...next[index],
      quantity: Math.min(9, next[index].quantity + item.quantity),
    };
  }
  commit(next);
}

export function setQuantity(
  slug: string,
  categorySlug: string,
  quantity: number,
  watt = "",
  lightColor = "",
) {
  const current = load();
  const next =
    quantity < 1
      ? current.filter((line) => !sameLine(line, slug, categorySlug, watt, lightColor))
      : current.map((line) =>
          sameLine(line, slug, categorySlug, watt, lightColor)
            ? { ...line, quantity: Math.min(9, quantity) }
            : line,
        );
  commit(next);
}

export function removeItem(slug: string, categorySlug: string, watt = "", lightColor = "") {
  commit(load().filter((line) => !sameLine(line, slug, categorySlug, watt, lightColor)));
}

export function clearCart() {
  commit([]);
}

export function subtotalOf(lines: CartItem[]) {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export const FREE_SHIPPING_FROM = 500;
export const SHIPPING_FEE = 99;

export function shippingOf(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}

export function countOf(lines: CartItem[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
