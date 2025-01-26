import React from "react";
import { bookingsByProfileApi, venuesApi } from "../constants/api.js";
import { useState, useEffect } from "react";
import { apiKey } from "../constants/api.js";
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
              <div className="mx-auto">
                <h3 className="font-semibold text-2xl">{booking.venue.name}</h3>
                <img src={booking.venue.media[0]?.url} alt="Venue image" className="max-w-[25rem] h-auto w-auto rounded-lg max-h-[25rem] mx-auto rounded my-2"></img>
                <p className="max-w-[25rem] h-auto w-auto rounded-lg max-h-[15rem] mx-auto rounded my-2">{booking.venue.description.slice(0, 300)}...</p>
                <p className="">Venue ID: {booking.venue.id}</p>
              </div>
              <div className="mx-auto">
                <h3>{booking.dateFrom.slice(0, 10)} to {booking.dateTo.slice(0, 10)}</h3>
                <p className="underline">Guests: {booking.guests}</p>
                <p className="underline">Price: {booking.price}</p>
                <p className="underline">Location: {booking.venue.location.address}, {booking.venue.location.zip} {booking.venue.location.city}, {booking.venue.location.country}</p>
                <p className="underline">Wifi: {booking.venue.meta.wifi}</p>
                <p className="underline">Parking: {booking.venue.meta.parking}</p>
                <p className="underline">Breakfast: {booking.venue.meta.breakfast}</p>
                <p className="underline">Pets: {booking.venue.meta.pets}</p>
                <p className="underline">Max. guests allowed: {booking.venue.maxGuests}</p>
                <p className="underline">Booking date: {booking.created.slice(0, 10)}</p>
                <p className="underline">Last updated: {booking.updated.slice(0, 10)}</p>
                <p className="underline">Booking ID: {booking.id}</p>
              </div>
              {/* <div className="mx-auto">
                <h3>{booking.venue.owner.name}</h3>
                <img src={booking.venue.owner.avatar.url} alt="Profile picture"></img>
                <p>{booking.venue.owner.email}</p>
                <div>{booking.venue.owner.bio.slice(0, 100)}</div>
                <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">View host profile</button>
              </div> */}
            </div>
            <button classname="text-2xl rounded-lg bg-primary text-white p-2 font-bold max-w-[8rem] mx-auto">View venue</button>
          </article>
        ))
      ) : (
        <p>You have no bookings.</p>
      )}
    </section>
  );
}

export default BookingsFunctionality;