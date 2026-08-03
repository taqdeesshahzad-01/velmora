export type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  shape: "Almond" | "Coffin" | "Square" | "Stiletto";
  length: "Short" | "Medium" | "Long";
  color: "Nude" | "Pink" | "White" | "Red" | "Chrome";
  collection: "Bridal" | "Everyday" | "Statement";
  bestSeller: boolean;
  description: string;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const products: Product[] = [
  {
    slug: "champagne-blush",
    name: "Champagne Blush",
    price: 32,
    image: img("photo-1604654894610-df63bc536371"),
    shape: "Almond",
    length: "Medium",
    color: "Nude",
    collection: "Everyday",
    bestSeller: true,
    description:
      "A soft champagne shimmer with a glass-like finish. Effortless elegance for every day.",
  },
  {
    slug: "rose-gold-veil",
    name: "Rose Gold Veil",
    price: 38,
    image: img("photo-1632345031435-8727f6897d53"),
    shape: "Coffin",
    length: "Long",
    color: "Chrome",
    collection: "Statement",
    bestSeller: true,
    description:
      "Hand-buffed rose gold chrome that catches every light. Made for celebrating.",
  },
  {
    slug: "porcelain-white",
    name: "Porcelain White",
    price: 30,
    image: img("photo-1607779097040-26e80aa78e66"),
    shape: "Square",
    length: "Short",
    color: "White",
    collection: "Everyday",
    bestSeller: true,
    description:
      "A clean, milky white with a satin sheen. Minimal, modern and endlessly wearable.",
  },
  {
    slug: "silk-bridal",
    name: "Silk Bridal",
    price: 45,
    image: img("photo-1636018943673-1ef37f81a2ec"),
    shape: "Almond",
    length: "Long",
    color: "Pink",
    collection: "Bridal",
    bestSeller: true,
    description:
      "Delicate pearl detailing over a sheer blush base. Designed for the moments you keep.",
  },
  {
    slug: "nude-ballet",
    name: "Nude Ballet",
    price: 28,
    image: img("photo-1610992015732-2449b76344bc"),
    shape: "Almond",
    length: "Short",
    color: "Nude",
    collection: "Everyday",
    bestSeller: false,
    description:
      "The quiet luxury classic — a warm nude that flatters every skin tone.",
  },
  {
    slug: "crimson-hour",
    name: "Crimson Hour",
    price: 34,
    image: img("photo-1522337360788-8b13dee7a37e"),
    shape: "Stiletto",
    length: "Long",
    color: "Red",
    collection: "Statement",
    bestSeller: false,
    description:
      "A deep, glossy crimson with an ultra-sharp silhouette. Unapologetically bold.",
  },
  {
    slug: "pearl-atelier",
    name: "Pearl Atelier",
    price: 42,
    image: img("photo-1632345031392-1d0c9a09e11a"),
    shape: "Coffin",
    length: "Medium",
    color: "White",
    collection: "Bridal",
    bestSeller: false,
    description:
      "Hand-placed micro pearls on an ivory base. An heirloom finish, handmade in small batches.",
  },
  {
    slug: "blush-suede",
    name: "Blush Suede",
    price: 30,
    image: img("photo-1519014816548-bf5fe059798b"),
    shape: "Square",
    length: "Medium",
    color: "Pink",
    collection: "Everyday",
    bestSeller: false,
    description:
      "A matte blush with a velvet touch. Soft, feminine and beautifully understated.",
  },
  {
    slug: "midnight-chrome",
    name: "Midnight Chrome",
    price: 40,
    image: img("photo-1595475207225-428b62bda831"),
    shape: "Stiletto",
    length: "Medium",
    color: "Chrome",
    collection: "Statement",
    bestSeller: false,
    description:
      "A mirrored smoke chrome finish. Modern, editorial and impossible to ignore.",
  },
];

export const collections = [
  {
    name: "Bridal",
    blurb: "Pearls, sheers and forever finishes.",
    image: img("photo-1636018943673-1ef37f81a2ec"),
  },
  {
    name: "Everyday",
    blurb: "Nudes and neutrals for daily polish.",
    image: img("photo-1604654894610-df63bc536371"),
  },
  {
    name: "Statement",
    blurb: "Chromes and colour that turn heads.",
    image: img("photo-1632345031435-8727f6897d53"),
  },
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
