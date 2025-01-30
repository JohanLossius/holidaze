import React from "react";
import { profileLoginUsage } from "../constants/context";

function ViewBookingsByVenue() {

  const { bookingsByVenue, setBookingsByVenue, contextLoading, setContextLoading, contextError, setContextError } = profileLoginUsage();

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
      <section id="view-bookings-section" className="text-center mx-auto text-center my-4 flex flex-col items-center border-2 bg-tertiary border-secondary w-4/5 rounded-[25px]">
        <h2 className="text-center mx-auto font-bold text-2xl mt-4">Bookings {bookingsByVenue?.name}</h2>
        <section className="w-4/5">
        {bookingsByVenue?.bookings?.length >= 1 ? (
          bookingsByVenue.bookings.map((booking) => (
            <article key={booking.id} className="flex flex-col justify-between bg-white border-2 rounded-[25px] m-2 p-2 w-full text-center">
              <div className="flex flex-col text-center">
                <span className="font-bold">From {booking.dateFrom.slice(0, 10)} to {booking.dateTo.slice(0, 10)}</span>
                <p>Guests: {booking.guests}</p>
                <p>Booked: {booking.created.slice(0, 10)}</p>
                <p>Updated: {booking.updated.slice(0, 10)}</p>
                <p>Booking ID: {booking.id}</p>
              </div>
              <div className="flex flex-col mx-auto text-center w-1/2">
                <img className="max-w-[15rem] h-auto w-auto rounded-[25px] max-h-[15rem] mx-auto rounded mt-2" src={booking.customer.avatar?.url} alt="Profile picture"></img>
                <p>{booking.customer.name}</p>
                <p>{booking.customer.email}</p>
                <p>{booking.customer.bio?.slice(0, 50)}</p>
              </div>
            </article>
          ))) : ( 
            <div className="bg-white border-2 rounded-[25px] my-4 p-2 w-full text-center font-bold">You have no bookings for this venue.</div>
          )
        }
        </section>
      </section>
    )
  }
}

export default ViewBookingsByVenue;