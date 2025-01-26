import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// Product list API state management
function singleVenueStates(url) {
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [maxVisitors, setMaxVisitors] = useState(100);

  useEffect(() => {
    async function fetchVenue() {
      try {
        setIsLoading(true);
        setIsError(false);

        if (!url) return;

        const response = await fetch(url);
        const json = await response.json();

        if (!response) {
          setErrorMessage(json.errors[0].message);
          throw new Error(json.errors[0].message);
        }

        console.log("json.data: ", json.data)

        setVenue(json.data);
        setMaxVisitors(json.data.maxGuests);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVenue();
  }, [url]);

  return { venue, isLoading, isError, errorMessage, maxVisitors };
}

export default singleVenueStates;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// // Product list API state management
// function SingleProductApiStates(url) {
//   const [product, setProducts] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setIsLoading(true);
//         setIsError(false);

//         const response = await fetch(url);
//         const json = await response.json();

//         setProducts(json.data);
//       } catch (error) {
//         setIsError(true);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchData();
//   }, [url]);

//   return { product, isLoading, isError };
// }

// export default SingleProductApiStates;