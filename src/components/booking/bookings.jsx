import React from "react";
import { profilesApi } from "../constants/api";
import { useState, useEffect } from "react";
import { apiKey } from "../constants/api.js";

const usernameConst = localStorage.getItem("username");
const token = localStorage.getItem("accessToken");

const bookingsByProfile = `${profilesApi}/${usernameConst}/bookings`;

function Bookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await fetch(bookingsByProfile, bookingsByProfileOptions);
        const jsonObject = await response.json();
        console.log("jsonObject: ", jsonObject);
        // const venuesCont = JSON.stringify(data);
        const bookingsCont = jsonObject.data;
        console.log("dataCont ", bookingsCont);

        if (!response.ok) {
          throw new Error(jsonObject.errors[0].message);
        }
        if (response.ok) {
          setBookings(bookingsCont);
        }
      } catch (error) {
        console.log("Error: " + error.message);
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
        <p className="mx-auto mt-auto mb-2">I'm sorry, darling, but an error has occured. Technically speaking:</p>
        <p className="font-bold underline mx-auto mb-auto mt-2">{error}</p>
      </main>
    )
  }

  return (
    <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
      <h1 className="m-auto font-bold text-3xl">Your bookings!</h1>
      <section className="flex flex-wrap justify-center justify-between m-4 gap-4">
        {bookings.length >= 1 ? (
          bookings.map((booking) => (
            <article key={booking.id} className="flex flex-col justify-between gap-2 p-4 border-2 rounded-[25px] border-secondary bg-tertiary font-primary">
              <h3 className="font-semibold text-2xl"></h3>
              <p className="underline">Booking ID: {booking.id}</p>
              <p className="underline">Date from: {booking.dateFrom}</p>
              <p className="underline">Date to: {booking.dateTo}</p>
              <p className="underline">Guests {booking.guests}</p>
              <p className="underline">Booking date: {booking.created.slice(0, 10)}</p>
            </article>
          ))
        ) : (
          <p>You have no bookings.</p>
        )}
      </section>
    </main>
  );
}

export default Bookings;