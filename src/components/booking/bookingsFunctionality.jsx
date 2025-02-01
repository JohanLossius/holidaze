import React from "react";
import { holidazeApi, apiKey, bookingsApi } from "../constants/api.js";
import { getToken, getUsername } from "../constants/localStorage.js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { profileLoginUsage } from "../constants/context.jsx";

// const bookingsByProfile = `${profilesApi}/${usernameConst}/bookings`;

function BookingsFunctionality() {

  // const [reservations, setReservations] = useState([]);
  // const [blockedDates, setBlockedDates] = useState([]);
  // const [start, setStart] = useState(null);
  // const [end, setEnd] = useState(null);

  const { bookingFeedback, setBookingFeedback } = profileLoginUsage();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteUpdater, setDeleteUpdater] = useState(0);

  const username = getUsername();
  const token = getToken();

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
        const bookingsCont = jsonObject.data;

        if (!response.ok) {
          throw new Error(jsonObject.errors[0].message);
        }
        if (response.ok) {
          setBookings(bookingsCont);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    getBookings();
  }, [deleteUpdater]);

  // Trigger refetch of bookings when a booking is deleted
  const updateBookingsManager = () => {
    setDeleteUpdater(deleteUpdater + 1);
  };

  // Functionality to delete booking
  const deleteBooking = (id, venueNameBooking) => {
    const deleteBookingApi = `${bookingsApi}/${id}`;
    if (!id) {
      console.log("no id for booking to delete")
      return;
    }
    const optionsDeleteBooking = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      }
    }
    async function deleteBookingFunction() {
      try {
        const responseDelete = await fetch(deleteBookingApi, optionsDeleteBooking);
        // console.log("jsonDelete: ", responseDelete);

        if (!responseDelete.ok) {
          setBookingFeedback(<div className="text-green-500 font-bold">An error occured while trying to delete the booking.</div>);
          throw new Error("An error occured while trying to delete the booking.");
        }
        if (responseDelete.ok) {
          // setBookingFeedback(<div className="text-red-500 font-bold">Your reservation at <span className="underline">{venueNameBooking}</span> was successfully deleted!</div>);
          setBookingFeedback(
          <div className="text-red-500 font-bold mx-auto">
            <p className="mx-2">Your reservation was successfully deleted at:</p>
            <p className="mx-2"><span className="underline break-all">{venueNameBooking}</span></p>
          </div>);
          window.scrollTo({ top: 0, behavior: "smooth" });
          updateBookingsManager();
        }
      }
      catch (error) {
        console.log(error.message);
      }
    }
    deleteBookingFunction();
  }

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
    <section className="flex flex-col justify-center justify-between m-4 gap-4 w-full">
      {bookings.length >= 1 ? (
        bookings.map((booking) => (
          <article key={booking.id} className="mx-auto w-3/5 flex flex-col justify-between gap-2 border-2 rounded-[25px] border-secondary bg-tertiary font-primary xl:w-[90%] lg:w-[95%] md:w-[98%] p-2">
            <div className="flex flex-row mx-auto md:flex-col">
              <div className="mx-2 mt-2 w-1/2 md:w-full mx-auto">
                <img src={booking.venue.media[0]?.url} alt="Venue image" className="max-w-[20rem] h-auto w-auto rounded-lg max-h-[15rem] mx-auto rounded my-2 lg:max-w-[15rem] md:max-w-[10rem] my-0 s:max-w-[7rem]"></img>
                <h3 className="font-bold text-2xl break-all">{booking.venue.name}</h3>
                { booking.venue.description.length > 300 ? <p className="max-w-[25rem] h-auto w-auto max-h-[20rem] mx-auto my-4 italic break-words whitespace-normal md:text-[0.9rem]">{booking.venue.description.slice(0, 200)}...</p> : <p className="max-w-[25rem] h-auto w-auto max-h-[15rem] mx-auto my-4 italic break-words whitespace-normal break-all">{booking.venue.description}</p>}
                <div className="my-2 md:text-[0.9rem]">
                  <p className="">Venue ID:</p>
                  <span className="font-semibold break-all"> {booking.venue.id}</span>
                </div>
              </div>
              <div className="mx-2 text-left flex flex-col gap-2 w-1/2 md:w-full mx-auto text-center">
                <h3 className="font-bold text-2xl my-4 w-full text-left md:text-xl text-center">{booking.dateFrom.slice(0, 10)} to {booking.dateTo.slice(0, 10)}</h3>
                <div className="md:text-[0.9rem]">
                  <span className="">Guests:</span>
                  <span className="font-semibold"> {booking.guests}</span>
                </div>
                <div className="md:text-[0.9rem]">
                  <span className="">NOK per day:</span>
                  <span className="font-semibold"> {booking.venue.price}</span>
                </div>
                <div className="md:text-[0.9rem] break-all">
                  <p className="">Location: </p>
                  <p className="font-semibold">{booking.venue.location.address}, {booking.venue.location.zip} {booking.venue.location.city}, {booking.venue.location.country}</p>
                </div>
                <div className="md:text-[0.9rem]">
                  <span className="">Wifi:</span>
                  { booking.venue.meta.wifi ? <span className="font-semibold"> Yes</span> : <span className="font-semibold"> No</span> }
                </div>
                <div className="md:text-[0.9rem]">
                  <span className="">Parking:</span>
                  { booking.venue.meta.parking ? <span className="font-semibold"> Yes</span> : <span className="font-semibold"> No</span> }
                </div>
                <div className="md:text-[0.9rem]">
                  <span className="">Breakfast:</span>
                  { booking.venue.meta.breakfast ? <span className="font-semibold"> Yes</span> : <span className="font-semibold"> No</span> }
                </div>
                <div className="md:text-[0.9rem]">
                  <span className="">Pets:</span>
                  { booking.venue.meta.pets ? <span className="font-semibold"> Yes</span> : <span className="font-semibold"> No</span> }
                </div>
                <div className="md:text-[0.9rem] flex flex-col">
                  <span className="">Max. guests allowed:</span>
                  <span className="font-semibold"> {booking.venue.maxGuests}</span>
                </div>
                <div className="md:text-[0.9rem] flex flex-col">
                  <span className="">Booking date:</span>
                  <span className="font-semibold"> {booking.created.slice(0, 10)}</span>
                </div>
                <div className="md:text-[0.9rem] flex flex-col">
                  <span className="">Last updated:</span>
                  <span className="font-semibold"> {booking.updated.slice(0, 10)}</span>
                </div>
                <div className="md:text-[0.9rem]">
                  <p className="">Booking ID:</p>
                  <span className="font-semibold break-all"> {booking.id}</span>
                </div>
              </div>
              {/*
              // Can be implemented when API returns owner details, that it didn't while I was working with it
              <div className="mx-auto">
                <h3>{booking.venue.owner.name}</h3>
                <img src={booking.venue.owner.avatar.url} alt="Profile picture"></img>
                <p>{booking.venue.owner.email}</p>
                <div>{booking.venue.owner.bio.slice(0, 100)}</div>
                <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[6rem] mx-auto">View host profile</button>
              </div> */}
            </div>
            <div className="flex flex-row justify-center gap-6 s:flex-col mx-auto">
              <Link to={`/venue/${booking.venue.id}`}>
                <button className="text-2xl rounded-lg bg-primary text-white p-2 font-bold max-w-[8rem] mx-auto">View venue</button>
              </Link>
              <button onClick={() => deleteBooking(booking.id, booking.venue.name)} className="text-2xl rounded-lg bg-primary text-white p-2 font-bold max-w-[8rem]">Delete booking</button>
            </div>
          </article>
        ))
      ) : (
        <p>You have no bookings.</p>
      )}
    </section>
  );
}

export default BookingsFunctionality;