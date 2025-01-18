import React from "react";
import { singleVenueApiBase } from "../constants/api";
import { Link, useParams } from "react-router-dom";
import singleVenueStates from "../constants/singleVenueStates.js";
import { maxTwoDecimals } from "../constants/handlers.js";
import { profileLoginUsage } from "../constants/loginContext.jsx";

function Venue() {

  const { loggedInState } = profileLoginUsage();

  const { id } = useParams();

  const singleVenueApi = singleVenueApiBase + "/" + id;

  const { venue, isLoading, isError, errorMessage } = singleVenueStates(singleVenueApi);
  console.log("singlevenueapi: ", singleVenueApi)
  console.log("venue is loading and is error states: ", venue, isLoading, isError)

  if (isLoading) {
    return <div>The hamster is running at full speed now, hang on...</div>;
  }

  if (isError) {
    return <div>There was an error: {isError}.</div>;
  }

  if (venue) {
    return (
      <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
        {/* <section key={venue.id} className="flex flex-col justify-between p-4 border-2 rounded-[25px] border-secondary bg-tertiary font-primary"> */}
          <h1 className="mx-auto font-bold text-3xl my-3">{venue.name}</h1>
          <div className="w-4/5 p-4 mx-auto italic">{venue.description}</div>
          <div className="flex flex-row w-full mx-2">
            <div className="w-1/2">
              {venue.media.length >= 1 ? (
                venue.media.map((image) => (
                  <img src={image.url} className="max-w-[30rem] h-auto w-auto rounded-lg max-h-[30rem] mx-auto rounded my-2" alt={image.alt}></img>
                ))
              ) : (
                <img src={venue.media[0]?.url} className="max-w-[30rem] h-auto w-auto rounded-lg max-h-[30rem] mx-auto rounded" alt={venue.media[0]?.alt}></img>
              )}
            </div>
            <div className="w-1/2">
              <div className="w-3/5 flex flex-col gap-2 mx-auto bg-tertiary border-secondary border-2 p-4 rounded-[25px]">
                <h2 className="text-2xl font-bold">Details</h2>
                <p className="underline">Address: {venue.location.address}, {venue.location.zip} {venue.location.city}, {venue.location.country}</p>
                <p className="underline">Price: {maxTwoDecimals(venue.price)} NOK per day</p>
                {venue.rating != 0 ? <p className="underline">Rating: {venue.rating}/5 stars</p> : null}
                {venue.meta.parking === true ? <p className="underline">Parking space: Yes</p> : <p className="underline">Parking space: No</p>}
                {venue.meta.wifi === true ? <p className="underline">Wifi: Yes</p> : <p className="underline">Wifi: No</p>}
                {venue.meta.breakfast === true ? <p className="underline">Breakfast: Yes</p> : <p className="underline">Breakfast: No</p>}
                {venue.meta.pets === true ? <p className="underline">Pets: Yes</p> : <p className="underline">Pets: No</p>}
                {venue.maxGuests > 0 ? <p className="underline">Max guests: {venue.maxGuests}</p> : null}
                <p className="underline">Venue created at: {venue.created.slice(0, 10)}</p>
                {venue.updated ? <p className="underline">Venue last updated at: {venue.updated.slice(0, 10)}</p> : null}
                <p className="underline">Venue id: {venue.id}</p>
                {loggedInState === false ? (
                <form className="w-3/5 gap-4 flex flex-col mx-auto text-center justify-between bg-white text-black border-2 p-4 justify-between rounded-[25px]">
                  <img src="/calendar-icon.svg" className="mx-auto"></img>
                  <h3 className="text-2xl font-bold mx-auto">Book your stay today</h3>
                  <input disabled className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Date from"></input>
                  <input disabled className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Date to"></input>
                  <input disabled className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Number of guests"></input>
                  <Link to="/login">
                    {/* Make login a popup window if time */}
                    <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[18rem] mx-auto">Log in to book venue</button>
                  </Link>
                </form>
                ) : (
                  <form className="w-3/5 gap-4 flex flex-col mx-auto text-center text-black bg-white border-2 p-4 justify-between rounded-[25px]">
                    <img src="/calendar-icon.svg" className="mx-auto"></img>
                    <h3 className="text-2xl font-bold mx-auto">Book your stay today</h3>
                    <input className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Date from"></input>
                    <input className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Date to"></input>
                    <input className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Number of guests"></input>
                    <submit className="rounded-lg bg-primary text-white p-2 font-bold max-w-[7rem] mx-auto">Book</submit>
                  </form>
                )}
              </div>
            </div>
          </div>
        {/* </section> */}
      </main>
    )
  }

  if (!venue) {
    return <div>There was an error: {errorMessage}.</div>
  }
}

export default Venue;