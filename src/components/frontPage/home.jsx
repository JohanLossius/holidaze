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

      // Variables to handle multiple API calls for venues by pages
      let allVenuesCont = [];
      let currentPage = 1;
      let lastPage = false;

      try {
        // Calls the next page of the API as long as last page has not been reached
        while (!lastPage) {
          const response = await fetch(`${venuesApi}?page=${currentPage}`);
          const jsonObject = await response.json();

          if (!response.ok) {
            throw new Error(jsonObject.errors[0]?.message);
          }
          if (response.ok) {
            const venuesCont = jsonObject.data;

            // Only include venues with a certain data quality (that includes relevant location data)
            const filteredVenuesCont = venuesCont.filter((venue) => venue.location?.country && venue.location?.city && venue.location?.address);

            // Manage all venues pulled from API continuously
            allVenuesCont = [...allVenuesCont, ...filteredVenuesCont];
            setVenues(allVenuesCont);

            // Manage state when first set of venues are loaded, and before all pages of venues are loaded
            if (currentPage === 1) {
              setPartiallyLoaded(true);
            }
            // Manage pages
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

  // Calls the venues upon mounting of the component
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

  // Logic to check for duplicate ids. Testinghouse venue had some duplicate ids.
  // console.log("filteredVenues id: ", filteredVenues.map((venue) => venue.id));
  const ids = filteredVenues.map((venue) => venue.id);
  // Compares index of current id being processed if it's the same as the first occurring index for that same id,
  // and if no, meaning a duplicate exists, adds that id to duplicates cont
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    console.log("Duplicate IDs:", [...new Set(duplicates)]); // Only log duplicates once
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
      <section id="search-section" className="w-1/2 mx-auto lg:w-4/5 s:w-full">
        <form className="mx-auto lg:mx-2 s:mx-0">
          <input type="search" placeholder="Search by venue title..." name="search" value={query} onChange={handleSearch} className="mx-auto font-bold text-center bg-tertiary w-3/5 min-h-[3.5rem] my-4 rounded-[25px] lg:w-full font-semibold xs:font-normal" />
        </form>
      </section>
      <section className="flex flex-wrap justify-center justify-between w-full gap-2">
        {filteredVenues.length >= 1 ? (
            filteredVenues.map((venue, index) => (
              <Link to={`/venue/${venue.id}`} key={`${venue.id}-${index}`} className="mb-4 mx-auto mt-2 w-[30%] xl:w-[45%] lg:w-[80%] md:w-[90%] s:w-[95%]">
                <article className="flex flex-col justify-between gap-2 p-4 border-2 rounded-[25px] border-secondary bg-tertiary font-primary w-full s:p-2 gap-2">
                  <img 
                    src={venue.media[0]?.url}
                    className="max-w-[20rem] h-auto w-auto rounded-lg max-h-[20rem] mx-auto rounded s:max-w-[12rem] xs:max-w-[5rem]"
                    alt={venue.media[0]?.alt}
                    loading="lazy"
                  >
                  </img>
                  <h3 className="font-semibold text-2xl truncate">{venue.name}</h3>
                  <p className="font-semibold">{venue.location.city}, {venue.location.country}</p>
                  <p className="font-semibold">{maxTwoDecimals(venue.price)} NOK per day</p>
                  {venue.rating != 0 ? <p className="font-semibold">{venue.rating}/5 stars</p> : null}
                  {venue.description.length >= 100 ? <div className="max-w-[15rem] mx-auto italic truncate s:max-w-[10rem] text-s xs:max-w-[5rem] text-xs">{venue.description.slice(0, 100)}...</div> : null}
                  {venue.description.length >= 0 && venue.description.length < 100 ? <div className="max-w-[15rem] mx-auto italic truncate s:max-w-[10rem] text-s xs:max-w-[5rem] text-xs">{venue.description.slice(0, 99)}</div> : null}
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