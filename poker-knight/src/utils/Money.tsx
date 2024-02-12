// utils/Money.tsx
export const formatCurrency = (value: number) => {
  return `$${value.toLocaleString()}`; // Formats the number as currency (e.g., $250)
};
