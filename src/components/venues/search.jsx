// import React, { useState } from "react";

//   // Handle search bar and query state
//   const [query, setQuery] = useState("");
//   const handleSearch = (event) => {
//     setQuery(event.target.value);
//   }

//   // Filter venues based on search query
//   // filteredVenues is also used to display search suggestions
//   const filteredVenues = venues.filter((venue) => {
//     return venue.name.toLowerCase().includes(query.toLowerCase());
//   });


  // <form className="search-bar-form">
  //         <input type="search" placeholder="Type to search by product title..." name="search" value={query} onChange={handleChange} className="search-bar" />
  //         {/* Search suggestions functionality, displays if there are filtered products that match user search query of atleast 2 characters. */}
  //         <div className="search-suggestions-cont">
  //           {filteredProducts.length >= 1 && query.length >= 2 ? (
  //             <div className="search-suggestions-sub-cont">
  //               <h4 className="quick-search-title">Quick search results:</h4>
  //               {filteredProducts.map((product) => (
  //                 <Link key={product.id} to={`/product/${product.id}`} className="search-a-tag">
  //                   <div className="search-suggestion-div">
  //                     <span className="span-search">{product.title}</span>
  //                     <button className="quick-search-view-btn">View</button>
  //                   </div>
  //                 </Link>
  //               ))}
  //             </div>
  //           ) : ("")}
  //         </div>
  //       </form>
  //       <div className="product-container">
  //       {filteredProducts.length >= 1 ? (
  //       filteredProducts.map((product) => (
  //         <div key={product.id} className="product-card">
  //           <h2 className="h2-card">{product.title}</h2>
  //           <div className="text-div-product-card">
  //             <span>{product.description}</span>
  //             <span>Discounted price: {maxTwoDecimals(product.discountedPrice)} NOK</span>
  //             {product.price - product.discountedPrice > 0 && (
  //               <span>Discount: {maxTwoDecimals(product.price - product.discountedPrice)} NOK</span>
  //             )}
  //           </div>
  //           <img src={product.image.url} alt={product.title} className="product-card-img"/>
  //           <Link to={`/product/${product.id}`}><button className="cta-button">View product</button></Link>
  //           <button onClick={() => dispatch({ type: "addProduct", payload: product })} className="cta-button">Add to cart</button>
  //         </div>
  //       ))) : (
  //         <div>There are no results that match your search!</div>
  //       )}
  //     </div>