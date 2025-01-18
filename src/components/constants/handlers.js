
// Handle max 2 decimals functionality
export function maxTwoDecimals(price) {
  if (price % 1 === 0) {
    return price.toFixed(0);
  } else {
    return price.toFixed(2);
  }
}

// // Handle max 50 characters functionality
// export function maxFiftyCharacters(description) {
//   if (description % 1 === 0) {
//     return price.toFixed(0);
//   } else {
//     return price.toFixed(2);
//   }
// }