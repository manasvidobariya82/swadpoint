export const getMenu = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("restaurantMenu")) || [];
};

export const saveMenu = (menu) => {
  localStorage.setItem("restaurantMenu", JSON.stringify(menu));
};

export const getOrders = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("restaurantOrders")) || [];
};

export const saveOrders = (orders) => {
  localStorage.setItem("restaurantOrders", JSON.stringify(orders));
};
