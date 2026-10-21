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

// Collection tiles on the homepage. `category` must match products.category in Supabase;
// each tile's image is taken from a real product in that category.
export const collections = [
  {
    category: "Everyday Nudes",
    blurb: "Soft pearl, blush and neutral finishes.",
  },
  {
    category: "French Edit",
    blurb: "A modern take on the French tip.",
  },
  {
    category: "Glam Nights",
    blurb: "Deep plum and mauve for the evening.",
  },
  {
    category: "Bridal & Occasion",
    blurb: "Rich tones and fine detail for celebrations.",
  },
];

export const PLACEHOLDER_IMAGE = img("photo-1604654894610-df63bc536371");
