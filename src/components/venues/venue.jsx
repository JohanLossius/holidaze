import React, { useState } from "react";
import { venuesApi, bookingsApi, apiKey } from "../constants/api";
import { getToken } from "../constants/localStorage";
import { Link, useParams, useNavigate } from "react-router-dom";
import singleVenueStates from "../constants/singleVenueStates.js";
import { maxTwoDecimals } from "../constants/handlers.js";
import { profileLoginUsage } from "../constants/context.jsx";
import BookingCalendar from "../booking/bookingCalendar.jsx";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

function Venue() {
  const { loggedInState } = profileLoginUsage();
  const { id } = useParams();
  const singleVenueApi = venuesApi + "/" + id + "?_bookings=true";
  const { venue, isLoading, isError, errorMessage, maxVisitors } = singleVenueStates(singleVenueApi);
  const { bookingFeedback, setBookingFeedback } = profileLoginUsage();

  const [feedback, setFeedback] = useState(null);
  const [selectedDates, setSelectedDates] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [errorMessaging, setErrorMessaging] = useState(null);

  const navigate = useNavigate();

  const schema = yup
  .object({
    guests: yup
      .number()
      .min(1, "Please enter how many will be visiting, yourself included.")
      .max(maxVisitors, `Maximum ${maxVisitors} visitors for this venue!`)
      .typeError("Please enter the number of visitors for this venue in the given period.")
      .required("Please enter how many visitors will come."),
  })
  .required();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState:
      { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle console logging, validation with yup and react form hook
  const handleBlur = async (field) => {
    // Trigger validation for the specified field when it loses focus
    const result = await trigger(field);
    if (result) {
      // Get the current values of the form fields
      const values = getValues();
      if (
        !errors.guests && values.guests
      ) {
        console.log("Validation succeeded, data:", values);
      }
    }
  };

  async function onSubmitHandler(data) {

    const token = getToken();

    const createBookingOptions = {
      method: "POST",
      body: JSON.stringify({
        dateFrom: selectedDates[0]?.toDateString(),
        dateTo: selectedDates[1]?.toDateString(),
        guests: data.guests,
        venueId: venue.id
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      }
    };  

    try {
      const resp = await fetch(bookingsApi, createBookingOptions);
      const json = await resp.json();

      if (!resp.ok) {
        setFeedback(<div className="text-red-500 font-bold">{json.errors[0]?.message || "An error occurred."}</div>);
        throw new Error(json.errors[0]?.message);
      }

      if (resp.ok) {
        setBookingFeedback(
        <div className="text-green-500 font-bold mx-auto">
          <p className="mx-2">Your reservation was successfully booked at:</p>
          <p className="mx-2"><span className="break-all">{venue.name}!</span></p>
        </div>);
        // Scrolls to top on page for user messaging to be seen correctly
        window.scrollTo(0, 0);
        reset();
        navigate("/bookings");
      }
    } catch (error) {
      console.log("Error: " + error.message);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>There was an error: {errorMessage}.</div>;
  }

  if (venue) {
    return (
      <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
        <h1 className="mx-auto font-bold text-3xl my-2 md:my-0 px-2 text-xl break-all">{venue.name}</h1>
        <div className="w-4/5 p-4 mx-auto italic md:p-2 text-s break-all">{venue.description}</div>
        <div className="flex flex-row w-full mx-2 md:flex-col xs:m-0">
          <div className="w-1/2 md:w-4/5 mx-auto s:w-[100%]">
            {venue.media?.length >= 1 ? (
              venue.media.map((image, index) => (
                <img src={image.url} key={`${image.url}-${index}`} className="max-w-[30rem] h-auto w-auto rounded-lg max-h-[30rem] mx-auto rounded my-2 xl:w-[95%]" alt={image.alt}></img>
              ))
            ) : (
              <img src={venue.media[0]?.url} className="max-w-[30rem] h-auto w-auto rounded-lg max-h-[30rem] mx-auto rounded" alt={venue.media[0]?.alt}></img>
            )}
          </div>
          <div className="w-1/2 md:w-4/5 mx-auto s:w-[95%] s:w-[100%]">
            <div className="w-3/5 flex flex-col gap-2 mx-auto bg-tertiary border-secondary border-2 p-4 rounded-[25px] my-2 xl:w-[95%] md:text-[0.8rem] p-2 s:p-2 s:w-full xs:mx-0">
              <h2 className="text-2xl font-bold md:text-lg">Venue details</h2>
              <p className="">Address: <span className="font-semibold">{venue.location.address}, {venue.location.zip} {venue.location.city}, {venue.location.country}</span></p>
              <p className="">Price: <span className="font-semibold">{maxTwoDecimals(venue.price)} NOK per day</span></p>
              {venue.rating != 0 ? <p className="">Rating: <span className="font-semibold">{venue.rating}/5 stars</span></p> : null}
              {venue.meta.parking === true ? <p className="" >Parking space: <span className="font-semibold">Yes</span></p> : <p className="">Parking space: <span className="font-semibold">No</span></p>}
              {venue.meta.wifi === true ? <p className="" >Wifi: <span className="font-semibold">Yes</span></p> : <p className="">Wifi: <span className="font-semibold">No</span></p>}
              {venue.meta.breakfast === true ? <p className="" >Breakfast: <span className="font-semibold">Yes</span></p> : <p className="">Breakfast: <span className="font-semibold">No</span></p>}
              {venue.meta.pets === true ? <p className="">Pets: <span className="font-semibold">Yes</span></p> : <p className="">Pets: <span className="font-semibold">No</span></p>}
              {venue.maxGuests > 0 ? <p className="">Max visitors: <span className="font-semibold">{venue.maxGuests}</span></p> : null}
              <p className="">Venue created at: <span className="font-semibold">{venue.created.slice(0, 10)}</span></p>
              {venue.updated ? <p className="">Venue last updated at: <span className="font-semibold">{venue.updated.slice(0, 10)}</span></p> : null}
              <p className="break-all">Venue id: <span className="font-semibold">{venue.id}</span></p>

              {loggedInState === false ? (
              <form className="w-3/5 gap-4 flex flex-col mx-auto text-center justify-between bg-white text-black border-2 p-2 justify-between rounded-[25px] lg:w-4/5 md:w-[95%] p-2 s:w-full">
                <img src="/calendar-icon.svg" className="mx-auto"></img>
                <h3 className="text-2xl font-bold mx-auto">Book your stay today</h3>
                <span className="text-red-500">{errors.guests?.message}</span>
                <label htmlFor="guests-id" className="font-bold">Nr. of visitors:</label>
                <input disabled className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black md:min-w-[5rem] s:mx-2" placeholder="Visitors"></input>
                <Link to="/login"
                  state={{ redirectToVenueBooking: `/venue/${venue.id}` }}
                >
                  <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[18rem] mx-auto">Log in to book venue</button>
                </Link>
                {/* Make login a popup window if time */}
                <BookingCalendar 
                  bookedDates={bookedDates}
                  setBookedDates={setBookedDates}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  errorMessaging={errorMessaging}
                  setErrorMessaging={setErrorMessaging}
                  className="s:mx-2"
                />
                <Link to="/login"
                  state={{ redirectToVenueBooking: `/venue/${venue.id}` }}
                >
                  <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[18rem] mx-auto s:mb-2">Log in to book venue</button>
                </Link>
              </form>
              ) : (
                <form onSubmit={handleSubmit(onSubmitHandler)} className="w-3/5 gap-4 flex flex-col mx-auto text-center text-black bg-white border-2 p-4 justify-between rounded-[25px] lg:w-4/5 md:w-[95%] p-2 s:w-full">
                  <img src="/calendar-icon.svg" className="mx-auto"></img>
                  <h3 className="text-2xl font-bold mx-auto">Book your stay today!</h3>
                  {feedback ? <p className="mx-auto">{feedback}</p> : null }
                  <span className="text-red-500">{errors.guests?.message}</span>
                  <label htmlFor="guests-id" className="font-bold">Nr. of visitors:</label>
                  <input
                    {...register("guests")}
                    onBlur={() => handleBlur("guests")}
                    id="guests-id"
                    className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black md:min-w-[5rem] s:mx-2"
                    placeholder="Visitors"
                  />
                  <BookingCalendar 
                    bookedDates={bookedDates}
                    setBookedDates={setBookedDates}
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                    errorMessaging={errorMessaging}
                    setErrorMessaging={setErrorMessaging}
                    className="s:mx-2"
                  />
                  <button type="submit" className="rounded-lg bg-primary text-white p-2 font-bold max-w-[7rem] mx-auto">Book</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  } else {
    return <div className="mx-auto text-red-500">There was an error: {errorMessage || "An unknown error occurred."}.</div>
  }
}

export default Venue;