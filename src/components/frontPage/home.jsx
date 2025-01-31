import React, { useState, useEffect } from "react";
import { venuesApi } from "../constants/api";
import { maxTwoDecimals } from "../constants/handlers";
import { Link } from "react-router-dom";

function Home() {

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partiallyLoaded, setPartiallyLoaded] = useState(false);
  const [error, setError] = useState(null);

    async function getVenues() {

      let allVenuesCont = [];
      let currentPage = 1;
      let lastPage = false;

      try {
        while (!lastPage) {
          const response = await fetch(`${venuesApi}?page=${currentPage}`);
          const jsonObject = await response.json();
          // console.log("jsonObject venues", jsonObject);

          if (!response.ok) {
            throw new Error(jsonObject.errors[0]?.message);
          }
          if (response.ok) {
            const venuesCont = jsonObject.data;
            const filteredVenuesCont = venuesCont.filter((venue) => venue.location?.country && venue.location?.city && venue.location?.address);
            allVenuesCont = [...allVenuesCont, ...filteredVenuesCont];
            setVenues(allVenuesCont);
            if (currentPage === 1) {
              setPartiallyLoaded(true);
            }
            lastPage = jsonObject.meta.isLastPage;
            currentPage = currentPage + 1;
          }
        }
      } catch (error) {
        console.log("Error: ", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
        setPartiallyLoaded(false);
      }
    }

  useEffect(() => {
    getVenues();
  }, []);

  // Handle search bar and query state
  const [query, setQuery] = useState("");
  const handleSearch = (event) => {
    setQuery(event.target.value);
  }

  // Filter venues based on search query
  const filteredVenues = venues.filter((venue) => {
    return venue.name.toLowerCase().includes(query.toLowerCase());
  });

  // Logic to check for duplicate ids. Testinghouse venue has some duplicate ids.
  // console.log("filteredVenues id: ", filteredVenues.map((venue) => venue.id));
  const ids = filteredVenues.map((venue) => venue.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    console.log("Duplicate IDs:", [...new Set(duplicates)]); // Remove duplicate duplicates
  } else {
    console.log("No duplicates found");
  }

  // Loading message before any venues are displayed
  if (loading && !partiallyLoaded) {
    return (
      <main className="h-auto min-h-[85vh] text-center flex flex-col justify-between items-center w-full">
        <h1 className="m-auto font-bold text-3xl">Venues for hire!</h1>
        <section className="m-auto">Venues are loading... Sit back and have a sip of your coffee, and we'll be back shortly!</section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="h-auto min-h-[85vh] text-center w-full m-auto flex flex-col">
        <p className="mx-auto mt-auto mb-2">An error has manifested. Technically speaking:</p>
        <p className="font-bold underline mx-auto mb-auto mt-2">{error}</p>
      </main>
    )
  }

  return (
    <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
      <h1 className="m-auto font-bold text-3xl">Venues for hire!</h1>
      <section id="search-section" className="w-1/2 mx-auto">
        <form className="mx-auto">
          <input type="search" placeholder="Search by venue title..." name="search" value={query} onChange={handleSearch} className="mx-auto font-bold text-center bg-tertiary w-1/2 min-h-[3.5rem] my-4 rounded-[25px]" />
        </form>
      </section>
      <section className="flex flex-wrap justify-center justify-between w-full gap-2">
        {filteredVenues.length >= 1 ? (
            filteredVenues.map((venue, index) => (
              <Link to={`/venue/${venue.id}`} key={`${venue.id}-${index}`} className="w-[30%] mb-4 mx-auto mt-2">
                <article className="flex flex-col justify-between gap-2 p-4 border-2 rounded-[25px] border-secondary bg-tertiary font-primary w-full">
                  <img 
                    src={venue.media[0]?.url}
                    className="max-w-[20rem] h-auto w-auto rounded-lg max-h-[20rem] mx-auto rounded"
                    alt={venue.media[0]?.alt}
                    loading="lazy"
                  >
                  </img>
                  <h3 className="font-semibold text-2xl">{venue.name}</h3>
                  <p className="font-semibold">{venue.location.city}, {venue.location.country}</p>
                  <p className="font-semibold">{maxTwoDecimals(venue.price)} NOK per day</p>
                  {venue.rating != 0 ? <p className="font-semibold">{venue.rating}/5 stars</p> : null}
                  {venue.description.length >= 100 ? <div className="max-w-[15rem] mx-auto italic">{venue.description.slice(0, 100)}...</div> : null}
                  {venue.description.length >= 20 && venue.description.length < 100 ? <div className="max-w-[15rem] mx-auto italic">{venue.description.slice(0, 99)}</div> : null}
                  <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[7rem] mx-auto">Discover</button>
                </article>
              </Link>
            ))) : (<div>There are no results that match your search!</div>)
          }
      </section>
      {/* To avoid too long load time before all venues fetched and displayed all at once,
      we display the first venues loaded on top, with loading message before all are loaded at bottom */}
      {partiallyLoaded &&
        <section id="still-loading-section" className="w-1/2 mx-auto rounded-[25px] bg-tertiary text-secondary p-2 my-2 font-bold text-lg">
          <p className="text-center mx-auto text-rose-500">Venues are still loading...</p>
        </section>
      }
    </main>
  );
}

