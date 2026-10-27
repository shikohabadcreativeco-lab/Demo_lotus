export type ProductCategory = {
  slug: string;
  name: string;
  summary: string;
  detail: string;
  image: string;
  alt: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: "table-lamps",
    name: "Table Lamps",
    summary: "Warm light for side tables, consoles, and quiet corners.",
    detail:
      "Table lamps for homes, offices, showrooms, and stores will appear here once they are listed.",
    image: "/images/home/living-room.jpg",
    alt: "Living room with warm table lamps",
  },
  {
    slug: "floor-lamps",
    name: "Floor Lamps",
    summary: "Standing lights that shape a room without a ceiling install.",
    detail:
      "Floor lamps for homes, offices, and showrooms will appear here once they are listed.",
    image: "/images/home/cta-lamp.jpg",
    alt: "Sculptural lamp glowing in a dark room",
  },
  {
    slug: "pendant-lights",
    name: "Pendant Lights",
    summary: "Hung lights for dining tables, islands, and entryways.",
    detail:
      "Pendants sized for dining and kitchen islands will appear here once they are listed.",
    image: "/images/home/dining-room.jpg",
    alt: "Dining area with warm hanging light",
  },
  {
    slug: "wall-lights",
    name: "Wall Lights",
    summary: "Sconces that wash a wall and free up the floor.",
    detail:
      "Wall lights for homes, offices, showrooms, and stores will appear here once they are listed.",
    image: "/images/home/bedroom.jpg",
    alt: "Bedroom with soft bedside lighting",
  },
  {
    slug: "desk-lamps",
    name: "Desk Lamps",
    summary: "Focused light for an office desk, a counter, or a study.",
    detail:
      "Desk lamps for workspaces and reading will appear here once they are listed.",
    image: "/images/home/workspace.jpg",
    alt: "Desk with a sculptural lamp and a plant",
  },
  {
    slug: "ceiling-lights",
    name: "Ceiling Lights",
    summary: "Overhead fixtures for homes, offices, showrooms, and stores.",
    detail:
      "Ceiling lights for whole-room illumination will appear here once they are listed.",
    image: "/images/home/promo-lamp.jpg",
    alt: "Black dome lamp glowing over a dark table",
  },
];

export function getCategory(slug: string) {
  return productCategories.find((category) => category.slug === slug);
}
