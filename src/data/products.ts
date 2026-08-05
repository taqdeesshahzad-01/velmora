export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  shape: string;
  length: string;
  color: string;
  collection: string;
  bestSeller: boolean;
  description: string;
};

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

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

export const PLACEHOLDER_IMAGE = img("photo-1604654894610-df63bc536371");
