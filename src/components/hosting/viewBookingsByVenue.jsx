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
      <p className="font-bold underline mx-auto mb-auto mt-2">{contextError}</p>
    </section>
  )}

  if (!bookingsByVenue) {
    return <section id="view-bookings-section" className="text-center mx-auto"></section>
  }

  return (
    <section id="view-bookings-section" className="text-center mx-auto text-center my-4 flex flex-col items-center border-2 bg-tertiary border-secondary w-4/5 rounded-[25px] xl:w-[90%] lg:w-[95%]">
      <h2 className="text-center mx-auto font-bold text-2xl mt-4">Bookings {bookingsByVenue?.name}</h2>
      <section className="w-4/5 s:w-[95%]">
      {bookingsByVenue?.bookings?.length >= 1 ? (
        bookingsByVenue.bookings.map((booking) => (
          <article key={booking.id} className="flex flex-col justify-between bg-white border-2 rounded-[25px] my-2 mx-auto p-2 w-full text-center xl:w-[95%] lg:w-[98%]">
            <div className="flex flex-col text-center">
              <span className="font-bold text-lg">From {booking.dateFrom.slice(0, 10)} to {booking.dateTo.slice(0, 10)}</span>
              <p>Guests: <span className="font-semibold">{booking.guests}</span></p>
              <p>Booked: <span className="font-semibold">{booking.created.slice(0, 10)}</span></p>
              <p>Updated: <span className="font-semibold">{booking.updated.slice(0, 10)}</span></p>
              <p>Booking ID: <span className="font-semibold">{booking.id}</span></p>
            </div>
            <div className="flex flex-col mx-auto text-center w-4/5 s:w-[95%]">
              <img className="max-w-[15rem] h-auto w-auto rounded-[25px] max-h-[15rem] mx-auto rounded mt-2 s:max-w-[10rem] max-h-[10rem] xs:max-w-[7rem] max-h-[7rem]" src={booking.customer.avatar?.url} alt="Profile picture" loading="lazy"></img>
              <p className="font-semibold">{booking.customer.name}</p>
              <a href={`mailto:${booking.customer.email}`}className="truncate underline font-semibold">{booking.customer.email}</a>
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

export default ViewBookingsByVenue;