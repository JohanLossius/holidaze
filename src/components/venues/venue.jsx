import React, { useState } from "react";
import { venuesApi, bookingsApi, apiKey } from "../constants/api";
import { token } from "../constants/localStorage";
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
  console.log("singlevenueapi: ", singleVenueApi)
  console.log("venue is loading and is error states: ", venue, isLoading, isError)
  const { bookingFeedback, setBookingFeedback } = profileLoginUsage();

  const [feedback, setFeedback] = useState(null);
  const [selectedDates, setSelectedDates] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [errorMessaging, setErrorMessaging] = useState(null);
  // const [refreshBookings, setRefreshBookings] = useState(false);

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
    formState:
      { errors },
      trigger,
      getValues,
      reset,
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
    console.log("onSubmit data:", data);
    // setSubmittedData(data);

    // setFeedback(null);

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
    console.log("createBookingOptions: ", createBookingOptions);
    

    try {
      const resp = await fetch(bookingsApi, createBookingOptions);
      const json = await resp.json();

      console.log("Response create booking json: ", json);

      if (!resp.ok) {
        setFeedback(<div className="text-red-500 font-bold">{json.errors[0]?.message}</div>);
        throw new Error(json.errors[0]?.message);
      }

      // signup(username, email);

      if (resp.ok) {
        console.log("Booking successful!");
        // setBookedDates(null);
        setBookingFeedback(<div className="text-green-500 font-bold">Your reservation was successfully booked!</div>);
        // setFeedback(<div className="text-green-500 font-bold">Your reservation was successfully booked!</div>);
        window.scrollTo(0, 0);
        reset();
        navigate("/bookings");
      }
    } catch (error) {
      console.log("Error: " + error.message);
      // setFeedback(<div className="text-red-500 font-bold">{error.message}</div>);
    }
  }

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
                venue.media.map((image, index) => (
                  <img src={image.url} key={`${image.url}-${index}`} className="max-w-[30rem] h-auto w-auto rounded-lg max-h-[30rem] mx-auto rounded my-2" alt={image.alt}></img>
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
                {venue.maxGuests > 0 ? <p className="underline">Max visitors: {venue.maxGuests}</p> : null}
                <p className="underline">Venue created at: {venue.created.slice(0, 10)}</p>
                {venue.updated ? <p className="underline">Venue last updated at: {venue.updated.slice(0, 10)}</p> : null}
                <p className="underline">Venue id: {venue.id}</p>
                {loggedInState === false ? (
                <form className="w-3/5 gap-4 flex flex-col mx-auto text-center justify-between bg-white text-black border-2 p-4 justify-between rounded-[25px]">
                  <img src="/calendar-icon.svg" className="mx-auto"></img>
                  <h3 className="text-2xl font-bold mx-auto">Book your stay today</h3>
                  <span className="text-red-500">{errors.guests?.message}</span>
                  <label htmlFor="guests-id" className="font-bold">Visitors:</label>
                  <input disabled className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Number of visitors"></input>
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
                  />
                  <Link to="/login"
                    state={{ redirectToVenueBooking: `/venue/${venue.id}` }}
                  >
                    <button className="rounded-lg bg-primary text-white p-2 font-bold max-w-[18rem] mx-auto">Log in to book venue</button>
                  </Link>
                </form>
                ) : (
                  <form onSubmit={handleSubmit(onSubmitHandler)} className="w-3/5 gap-4 flex flex-col mx-auto text-center text-black bg-white border-2 p-4 justify-between rounded-[25px]">
                    <img src="/calendar-icon.svg" className="mx-auto"></img>
                    <h3 className="text-2xl font-bold mx-auto">Book your stay today!</h3>
                    {feedback ? <p className="mx-auto">{feedback}</p> : null }
                    {/* <input className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Date from"></input>
                    <input className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black" placeholder="Date to"></input> */}
                    <span className="text-red-500">{errors.guests?.message}</span>
                    <label htmlFor="guests-id" className="font-bold">Visitors:</label>
                    <input
                      {...register("guests")}
                      onBlur={() => handleBlur("guests")}
                      id="guests-id"
                      className="p-2 rounded-lg min-w-[10rem] text-center bg-tertiary text-black"
                      placeholder="Enter number of visitors"
                    />
                    <BookingCalendar 
                      bookedDates={bookedDates}
                      setBookedDates={setBookedDates}
                      selectedDates={selectedDates}
                      setSelectedDates={setSelectedDates}
                      errorMessaging={errorMessaging}
                      setErrorMessaging={setErrorMessaging}
                    />
                    <button type="submit" className="rounded-lg bg-primary text-white p-2 font-bold max-w-[7rem] mx-auto">Book</button>
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