// Cart endpoints — productId-keyed. The backend reads the user from the JWT.
import api from "./api";

export const cartService = {
  async list()                       { return (await api.get("/api/cart")).data; },
  async add(productId, quantity = 1) { return (await api.post("/api/cart/items", { productId, quantity })).data; },
  async update(productId, quantity)  { return (await api.put(`/api/cart/items/${productId}`, { quantity })).data; },
  async remove(productId)            { return (await api.delete(`/api/cart/items/${productId}`)).data; },
  async clear()                      { return (await api.delete("/api/cart")).data; },
};
