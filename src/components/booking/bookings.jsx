import React, { useEffect } from "react";
import BookingsFunctionality from "./bookingsFunctionality";
import { profileLoginUsage } from "../constants/context";
import { useLocation } from "react-router-dom";

function Bookings() {
  const { bookingFeedback, setBookingFeedback } = profileLoginUsage();
  const navigate = useLocation();

  // Make sure booking feedback doesn't linger after navigating to new pages
  // const location = useLocation();
  // useEffect(() => {
  //   console.log("Current pathname:", location.pathname);
  //     if (location.pathname !== "/bookings") {
  //       console.log("Clearing booking feedback");
  //       setBookingFeedback(null);
  //     }
  //   }, [location.pathname, setBookingFeedback]
  // );

  useEffect(() => {
    if (bookingFeedback) {
      const timeout = setTimeout(() => {
        setBookingFeedback(null);
      }, 5000);
  
      return () => clearTimeout(timeout);
    }
  }, [bookingFeedback]);

  return (
    <main className="h-auto min-h-[80vh] text-center flex flex-col items-center w-full mt-4">
      <h1 id="your-bookings-id" className="m-auto font-bold text-3xl">Your bookings!</h1>
      {bookingFeedback ? <section className="mx-auto text-center">{bookingFeedback}</section> : null }
      <BookingsFunctionality />
    </main>
  );
}

export default Bookings;