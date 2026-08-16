// Mock seed for the admin UI. Mirrors the v2 schema so backend swap is 1:1.
// Replace each call site with the corresponding adminService method when the API is ready.

export const mockProducts = [
  { id: 1,  name: "Classic White Shirt",       sku: "MX-SHR-001", category: "Shirts",      price: 1299, stock: 120, status: "ACTIVE",  image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200" },
  { id: 2,  name: "Oxford Blue Shirt",         sku: "MX-SHR-002", category: "Shirts",      price: 1499, stock: 85,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1563630423918-b58bdb363931?w=200" },
  { id: 3,  name: "Flannel Check Shirt",       sku: "MX-SHR-003", category: "Shirts",      price: 999,  stock: 60,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200" },
  { id: 4,  name: "Slim-Fit Chino Pants",      sku: "MX-PNT-001", category: "Pants",       price: 1799, stock: 95,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200" },
  { id: 5,  name: "Classic Black Trousers",    sku: "MX-PNT-002", category: "Pants",       price: 2199, stock: 70,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200" },
  { id: 6,  name: "Cargo Utility Pants",       sku: "MX-PNT-003", category: "Pants",       price: 1599, stock: 110, status: "ACTIVE",  image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200" },
  { id: 7,  name: "Minimalist Quartz Watch",   sku: "MX-WCH-001", category: "Watches",     price: 4999, stock: 40,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
  { id: 8,  name: "Chronograph Sports Watch",  sku: "MX-WCH-002", category: "Watches",     price: 7499, stock: 25,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=200" },
  { id: 9,  name: "Vintage Leather Watch",     sku: "MX-WCH-003", category: "Watches",     price: 9999, stock: 15,  status: "LOW",     image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200" },
  { id: 10, name: "Smart Fitness Watch",       sku: "MX-WCH-004", category: "Watches",     price: 5999, stock: 55,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200" },
  { id: 11, name: "Gold-Plated Necklace",      sku: "MX-JWL-001", category: "Jewellery",   price: 2499, stock: 50,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200" },
  { id: 12, name: "Sterling Silver Earrings",  sku: "MX-JWL-002", category: "Jewellery",   price: 1299, stock: 75,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200" },
  { id: 13, name: "Diamond Stud Earrings",     sku: "MX-JWL-003", category: "Jewellery",   price: 24999,stock: 6,   status: "LOW",     image: "https://images.unsplash.com/photo-1573408301185-9519f94815f9?w=200" },
  { id: 14, name: "Leather Bifold Wallet",     sku: "MX-ACC-001", category: "Accessories", price: 1299, stock: 90,  status: "ACTIVE",  image: "https://images.unsplash.com/photo-1627123424574-724758594913?w=200" },
  { id: 15, name: "Polarised Sunglasses",      sku: "MX-ACC-002", category: "Accessories", price: 1999, stock: 0,   status: "OOS",     image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200" },
  { id: 16, name: "Leather Belt",              sku: "MX-ACC-003", category: "Accessories", price: 999,  stock: 120, status: "ACTIVE",  image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200" },
];

export const mockUsers = [
  { id: 1, username: "admin",        email: "admin@mercantix.com",   role: "ADMIN",    orders: 0,  spend: 0,     joined: "2025-01-12", status: "ACTIVE" },
  { id: 2, username: "john_doe",     email: "john@example.com",      role: "CUSTOMER", orders: 8,  spend: 18450, joined: "2025-02-04", status: "ACTIVE" },
  { id: 3, username: "aria_s",       email: "aria@example.com",      role: "CUSTOMER", orders: 14, spend: 32990, joined: "2025-02-19", status: "ACTIVE" },
  { id: 4, username: "marcus_w",     email: "marcus@example.com",    role: "CUSTOMER", orders: 3,  spend: 4720,  joined: "2025-03-08", status: "ACTIVE" },
  { id: 5, username: "elena_b",      email: "elena@example.com",     role: "CUSTOMER", orders: 22, spend: 67100, joined: "2025-03-21", status: "ACTIVE" },
  { id: 6, username: "kenji_t",      email: "kenji@example.com",     role: "CUSTOMER", orders: 1,  spend: 1499,  joined: "2025-04-02", status: "INACTIVE" },
  { id: 7, username: "priya_n",      email: "priya@example.com",     role: "CUSTOMER", orders: 6,  spend: 9870,  joined: "2025-04-14", status: "ACTIVE" },
  { id: 8, username: "luis_r",       email: "luis@example.com",      role: "CUSTOMER", orders: 0,  spend: 0,     joined: "2025-05-01", status: "PENDING" },
];

export const mockOrders = [
  { id: "MX-10231", customer: "elena_b",   email: "elena@example.com",  total: 12450, items: 3, status: "DELIVERED", paymentStatus: "PAID",   placedAt: "2026-05-22" },
  { id: "MX-10232", customer: "john_doe",  email: "john@example.com",   total: 3298,  items: 2, status: "SHIPPED",   paymentStatus: "PAID",   placedAt: "2026-05-23" },
  { id: "MX-10233", customer: "aria_s",    email: "aria@example.com",   total: 7499,  items: 1, status: "CONFIRMED", paymentStatus: "PAID",   placedAt: "2026-05-24" },
  { id: "MX-10234", customer: "marcus_w",  email: "marcus@example.com", total: 2098,  items: 2, status: "PENDING",   paymentStatus: "UNPAID", placedAt: "2026-05-25" },
  { id: "MX-10235", customer: "priya_n",   email: "priya@example.com",  total: 24999, items: 1, status: "CONFIRMED", paymentStatus: "PAID",   placedAt: "2026-05-26" },
  { id: "MX-10236", customer: "elena_b",   email: "elena@example.com",  total: 5798,  items: 4, status: "CANCELLED", paymentStatus: "REFUNDED",placedAt: "2026-05-27" },
  { id: "MX-10237", customer: "aria_s",    email: "aria@example.com",   total: 1999,  items: 1, status: "SHIPPED",   paymentStatus: "PAID",   placedAt: "2026-05-28" },
  { id: "MX-10238", customer: "john_doe",  email: "john@example.com",   total: 999,   items: 1, status: "PENDING",   paymentStatus: "UNPAID", placedAt: "2026-05-29" },
];

// Monthly sales for the last 12 months (most recent last)
export const monthlySales = [
  { label: "Jun", revenue: 142_300, orders: 86 },
  { label: "Jul", revenue: 168_750, orders: 102 },
  { label: "Aug", revenue: 154_200, orders: 94 },
  { label: "Sep", revenue: 189_400, orders: 118 },
  { label: "Oct", revenue: 221_800, orders: 138 },
  { label: "Nov", revenue: 287_600, orders: 167 },
  { label: "Dec", revenue: 342_900, orders: 201 },
  { label: "Jan", revenue: 198_500, orders: 121 },
  { label: "Feb", revenue: 215_300, orders: 132 },
  { label: "Mar", revenue: 248_700, orders: 149 },
  { label: "Apr", revenue: 261_400, orders: 156 },
  { label: "May", revenue: 296_120, orders: 174 },
];

// Category revenue split (for donut + bar)
export const categoryShare = [
  { label: "Watches",     value: 38, revenue: 112_300 },
  { label: "Shirts",      value: 22, revenue: 65_140  },
  { label: "Jewellery",   value: 18, revenue: 53_300  },
  { label: "Accessories", value: 14, revenue: 41_460  },
  { label: "Pants",       value: 8,  revenue: 23_920  },
];

// Top sellers (for dashboard)
export const topSellers = [
  { id: 7,  name: "Minimalist Quartz Watch",  category: "Watches",     sold: 142, revenue: 709_858 },
  { id: 2,  name: "Oxford Blue Shirt",        category: "Shirts",      sold: 118, revenue: 176_882 },
  { id: 11, name: "Gold-Plated Necklace",     category: "Jewellery",   sold: 96,  revenue: 239_904 },
  { id: 4,  name: "Slim-Fit Chino Pants",     category: "Pants",       sold: 88,  revenue: 158_312 },
  { id: 14, name: "Leather Bifold Wallet",    category: "Accessories", sold: 74,  revenue: 96_126  },
];
