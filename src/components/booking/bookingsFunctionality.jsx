import React from "react";
import { venuesApi, holidazeApi } from "../constants/api.js";
import { useState, useEffect } from "react";
import { apiKey } from "../constants/api.js";
import { Link } from "react-router-dom";
// import { profileLoginUsage } from "../constants/context.jsx";

const usernameConst = localStorage.getItem("username");
const token = localStorage.getItem("accessToken");

// const bookingsByProfile = `${profilesApi}/${usernameConst}/bookings`;

function BookingsFunctionality() {

  const [reservations, setReservations] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("accessToken");

  const bookingsByProfileApi = `${holidazeApi}/profiles/${username}/bookings?_customer=true&_venue=true`;

  // In case separate api call needs to be made to get the owner of the venue of the booking
  // const venueOwnerApi = `${venuesApi}/${id}?_owner=true`;

  useEffect(() => {
    async function getBookings() {

      const bookingsByProfileOptions = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey
        },
      };

      try {
        const response = await fetch(bookingsByProfileApi, bookingsByProfileOptions);
        const jsonObject = await response.json();
        console.log("jsonObject bookings json: ", jsonObject);
        // const venuesCont = JSON.stringify(data);
        const bookingsCont = jsonObject.data;
        console.log("dataCont bookings ", bookingsCont);

        if (!response.ok) {
          throw new Error(jsonObject.errors[0].message);
        }
        if (response.ok) {
          setBookings(bookingsCont);
        }
      } catch (error) {
        console.log("Error bookings: " + error.message);
        setError(error.message);
        // setFeedback(<div className="text-red-500 font-bold">{error.message}</div>);
      } finally {
        setLoading(false);
      }
    }

    getBookings();
  }, []);

  if (loading) {
    return (
      <main className="h-auto min-h-[85vh] text-center flex flex-col justify-between items-center w-full">
        <h1 className="m-auto font-bold text-3xl">Your bookings!</h1>
        <section className="m-auto">Your bookings are loading... Sit back and have a sip of your coffee, and we'll be back shortly!</section>
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
    <section className="flex flex-wrap justify-center justify-between m-4 gap-4">
      {bookings.length >= 1 ? (
        bookings.map((booking) => (
          <article key={booking.id} className="mx-auto flex flex-col justify-between gap-2 p-4 border-2 rounded-[25px] border-secondary bg-tertiary font-primary">
            <div className="flex flex-row mx-auto">
              <div className="mx-2 mt-2 text-center">
                <h3 className="font-bold text-2xl">{booking.venue.name}</h3>
                <img src={booking.venue.media[0]?.url} alt="Venue image" className="max-w-[25rem] h-auto w-auto rounded-lg max-h-[25rem] mx-auto rounded my-2"></img>
                { booking.venue.description.length > 300 ? <p className="max-w-[25rem] h-auto w-auto max-h-[15rem] mx-auto my-2">{booking.venue.description.slice(0, 300)}...</p> : <p className="max-w-[25rem] h-auto w-auto max-h-[15rem] mx-auto">{booking.venue.description}</p>}
                {/* <p className="max-w-[25rem] h-auto w-auto rounded-lg max-h-[15rem] mx-auto rounded my-2">{booking.venue.description.slice(0, 300)}...</p> */}
                <div>
                  <p className="underline">Venue ID:</p>
                  {<span className="font-bold"> {booking.venue.id}</span>}
                </div>
              </div>
              <div className="mx-2 text-left">
                <h3 className="font-semibold text-xl my-4 mx-auto">{booking.dateFrom.slice(0, 10)} to {booking.dateTo.slice(0, 10)}</h3>
                <div>
                  <span className="underline">Guests:</span>
                  {<span className="font-bold"> {booking.guests}</span>}
                </div>
                <div>
                  <span className="underline">NOK per day:</span>
                  {<span className="font-bold"> {booking.venue.price}</span>}
                </div>
                <div>
                  <p className="underline">Location:</p>
                  <p className="font-bold">{booking.venue.location.address},</p>
                  <p className="font-bold">{booking.venue.location.zip} {booking.venue.location.city}</p>
                  <p className="font-bold">{booking.venue.location.country}</p>
                </div>
                <div>
                  <span className="underline">Wifi:</span>
                  { booking.venue.meta.wifi ? <span className="font-bold"> Yes</span> : <span className="font-bold"> No</span> }
                </div>
                <div>
                  <span className="underline">Parking:</span>
                  { booking.venue.meta.parking ? <span className="font-bold"> Yes</span> : <span className="font-bold"> No</span> }
                </div>
                <div>
                  <span className="underline">Breakfast:</span>
                  { booking.venue.meta.breakfast ? <span className="font-bold"> Yes</span> : <span className="font-bold"> No</span> }
                </div>
                <div>
                  <span className="underline">Pets:</span>
                  { booking.venue.meta.pets ? <span className="font-bold"> Yes</span> : <span className="font-bold"> No</span> }
                </div>
                <div>
                  <span className="underline">Max. guests allowed:</span>
                  {<span className="font-bold"> {booking.venue.maxGuests}</span>}
                </div>
                <div>
                  <span className="underline">Booking date:</span>
                  {<span className="font-bold"> {booking.created.slice(0, 10)}</span>}
                </div>
                <div>
                  <span className="underline">Last updated:</span>
                  {<span className="font-bold"> {booking.updated.slice(0, 10)}</span>}
                </div>
                <div>
                  <p className="underline">Booking ID:</p>
                  {<span className="font-bold"> {booking.id}</span>}
                </div>
              </div>
              {/* <div className="mx-auto">
                <h3>{booking.venue.owner.name}</h3>
                <img src={booking.venue.owner.avatar.url} alt="Profile picture"></img>
                <p>{booking.venue.owner.email}</p>
                <div>{booking.venue.owner.bio.slice(0, 100)}</div>
                <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">View host profile</button>
              </div> */}
            </div>
            <Link to={`/venue/${booking.venue.id}`}>
              <button className="text-2xl rounded-lg bg-primary text-white p-2 font-bold max-w-[8rem] mx-auto">View venue</button>
            </Link>
          </article>
        ))
      ) : (
        <p>You have no bookings.</p>
      )}
    </section>
  );
}

export default BookingsFunctionality;