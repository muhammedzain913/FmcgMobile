/**
 * Calculates the discount percentage based on original price and sale price
 * @param originalPrice - The original price of the product
 * @param salePrice - The discounted/sale price of the product
 * @returns The discount percentage rounded to the nearest integer, or 0 if invalid
 * 
 * @example
 * calculateDiscountPercentage(100, 50) // Returns 50
 * calculateDiscountPercentage(200, 150) // Returns 25
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  // Validate inputs
  if (!originalPrice || originalPrice <= 0) {
    return 0;
  }
  
  if (!salePrice || salePrice <= 0) {
    return 0;
  }
  
  // If sale price is greater than or equal to original price, no discount
  if (salePrice >= originalPrice) {
    return 0;
  }
  
  // Calculate discount percentage: ((original - sale) / original) * 100
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  
  // Round to nearest integer
  return Math.round(discount);
}
