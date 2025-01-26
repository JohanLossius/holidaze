// import { apiKey } from "./api";
// import { token } from "./localStorage";

// export async function deleteVenue(url) {

//   const deleteOptions = {
//     method: "DELETE",
//     headers: {
//       "Content-type": "application/json; charset=UTF-8",
//       "Authorization": `Bearer ${token}`,
//       "X-Noroff-API-Key": apiKey
//     }
//   }

//   try {
//     if (!url) {
//       console.log("No URL provided for deletion.");
//       return;
//     }
//     const response = await fetch(url, deleteOptions);

//     if (!response.ok) {
//       // setErrorMessage(json.errors[0].message);
//       throw new Error("An unknown error occurred.");
//     }

//     if (response.ok) {
//       console.log("deletion successful")
//       return <div className="text-red font-bold">Venue successfully deleted</div>
//     }

//   } catch (error) {
//     console.log("error delete venue: ", error.message)
//   }
// }

// import React, { useState, useEffect } from "react";
// import { apiKey } from "./api";
// import { token } from "./localStorage";
// import { profileLoginUsage } from "./context";  

// // Product list API state management
// function deleteVenueFunction(url) {

//   const { venueManagerFeedback, setVenueManagerFeedback } = profileLoginUsage();

//   const deleteOptions = {
//     method: "DELETE",
//     headers: {
//       "Content-type": "application/json; charset=UTF-8",
//       "Authorization": `Bearer ${token}`,
//       "X-Noroff-API-Key": apiKey
//     }
//   }

//   useEffect(() => {
//     async function deleteVenue() {
//       try {

//         if (!url) return;

//         const response = await fetch(url, deleteOptions);
//         const json = await response.json();

//         console.log("delete venue json.data ", json.data)

//         if (!response.ok) {
//           // setErrorMessage(json.errors[0].message);
//           throw new Error(json.errors[0].message);
//         }

//         if (response.ok) {
//           setVenueManagerFeedback(<div className="text-red font-bold mx-auto text-center text-lg">The venue was successfully deleted!</div>)
//         }

//       } catch (error) {
//         console.log("error delete venue: ", error.message)
//       }
//     }
//   }, [url])
//   deleteVenue()
// }

// export default deleteVenueFunction;