export default Home;

// function Home() {

//   const [venues, setVenues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function getVenues() {
//       try {
//         const response = await fetch(venuesApi);
//         const jsonObject = await response.json();
//         console.log("jsonObject: ", jsonObject);
//         // const venuesCont = JSON.stringify(data);
//         const dataCont = jsonObject.data;
//         console.log("dataCont ", dataCont);

//         if (!response.ok) {
//           throw new Error("An error occurred");
//         }
//         if (response.ok) {
//           const venuesCont = dataCont.filter((venue) => venue.location?.country && venue.location?.city && venue.location?.address);
//           // const venuesString = JSON.stringify(venuesCont);
//           setVenues(venuesCont);
//         }
//       } catch (error) {
//         console.log("Error: " + error.message);
//         setError(error.message);
//         // setFeedback(<div className="text-red-500 font-bold">{error.message}</div>);
//       } finally {
//         setLoading(false);
//       }
//     }

//     getVenues();
//   }, []);

//     // Handle search bar and query state
//     const [query, setQuery] = useState("");
//     const handleSearch = (event) => {
//       setQuery(event.target.value);
//     }
  
//     // Filter venues based on search query
//     const filteredVenues = venues.filter((venue) => {
//       return venue.name.toLowerCase().includes(query.toLowerCase());
//     });

//   if (loading) {
//     return (
//       <main className="h-auto min-h-[85vh] text-center flex flex-col justify-between items-center w-full">
//         <h1 className="m-auto font-bold text-3xl">Venues for hire!</h1>
//         <section className="m-auto">Venues are loading... Sit back and have a sip of your coffee, and we'll be back shortly!</section>
//       </main>
//     )
//   }

//   if (error) {
//     return (
//       <main className="h-auto min-h-[85vh] text-center w-full m-auto flex flex-col">
//         <p className="mx-auto mt-auto mb-2">An error has occured. Technically speaking:</p>
//         <p className="font-bold underline mx-auto mb-auto mt-2">{error}</p>
//       </main>
//     )
//   }

//   return (
//     <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
//       <h1 className="m-auto font-bold text-3xl">Venues for hire!</h1>
//       <section id="search-section" className="w-1/2 mx-auto">
//         <form className="mx-auto">
//           <input type="search" placeholder="Search by venue title..." name="search" value={query} onChange={handleSearch} className="mx-auto font-bold text-center bg-tertiary w-1/2 min-h-[3.5rem] my-4 rounded-[25px]" />
//         </form>
//       </section>
//       <section className="flex flex-wrap justify-center justify-between m-4 gap-4">
//         {filteredVenues.length >= 1 ? (
//           filteredVenues.map((venue) => (
//             <Link to={`/venue/${venue.id}`} key={venue.id}>
//               <article className="flex flex-col justify-between gap-2 p-4 border-2 rounded-[25px] border-secondary bg-tertiary font-primary">
//                 <img src={venue.media[0]?.url} className="max-w-[20rem] h-auto w-auto rounded-lg max-h-[20rem] mx-auto rounded" alt={venue.media[0]?.alt}></img>
//                 <h3 className="font-semibold text-2xl">{venue.name}</h3>
//                 <p className="underline">{venue.location.city}, {venue.location.country}</p>
//                 <p className="underline">{maxTwoDecimals(venue.price)} NOK per day</p>
//                 {venue.rating != 0 ? <p className="underline">{venue.rating}/5 stars</p> : null}
//                 {venue.description.length >= 100 ? <div className="max-w-[15rem] mx-auto italic">{venue.description.slice(0, 100)}...</div> : null}
//                 {venue.description.length >= 20 && venue.description.length < 100 ? <div className="max-w-[15rem] mx-auto italic">{venue.description.slice(0, 99)}</div> : null}
//                 <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[7rem] mx-auto">Discover</button>
//               </article>
//             </Link>
//           ))
//         ) : (
//           <p>There are no venues that match your search!</p>
//         )}
//       </section>
//     </main>
//   );
// }