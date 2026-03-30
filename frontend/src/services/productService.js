import API from "./api";

export const getProducts = async (category) => {
  return API.get("/api/products", {
    params: { category },
  });
};