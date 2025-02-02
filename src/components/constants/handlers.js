// Handle max 2 decimals functionality
// Takes the price as a parameter, checks if it has decimals, and if yes, ensures max two decimals. Else no decimals.
export function maxTwoDecimals(price) {
  if (price % 1 === 0) {
    return price.toFixed(0);
  } else {
    return price.toFixed(2);
  }
}