export const categories = [
  {
    id: "men",
    label: "Men",
    blurb: "Refined essentials",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=900&q=70&auto=format",
    sub: [
      { id: "shirts", label: "Shirts" },
      { id: "suits", label: "Suits & Blazers" },
      { id: "outerwear", label: "Outerwear" },
      { id: "denim", label: "Denim" },
      { id: "knitwear", label: "Knitwear" },
      { id: "shoes", label: "Shoes" },
    ],
  },
  {
    id: "women",
    label: "Women",
    blurb: "Timeless silhouettes",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=70&auto=format",
    sub: [
      { id: "dresses", label: "Dresses" },
      { id: "tops", label: "Tops & Blouses" },
      { id: "outerwear", label: "Outerwear" },
      { id: "trousers", label: "Trousers" },
      { id: "knitwear", label: "Knitwear" },
      { id: "shoes", label: "Shoes" },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    blurb: "The finishing detail",
    image: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=900&q=70&auto=format",
    sub: [
      { id: "bags", label: "Bags" },
      { id: "belts", label: "Belts" },
      { id: "scarves", label: "Scarves" },
      { id: "jewelry", label: "Jewelry" },
      { id: "watches", label: "Watches" },
    ],
  },
  {
    id: "sale",
    label: "Sale",
    blurb: "Curated reductions",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=70&auto=format",
    sub: [
      { id: "final", label: "Final Sale" },
      { id: "seasonal", label: "Seasonal" },
    ],
  },
];

export const categoryById = (id) => categories.find((c) => c.id === id);
