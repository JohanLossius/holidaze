import React, { useState, useEffect } from "react";
import { venuesApi } from "../constants/api";
import { maxTwoDecimals } from "../constants/handlers";
import { Link } from "react-router-dom";

function Home() {

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getVenues() {
      try {
        const response = await fetch(venuesApi);
        const jsonObject = await response.json();
        console.log("jsonObject: ", jsonObject);
        // const venuesCont = JSON.stringify(data);
        const dataCont = jsonObject.data;
        console.log("dataCont ", dataCont);

        if (!response.ok) {
          throw new Error("An error occurred");
        }
        if (response.ok) {
          const venuesCont = dataCont.filter((venue) => venue.location?.country && venue.location?.city && venue.location?.address);
          // const venuesString = JSON.stringify(venuesCont);
          setVenues(venuesCont);
        }
      } catch (error) {
        console.log("Error: " + error.message);
        setError(error.message);
        // setFeedback(<div className="text-red-500 font-bold">{error.message}</div>);
      } finally {
        setLoading(false);
      }
    }

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

  if (loading) {
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
        <p className="mx-auto mt-auto mb-2">An error has occured. Technically speaking:</p>
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
      <section className="flex flex-wrap justify-center justify-between m-4 gap-4">
        {filteredVenues.length >= 1 ? (
          filteredVenues.map((venue) => (
            <Link to={`/venue/${venue.id}`} key={venue.id}>
              <article className="flex flex-col justify-between gap-2 p-4 border-2 rounded-[25px] border-secondary bg-tertiary font-primary">
                <img src={venue.media[0]?.url} className="max-w-[20rem] h-auto w-auto rounded-lg max-h-[20rem] mx-auto rounded" alt={venue.media[0]?.alt}></img>
                <h3 className="font-semibold text-2xl">{venue.name}</h3>
                <p className="underline">{venue.location.city}, {venue.location.country}</p>
                <p className="underline">{maxTwoDecimals(venue.price)} NOK per day</p>
                {venue.rating != 0 ? <p className="underline">{venue.rating}/5 stars</p> : null}
                {venue.description.length >= 100 ? <div className="max-w-[15rem] mx-auto italic">{venue.description.slice(0, 100)}...</div> : null}
                {venue.description.length >= 20 && venue.description.length < 100 ? <div className="max-w-[15rem] mx-auto italic">{venue.description.slice(0, 99)}</div> : null}
                <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[7rem] mx-auto">Discover</button>
              </article>
            </Link>
          ))
        ) : (
          <p>There are no venues that match your search!</p>
        )}
      </section>
    </main>
  );
}

export default Home;