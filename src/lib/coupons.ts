export const storeCoupons = [
  {
    code: "LOTUS10",
    label: "10% off the lights",
    percent: 10,
    detail: "Takes 10% off the product total. Shipping is calculated after the discount.",
  },
  {
    code: "STUDIO15",
    label: "15% off a studio order",
    percent: 15,
    detail: "For a showroom, office, or store order. Shipping is calculated after the discount.",
  },
  {
    code: "WELCOME5",
    label: "5% off a first order",
    percent: 5,
    detail: "A smaller welcome offer. Shipping is calculated after the discount.",
  },
] as const;

export function quoteCoupon(raw: string, subtotal: number) {
  const code = raw.trim().toUpperCase();
  const coupon = storeCoupons.find((item) => item.code === code);
  if (!coupon) return { ok: false as const, message: "That code is not active." };
  const amount = Math.min(subtotal, Math.round((subtotal * coupon.percent) / 100));
  return { ok: true as const, code: coupon.code, amount, label: coupon.label };
}
