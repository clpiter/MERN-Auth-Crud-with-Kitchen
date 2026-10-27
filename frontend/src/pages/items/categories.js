export const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy & Eggs",
  "Grains & Pulses",
  "Spices & Condiments",
  "Oils & Ghee",
  "Bakery",
  "Beverages",
  "Snacks & Sweeteners",
  "Cleaning & Household"
];

export const formatPrice = (price) => `Rs. ${Number(price || 0).toLocaleString()}`;
