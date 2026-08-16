// Product + category endpoints (public).
import api from "./api";

/**
 * Map a backend ProductResponse to the shape the storefront UI renders.
 * Backend → UI field renames: productId→id, subCategory→sub, reviewCount→reviews,
 * imageUrl→image. Prices are coerced to numbers; gallery falls back to [image].
 */
export function normalizeProduct(p) {
  if (!p) return null;
  const gallery =
    Array.isArray(p.gallery) && p.gallery.length
      ? p.gallery
      : p.imageUrl
      ? [p.imageUrl]
      : [];
  return {
    id: p.productId,
    name: p.name,
    brand: p.brand || "Mercantix",
    description: p.description,
    price: p.price != null ? Number(p.price) : 0,
    originalPrice: p.originalPrice != null ? Number(p.originalPrice) : undefined,
    stock: p.stock,
    inStock: p.inStock ?? (p.stock ?? 0) > 0,
    category: p.category,
    sub: p.subCategory,
    color: p.color,
    rating: p.rating != null ? Number(p.rating) : undefined,
    reviews: p.reviewCount ?? 0,
    tag: p.tag || undefined,
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    image: p.imageUrl,
    gallery,
  };
}

// UI sort id → backend (sortBy, sortDir) pair.
const SORT_MAP = {
  popular: { sortBy: "reviewCount", sortDir: "desc" },
  newest: { sortBy: "createdAt", sortDir: "desc" },
  "price-asc": { sortBy: "price", sortDir: "asc" },
  "price-desc": { sortBy: "price", sortDir: "desc" },
  rating: { sortBy: "rating", sortDir: "desc" },
};

export const productService = {
  /**
   * GET /api/products — paginated, server-side search/filter/sort.
   * Returns { items, page, totalPages, totalElements, first, last }.
   */
  async list({ category, q, minPrice, maxPrice, sort, page = 0, size = 60 } = {}) {
    const sortParams = SORT_MAP[sort] || {};
    const { data } = await api.get("/api/products", {
      params: {
        category: category || undefined,
        q: q || undefined,
        minPrice: minPrice ?? undefined,
        maxPrice: maxPrice ?? undefined,
        page,
        size,
        ...sortParams,
      },
    });
    return {
      items: (data.content || []).map(normalizeProduct),
      page: data.page ?? 0,
      totalPages: data.totalPages ?? 1,
      totalElements: data.totalElements ?? 0,
      first: data.first ?? true,
      last: data.last ?? true,
    };
  },

  // GET /api/products/:id → single normalized product
  async getById(productId) {
    const { data } = await api.get(`/api/products/${productId}`);
    return normalizeProduct(data);
  },

  // GET /api/categories → array of category name strings
  async categories() {
    const { data } = await api.get("/api/categories");
    return Array.isArray(data) ? data : [];
  },
};
