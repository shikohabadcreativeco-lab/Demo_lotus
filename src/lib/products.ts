export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  compareAt?: number;
  description: string;
  details: string;
  images: ProductImage[];
  specs: ProductSpec[];
  stock?: number;
};

export const products: Product[] = [
  {
    slug: "arc-table-lamp",
    name: "Arc Table Lamp",
    categorySlug: "table-lamps",
    price: 12400,
    compareAt: 20700,
    description: "A brass arc that throws a warm pool of light across a sofa or console.",
    details:
      "The Arc Table Lamp is sized for a living room side table. The shade tilts, and the base is heavy enough to stay put on a marble or wood top.",
    images: [
      { src: "/images/home/living-room.jpg", alt: "Arc table lamp beside a sofa" },
      { src: "/images/home/cta-lamp.jpg", alt: "Close view of the glowing shade" },
    ],
    specs: [
      { label: "Finish", value: "Brushed brass" },
      { label: "Height", value: "58 cm" },
      { label: "Bulb", value: "E27, up to 12W" },
      { label: "Material", value: "Brass and linen" },
    ],
  },
  {
    slug: "bedside-glow",
    name: "Bedside Glow",
    categorySlug: "table-lamps",
    price: 6800,
    compareAt: 11300,
    description: "A small ceramic lamp with a soft shade for reading in bed.",
    details:
      "Bedside Glow sits low enough for a nightstand. The shade diffuses the bulb so the light stays warm and even.",
    images: [
      { src: "/images/home/bedroom.jpg", alt: "Bedside lamp in a bedroom" },
      { src: "/images/home/promo-lamp.jpg", alt: "Dome shade glowing in a dark room" },
    ],
    specs: [
      { label: "Finish", value: "Warm ceramic" },
      { label: "Height", value: "36 cm" },
      { label: "Bulb", value: "E14, up to 8W" },
      { label: "Material", value: "Ceramic and fabric" },
    ],
  },
  {
    slug: "halo-floor-lamp",
    name: "Halo Floor Lamp",
    categorySlug: "floor-lamps",
    price: 18900,
    compareAt: 31500,
    description: "A standing ring of light for a reading chair or an open corner.",
    details:
      "Halo Floor Lamp needs no ceiling work. The ring sits at eye level and fills a corner without a harsh spotlight.",
    images: [
      { src: "/images/home/cta-lamp.jpg", alt: "Ring lamp glowing on a wooden surface" },
      { src: "/images/home/living-room.jpg", alt: "Warm lamp light in a living room" },
    ],
    specs: [
      { label: "Finish", value: "Matte black" },
      { label: "Height", value: "158 cm" },
      { label: "Bulb", value: "Integrated LED" },
      { label: "Material", value: "Steel" },
    ],
  },
  {
    slug: "pendant-pair",
    name: "Pendant Pair",
    categorySlug: "pendant-lights",
    price: 15200,
    compareAt: 25300,
    description: "Two linen pendants for a dining table or a kitchen island.",
    details:
      "Hang the pair over a table for six. The cords can be trimmed on site so both shades sit at the same height.",
    images: [
      { src: "/images/home/dining-room.jpg", alt: "Warm light over a dining area" },
      { src: "/images/home/promo-lamp.jpg", alt: "Black dome shade glowing" },
    ],
    specs: [
      { label: "Finish", value: "Natural linen" },
      { label: "Drop", value: "Adjustable, up to 150 cm" },
      { label: "Bulb", value: "E27, up to 12W" },
      { label: "Set", value: "Two pendants" },
    ],
  },
  {
    slug: "linen-sconce",
    name: "Linen Sconce",
    categorySlug: "wall-lights",
    price: 8400,
    compareAt: 14000,
    description: "A wall light that washes the wall beside a bed or a mirror.",
    details:
      "Linen Sconce mounts on a single point and throws light up and down. Use a pair on either side of a headboard.",
    images: [
      { src: "/images/home/bedroom.jpg", alt: "Soft light in a bedroom" },
      { src: "/images/home/dining-room.jpg", alt: "Warm wall light in a lounge" },
    ],
    specs: [
      { label: "Finish", value: "Brass and linen" },
      { label: "Width", value: "22 cm" },
      { label: "Bulb", value: "E14, up to 8W" },
      { label: "Mount", value: "Wall" },
    ],
  },
  {
    slug: "sculptural-desk-lamp",
    name: "Sculptural Desk Lamp",
    categorySlug: "desk-lamps",
    price: 7500,
    compareAt: 12500,
    description: "A focused lamp for a desk, with a shade that turns toward the page.",
    details:
      "Sculptural Desk Lamp keeps the light on your work and off the rest of the room. The arm stays where you set it.",
    images: [
      { src: "/images/home/workspace.jpg", alt: "Desk lamp beside a plant" },
      { src: "/images/home/promo-lamp.jpg", alt: "Glowing shade on a dark table" },
    ],
    specs: [
      { label: "Finish", value: "Matte black" },
      { label: "Height", value: "48 cm" },
      { label: "Bulb", value: "E27, up to 10W" },
      { label: "Material", value: "Steel" },
    ],
  },
  {
    slug: "dome-ceiling-light",
    name: "Dome Ceiling Light",
    categorySlug: "ceiling-lights",
    price: 11600,
    compareAt: 19300,
    description: "An overhead dome for the rooms you use every evening.",
    details:
      "Dome Ceiling Light replaces a plain ceiling fitting. The shade hides the bulb and spreads light across the room.",
    images: [
      { src: "/images/home/promo-lamp.jpg", alt: "Black dome light glowing" },
      { src: "/images/home/dining-room.jpg", alt: "Overhead light in a dining room" },
    ],
    specs: [
      { label: "Finish", value: "Matte black" },
      { label: "Diameter", value: "42 cm" },
      { label: "Bulb", value: "E27, up to 15W" },
      { label: "Mount", value: "Ceiling" },
    ],
  },
];

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((product) => product.categorySlug === categorySlug);
}

export function getProduct(categorySlug: string, slug: string) {
  return products.find(
    (product) => product.categorySlug === categorySlug && product.slug === slug,
  );
}
