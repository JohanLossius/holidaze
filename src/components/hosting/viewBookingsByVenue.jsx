import React, { useState, useEffect } from "react";
import { venuesApi, bookingsByVenueOptions } from "../constants/api";
import { profileLoginUsage } from "../constants/context";

function ViewBookingsByVenue() {

  const { bookingsByVenue, setBookingsByVenue, contextLoading, setContextLoading, contextError, setContextError } = profileLoginUsage();
  
  // useEffect(() => (
  //   async function bookingsByVenueCall() {
  //     try {
  //       console.log("singleVenueBookings from bookings by venue call: ", singleVenueBookings);
  //       setLoading(true);
  //       const venueId = singleVenueBookings.id;
  //       const bookingsByVenueApi = `${venuesApi}/${venueId}?_bookings=true`;
  //       const response = await fetch(bookingsByVenueApi, bookingsByVenueOptions);
  //       const json = await response.json();
  //       console.log("bookings by venoe call json: ", json)

  //       if (!response.ok) {
  //         setError(json.errors[0]?.message || "Unknown error.")
  //         setLoading(false);
  //         throw new Error("An error occured.")
  //       }

  //       if (response.ok) {
  //         console.log("bookings by venue success: ", json.data)
  //         setBookingsByVenue(json.data);
  //         setError(null);
  //         setLoading(false);
  //       }
  //     }
  //     catch (error) {
  //       console.log("error message bookings by venue: ", error.message);
  //     }
  //   }), [singleVenueBookings]
  // )

  if (contextLoading) {
    return (
      <section id="view-bookings-section" className="h-auto text-center flex flex-col justify-between items-center w-full">
        <h1 className="m-auto font-bold text-3xl">Profile</h1>
        <section className="m-auto">Your profile is loading...</section>
      </section>
  )}

  if (contextError) {
  return (
    <section id="view-bookings-section" className="h-auto text-center w-full m-auto flex flex-col">
      <p className="mx-auto mt-auto mb-2">An error has manifested. Technically speaking:</p>
      <p className="font-bold underline mx-auto mb-auto mt-2">{error}</p>
    </section>
  )}

  if (!bookingsByVenue) {
    return <section id="view-bookings-section" className="text-center mx-auto"></section>
  }

  if (bookingsByVenue) {
    return (
      <section id="view-bookings-section" className="text-center mx-auto text-center mt-4 flex flex-col items-center border-2 bg-tertiary border-secondary w-4/5 rounded-[25px]">
        <h2 className="text-center mx-auto font-bold text-2xl">Bookings {bookingsByVenue?.name}</h2>
        <section>
        {bookingsByVenue?.bookings?.length >= 1 ? (
          bookingsByVenue.bookings.map((booking) => (
            <div key={booking.id}>
              <div className="flex flex-col mx-auto text-center">
                <img src={booking.customer.avatar?.url} alt="Profile picture"></img>
                <p>{booking.customer.name}</p>
                <p>{booking.customer.email}</p>
                <p>{booking.customer.bio?.slice(0, 50)}</p>
              </div>
              <div>
                <span className="font-bold">From {booking.dateFrom.slice(0, 10)} to {booking.dateTo.slice(0, 10)}</span>
                <p>Guests: {booking.guests}</p>
                <p>Booked: {booking.created.slice(0, 10)}</p>
                <p>Updated: {booking.updated.slice(0, 10)}</p>
                <p>Booking ID: {booking.id}</p>
              </div>
            </div>
          ))) : ( 
            <div>You have no bookings for this venue.</div>
          )
        }
        </section>
      </section>
    )
  }
}

export default ViewBookingsByVenue;