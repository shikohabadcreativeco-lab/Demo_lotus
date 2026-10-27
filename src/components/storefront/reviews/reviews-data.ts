export const rooms = [
  "Living Room",
  "Bedroom",
  "Workspace",
  "Dining Room",
] as const;

export type Room = (typeof rooms)[number];

export type Review = {
  id: string;
  quote: string;
  name: string;
  city: string;
  rating: number;
  room: Room;
  product: string;
};

export const publishedReviews: Review[] = [
  {
    id: "priya",
    quote:
      "Amazing quality and beautiful design. It completely transformed my workspace.",
    name: "Priya S.",
    city: "Bengaluru",
    rating: 5,
    room: "Workspace",
    product: "Sculptural Desk Lamp",
  },
  {
    id: "rahul",
    quote: "Perfect lighting solution for my bedroom. Highly recommended!",
    name: "Rahul K.",
    city: "Mumbai",
    rating: 5,
    room: "Bedroom",
    product: "Bedside Glow",
  },
  {
    id: "ananya",
    quote: "Stylish, durable and easy to install. Worth every penny.",
    name: "Ananya M.",
    city: "Delhi",
    rating: 5,
    room: "Living Room",
    product: "Arc Table Lamp",
  },
  {
    id: "vikram",
    quote:
      "The evening light in our living room feels warmer now. Guests always ask where the lamps are from.",
    name: "Vikram J.",
    city: "Hyderabad",
    rating: 5,
    room: "Living Room",
    product: "Arc Table Lamp",
  },
  {
    id: "meera",
    quote:
      "The glow is lovely. Delivery took a little longer than I expected, but the lamp was worth the wait.",
    name: "Meera T.",
    city: "Pune",
    rating: 4,
    room: "Dining Room",
    product: "Pendant Pair",
  },
  {
    id: "sana",
    quote:
      "Soft enough for late reading and still bright enough to get ready. It looks beautiful on the bedside table.",
    name: "Sana Q.",
    city: "Jaipur",
    rating: 5,
    room: "Bedroom",
    product: "Bedside Glow",
  },
  {
    id: "arjun",
    quote:
      "I wanted a lamp that would not glare on my screen. This one stays calm through long work nights.",
    name: "Arjun P.",
    city: "Chennai",
    rating: 5,
    room: "Workspace",
    product: "Sculptural Desk Lamp",
  },
];

export function reviewSummary(list: Review[]) {
  const total = list.length;
  const average =
    total === 0 ? 0 : list.reduce((sum, review) => sum + review.rating, 0) / total;
  const fiveStar = list.filter((review) => review.rating === 5).length;
  const cities = new Set(list.map((review) => review.city)).size;

  return { total, average, fiveStar, cities };
}
